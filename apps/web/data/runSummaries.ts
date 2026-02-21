import { issues } from "@/data/issues"
import { runSteps } from "@/data/runs"
import type { RunStatus, RunSummary } from "@/types/domain"

const open = issues.filter((i) => i.status === "open")
const errors = open.filter((i) => i.severity === "error").length
const warnings = open.filter((i) => i.severity === "warning").length

export const runs = [
  {
    id: "1",
    name: "TimeEdit test #1",
    url: "timeedit.com",
    date: "2026-02-21",
    duration: "14.8s",
    status: (errors > 0 ? "failed" : "passed") as RunStatus,
    errors,
    warnings,
    steps: runSteps.length,
    href: "/workspace",
  },
] satisfies RunSummary[]
