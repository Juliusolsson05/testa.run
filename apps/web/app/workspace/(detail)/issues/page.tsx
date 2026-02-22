"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Filter, KanbanSquare, LayoutList } from "lucide-react"
import { AppSidebar } from "@/components/workspace/AppSidebar"
import { useAuth } from "@/components/auth/AuthProvider"
import { InlineLoading } from "@/components/loading/InlineLoading"
import { StatSkeleton } from "@/components/workspace/StatSkeleton"
import { useProjectRuns } from "@/components/workspace/useProjectRuns"
import { cn } from "@/lib/utils"

type FilterType = "all" | "error" | "warning" | "resolved"
type ViewMode = "list" | "kanban"
type ScopeType = "all" | string

type RunIssue = {
  id: string
  runId: string
  runName: string
  nodeKey: string
  nodeLabel: string
  stepIndex: number | null
  severity: "error" | "warning"
  status: "open" | "resolved"
  title: string
  element: string
}

function IssueListRow({
  issue,
  href,
  draggable,
  onDragStart,
}: {
  issue: RunIssue
  href: string
  draggable?: boolean
  onDragStart?: (id: string) => void
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={() => onDragStart?.(issue.id)}
      className={cn(draggable ? "cursor-grab active:cursor-grabbing" : "")}
    >
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
            {issue.runName} · Step {issue.stepIndex ?? "—"} · {issue.nodeLabel} · {issue.element}
          </div>
        </div>
        <span className="text-xs text-ui-muted">→</span>
      </Link>
    </div>
  )
}

function KanbanColumn({
  label,
  items,
  hrefFor,
  status,
  onDropTo,
  onDragStart,
  dropActive,
}: {
  label: string
  items: RunIssue[]
  hrefFor: (issue: RunIssue) => string
  status: "open" | "resolved"
  onDropTo: (status: "open" | "resolved") => void
  onDragStart: (id: string) => void
  dropActive: boolean
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.7px] text-ui-muted">{label}</span>
        <span className="rounded bg-[#eff6ff] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#1559d4]">
          {items.length}
        </span>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => onDropTo(status)}
        className={cn(
          "min-h-24 rounded border border-dashed border-ui-border p-2",
          dropActive && "border-[#1d6ef5] bg-[#eff6ff]"
        )}
      >
        {items.length === 0 ? (
          <div className="px-4 py-6 text-center text-[12px] text-ui-muted">Drop issue here</div>
        ) : (
          <div className="space-y-2">
            {items.map((issue) => (
              <IssueListRow
                key={issue.id}
                issue={issue}
                href={hrefFor(issue)}
                draggable
                onDragStart={onDragStart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function IssuesPage() {
  const params = useSearchParams()
  const runIdParam = params.get("runId") || undefined
  const { accessToken } = useAuth()
  const { loading: runsLoading, project, runs } = useProjectRuns(undefined, 20)

  const [filter, setFilter] = useState<FilterType>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")
  const [scope, setScope] = useState<ScopeType>(runIdParam ?? "all")
  const [issues, setIssues] = useState<RunIssue[]>([])
  const [loadingIssues, setLoadingIssues] = useState(true)
  const [draggingIssueId, setDraggingIssueId] = useState<string | null>(null)

  useEffect(() => {
    if (!runIdParam) return
    setScope(runIdParam)
  }, [runIdParam])

  useEffect(() => {
    async function load() {
      if (!accessToken) {
        setLoadingIssues(false)
        setIssues([])
        return
      }

      if (!project?.id) {
        if (runsLoading) {
          setLoadingIssues(true)
        } else {
          setLoadingIssues(false)
          setIssues([])
        }
        return
      }

      setLoadingIssues(true)
      const query = scope === "all" ? "" : `?runId=${encodeURIComponent(scope)}`
      const res = await fetch(`/api/projects/${project.id}/issues${query}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      })
      if (!res.ok) {
        setLoadingIssues(false)
        return
      }
      const data = await res.json()
      setIssues(data.issues)
      setLoadingIssues(false)
    }

    void load()
  }, [accessToken, project?.id, runsLoading, scope])

  async function updateIssueStatus(issueId: string, nextStatus: "open" | "resolved") {
    if (!accessToken) return

    const previous = issues
    setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, status: nextStatus } : i)))

    try {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      })

      if (!res.ok) throw new Error("Failed to update status")
    } catch {
      setIssues(previous)
    }
  }

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

  const issueHref = (issue: RunIssue) => `/workspace/${issue.runId}?issueId=${issue.id}`

  const onDropTo = (status: "open" | "resolved") => {
    if (!draggingIssueId) return
    const current = issues.find((i) => i.id === draggingIssueId)
    setDraggingIssueId(null)
    if (!current || current.status === status) return
    void updateIssueStatus(current.id, status)
  }

  return (
    <div className="flex h-dvh bg-app-bg font-sans">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="border-b border-ui-border bg-white">
          <div className="flex items-stretch divide-x divide-ui-border">
            {loadingIssues && issues.length === 0 ? (
              Array.from({ length: 4 }).map((_, idx) => <StatSkeleton key={idx} />)
            ) : (
              [
                { label: "OPEN", value: totalOpen },
                { label: "ERRORS", value: totalErrors },
                { label: "WARNINGS", value: totalWarnings },
                { label: "RESOLVED", value: totalResolved },
              ].map((s) => (
                <div key={s.label} className="px-8 py-4">
                  <div className="text-[10px] text-ui-muted">{s.label}</div>
                  <div className="text-2xl font-bold text-[#1a2a33]">{s.value}</div>
                </div>
              ))
            )}
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

          <select
            className="ml-2 rounded border border-ui-border bg-white px-2 py-1 text-[12px] text-[#1a2a33]"
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
            {scope === "all" ? "Showing all jobs" : runs.find((r) => r.id === scope)?.name ?? "Selected job"}
          </span>
        </div>

        <div className="flex-1 px-8 py-6">
          {loadingIssues ? (
            <InlineLoading label="Loading issues…" cubeSize={56} className="min-h-[360px]" />
          ) : filtered.length === 0 ? (
            <div className="text-sm text-ui-muted">No issues for this scope/filter.</div>
          ) : viewMode === "list" ? (
            <div className="space-y-2">
              {filtered.map((issue) => (
                <IssueListRow key={issue.id} issue={issue} href={issueHref(issue)} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              <KanbanColumn
                label="Open errors"
                items={openErrors}
                hrefFor={issueHref}
                status="open"
                onDropTo={onDropTo}
                onDragStart={setDraggingIssueId}
                dropActive={draggingIssueId !== null}
              />
              <KanbanColumn
                label="Open warnings"
                items={openWarnings}
                hrefFor={issueHref}
                status="open"
                onDropTo={onDropTo}
                onDragStart={setDraggingIssueId}
                dropActive={draggingIssueId !== null}
              />
              <KanbanColumn
                label="Resolved"
                items={resolved}
                hrefFor={issueHref}
                status="resolved"
                onDropTo={onDropTo}
                onDragStart={setDraggingIssueId}
                dropActive={draggingIssueId !== null}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
