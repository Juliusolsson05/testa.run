import type {
  IssueCategory,
  IssueItem,
  RunCategory,
  RunStepAction,
  RunStepStatus,
  StepItem,
} from "./types";

export type ParsedOutput = {
  name: string;
  category: RunCategory;
  summary?: string;
  securitySynopsis?: string;
  steps: StepItem[];
  issues: IssueItem[];
  parseError?: string;
};

const DEBUG_ENABLED = /^(1|true|yes)$/i.test(process.env["TESTING_DEBUG"] ?? "");

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

function stripEventLines(content: string): string {
  return content
    .split(/\r?\n/)
    .filter((line) => !/^\s*(EVENT|SCREENSHOT_URL):\s*/i.test(line))
    .join("\n");
}

function extractJson(content: string): unknown {
  const sanitized = stripEventLines(content);

  const fenceMatch = /```(?:json)?\s*\n?([\s\S]*?)```/.exec(sanitized);
  if (fenceMatch?.[1]) {
    return JSON.parse(fenceMatch[1]);
  }

  const braceStart = sanitized.indexOf("{");
  const braceEnd = sanitized.lastIndexOf("}");
  if (braceStart !== -1 && braceEnd > braceStart) {
    return JSON.parse(sanitized.slice(braceStart, braceEnd + 1));
  }

  throw new Error("No JSON found in engine response");
}

function normalizeUrl(raw: unknown): string {
  if (typeof raw !== "string") {
    return "";
  }
  return raw.trim();
}

function slugify(input: string): string {
  const normalized = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || "node";
}

function buildNodeKey(rawUrl: string, index: number): string {
  if (!rawUrl) {
    return `node-${String(index + 1)}`;
  }

  try {
    const candidate = rawUrl.startsWith("http") ? new URL(rawUrl) : new URL(`https://${rawUrl}`);
    const path = candidate.pathname.replace(/\/+$/, "") || "/";
    if (path === "/") {
      return "landing";
    }

    const segments = path.split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "page";
    return slugify(last);
  } catch {
    return slugify(rawUrl) || `node-${String(index + 1)}`;
  }
}

function normalizeStepStatus(raw: unknown): RunStepStatus {
  if (raw === "passed" || raw === "failed" || raw === "warning") {
    return raw;
  }
  if (raw === "running" || raw === "pending") {
    return "warning";
  }
  return "passed";
}

function normalizeRunCategory(raw: unknown): RunCategory {
  if (raw === "security" || raw === "buttons" || raw === "ux") {
    return raw;
  }

  const candidate = String(raw ?? "").toLowerCase();
  if (candidate.includes("security")) {
    return "security";
  }
  if (candidate.includes("button") || candidate.includes("interaction")) {
    return "buttons";
  }
  return "ux";
}

function normalizeStepAction(raw: unknown, fallbackText: string): RunStepAction {
  if (
    raw === "navigate" ||
    raw === "scroll" ||
    raw === "audit" ||
    raw === "click" ||
    raw === "wait" ||
    raw === "fill" ||
    raw === "resize" ||
    raw === "screenshot"
  ) {
    return raw;
  }

  const candidate = fallbackText.toLowerCase();
  if (candidate.includes("click")) return "click";
  if (candidate.includes("fill") || candidate.includes("type")) return "fill";
  if (candidate.includes("scroll")) return "scroll";
  if (candidate.includes("wait")) return "wait";
  if (candidate.includes("resize")) return "resize";
  if (candidate.includes("screenshot") || candidate.includes("capture")) return "screenshot";
  if (candidate.includes("audit") || candidate.includes("inspect") || candidate.includes("verify")) return "audit";
  return "navigate";
}

function toDurationMs(raw: unknown): number | undefined {
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 0) {
    return Math.round(raw);
  }

  if (typeof raw === "string") {
    const trimmed = raw.trim().toLowerCase();
    if (!trimmed) {
      return undefined;
    }

    const secondsMatch = /^([0-9]*\.?[0-9]+)s$/.exec(trimmed);
    if (secondsMatch?.[1]) {
      const value = Number(secondsMatch[1]);
      if (Number.isFinite(value)) {
        return Math.round(value * 1000);
      }
    }

    const msMatch = /^([0-9]+)ms$/.exec(trimmed);
    if (msMatch?.[1]) {
      const value = Number(msMatch[1]);
      if (Number.isFinite(value)) {
        return Math.round(value);
      }
    }
  }

  return undefined;
}

