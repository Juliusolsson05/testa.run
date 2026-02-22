"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Play, X } from "lucide-react"
import { toast } from "sonner"
import { AppSidebar } from "@/components/workspace/AppSidebar"
import { Badge } from "@/components/ui/badge"
import { RequireAuth } from "@/components/auth/RequireAuth"
import { useAuth } from "@/components/auth/AuthProvider"
import { InlineLoading } from "@/components/loading/InlineLoading"
import { useProjectRuns } from "@/components/workspace/useProjectRuns"
import { fetchProjectRuns } from "@/store/runs-slice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { Run, RunStatus } from "@/types/domain"
import { cn } from "@/lib/utils"

const statusConfig = {
  running: {
    label: "Running",
    dot: "bg-[#1d6ef5] shadow-[0_0_6px_rgba(29,110,245,0.7)]",
    badge: "bg-[#1d6ef5]/10 text-[#1d6ef5]",
  },
  passed: { label: "Passed", dot: "bg-emerald-500 shadow-[0_0_6px_#22c55e]", badge: "bg-emerald-500/10 text-emerald-600" },
  warning: { label: "Warning", dot: "bg-amber-400 shadow-[0_0_6px_#f59e0b]", badge: "bg-amber-400/10 text-amber-600" },
  failed: { label: "Failed", dot: "bg-red-500 shadow-[0_0_6px_#ef4444]", badge: "bg-red-500/10 text-red-600" },
} satisfies Record<RunStatus, { label: string; dot: string; badge: string }>

type FilterType = "all" | "running" | "passed" | "warning" | "failed"

type ApiRun = {
  id: string
  label: string | null
  name: string
  url: string
  startedAt: string
  durationMs: number | null
  status: RunStatus
  openIssues: { errors: number; warnings: number }
  stepsCount: number
}

