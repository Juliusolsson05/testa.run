export type TestRunRequest = {
  url: string;
  prompt?: string;
};

export type RunCategory = "security" | "buttons" | "ux";
export type RunStatus = "running" | "passed" | "warning" | "failed";

export type RunStepStatus = "passed" | "failed" | "warning";
export type RunStepAction =
  | "navigate"
  | "scroll"
  | "audit"
  | "click"
  | "wait"
  | "fill"
  | "resize"
  | "screenshot";

export type NodeStatus = "passed" | "running" | "pending";

export type IssueSeverity = "error" | "warning";
export type IssueStatus = "open" | "resolved";
export type IssueCategory = "security" | "other";

export type RunMeta = {
  runKey: string;
  name: string;
  category: RunCategory;
  status: RunStatus;
  startedAt: string;
  finishedAt?: string;
  durationMs?: number;
  summary?: string;
  securitySynopsis?: string;
  metadata?: Record<string, unknown>;
};

export type StepItem = {
  stepKey: string;
  index: number;
  nodeKey: string;
  action: RunStepAction;
  target: string;
  description: string;
  reasoning: string;
  status: RunStepStatus;
  durationMs?: number;
  url: string;
};

export type IssueItem = {
  issueKey: string;
  nodeKey: string;
  stepKey?: string;
  category: IssueCategory;
  title: string;
  description: string;
  reasoning: string;
  element: string;
  severity: IssueSeverity;
  status: IssueStatus;
  detectedAt?: string;
};

export type FlowNodeItem = {
  nodeKey: string;
  label: string;
  url: string;
  status: NodeStatus;
  step: number;
  durationMs?: number;
  imageUrl?: string;
};

export type FlowEdgeItem = {
  edgeKey: string;
  sourceNodeKey: string;
  targetNodeKey: string;
  label?: string;
};

export type RunError = {
  code: string;
  message: string;
};

export type TestRunResult = {
  run: RunMeta;
  steps: StepItem[];
  issues: IssueItem[];
  nodes: FlowNodeItem[];
  edges: FlowEdgeItem[];
};

export type TestRunEvent =
  | {
      type: "run.started";
      runKey: string;
      at: string;
      run: RunMeta;
    }
  | {
      type: "run.updated";
      runKey: string;
      at: string;
      run: RunMeta;
    }
  | {
      type: "step.upserted";
      runKey: string;
      at: string;
      step: StepItem;
    }
  | {
      type: "step.progress";
      runKey: string;
      at: string;
      stepKey: string;
      message: string;
    }
  | {
      type: "step.image";
      runKey: string;
      at: string;
      stepKey: string;
      imageUrl: string;
      nodeKey?: string;
    }
  | {
      type: "node.upserted";
      runKey: string;
      at: string;
      node: FlowNodeItem;
    }
  | {
      type: "edge.upserted";
      runKey: string;
      at: string;
      edge: FlowEdgeItem;
    }
  | {
      type: "issue.created";
      runKey: string;
      at: string;
      issue: IssueItem;
    }
  | {
      type: "run.warning";
      runKey: string;
      at: string;
      message: string;
    }
  | {
      type: "run.failed";
      runKey: string;
      at: string;
      error: RunError;
      partialResult?: TestRunResult;
    }
  | {
      type: "run.completed";
      runKey: string;
      at: string;
      result: TestRunResult;
    };

export type TestRunHandle = {
  runKey: string;
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
