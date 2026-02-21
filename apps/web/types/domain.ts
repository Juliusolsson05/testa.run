// ────────────────────────────────────────────────────────────────────────────
// Canonical domain types — single source of truth
// ────────────────────────────────────────────────────────────────────────────

// Opaque id helpers
export type RunId = string
export type IssueId = string
export type NodeId = string

// ── Issues ──────────────────────────────────────────────────────────────────

export type IssueSeverity = "error" | "warning"
export type IssueStatus = "open" | "resolved"

export type Issue = {
  id: IssueId
  runId: RunId
  nodeId: NodeId
  title: string
  description: string
  reasoning: string
  severity: IssueSeverity
  status: IssueStatus
  element: string
}

// ── Runs ────────────────────────────────────────────────────────────────────

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

export type RunStep = {
  id: string
  index: number
  action: RunStepAction
  target: string
  description: string
  reasoning: string
  duration: string
  status: RunStepStatus
  nodeId: NodeId
}

export type Run = {
  id: RunId
  label: string
  name: string
  category: "security" | "buttons" | "ux"
  url: string
  date: string
  ago: string
  duration: string
  status: RunStatus
  steps: RunStep[]
}

// ── Run summaries (home list / tables) ──────────────────────────────────────

export type RunSummary = {
  id: RunId
  name: string
  url: string
  date: string
  duration: string
  status: RunStatus
  errors: number
  warnings: number
  steps: number
  href: string
}

// ── Flow node status (UI) ───────────────────────────────────────────────────

export type NodeStatus = "passed" | "running" | "pending"
