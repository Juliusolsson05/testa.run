export type Severity = "error" | "warning";

export type FindingStatus = "open" | "resolved";

export type TestRequest = {
  url: string;
  viewport?: { width: number; height: number };
  steps?: string[];
  auth?: { username: string; password: string };
};

export type Finding = {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: FindingStatus;
  element: string;
  evidence?: string;
};

export type Step = {
  label: string;
  url: string;
  status: "passed" | "failed" | "running" | "pending";
  duration?: number;
};

export type TestResult = {
  findings: Finding[];
  steps: Step[];
  summary: string;
  status: "completed" | "failed" | "partial";
};

export type EngineConfig = {
  engineUrl?: string;
  engineToken?: string;
};

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
