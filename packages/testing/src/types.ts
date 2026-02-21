export type TestRunRequest = {
  url: string;
  prompt?: string;
};

export type FindingDomain = "qa" | "security";

export type FindingSeverity = "error" | "warning";

export type FindingStatus = "open" | "resolved";

export type StepStatus = "passed" | "failed" | "running" | "pending";

export type RunStatus = "completed" | "failed" | "partial";

export type Step = {
  id: string;
  label: string;
  url: string;
  status: StepStatus;
  duration?: number;
  screenshotUrl?: string;
};

export type Finding = {
  id: string;
  domain: FindingDomain;
  category: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  status: FindingStatus;
  element: string;
  evidence?: string;
};

export type RunError = {
  code: string;
  message: string;
};

export type TestRunResult = {
  findings: Finding[];
  qaFindings: Finding[];
  securityFindings: Finding[];
  steps: Step[];
  summary: string;
  status: RunStatus;
  error?: RunError;
};

export type TestRunEvent =
  | {
      type: "run.started";
      runId: string;
      at: string;
      request: { url: string };
    }
  | {
      type: "step.started";
      runId: string;
      at: string;
      step: Step;
    }
  | {
      type: "step.progress";
      runId: string;
      at: string;
      stepId: string;
      message: string;
    }
  | {
      type: "step.screenshot";
      runId: string;
      at: string;
      stepId: string;
      imageUrl: string;
    }
  | {
      type: "finding.created";
      runId: string;
      at: string;
      finding: Finding;
    }
  | {
      type: "run.warning";
      runId: string;
      at: string;
      message: string;
    }
  | {
      type: "run.failed";
      runId: string;
      at: string;
      error: RunError;
    }
  | {
      type: "run.completed";
      runId: string;
      at: string;
      result: TestRunResult;
    };

export type TestRunHandle = {
  runId: string;
  events: AsyncIterable<TestRunEvent>;
  result: Promise<TestRunResult>;
  cancel: () => void;
};

export type EngineConfig = {
  engineUrl?: string;
  engineToken?: string;
};

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
