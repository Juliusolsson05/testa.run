"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ShieldAlert, ShieldCheck } from "lucide-react"

import { AppSidebar } from "@/components/workspace/AppSidebar"
import { useAuth } from "@/components/auth/AuthProvider"
import { useProjectRuns } from "@/components/workspace/useProjectRuns"
import { InlineLoading } from "@/components/loading/InlineLoading"
import { StatSkeleton } from "@/components/workspace/StatSkeleton"
import { cn } from "@/lib/utils"

type ScopeType = "all" | string

type SecurityIssue = {
  id: string
  runId: string
  runName: string
  stepIndex: number | null
  nodeLabel: string
  severity: "error" | "warning"
  status: "open" | "resolved"
  title: string
  description: string
  reasoning: string
  element: string
}

type RunDetail = { securitySynopsis: string | null }

export default function SecurityPage() {
  const params = useSearchParams()
  const runIdParam = params.get("runId") || undefined
  const { accessToken } = useAuth()
  const { loading: runsLoading, project, runs } = useProjectRuns(undefined, 20)

  const [scope, setScope] = useState<ScopeType>(runIdParam ?? "all")
  const [issues, setIssues] = useState<SecurityIssue[]>([])
  const [runDetail, setRunDetail] = useState<RunDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showResolved, setShowResolved] = useState(false)

  useEffect(() => {
    if (!runIdParam) return
    setScope(runIdParam)
  }, [runIdParam])

  useEffect(() => {
    async function load() {
      if (!accessToken) {
        setLoading(false)
        setIssues([])
        setRunDetail(null)
        return
      }

      if (!project?.id) {
        if (runsLoading) {
          setLoading(true)
        } else {
          setLoading(false)
          setIssues([])
          setRunDetail(null)
        }
        return
      }

      setLoading(true)
      const headers = { Authorization: `Bearer ${accessToken}` }
      const query = new URLSearchParams({ category: "security" })
      if (scope !== "all") query.set("runId", scope)

      const issuesRes = await fetch(`/api/projects/${project.id}/issues?${query.toString()}`, {
        headers,
        cache: "no-store",
      })

      if (issuesRes.ok) {
        const data = await issuesRes.json()
        setIssues(data.issues)
      } else {
        setIssues([])
      }

      if (scope !== "all") {
        const runRes = await fetch(`/api/runs/${scope}`, { headers, cache: "no-store" })
        if (runRes.ok) {
          const data = await runRes.json()
          setRunDetail({ securitySynopsis: data.run.securitySynopsis ?? null })
        } else {
          setRunDetail(null)
        }
      } else {
        setRunDetail(null)
      }

      setLoading(false)
    }

    void load()
  }, [accessToken, project?.id, runsLoading, scope])

  const openSec = useMemo(() => issues.filter((i) => i.status === "open"), [issues])
  const resolvedSec = useMemo(() => issues.filter((i) => i.status === "resolved"), [issues])
  const criticalCount = useMemo(
    () => openSec.filter((i) => i.severity === "error").length,
    [openSec]
  )

  const riskLevel =
    criticalCount > 0 ? "Critical" : openSec.length > 0 ? "High" : resolvedSec.length > 0 ? "Low" : "None"

  const riskStyle = {
    Critical: { label: "CRITICAL", dot: "bg-red-500", text: "text-red-600", bg: "bg-red-500/10" },
    High: { label: "HIGH", dot: "bg-amber-400", text: "text-amber-600", bg: "bg-amber-400/10" },
    Low: { label: "LOW", dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-500/10" },
    None: { label: "NONE", dot: "bg-white/30", text: "text-white/50", bg: "bg-white/10" },
  }[riskLevel]

  const selectedRunName = scope === "all"
    ? "All jobs"
    : runs.find((r) => r.id === scope)?.name ?? "Selected job"

  const orderedIssues = useMemo(() => {
    const openCritical = issues.filter((i) => i.status === "open" && i.severity === "error")
    const openWarnings = issues.filter((i) => i.status === "open" && i.severity === "warning")
    const resolved = issues.filter((i) => i.status === "resolved")
    return showResolved ? [...openCritical, ...openWarnings, ...resolved] : [...openCritical, ...openWarnings]
  }, [issues, showResolved])

  return (
    <div className="flex h-dvh bg-[#eff6ff] font-sans">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="border-b border-[#c7d9f0] bg-white">
          <div className="flex items-stretch divide-x divide-[#c7d9f0]">
            {loading && issues.length === 0 ? (
              Array.from({ length: 4 }).map((_, idx) => <StatSkeleton key={idx} className="px-10 py-5 first:pl-8" />)
            ) : (
              ([
                { label: "RISK LEVEL", value: riskLevel, color: criticalCount > 0 ? "text-red-500" : "text-amber-500" },
                { label: "OPEN FINDINGS", value: openSec.length, color: "text-[#1a2a33]" },
                { label: "CRITICAL", value: criticalCount, color: "text-red-500" },
                { label: "RESOLVED", value: resolvedSec.length, color: "text-emerald-500" },
              ] as const).map((stat) => (
                <div key={stat.label} className="px-10 py-5 first:pl-8">
                  <div className="text-[10px] font-bold uppercase tracking-[0.8px] text-[#4a7ab5]">{stat.label}</div>
                  <div className={cn("mt-0.5 text-[30px] font-bold leading-none tabular-nums", stat.color)}>{stat.value}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-[#c7d9f0] bg-white px-8 py-3">
          <ShieldAlert className="h-3.5 w-3.5 text-[#4a7ab5]" />
          <select
            className="rounded border border-[#c7d9f0] bg-white px-2 py-1 text-[12px] text-[#1a2a33]"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            <option value="all">All jobs</option>
            {runs.map((run) => (
              <option key={run.id} value={run.id}>
                {run.name}
              </option>
            ))}
          </select>
          <span className="ml-auto text-[11px] text-[#4a7ab5]">{selectedRunName}</span>
        </div>

        <div className="flex-1 px-8 py-6 flex flex-col gap-6">
          {loading ? (
            <InlineLoading label="Loading security analysis…" cubeSize={58} className="min-h-[420px]" />
          ) : (
            <>
              {runDetail?.securitySynopsis && (
                <div className="border border-[#c7d9f0] bg-white">
                  <div className="flex items-center gap-3 border-b border-[#eff6ff] px-6 py-4">
                    <ShieldAlert className="h-4 w-4 text-[#1d6ef5]" />
                    <span className="text-[12px] font-bold uppercase tracking-[0.8px] text-[#4a7ab5]">Security Analysis</span>
                    <span className={cn("ml-auto flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-semibold", riskStyle.text, riskStyle.bg)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", riskStyle.dot)} />
                      {riskStyle.label}
                    </span>
                  </div>
                  <div className="px-6 py-5">
                    {runDetail.securitySynopsis.split("\n\n").map((para, i) => (
                      <p key={i} className={cn("text-[14px] leading-relaxed text-[#1a2a33]", i > 0 && "mt-4")}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-[0.8px] text-[#4a7ab5]">Findings</div>
                  {resolvedSec.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowResolved((v) => !v)}
                      className="rounded border border-[#c7d9f0] bg-white px-2 py-1 text-[10px] font-semibold text-[#4a7ab5] hover:bg-[#eff6ff]"
                    >
                      {showResolved ? "Hide resolved" : `Show resolved (${resolvedSec.length})`}
                    </button>
                  )}
                </div>

                {orderedIssues.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-20 text-center">
                    <ShieldCheck className="h-8 w-8 text-emerald-500" />
                    <p className="text-[13px] text-[#4a7ab5]">No security findings.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden border border-[#c7d9f0] bg-white">
                    {orderedIssues.map((issue, idx) => {
                      const isError = issue.severity === "error" && issue.status === "open"
                      const isWarning = issue.severity === "warning" && issue.status === "open"
                      const isResolved = issue.status === "resolved"

                      return (
                        <Link
                          key={issue.id}
                          href={`/workspace/${issue.runId}?issueId=${issue.id}`}
                          className={cn(
                            "group flex flex-col gap-2.5 border-l-4 px-5 py-4 transition-colors cursor-pointer",
                            idx !== 0 && "border-t border-[#eff6ff]",
                            isError && "border-l-red-500 bg-red-500/[0.03] hover:bg-red-500/[0.06]",
                            isWarning && "border-l-amber-400 bg-amber-400/[0.03] hover:bg-amber-400/[0.06]",
                            isResolved && "border-l-emerald-400 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04]"
                          )}
                        >
                          <div className="flex items-center gap-5">
                            <div
                              className={cn(
                                "flex w-[90px] shrink-0 items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-semibold",
                                isResolved && "bg-emerald-500/10 text-emerald-600",
                                isError && "bg-red-500/10 text-red-600",
                                isWarning && "bg-amber-400/10 text-amber-600"
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 shrink-0 rounded-full",
                                  isResolved && "bg-emerald-500",
                                  isError && "bg-red-500",
                                  isWarning && "bg-amber-400"
                                )}
                              />
                              {isResolved ? "Resolved" : isError ? "Error" : "Warning"}
                            </div>

                            <div className={cn("min-w-0 flex-1 text-[13px] font-medium text-[#1a2a33]", isResolved && "text-[#4a7ab5] line-through")}>
                              {issue.title}
                            </div>

                            <code className="shrink-0 font-mono text-[11px] text-[#4a7ab5]">{issue.element}</code>

                            <div className="shrink-0 rounded bg-[#dbeafe] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#1559d4]">
                              Step {issue.stepIndex ?? "—"}
                            </div>

                            <span className="text-[#4a7ab5] opacity-0 transition-opacity group-hover:opacity-100">→</span>
                          </div>

                          <div className="pl-[118px] flex flex-col gap-1.5">
                            <p className="text-[12px] text-[#1a2a33]">{issue.description}</p>
                            <p className="text-[12px] leading-relaxed text-[#4a7ab5]">{issue.reasoning}</p>
                            <p className="text-[11px] text-ui-muted">{issue.nodeLabel}</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
