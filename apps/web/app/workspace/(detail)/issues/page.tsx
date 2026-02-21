"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Filter } from "lucide-react"
import { AppSidebar } from "@/components/workspace/AppSidebar"
import { useAuth } from "@/components/auth/AuthProvider"
import { useProjectRuns } from "@/components/workspace/useProjectRuns"
import { cn } from "@/lib/utils"

type FilterType = "all" | "error" | "warning" | "resolved"

type RunIssue = {
  id: string
  nodeKey: string
  nodeLabel: string
  stepIndex: number | null
  severity: "error" | "warning"
  status: "open" | "resolved"
  title: string
  element: string
}

export default function IssuesPage() {
  const params = useSearchParams()
  const runIdParam = params.get("runId") || undefined
  const { accessToken } = useAuth()
  const { activeRun } = useProjectRuns(runIdParam, 10)

  const [filter, setFilter] = useState<FilterType>("all")
  const [issues, setIssues] = useState<RunIssue[]>([])

  useEffect(() => {
    async function load() {
      if (!accessToken || !activeRun?.id) return
      const res = await fetch(`/api/runs/${activeRun.id}/issues`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      })
      if (!res.ok) return
      const data = await res.json()
      setIssues(data.issues)
    }

    void load()
  }, [accessToken, activeRun?.id])

  const filtered = useMemo(() => {
    return issues.filter((i) => {
      if (filter === "all") return true
      if (filter === "resolved") return i.status === "resolved"
      if (filter === "error") return i.status === "open" && i.severity === "error"
      return i.status === "open" && i.severity === "warning"
    })
  }, [filter, issues])

  const totalOpen = issues.filter((i) => i.status === "open").length
  const totalErrors = issues.filter((i) => i.status === "open" && i.severity === "error").length
  const totalWarnings = issues.filter((i) => i.status === "open" && i.severity === "warning").length
  const totalResolved = issues.filter((i) => i.status === "resolved").length

  return (
    <div className="flex h-dvh bg-app-bg font-sans">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="border-b border-ui-border bg-white">
          <div className="flex items-stretch divide-x divide-ui-border">
            {[{ label: "OPEN", value: totalOpen }, { label: "ERRORS", value: totalErrors }, { label: "WARNINGS", value: totalWarnings }, { label: "RESOLVED", value: totalResolved }].map((s) => (
              <div key={s.label} className="px-8 py-4">
                <div className="text-[10px] text-ui-muted">{s.label}</div>
                <div className="text-2xl font-bold text-[#1a2a33]">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-ui-border bg-white px-8 py-3">
          <Filter className="h-3.5 w-3.5 text-ui-muted" />
          {(["all", "error", "warning", "resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn("rounded px-3 py-1 text-[12px] font-semibold", filter === f ? "bg-[#1d6ef5] text-white" : "text-ui-muted hover:bg-app-bg")}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-ui-muted">{activeRun ? activeRun.name : "No run selected"}</span>
        </div>

        <div className="flex-1 px-8 py-6">
          {filtered.length === 0 ? (
            <div className="text-sm text-ui-muted">No issues for this run/filter.</div>
          ) : (
            <div className="space-y-2">
              {filtered.map((issue) => (
                <Link
                  key={issue.id}
                  href={activeRun ? `/workspace/${activeRun.id}?issueId=${issue.id}` : "#"}
                  className="flex items-center gap-4 border border-ui-border bg-white px-4 py-3 hover:bg-[#eff6ff]"
                >
                  <span className={cn("h-2 w-2 rounded-full", issue.status === "resolved" ? "bg-emerald-500" : issue.severity === "error" ? "bg-red-500" : "bg-amber-400")} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#1a2a33]">{issue.title}</div>
                    <div className="text-xs text-ui-muted">Step {issue.stepIndex ?? "—"} · {issue.nodeLabel} · {issue.element}</div>
                  </div>
                  <span className="text-xs text-ui-muted">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
