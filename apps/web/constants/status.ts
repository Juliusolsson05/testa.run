import type { NodeStatus, RunStatus, RunStepAction, RunStepStatus } from "@/types/domain"

type StatusStyle = { label: string; color: string; bg: string }

export const runStatusConfig = {
  passed:  { label: "Passed",  color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  running: { label: "Running", color: "#1d6ef5", bg: "rgba(29,110,245,0.1)" },
  warning: { label: "Warning", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  failed:  { label: "Failed",  color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
} satisfies Record<RunStatus, StatusStyle>

export const stepStatusConfig = {
  passed:  { label: "Passed",  color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
  warning: { label: "Warning", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  failed:  { label: "Failed",  color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
} satisfies Record<RunStepStatus, StatusStyle>

export const nodeStatusConfig = {
  passed:  { color: "#22c55e", bg: "rgba(34,197,94,0.12)",  label: "✓ Passed" },
  running: { color: "#1d6ef5", bg: "rgba(29,110,245,0.12)", label: "⟳ Running" },
  pending: { color: "#6366f1", bg: "rgba(99,102,241,0.12)", label: "◦ Pending" },
} satisfies Record<NodeStatus, StatusStyle>

export const actionIcons = {
  navigate:   "→",
  scroll:     "↕",
  audit:      "◎",
  click:      "↵",
  wait:       "⏱",
  fill:       "✎",
  resize:     "⤢",
  screenshot: "▣",
} satisfies Record<RunStepAction, string>