function inferIssueCategory(raw: Record<string, unknown>): IssueCategory {
  if (raw["category"] === "security" || raw["domain"] === "security") {
    return "security";
  }

  const candidate = [raw["category"], raw["title"], raw["description"], raw["reasoning"], raw["element"]]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();

  if (
    /csrf|xss|csp|auth|token|jwt|session|insecure|security|password|cookie|hsts|sqli|injection/.test(
      candidate,
    )
  ) {
    return "security";
  }

  return "other";
}

function coerceStep(raw: Record<string, unknown>, index: number): StepItem {
  const url = normalizeUrl(raw["url"]);
  const stepKey =
    typeof raw["stepKey"] === "string"
      ? raw["stepKey"]
      : typeof raw["id"] === "string"
        ? raw["id"]
        : `s-${String(index + 1)}`;

  const description =
    typeof raw["description"] === "string"
      ? raw["description"]
      : typeof raw["label"] === "string"
        ? raw["label"]
        : "Executed test step";

  const nodeKey =
    typeof raw["nodeKey"] === "string" && raw["nodeKey"].trim().length > 0
      ? raw["nodeKey"].trim()
      : buildNodeKey(url, index);

  const actionText = [raw["action"], description, raw["target"], raw["label"]]
    .filter((value): value is string => typeof value === "string")
    .join(" ");

  return {
    stepKey,
    index:
      typeof raw["index"] === "number" && Number.isFinite(raw["index"])
        ? Math.max(1, Math.floor(raw["index"]))
        : index + 1,
    nodeKey,
    action: normalizeStepAction(raw["action"], actionText),
    target:
      typeof raw["target"] === "string"
        ? raw["target"]
        : typeof raw["selector"] === "string"
          ? raw["selector"]
          : url,
    description,
    reasoning:
      typeof raw["reasoning"] === "string"
        ? raw["reasoning"]
        : typeof raw["evidence"] === "string"
          ? raw["evidence"]
          : "",
    status: normalizeStepStatus(raw["status"]),
    ...(toDurationMs(raw["durationMs"] ?? raw["duration"]) !== undefined
      ? { durationMs: toDurationMs(raw["durationMs"] ?? raw["duration"]) }
      : {}),
    url,
  };
}

function coerceIssue(raw: Record<string, unknown>, index: number): IssueItem {
  const category = inferIssueCategory(raw);

  return {
    issueKey:
      typeof raw["issueKey"] === "string"
        ? raw["issueKey"]
        : typeof raw["id"] === "string"
          ? raw["id"]
          : `iss-${String(index + 1)}`,
    nodeKey: typeof raw["nodeKey"] === "string" ? raw["nodeKey"] : "",
    ...(typeof raw["stepKey"] === "string"
      ? { stepKey: raw["stepKey"] }
      : typeof raw["stepId"] === "string"
        ? { stepKey: raw["stepId"] }
        : {}),
    category,
    title: typeof raw["title"] === "string" ? raw["title"] : "Untitled issue",
    description: typeof raw["description"] === "string" ? raw["description"] : "",
    reasoning:
      typeof raw["reasoning"] === "string"
        ? raw["reasoning"]
        : typeof raw["evidence"] === "string"
          ? raw["evidence"]
          : "",
    element: typeof raw["element"] === "string" ? raw["element"] : "",
    severity: raw["severity"] === "error" || raw["severity"] === "warning" ? raw["severity"] : "warning",
    status: raw["status"] === "resolved" ? "resolved" : "open",
    ...(typeof raw["detectedAt"] === "string" ? { detectedAt: raw["detectedAt"] } : {}),
  };
}

export function parseEngineOutput(content: string): ParsedOutput {
  try {
    const parsed = extractJson(content) as Record<string, unknown>;

    const rawSteps = Array.isArray(parsed["steps"]) ? parsed["steps"] : [];
    const rawIssues = Array.isArray(parsed["issues"])
      ? parsed["issues"]
      : Array.isArray(parsed["findings"])
        ? parsed["findings"]
        : [];

    const steps = rawSteps.map((value, index) =>
      coerceStep(typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {}, index),
    );
    const issues = rawIssues.map((value, index) =>
      coerceIssue(typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {}, index),
    );

    const runRaw =
      typeof parsed["run"] === "object" && parsed["run"] !== null
        ? (parsed["run"] as Record<string, unknown>)
        : undefined;

    const nameCandidate =
      (runRaw?.["name"] as unknown) ??
      parsed["name"] ??
      parsed["title"];
    const categoryCandidate =
      (runRaw?.["category"] as unknown) ??
      parsed["category"];

    return {
      name:
        typeof nameCandidate === "string" && nameCandidate.trim().length > 0
          ? nameCandidate.trim()
          : "Automated Test Run",
      category: normalizeRunCategory(categoryCandidate),
      ...(typeof parsed["summary"] === "string" ? { summary: parsed["summary"] } : {}),
      ...(typeof parsed["securitySynopsis"] === "string"
        ? { securitySynopsis: parsed["securitySynopsis"] }
        : {}),
      steps,
      issues,
    };
  } catch (error) {
    debugLog("parseEngineOutput failed", {
      error: error instanceof Error ? error.message : "Unknown parse error",
      preview: content.slice(0, 240),
    });

    return {
      name: "Automated Test Run",
      category: "ux",
      steps: [],
      issues: [],
      parseError: error instanceof Error ? error.message : "Unknown parse error",
    };
  }
}

