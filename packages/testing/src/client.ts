import type {
  EngineConfig,
  FlowEdgeItem,
  FlowNodeItem,
  IssueItem,
  RunMeta,
  RunStatus,
  StepItem,
  TestRunEvent,
  TestRunHandle,
  TestRunRequest,
  TestRunResult,
} from "./types";
import { streamEngine } from "./engine";
import { buildPrompt } from "./prompt";
import {
  backfillIssueNodeKeys,
  buildFlowGraph,
  inferStatusFromStepsAndIssues,
  parseEngineOutput,
} from "./parser";

class AsyncEventQueue<T> implements AsyncIterable<T> {
  private items: T[] = [];
  private resolvers: Array<(value: IteratorResult<T>) => void> = [];
  private closed = false;

  push(item: T): void {
    if (this.closed) {
      return;
    }
    const resolver = this.resolvers.shift();
    if (resolver) {
      resolver({ value: item, done: false });
      return;
    }
    this.items.push(item);
  }

  close(): void {
    this.closed = true;
    while (this.resolvers.length > 0) {
      const resolver = this.resolvers.shift();
      resolver?.({ value: undefined as T, done: true });
    }
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return {
      next: async () => {
        if (this.items.length > 0) {
          const value = this.items.shift() as T;
          return { value, done: false };
        }
        if (this.closed) {
          return { value: undefined as T, done: true };
        }
        return await new Promise<IteratorResult<T>>((resolve) => {
          this.resolvers.push(resolve);
        });
      },
    };
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

const DEBUG_ENABLED = /^(1|true|yes)$/i.test(process.env["TESTING_DEBUG"] ?? "");

function debugLog(runKey: string, message: string, details?: unknown): void {
  if (!DEBUG_ENABLED) {
    return;
  }

  // eslint-disable-next-line no-console
  console.error(
    JSON.stringify({
      type: "debug",
      scope: "testing-client",
      runKey,
      at: nowIso(),
      message,
      ...(details !== undefined ? { details } : {}),
    }),
  );
}

function normalizeEventMessage(content: string): string | null {
  const message = content
    .replace(/```[\s\S]*$/g, "")
    .replace(/\{[\s\S]*$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!message) {
    return null;
  }

  return message.slice(0, 140);
}

function normalizeScreenshotUrl(raw: string): string | null {
  const stripped = raw.trim();
  if (!stripped) {
    return null;
  }
  return /^https?:\/\/\S+$/i.test(stripped) ? stripped : null;
}

type ExtractedEnvelope = {
  progressMessages: string[];
  screenshots: Array<{ stepKey: string; imageUrl: string }>;
};

class StreamEnvelopeExtractor {
  private buffer = "";
  private lastEvent = "";
  private screenshotFingerprints = new Set<string>();

  push(content: string, runKey: string): ExtractedEnvelope {
    this.buffer += content;
    if (this.buffer.length > 10000) {
      this.buffer = this.buffer.slice(-5000);
    }

    const envelope: ExtractedEnvelope = { progressMessages: [], screenshots: [] };
    this.extractFromBuffer(runKey, envelope, false);
    return envelope;
  }

  flush(runKey: string): ExtractedEnvelope {
    const envelope: ExtractedEnvelope = { progressMessages: [], screenshots: [] };
    this.extractFromBuffer(runKey, envelope, true);
    this.buffer = "";
    return envelope;
  }

  private extractFromBuffer(
    runKey: string,
    output: ExtractedEnvelope,
    flushAll: boolean,
  ): void {
    const markers = ["EVENT:", "SCREENSHOT_URL:"];

    while (true) {
      const positions = markers
        .map((marker) => ({ marker, index: this.buffer.indexOf(marker) }))
        .filter((candidate) => candidate.index >= 0)
        .sort((a, b) => a.index - b.index);

      const first = positions[0];
      const start = first?.index ?? -1;
      if (start === -1) {
        if (!flushAll && this.buffer.length > 3000) {
          this.buffer = this.buffer.slice(-1500);
        }
        return;
      }

      if (start > 0) {
        this.buffer = this.buffer.slice(start);
      }

      const marker = first?.marker ?? "EVENT:";
      const afterMarker = this.buffer.slice(marker.length);
      const nextMarkerPositions = markers
        .map((candidate) => afterMarker.indexOf(candidate))
        .filter((value) => value >= 0);

      const newline = afterMarker.indexOf("\n");
      const fence = afterMarker.indexOf("```");
      const candidates = [...nextMarkerPositions, newline, fence].filter((value) => value >= 0);

      if (candidates.length === 0 && !flushAll) {
        return;
      }

      const endRelative = candidates.length === 0 ? afterMarker.length : Math.min(...candidates);
      const rawMessage = afterMarker.slice(0, endRelative);
      this.buffer = afterMarker.slice(endRelative);

      if (marker === "EVENT:") {
        const message = normalizeEventMessage(rawMessage);
        if (!message || message === this.lastEvent) {
          continue;
        }
        this.lastEvent = message;
        output.progressMessages.push(message);
        continue;
      }

      const screenshotMatch = /^\s*([^|\s]+)\|([\s\S]+)$/.exec(rawMessage.trim());
      if (!screenshotMatch?.[1] || !screenshotMatch[2]) {
        continue;
      }

      const stepKey = screenshotMatch[1].trim();
      const imageUrl = normalizeScreenshotUrl(screenshotMatch[2]);
      if (!imageUrl) {
        continue;
      }

      const fingerprint = `${stepKey}:${imageUrl}`;
      if (this.screenshotFingerprints.has(fingerprint)) {
        continue;
      }

      this.screenshotFingerprints.add(fingerprint);
      output.screenshots.push({ stepKey, imageUrl });
      debugLog(runKey, "Extracted screenshot", { stepKey, imageUrl });
    }
  }
}

function toRunError(error: unknown): { code: string; message: string } {
  if (error instanceof Error) {
    return { code: "ENGINE_ERROR", message: error.message };
  }
  return { code: "ENGINE_ERROR", message: "Unknown engine error" };
}

function makeRunKey(): string {
  return `run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function resolveScreenshotPublicBaseUrl(): string {
  return process.env["TESTING_SCREENSHOT_PUBLIC_BASE_URL"]?.trim() || "http://76.13.77.252:8088";
}

function buildRunMeta(args: {
  runKey: string;
  name: string;
  category: "security" | "buttons" | "ux";
  status: RunStatus;
  startedAt: string;
  summary?: string;
  securitySynopsis?: string;
}): RunMeta {
  return {
    runKey: args.runKey,
    name: args.name,
    category: args.category,
    status: args.status,
    startedAt: args.startedAt,
    ...(args.summary ? { summary: args.summary } : {}),
    ...(args.securitySynopsis ? { securitySynopsis: args.securitySynopsis } : {}),
  };
}

function buildResult(args: {
  run: RunMeta;
  steps: StepItem[];
  issues: IssueItem[];
  nodes: FlowNodeItem[];
  edges: FlowEdgeItem[];
}): TestRunResult {
  return {
    run: args.run,
    steps: args.steps,
    issues: args.issues,
    nodes: args.nodes,
    edges: args.edges,
  };
}

export function createTestRun(
  request: TestRunRequest,
  config?: EngineConfig,
): TestRunHandle {
  if (!request.url?.trim()) {
    throw new Error("request.url is required");
  }

  const runKey = makeRunKey();
  const queue = new AsyncEventQueue<TestRunEvent>();
  const controller = new AbortController();
  const messages = buildPrompt(request, {
    runKey,
    screenshotPublicBaseUrl: resolveScreenshotPublicBaseUrl(),
  });

  const startedAt = nowIso();
  const stepImageByStepKey = new Map<string, string>();

  const result = (async (): Promise<TestRunResult> => {
    let content = "";
    const envelopeExtractor = new StreamEnvelopeExtractor();

    const initialRun = buildRunMeta({
      runKey,
      name: "Automated Test Run",
      category: "ux",
      status: "running",
      startedAt,
    });

    queue.push({
      type: "run.started",
      runKey,
      at: nowIso(),
      run: initialRun,
    });

    try {
      for await (const chunk of streamEngine(messages, config, controller.signal)) {
        content += chunk.content;

        const envelope = envelopeExtractor.push(chunk.content, runKey);
        for (const message of envelope.progressMessages) {
          queue.push({
            type: "step.progress",
            runKey,
            at: nowIso(),
            stepKey: "agent",
            message,
          });
        }

        for (const screenshot of envelope.screenshots) {
          stepImageByStepKey.set(screenshot.stepKey, screenshot.imageUrl);
          queue.push({
            type: "step.image",
            runKey,
            at: nowIso(),
            stepKey: screenshot.stepKey,
            imageUrl: screenshot.imageUrl,
          });
        }
      }

      const flushed = envelopeExtractor.flush(runKey);
      for (const message of flushed.progressMessages) {
        queue.push({
          type: "step.progress",
          runKey,
          at: nowIso(),
          stepKey: "agent",
          message,
        });
      }

      for (const screenshot of flushed.screenshots) {
        stepImageByStepKey.set(screenshot.stepKey, screenshot.imageUrl);
        queue.push({
          type: "step.image",
          runKey,
          at: nowIso(),
          stepKey: screenshot.stepKey,
          imageUrl: screenshot.imageUrl,
        });
      }

      const parsed = parseEngineOutput(content);
      if (parsed.parseError) {
        queue.push({
          type: "run.warning",
          runKey,
          at: nowIso(),
          message: parsed.parseError,
        });
      }

      const steps = [...parsed.steps].sort((a, b) => a.index - b.index);
      const issues = backfillIssueNodeKeys(steps, parsed.issues);
      const status = parsed.parseError
        ? "warning"
        : inferStatusFromStepsAndIssues(steps, issues);

      const { nodes, edges } = buildFlowGraph(steps, stepImageByStepKey);

      for (const step of steps) {
        queue.push({ type: "step.upserted", runKey, at: nowIso(), step });

        const imageUrl = stepImageByStepKey.get(step.stepKey);
        if (imageUrl) {
          queue.push({
            type: "step.image",
            runKey,
            at: nowIso(),
            stepKey: step.stepKey,
            nodeKey: step.nodeKey,
            imageUrl,
          });
        }
      }

      for (const node of nodes) {
        queue.push({ type: "node.upserted", runKey, at: nowIso(), node });
      }
      for (const edge of edges) {
        queue.push({ type: "edge.upserted", runKey, at: nowIso(), edge });
      }
      for (const issue of issues) {
        queue.push({ type: "issue.created", runKey, at: nowIso(), issue });
      }

      const finishedAt = nowIso();
      const durationMs = Math.max(0, Date.parse(finishedAt) - Date.parse(startedAt));
      const finalRun: RunMeta = {
        ...buildRunMeta({
          runKey,
          name: parsed.name,
          category: parsed.category,
          status,
          startedAt,
          summary: parsed.summary,
          securitySynopsis: parsed.securitySynopsis,
        }),
        finishedAt,
        durationMs,
      };

      queue.push({ type: "run.updated", runKey, at: nowIso(), run: finalRun });

      const finalResult = buildResult({ run: finalRun, steps, issues, nodes, edges });

      queue.push({
        type: "run.completed",
        runKey,
        at: nowIso(),
        result: finalResult,
      });

      return finalResult;
    } catch (error) {
      const runError = toRunError(error);
      const parsed = content ? parseEngineOutput(content) : undefined;
      const steps = parsed?.steps ?? [];
      const issues = backfillIssueNodeKeys(steps, parsed?.issues ?? []);
      const { nodes, edges } = buildFlowGraph(steps, stepImageByStepKey);

      const failedAt = nowIso();
      const durationMs = Math.max(0, Date.parse(failedAt) - Date.parse(startedAt));

      const failedRun: RunMeta = {
        ...buildRunMeta({
          runKey,
          name: parsed?.name ?? "Automated Test Run",
          category: parsed?.category ?? "ux",
          status: "failed",
          startedAt,
          ...(parsed?.summary ? { summary: parsed.summary } : {}),
          ...(parsed?.securitySynopsis ? { securitySynopsis: parsed.securitySynopsis } : {}),
        }),
        finishedAt: failedAt,
        durationMs,
      };

      const partialResult = buildResult({
        run: failedRun,
        steps,
        issues,
        nodes,
        edges,
      });

      queue.push({
        type: "run.failed",
        runKey,
        at: nowIso(),
        error: runError,
        partialResult,
      });

      return partialResult;
    } finally {
      queue.close();
    }
  })();

  return {
    runKey,
    events: queue,
    result,
    cancel: () => controller.abort(),
  };
}
