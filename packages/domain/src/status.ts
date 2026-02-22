export type RunStatus = "passed" | "failed" | "running" | "warning"
export type RunStepStatus = "passed" | "failed" | "warning"

export type RunStepAction =
  | "navigate"
  | "scroll"
  | "audit"
  | "click"
  | "wait"
  | "fill"
  | "resize"
  | "screenshot"

export type NodeStatus = "passed" | "running" | "pending"

export type IssueSeverity = "error" | "warning"
export type IssueStatus = "open" | "resolved" | "archived"
export type IssueCategory = "security" | "other"
