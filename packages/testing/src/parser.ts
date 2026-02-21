import type { Finding, Step, TestResult } from "./types.js";

/**
 * Extract JSON from a fenced code block, or try parsing the entire string.
 */
function extractJson(content: string): unknown {
  // Try fenced code block first: ```json ... ``` or ``` ... ```
  const fenceMatch = /```(?:json)?\s*\n?([\s\S]*?)```/.exec(content);
  if (fenceMatch?.[1]) {
    return JSON.parse(fenceMatch[1]);
  }

  // Fall back to finding a top-level JSON object
  const braceStart = content.indexOf("{");
  const braceEnd = content.lastIndexOf("}");
  if (braceStart !== -1 && braceEnd > braceStart) {
    return JSON.parse(content.slice(braceStart, braceEnd + 1));
  }

  throw new Error("No JSON found in engine response");
}

function coerceFinding(raw: Record<string, unknown>, index: number): Finding {
  return {
    id: typeof raw["id"] === "string" ? raw["id"] : `f-${String(index + 1)}`,
    title: typeof raw["title"] === "string" ? raw["title"] : "Untitled finding",
    description:
      typeof raw["description"] === "string" ? raw["description"] : "",
    severity:
      raw["severity"] === "error" || raw["severity"] === "warning"
        ? raw["severity"]
        : "warning",
    status:
      raw["status"] === "open" || raw["status"] === "resolved"
        ? raw["status"]
        : "open",
    element: typeof raw["element"] === "string" ? raw["element"] : "",
    ...(typeof raw["evidence"] === "string" ? { evidence: raw["evidence"] } : {}),
  };
}

function coerceStep(raw: Record<string, unknown>): Step {
  return {
    label: typeof raw["label"] === "string" ? raw["label"] : "Unknown step",
    url: typeof raw["url"] === "string" ? raw["url"] : "",
    status:
      raw["status"] === "passed" ||
      raw["status"] === "failed" ||
      raw["status"] === "running" ||
      raw["status"] === "pending"
        ? raw["status"]
        : "passed",
    ...(typeof raw["duration"] === "number" ? { duration: raw["duration"] } : {}),
  };
}

export function parseResult(content: string): TestResult {
  try {
    const parsed = extractJson(content) as Record<string, unknown>;

    const rawFindings = Array.isArray(parsed["findings"])
      ? parsed["findings"]
      : [];
    const rawSteps = Array.isArray(parsed["steps"]) ? parsed["steps"] : [];

    const findings = rawFindings.map(
      (f: Record<string, unknown>, i: number) => coerceFinding(f, i),
    );
    const steps = rawSteps.map((s: Record<string, unknown>) => coerceStep(s));
    const summary =
      typeof parsed["summary"] === "string"
        ? parsed["summary"]
        : `Found ${String(findings.length)} issue(s) across ${String(steps.length)} step(s).`;

    return {
      findings,
      steps,
      summary,
      status: "completed",
    };
  } catch {
    // If parsing fails entirely, return a partial result with the raw content as summary
    return {
      findings: [],
      steps: [],
      summary: `Engine returned unparseable response. Raw content: ${content.slice(0, 500)}`,
      status: "partial",
    };
  }
}
