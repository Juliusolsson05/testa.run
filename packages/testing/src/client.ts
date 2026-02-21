import type {
  EngineConfig,
  TestRunEvent,
  TestRunHandle,
  TestRunRequest,
  TestRunResult,
} from "./types.js";
import { streamEngine } from "./engine.js";
import { buildPrompt } from "./prompt.js";
import { buildResult, parseEngineOutput } from "./parser.js";

const EMPTY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO8W8l0AAAAASUVORK5CYII=";

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

const DEBUG_ENABLED = /^(1|true|yes)$/i.test(
  process.env["TESTING_DEBUG"] ?? "",
);

function debugLog(runId: string, message: string, details?: unknown): void {
  if (!DEBUG_ENABLED) {
    return;
  }

  const payload = {
    type: "debug",
    scope: "testing-client",
    runId,
    at: nowIso(),
    message,
    ...(details !== undefined ? { details } : {}),
  };
  // Use stderr so event stream on stdout remains unchanged.
  // eslint-disable-next-line no-console
  console.error(JSON.stringify(payload));
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

function normalizeScreenshotPayload(raw: string): string | null {
  const stripped = raw
    .trim()
    .replace(/^data:image\/png;base64,/i, "")
    .replace(/\s+/g, "");

  if (stripped.length < 64) {
    return null;
  }
  if (!/^[A-Za-z0-9+/=]+$/.test(stripped)) {
    return null;
  }
  return stripped;
}

type ExtractedEnvelope = {
  progressMessages: string[];
  screenshots: Array<{ stepId: string; base64: string }>;
};

class StreamEnvelopeExtractor {
  private buffer = "";
  private lastEvent = "";
  private lastScreenshotFingerprint = "";

  push(content: string, runId: string): ExtractedEnvelope {
    this.buffer += content;
    if (this.buffer.length > 10000) {
      this.buffer = this.buffer.slice(-5000);
    }

    const envelope: ExtractedEnvelope = { progressMessages: [], screenshots: [] };
    this.extractFromBuffer(runId, envelope, false);
    return envelope;
  }

  flush(runId: string): ExtractedEnvelope {
    const envelope: ExtractedEnvelope = { progressMessages: [], screenshots: [] };
    this.extractFromBuffer(runId, envelope, true);
    this.buffer = "";
    return envelope;
  }

  private extractFromBuffer(
    runId: string,
    output: ExtractedEnvelope,
    flushAll: boolean,
  ): void {
    const markers = ["EVENT:", "SCREENSHOT:"];
    while (true) {
      const positions = markers
        .map((marker) => ({ marker, index: this.buffer.indexOf(marker) }))
        .filter((candidate) => candidate.index >= 0)
        .sort((a, b) => a.index - b.index);

      const first = positions[0];
      const start = first?.index ?? -1;
      if (start === -1) {
        if (flushAll && this.buffer.length > 0) {
          debugLog(runId, "No stream marker found in remaining buffer", {
            preview: this.buffer.slice(0, 240),
          });
        }
        if (!flushAll && this.buffer.length > 3000) {
          this.buffer = this.buffer.slice(-1500);
        }
        return;
      }

      if (start > 0) {
        const skipped = this.buffer.slice(0, start);
        if (DEBUG_ENABLED && /[A-Za-z]/.test(skipped)) {
          debugLog(runId, "Skipping non-event stream text", {
            preview: skipped.slice(0, 200),
          });
        }
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

      const endRelative =
        candidates.length === 0
          ? afterMarker.length
          : Math.min(...candidates);

      const rawMessage = afterMarker.slice(0, endRelative);
      this.buffer = afterMarker.slice(endRelative);

      if (marker === "EVENT:") {
        const message = normalizeEventMessage(rawMessage);
        if (!message) {
          debugLog(runId, "Discarded empty/malformed EVENT payload", {
            raw: rawMessage.slice(0, 200),
          });
          continue;
        }

        if (message === this.lastEvent) {
          debugLog(runId, "Deduped repeated EVENT payload", { message });
          continue;
        }

        this.lastEvent = message;
        output.progressMessages.push(message);
        debugLog(runId, "Extracted EVENT payload", { message });
        continue;
      }

      const screenshotMatch = /^\s*([^|\s]+)\|([\s\S]+)$/.exec(rawMessage.trim());
      if (!screenshotMatch?.[1] || !screenshotMatch[2]) {
        debugLog(runId, "Discarded malformed SCREENSHOT payload", {
          raw: rawMessage.slice(0, 200),
        });
        continue;
      }

      const stepId = screenshotMatch[1].trim();
      const base64 = normalizeScreenshotPayload(screenshotMatch[2]);
      if (!base64) {
        debugLog(runId, "Discarded invalid SCREENSHOT base64", {
          stepId,
          rawPreview: screenshotMatch[2].slice(0, 120),
        });
        continue;
      }

      const fingerprint = `${stepId}:${base64.slice(0, 24)}:${base64.length}`;
      if (fingerprint === this.lastScreenshotFingerprint) {
        debugLog(runId, "Deduped repeated SCREENSHOT payload", { stepId });
        continue;
      }

      this.lastScreenshotFingerprint = fingerprint;
      output.screenshots.push({ stepId, base64 });
      debugLog(runId, "Extracted SCREENSHOT payload", {
        stepId,
        size: base64.length,
      });
    }
  }
}

function toRunError(error: unknown): { code: string; message: string } {
  if (error instanceof Error) {
    return { code: "ENGINE_ERROR", message: error.message };
  }
  return { code: "ENGINE_ERROR", message: "Unknown engine error" };
}

function emitStepArtifacts(args: {
  runId: string;
  queue: AsyncEventQueue<TestRunEvent>;
  steps: TestRunResult["steps"];
  screenshots: string[];
}): void {
  for (let index = 0; index < args.steps.length; index += 1) {
    const step = args.steps[index];
    if (!step) {
      continue;
    }

    args.queue.push({
      type: "step.started",
      runId: args.runId,
      at: nowIso(),
      step,
    });

    const screenshot = args.screenshots[index] ?? EMPTY_PNG_BASE64;
    args.queue.push({
      type: "step.screenshot",
      runId: args.runId,
      at: nowIso(),
      stepId: step.id,
      mimeType: "image/png",
      base64: screenshot,
    });
  }
}

export function createTestRun(
  request: TestRunRequest,
  config?: EngineConfig,
): TestRunHandle {
  if (!request.url?.trim()) {
    throw new Error("request.url is required");
  }

  const runId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  const queue = new AsyncEventQueue<TestRunEvent>();
  const controller = new AbortController();
  const messages = buildPrompt(request);

  const result = (async (): Promise<TestRunResult> => {
    let content = "";
    const envelopeExtractor = new StreamEnvelopeExtractor();
    let chunkCount = 0;
    const streamedScreenshotStepIds = new Set<string>();

    queue.push({
      type: "run.started",
      runId,
      at: nowIso(),
      request: { url: request.url },
    });
    debugLog(runId, "Run started", { url: request.url });

    try {
      for await (const chunk of streamEngine(messages, config, controller.signal)) {
        content += chunk.content;
        chunkCount += 1;
        debugLog(runId, "Received stream chunk", {
          chunkCount,
          chunkChars: chunk.content.length,
          totalChars: content.length,
          preview: chunk.content.slice(0, 200),
        });

        const envelope = envelopeExtractor.push(chunk.content, runId);
        for (const message of envelope.progressMessages) {
          queue.push({
            type: "step.progress",
            runId,
            at: nowIso(),
            stepId: "agent",
            message,
          });
          debugLog(runId, "Emitted step.progress", { message });
        }

        for (const screenshot of envelope.screenshots) {
          queue.push({
            type: "step.screenshot",
            runId,
            at: nowIso(),
            stepId: screenshot.stepId,
            mimeType: "image/png",
            base64: screenshot.base64,
          });
          streamedScreenshotStepIds.add(screenshot.stepId);
          debugLog(runId, "Emitted streamed step.screenshot", {
            stepId: screenshot.stepId,
            size: screenshot.base64.length,
          });
        }
      }

      debugLog(runId, "Stream ended", {
        chunkCount,
        totalChars: content.length,
      });

      const flushed = envelopeExtractor.flush(runId);

      for (const message of flushed.progressMessages) {
        queue.push({
          type: "step.progress",
          runId,
          at: nowIso(),
          stepId: "agent",
          message,
        });
        debugLog(runId, "Emitted flushed step.progress", { message });
      }

      for (const screenshot of flushed.screenshots) {
        queue.push({
          type: "step.screenshot",
          runId,
          at: nowIso(),
          stepId: screenshot.stepId,
          mimeType: "image/png",
          base64: screenshot.base64,
        });
        streamedScreenshotStepIds.add(screenshot.stepId);
        debugLog(runId, "Emitted flushed step.screenshot", {
          stepId: screenshot.stepId,
          size: screenshot.base64.length,
        });
      }

      const parsed = parseEngineOutput(content);
      debugLog(runId, "Parsed engine output", {
        parseError: parsed.parseError ?? null,
        findings: parsed.findings.length,
        steps: parsed.steps.length,
        screenshots: parsed.screenshots.length,
      });
      const finalResult = buildResult({
        findings: parsed.findings,
        steps: parsed.steps,
        summary: parsed.summary,
        status: parsed.parseError ? "partial" : "completed",
        ...(parsed.parseError
          ? {
              error: {
                code: "PARSE_ERROR",
                message: parsed.parseError,
              },
            }
          : {}),
      });

      if (parsed.parseError) {
        queue.push({
          type: "run.warning",
          runId,
          at: nowIso(),
          message: parsed.parseError,
        });
      }

      emitStepArtifacts({
        runId,
        queue,
        steps: finalResult.steps.filter(
          (step) => !streamedScreenshotStepIds.has(step.id),
        ),
        screenshots: parsed.screenshots,
      });
      debugLog(runId, "Emitted step artifacts", {
        steps: finalResult.steps.length,
        screenshots: parsed.screenshots.length,
      });

      for (const finding of finalResult.findings) {
        queue.push({
          type: "finding.created",
          runId,
          at: nowIso(),
          finding,
        });
      }
      debugLog(runId, "Emitted findings", { findings: finalResult.findings.length });

      queue.push({
        type: "run.completed",
        runId,
        at: nowIso(),
        result: finalResult,
      });
      debugLog(runId, "Run completed", { status: finalResult.status });

      return finalResult;
    } catch (error) {
      const runError = toRunError(error);
      debugLog(runId, "Run failed in catch", {
        error: runError,
        contentChars: content.length,
      });
      const parsed = content
        ? parseEngineOutput(content)
        : { findings: [], steps: [], screenshots: [], summary: "Run failed before output." };

      const failedResult = buildResult({
        findings: parsed.findings,
        steps: parsed.steps,
        summary: parsed.summary,
        status: content ? "partial" : "failed",
        error: runError,
      });

      emitStepArtifacts({
        runId,
        queue,
        steps: failedResult.steps,
        screenshots: parsed.screenshots,
      });

      for (const finding of failedResult.findings) {
        queue.push({
          type: "finding.created",
          runId,
          at: nowIso(),
          finding,
        });
      }

      queue.push({
        type: "run.failed",
        runId,
        at: nowIso(),
        error: runError,
      });

      return failedResult;
    } finally {
      queue.close();
    }
  })();

  return {
    runId,
    events: queue,
    result,
    cancel: () => controller.abort(),
  };
}
