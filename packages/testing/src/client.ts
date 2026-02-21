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

function normalizeProgressChunk(content: string): string {
  return content.replace(/\s+/g, " ").trim().slice(0, 200);
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

    queue.push({
      type: "run.started",
      runId,
      at: nowIso(),
      request: { url: request.url },
    });

    try {
      for await (const chunk of streamEngine(messages, config, controller.signal)) {
        content += chunk.content;
        const progress = normalizeProgressChunk(chunk.content);
        if (progress.length > 0) {
          queue.push({
            type: "step.progress",
            runId,
            at: nowIso(),
            stepId: "agent",
            message: progress,
          });
        }
      }

      const parsed = parseEngineOutput(content);
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
        steps: finalResult.steps,
        screenshots: parsed.screenshots,
      });

      for (const finding of finalResult.findings) {
        queue.push({
          type: "finding.created",
          runId,
          at: nowIso(),
          finding,
        });
      }

      queue.push({
        type: "run.completed",
        runId,
        at: nowIso(),
        result: finalResult,
      });

      return finalResult;
    } catch (error) {
      const runError = toRunError(error);
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
