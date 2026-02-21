export type RunStatus = "passed" | "running" | "failed"

export type RunSummary = {
  id: string
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

export const runs = [
  {
    id: "1",
    name: "TimeEdit test #1",
    url: "timeedit.com",
    date: "2026-02-21",
    duration: "2m 14s",
    status: "passed",
    errors: 2,
    warnings: 2,
    steps: 3,
    href: "/workspace",
  },
] satisfies RunSummary[]
