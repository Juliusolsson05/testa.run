"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Filter, KanbanSquare, LayoutList } from "lucide-react"
import { AppSidebar } from "@/components/workspace/AppSidebar"
import { useAuth } from "@/components/auth/AuthProvider"
import { useProjectRuns } from "@/components/workspace/useProjectRuns"
import { cn } from "@/lib/utils"

type FilterType = "all" | "error" | "warning" | "resolved"
type ViewMode = "list" | "kanban"

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

function IssueListRow({ issue, href }: { issue: RunIssue; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 border border-ui-border bg-white px-4 py-3 hover:bg-[#eff6ff]"
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          issue.status === "resolved"
            ? "bg-emerald-500"
            : issue.severity === "error"
              ? "bg-red-500"
              : "bg-amber-400"
        )}
      />
      <div className="flex-1">
        <div className="text-sm font-semibold text-[#1a2a33]">{issue.title}</div>
        <div className="text-xs text-ui-muted">
          Step {issue.stepIndex ?? "—"} · {issue.nodeLabel} · {issue.element}
        </div>
      </div>
      <span className="text-xs text-ui-muted">→</span>
    </Link>
  )
}

function KanbanColumn({
  label,
  items,
  hrefFor,
}: {
  label: string
  items: RunIssue[]
  hrefFor: (issue: RunIssue) => string
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.7px] text-ui-muted">{label}</span>
        <span className="rounded bg-[#eff6ff] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#1559d4]">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed border-ui-border px-4 py-6 text-center text-[12px] text-ui-muted">
          None
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((issue) => (
            <IssueListRow key={issue.id} issue={issue} href={hrefFor(issue)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function IssuesPage() {
  const params = useSearchParams()
  const runIdParam = params.get("runId") || undefined
  const { accessToken } = useAuth()
  const { activeRun } = useProjectRuns(runIdParam, 10)

  const [filter, setFilter] = useState<FilterType>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")
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

  const { openErrors, openWarnings, resolved } = useMemo(() => {
    const openErrorsIssues = filtered.filter((i) => i.status === "open" && i.severity === "error")
    const openWarningsIssues = filtered.filter((i) => i.status === "open" && i.severity === "warning")
    const resolvedIssues = filtered.filter((i) => i.status === "resolved")
    return {
      openErrors: openErrorsIssues,
      openWarnings: openWarningsIssues,
      resolved: resolvedIssues,
    }
  }, [filtered])

  const totalOpen = issues.filter((i) => i.status === "open").length
  const totalErrors = issues.filter((i) => i.status === "open" && i.severity === "error").length
  const totalWarnings = issues.filter((i) => i.status === "open" && i.severity === "warning").length
  const totalResolved = issues.filter((i) => i.status === "resolved").length

  const issueHref = (issue: RunIssue) =>
    activeRun ? `/workspace/${activeRun.id}?issueId=${issue.id}` : "#"

  return (
    <div className="flex h-dvh bg-app-bg font-sans">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="border-b border-ui-border bg-white">
          <div className="flex items-stretch divide-x divide-ui-border">
            {[
              { label: "OPEN", value: totalOpen },
              { label: "ERRORS", value: totalErrors },
              { label: "WARNINGS", value: totalWarnings },
              { label: "RESOLVED", value: totalResolved },
            ].map((s) => (
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
              className={cn(
                "rounded px-3 py-1 text-[12px] font-semibold",
                filter === f ? "bg-[#1d6ef5] text-white" : "text-ui-muted hover:bg-app-bg"
              )}
            >
              {f}
            </button>
          ))}

          <div className="ml-2 flex items-center gap-1 rounded border border-ui-border bg-white p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold",
                viewMode === "kanban" ? "bg-[#1d6ef5] text-white" : "text-ui-muted hover:bg-app-bg"
              )}
            >
              <KanbanSquare className="h-3.5 w-3.5" /> Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold",
                viewMode === "list" ? "bg-[#1d6ef5] text-white" : "text-ui-muted hover:bg-app-bg"
              )}
            >
              <LayoutList className="h-3.5 w-3.5" /> List
            </button>
          </div>

          <span className="ml-auto text-[11px] text-ui-muted">
            {activeRun ? activeRun.name : "No run selected"}
          </span>
        </div>

        <div className="flex-1 px-8 py-6">
          {filtered.length === 0 ? (
            <div className="text-sm text-ui-muted">No issues for this run/filter.</div>
          ) : viewMode === "list" ? (
            <div className="space-y-2">
              {filtered.map((issue) => (
                <IssueListRow key={issue.id} issue={issue} href={issueHref(issue)} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              <KanbanColumn label="Open errors" items={openErrors} hrefFor={issueHref} />
              <KanbanColumn label="Open warnings" items={openWarnings} hrefFor={issueHref} />
              <KanbanColumn label="Resolved" items={resolved} hrefFor={issueHref} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
