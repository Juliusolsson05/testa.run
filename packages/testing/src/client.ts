import type { EngineConfig, TestRequest, TestResult } from "./types.js";
import { callEngine } from "./engine.js";
import { buildPrompt } from "./prompt.js";
import { parseResult } from "./parser.js";

export async function runTest(
  request: TestRequest,
  config?: EngineConfig,
): Promise<TestResult> {
  const messages = buildPrompt(request);
  const content = await callEngine(messages, config);
  return parseResult(content);
}