function formatDuration(durationMs: number | null, startedAt?: string, isRunning?: boolean, nowMs?: number) {
  let effectiveDuration = durationMs ?? 0

  if (isRunning && startedAt && nowMs) {
    const elapsed = Math.max(0, nowMs - new Date(startedAt).getTime())
    effectiveDuration = Math.max(effectiveDuration, elapsed)
  }

  if (!effectiveDuration || effectiveDuration <= 0) return "—"
  const sec = Math.floor(effectiveDuration / 1000)
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${s}s`
}

function formatDate(iso: string) {
  const date = new Date(iso)
  return date.toLocaleString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function mapApiRunToUi(run: ApiRun, nowMs: number): Run {
  return {
    id: run.id,
    label: run.label ?? "#—",
    name: run.name,
    category: "ux",
    url: run.url,
    date: formatDate(run.startedAt),
    ago: "",
    duration: formatDuration(run.durationMs, run.startedAt, run.status === "running", nowMs),
    status: run.status,
    steps: Array.from({ length: run.stepsCount }, (_, i) => ({
      id: `${run.id}-step-${i + 1}`,
      index: i + 1,
      action: "audit",
      target: "",
      description: "",
      reasoning: "",
      duration: "",
      status: "passed",
      nodeId: "",
    })),
  }
}

function RunsHome() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { accessToken } = useAuth()
  const [filter, setFilter] = useState<FilterType>("all")
  const [showConfirm, setShowConfirm] = useState(false)
  const [starting, setStarting] = useState(false)
  const { loading: loadingRuns, project, runs: projectRuns } = useProjectRuns(undefined, 30)
  const usage = useAppSelector((s) => s.billing.usage)
  const usageStatus = useAppSelector((s) => s.billing.usageStatus)
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const runs = useMemo(() => projectRuns.map((run) => mapApiRunToUi(run as ApiRun, nowMs)), [nowMs, projectRuns])
  const issueCounts = useMemo(
    () =>
      Object.fromEntries(
        projectRuns.map((run) => [
          run.id,
          { errors: run.openIssues.errors ?? 0, warnings: run.openIssues.warnings ?? 0 },
        ])
      ),
    [projectRuns]
  )
  const hasProject = !!project
  const usageReady = usageStatus === "loaded"
  const runLocked = usageReady && usage?.remaining === 0

  const totalRunning = runs.filter((r) => r.status === "running").length
  const totalPassed = runs.filter((r) => r.status === "passed").length
  const totalFailed = runs.filter((r) => r.status === "failed").length
  const totalWarning = runs.filter((r) => r.status === "warning").length
  const openIssues = useMemo(
    () => Object.values(issueCounts).reduce((sum, count) => sum + count.errors + count.warnings, 0),
    [issueCounts]
  )

  function defaultRunName() {
    const now = new Date()
    const stamp = now.toLocaleString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    return `Run ${stamp}`
  }

  async function renameRun(runId: string, currentName: string) {
    if (!accessToken) return
    const name = window.prompt("Rename run", currentName)?.trim()
    if (!name || name === currentName) return

    const res = await fetch(`/api/runs/${runId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name }),
    })

    if (!res.ok) {
      const payload = await res.json().catch(() => null)
      toast.error(payload?.error || "Could not rename run")
      return
    }

    toast.success("Run renamed")
    void dispatch(fetchProjectRuns({ force: true }))
  }

  const startNewRun = useCallback(async () => {
    if (!accessToken || !project?.id || !usageReady || runLocked) return
    setStarting(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/runs/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: defaultRunName(), category: "ux" }),
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        if (payload?.code === "PLAN_LIMIT_REACHED") {
          toast.error(`Starter includes ${payload.limit} run/month. Upgrade to Pro for unlimited runs.`)
        } else {
          toast.error(payload?.error || "Failed to start run")
        }
        throw new Error("Failed to start run")
      }
      const data = await res.json()
      setShowConfirm(false)
      router.push(`/workspace/${data.run.id}`)
    } catch {
      setStarting(false)
    }
  }, [accessToken, project?.id, router, runLocked, usageReady])

  const filtered = filter === "all" ? runs : runs.filter((r) => r.status === filter)

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: "all", label: "All runs", count: runs.length },
    { id: "running", label: "Running", count: totalRunning },
    { id: "passed", label: "Passed", count: totalPassed },
    { id: "warning", label: "Warnings", count: totalWarning },
    { id: "failed", label: "Failed", count: totalFailed },
  ]

  return (
    <div className="flex h-dvh bg-app-bg font-sans">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="border-b border-ui-border bg-white">
          <div className="flex items-stretch divide-x divide-ui-border">
            {([
              { label: "TOTAL RUNS", value: runs.length, color: "text-[#1a2a33]" },
              { label: "RUNNING", value: totalRunning, color: "text-[#1d6ef5]" },
              { label: "FAILED", value: totalFailed, color: "text-red-500" },
              { label: "OPEN ISSUES", value: openIssues, color: "text-red-500" },
            ] as const).map((stat) => (
              <div key={stat.label} className="px-10 py-5 first:pl-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.8px] text-ui-muted">{stat.label}</div>
                <div className={cn("mt-0.5 text-[30px] font-bold leading-none tabular-nums", stat.color)}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-ui-border bg-white px-8 py-3">
          <span className="text-[12px] text-ui-muted">Filter:</span>
          <div className="flex items-center gap-1">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded px-3 py-1 text-[12px] font-semibold transition-colors",
                  filter === f.id ? "bg-[#1d6ef5] text-white" : "text-ui-muted hover:bg-app-bg hover:text-[#1d6ef5]"
                )}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 px-8 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-[22px] font-bold tracking-tight text-[#1a2a33]">Test runs</h1>
            {hasProject && (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={!usageReady || runLocked}
                className="flex items-center gap-2 rounded bg-[#1d6ef5] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1557d0] disabled:cursor-not-allowed disabled:opacity-50"
                title={!usageReady ? "Checking plan access..." : runLocked ? "No runs remaining on Starter this month" : undefined}
              >
                <Play className="h-3.5 w-3.5" />
                {!usageReady ? "Checking plan..." : "New Run"}
              </button>
            )}
          </div>

          {!usageReady ? (
            <div className="mb-4 rounded border border-ui-border bg-white p-3 text-xs text-ui-muted">Checking your plan access…</div>
          ) : usage ? (
            <div className="mb-4 rounded border border-ui-border bg-white p-3 text-xs text-ui-muted">
              <span className="font-semibold text-[#1a2a33]">Plan:</span> {usage.plan.toUpperCase()} · {usage.monthlyLimit == null ? "Unlimited runs" : `${usage.used}/${usage.monthlyLimit} runs used this month`}
              {runLocked && <span className="ml-2 font-semibold text-red-600">No credits left — upgrade to Pro to continue.</span>}
            </div>
          ) : null}

          {showConfirm && (
            <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/40">
              <div className="w-full max-w-sm rounded-lg border border-ui-border bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-semibold text-[#1a2a33]">Start new run?</h2>
                  <button onClick={() => setShowConfirm(false)} className="text-ui-muted hover:text-[#1a2a33]">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-ui-muted">
                  This will start a new test run against your project target. The agent will begin testing immediately.
                </p>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 rounded border border-ui-border px-3 py-2 text-sm font-semibold text-[#1a2a33]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => void startNewRun()}
                    disabled={starting || !usageReady || runLocked}
                    className="flex-1 rounded bg-[#1d6ef5] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {starting ? "Starting…" : "Start Run"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {loadingRuns ? (
            <InlineLoading label="Loading runs…" cubeSize={56} className="min-h-[360px]" />
          ) : !hasProject ? (
            <div className="rounded border border-ui-border bg-white p-4 text-sm text-ui-muted">
              You are signed in but do not have a project yet.
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded border border-ui-border bg-white p-4 text-sm text-ui-muted">No runs yet.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((run) => {
                const s = statusConfig[run.status]
                const { errors, warnings } = issueCounts[run.id] ?? { errors: 0, warnings: 0 }
                return (
                  <Link
                    key={run.id}
                    href={`/workspace/${run.id}`}
                    className="group relative flex items-center gap-5 border border-ui-border bg-white px-5 py-4 transition-shadow hover:shadow-[0_4px_16px_rgba(29,110,245,0.12)]"
                  >
                    {run.status === "running" && (
                      <>
                        <span className="absolute left-0 top-0 h-full w-1 bg-[#1d6ef5]/90" />
                        <span className="pointer-events-none absolute inset-y-0 left-0 w-[42%] animate-[pulse_1.6s_ease-in-out_infinite] bg-gradient-to-r from-[#1d6ef5]/20 via-[#60a5fa]/35 to-transparent" />
                      </>
                    )}
                    <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", s.dot)} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[14px] font-semibold text-[#1a2a33] transition-colors group-hover:text-[#1d6ef5]">{run.name}</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            void renameRun(run.id, run.name)
                          }}
                          className="rounded border border-ui-border px-1.5 py-0.5 text-[10px] font-semibold text-ui-muted hover:text-[#1d6ef5]"
                        >
                          Rename
                        </button>
                        <span className="font-mono text-[11px] text-ui-muted">{run.label}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 font-mono text-[11px] text-ui-muted">
                        <span>{run.url}</span>
                        <span className="text-ui-border">·</span>
                        <span>{run.date}</span>
                        <span className="text-ui-border">·</span>
                        <span>{run.duration}</span>
                        <span className="text-ui-border">·</span>
                        <span>{run.steps.length} steps</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-[11px] font-medium">
                      {errors > 0 && (
                        <Badge className="rounded bg-red-500/10 px-2 py-0.5 text-red-600 hover:bg-red-500/10">
                          {errors} error{errors > 1 ? "s" : ""}
                        </Badge>
                      )}
                      {warnings > 0 && (
                        <Badge className="rounded bg-amber-400/10 px-2 py-0.5 text-amber-600 hover:bg-amber-400/10">
                          {warnings} warning{warnings > 1 ? "s" : ""}
                        </Badge>
                      )}
                      {errors === 0 && warnings === 0 && (
                        <Badge className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-600 hover:bg-emerald-500/10">Clean</Badge>
                      )}
                    </div>

                    <span className={cn("shrink-0 rounded px-2.5 py-1 text-[11px] font-semibold", s.badge)}>
                      {run.status === "running" && <span className="mr-1 inline-block h-2.5 w-2.5 animate-spin rounded-full border border-[#1d6ef5] border-t-transparent align-[-1px]" />}
                      {s.label}
                    </span>

                    <span className="text-ui-muted opacity-0 transition-opacity group-hover:opacity-100">→</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <RequireAuth>
      <RunsHome />
    </RequireAuth>
  )
}
