import type { Finding, Step, TestRunResult } from "./types.js";

const EMPTY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO8W8l0AAAAASUVORK5CYII=";

type ParsedOutput = {
  summary: string;
  findings: Finding[];
  steps: Step[];
  screenshots: string[];
  parseError?: string;
};

const DEBUG_ENABLED = /^(1|true|yes)$/i.test(
  process.env["TESTING_DEBUG"] ?? "",
);

function debugLog(message: string, details?: unknown): void {
  if (!DEBUG_ENABLED) {
    return;
  }
  // eslint-disable-next-line no-console
  console.error(
    JSON.stringify({
      type: "debug",
      scope: "testing-parser",
      at: new Date().toISOString(),
      message,
      ...(details !== undefined ? { details } : {}),
    }),
  );
}

/**
 * Extract JSON from a fenced code block, or try parsing the entire string.
 */
function extractJson(content: string): unknown {
  const sanitized = stripEventLines(content);
  debugLog("Attempting JSON extraction", {
    rawChars: content.length,
    sanitizedChars: sanitized.length,
    preview: sanitized.slice(0, 240),
  });

  // Try fenced code block first: ```json ... ``` or ``` ... ```
  const fenceMatch = /```(?:json)?\s*\n?([\s\S]*?)```/.exec(sanitized);
  if (fenceMatch?.[1]) {
    debugLog("Found fenced JSON block", { blockChars: fenceMatch[1].length });
    return JSON.parse(fenceMatch[1]);
  }

  // Fall back to finding a top-level JSON object
  const braceStart = sanitized.indexOf("{");
  const braceEnd = sanitized.lastIndexOf("}");
  if (braceStart !== -1 && braceEnd > braceStart) {
    debugLog("Falling back to brace JSON extraction", {
      braceStart,
      braceEnd,
      objectChars: braceEnd - braceStart + 1,
    });
    return JSON.parse(sanitized.slice(braceStart, braceEnd + 1));
  }

  debugLog("JSON extraction failed: no candidate object found");
  throw new Error("No JSON found in engine response");
}

function stripEventLines(content: string): string {
  return content
    .split(/\r?\n/)
    .filter((line) => !/^\s*(EVENT|SCREENSHOT):\s*/i.test(line))
    .join("\n");
}

function stripDataUrl(raw: string): string {
  const match = /^data:image\/png;base64,(.*)$/i.exec(raw.trim());
  return match?.[1] ?? raw.trim();
}

function isLikelyBase64(input: string): boolean {
  return /^[A-Za-z0-9+/=\s]+$/.test(input) && input.replace(/\s+/g, "").length > 32;
}

function normalizeScreenshot(raw: unknown): string {
  if (typeof raw !== "string") {
    return EMPTY_PNG_BASE64;
  }

  const stripped = stripDataUrl(raw);
  return isLikelyBase64(stripped) ? stripped.replace(/\s+/g, "") : EMPTY_PNG_BASE64;
}

function inferDomain(raw: Record<string, unknown>): "qa" | "security" {
  if (raw["domain"] === "qa" || raw["domain"] === "security") {
    return raw["domain"];
  }

  const candidate = [
    raw["category"],
    raw["title"],
    raw["description"],
    raw["evidence"],
  ]
    .filter((v): v is string => typeof v === "string")
    .join(" ")
    .toLowerCase();

  if (
    /csrf|xss|sqli|sql injection|auth|csp|insecure|token|session|jwt|password|secret|security/.test(
      candidate,
    )
  ) {
    return "security";
  }

  return "qa";
}

function coerceFinding(raw: Record<string, unknown>, index: number): Finding {
  const domain = inferDomain(raw);

  return {
    id: typeof raw["id"] === "string" ? raw["id"] : `f-${String(index + 1)}`,
    domain,
    category:
      typeof raw["category"] === "string" && raw["category"].trim().length > 0
        ? raw["category"]
        : domain === "security"
          ? "security"
          : "general",
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

function coerceStep(raw: Record<string, unknown>, index: number): Step {
  return {
    id: typeof raw["id"] === "string" ? raw["id"] : `s-${String(index + 1)}`,
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

export function parseEngineOutput(content: string): ParsedOutput {
  try {
    const parsed = extractJson(content) as Record<string, unknown>;

    const rawFindings = Array.isArray(parsed["findings"])
      ? parsed["findings"]
      : [];
    const rawSteps = Array.isArray(parsed["steps"]) ? parsed["steps"] : [];

    const findings = rawFindings.map((f: unknown, i: number) =>
      coerceFinding(
        typeof f === "object" && f !== null
          ? (f as Record<string, unknown>)
          : {},
        i,
      ),
    );
    const steps = rawSteps.map((s: unknown, i: number) =>
      coerceStep(
        typeof s === "object" && s !== null
          ? (s as Record<string, unknown>)
          : {},
        i,
      ),
    );
    const screenshots = rawSteps.map((s: unknown) =>
      normalizeScreenshot(
        typeof s === "object" && s !== null
          ? (s as Record<string, unknown>)["screenshotBase64"] ??
              (s as Record<string, unknown>)["screenshot"]
          : undefined,
      ),
    );
    const summary =
      typeof parsed["summary"] === "string"
        ? parsed["summary"]
        : `Found ${String(findings.length)} issue(s) across ${String(steps.length)} step(s).`;

    return {
      summary,
      findings,
      steps,
      screenshots,
    };
  } catch (error) {
    debugLog("parseEngineOutput failed", {
      error: error instanceof Error ? error.message : "Unknown parse error",
      preview: content.slice(0, 240),
    });
    return {
      findings: [],
      steps: [],
      screenshots: [],
      summary: `Engine returned unparseable response. Raw content: ${content.slice(0, 500)}`,
      parseError: error instanceof Error ? error.message : "Unknown parse error",
    };
  }
}

export function buildResult(args: {
  findings: Finding[];
  steps: Step[];
  summary: string;
  status: "completed" | "failed" | "partial";
  error?: { code: string; message: string };
}): TestRunResult {
  const qaFindings = args.findings.filter((finding) => finding.domain === "qa");
  const securityFindings = args.findings.filter(
    (finding) => finding.domain === "security",
  );

  return {
    findings: args.findings,
    qaFindings,
    securityFindings,
    steps: args.steps,
    summary: args.summary,
    status: args.status,
    ...(args.error ? { error: args.error } : {}),
  };
}