export function mergeStepImageUrls(
  steps: StepItem[],
  stepImages: Map<string, string>,
): Map<string, string> {
  const byStep = new Map<string, string>();
  for (const step of steps) {
    const image = stepImages.get(step.stepKey);
    if (image) {
      byStep.set(step.stepKey, image);
    }
  }
  return byStep;
}

export function inferStatusFromStepsAndIssues(steps: StepItem[], issues: IssueItem[]): "passed" | "warning" | "failed" {
  const hasFailedStep = steps.some((step) => step.status === "failed");
  const hasErrorIssue = issues.some((issue) => issue.status === "open" && issue.severity === "error");
  if (hasFailedStep || hasErrorIssue) {
    return "failed";
  }

  const hasWarning =
    steps.some((step) => step.status === "warning") ||
    issues.some((issue) => issue.status === "open" && issue.severity === "warning");

  return hasWarning ? "warning" : "passed";
}

export function backfillIssueNodeKeys(steps: StepItem[], issues: IssueItem[]): IssueItem[] {
  const nodeByStep = new Map<string, string>(steps.map((step) => [step.stepKey, step.nodeKey]));
  const fallbackNode = steps[0]?.nodeKey ?? "landing";

  return issues.map((issue) => {
    if (issue.nodeKey) {
      return issue;
    }
    if (issue.stepKey && nodeByStep.has(issue.stepKey)) {
      return { ...issue, nodeKey: nodeByStep.get(issue.stepKey) as string };
    }
    return { ...issue, nodeKey: fallbackNode };
  });
}

export function buildFlowGraph(steps: StepItem[], stepImages: Map<string, string>): {
  nodes: Array<{
    nodeKey: string;
    label: string;
    url: string;
    status: "passed" | "running" | "pending";
    step: number;
    durationMs?: number;
    imageUrl?: string;
  }>;
  edges: Array<{
    edgeKey: string;
    sourceNodeKey: string;
    targetNodeKey: string;
    label?: string;
  }>;
} {
  const nodeMap = new Map<string, { nodeKey: string; label: string; url: string; status: "passed" | "running" | "pending"; step: number; durationMs?: number; imageUrl?: string }>();
  const edgeMap = new Map<string, { edgeKey: string; sourceNodeKey: string; targetNodeKey: string; label?: string }>();

  const sortedSteps = [...steps].sort((a, b) => a.index - b.index);

  for (const step of sortedSteps) {
    const existing = nodeMap.get(step.nodeKey);
    const nodeStatus: "passed" | "running" | "pending" =
      step.status === "failed" || step.status === "warning" ? "running" : "passed";

    const imageUrl = stepImages.get(step.stepKey);

    if (!existing) {
      nodeMap.set(step.nodeKey, {
        nodeKey: step.nodeKey,
        label: step.nodeKey.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()),
        url: step.url,
        status: nodeStatus,
        step: step.index,
        ...(step.durationMs !== undefined ? { durationMs: step.durationMs } : {}),
        ...(imageUrl ? { imageUrl } : {}),
      });
    } else {
      nodeMap.set(step.nodeKey, {
        ...existing,
        ...(step.url ? { url: step.url } : {}),
        status: existing.status === "running" ? "running" : nodeStatus,
        step: Math.min(existing.step, step.index),
        ...(imageUrl ? { imageUrl } : {}),
      });
    }
  }

  for (let index = 1; index < sortedSteps.length; index += 1) {
    const prev = sortedSteps[index - 1];
    const curr = sortedSteps[index];
    if (!prev || !curr || prev.nodeKey === curr.nodeKey) {
      continue;
    }
    const edgeKey = `${prev.nodeKey}->${curr.nodeKey}`;
    if (!edgeMap.has(edgeKey)) {
      edgeMap.set(edgeKey, {
        edgeKey,
        sourceNodeKey: prev.nodeKey,
        targetNodeKey: curr.nodeKey,
        label: curr.description,
      });
    }
  }

  return {
    nodes: [...nodeMap.values()].sort((a, b) => a.step - b.step),
    edges: [...edgeMap.values()],
  };
}
