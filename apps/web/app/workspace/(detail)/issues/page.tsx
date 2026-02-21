"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertTriangle, Filter, KanbanSquare, LayoutList, RefreshCw, XCircle } from "lucide-react"

import { AppSidebar } from "@/components/workspace/AppSidebar"
import { Button } from "@/components/ui/button"
import { issues } from "@/data/issues"
import { nodesById } from "@/data/flow"
import { cn } from "@/lib/utils"
import type { Issue } from "@/types/domain"

type FilterType = "all" | "error" | "warning" | "resolved"
type ViewMode   = "list" | "kanban"

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "all",      label: "All" },
  { id: "error",    label: "Errors" },
  { id: "warning",  label: "Warnings" },
  { id: "resolved", label: "Resolved" },
]

// ── Shared issue card used in both views ──────────────────────────────────────
function IssueRow({ issue, idx, showBorder }: { issue: Issue; idx: number; showBorder: boolean }) {
  const nd         = nodesById[issue.nodeId]
  const step       = nd?.data.step ?? 0
  const isError    = issue.severity === "error"   && issue.status === "open"
  const isWarning  = issue.severity === "warning" && issue.status === "open"
  const isResolved = issue.status === "resolved"

  return (
    <Link
      href={`/workspace?issueId=${issue.id}`}
      className={cn(
        "group flex items-center gap-5 px-5 py-3.5 transition-colors hover:bg-[#eff6ff] cursor-pointer",
        showBorder && "border-t border-[#eff6ff]"
      )}
    >
      <div className={cn(
        "flex w-[90px] shrink-0 items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-semibold",
        isResolved && "bg-emerald-500/10 text-emerald-600",
        isError    && "bg-red-500/10 text-red-600",
        isWarning  && "bg-amber-400/10 text-amber-600"
      )}>
        <span className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          isResolved && "bg-emerald-500",
          isError    && "bg-red-500",
          isWarning  && "bg-amber-400"
        )} />
        {isResolved ? "Resolved" : isError ? "Error" : "Warning"}
      </div>

      <div className={cn(
        "flex-1 text-[13px] font-medium text-[#1a2a33]",
        isResolved && "text-[#4a7ab5] line-through"
      )}>
        {issue.title}
      </div>

      <code className="shrink-0 font-mono text-[11px] text-[#4a7ab5]">{issue.element}</code>

      <div className="flex shrink-0 items-center gap-3 font-mono text-[11px]">
        <span className="flex items-center gap-1 text-red-500">
          <XCircle className="h-3 w-3" />{isError ? 1 : 0}
        </span>
        <span className="flex items-center gap-1 text-amber-500">
          <AlertTriangle className="h-3 w-3" />{isWarning ? 1 : 0}
        </span>
      </div>

      <div className="shrink-0 rounded bg-[#dbeafe] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#1559d4]">
        Step {step}
      </div>

      <span className="text-[#4a7ab5] opacity-0 transition-opacity group-hover:opacity-100">→</span>
    </Link>
  )
}

// ── Kanban card ───────────────────────────────────────────────────────────────
function KanbanCard({ issue }: { issue: Issue }) {
  const nd         = nodesById[issue.nodeId]
  const step       = nd?.data.step ?? 0
  const nodeLabel  = nd?.data.label ?? "Unknown"
  const isError    = issue.severity === "error"   && issue.status === "open"
  const isWarning  = issue.severity === "warning" && issue.status === "open"
  const isResolved = issue.status === "resolved"

  return (
    <Link
      href={`/workspace?issueId=${issue.id}`}
      className={cn(
        "group flex flex-col gap-2 border border-[#c7d9f0] bg-white p-3.5 transition-colors hover:bg-[#eff6ff] cursor-pointer",
        isError    && "border-l-4 border-l-red-500",
        isWarning  && "border-l-4 border-l-amber-400",
        isResolved && "border-l-4 border-l-emerald-400"
      )}
    >
      <div className={cn(
        "text-[13px] font-medium leading-snug text-[#1a2a33]",
        isResolved && "text-[#4a7ab5] line-through"
      )}>
        {issue.title}
      </div>

      <p className="line-clamp-2 text-[11px] leading-relaxed text-[#4a7ab5]">
        {issue.description}
      </p>

      <div className="flex items-center gap-2 pt-0.5">
        <code className="truncate font-mono text-[10px] text-[#4a7ab5]">{issue.element}</code>
        <div className="ml-auto shrink-0 rounded bg-[#dbeafe] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#1559d4]">
          Step {step}
        </div>
        <span className="shrink-0 text-[10px] text-[#4a7ab5]">{nodeLabel}</span>
        <span className="text-[#4a7ab5] opacity-0 transition-opacity group-hover:opacity-100">→</span>
      </div>
    </Link>
  )
}

// ── Kanban column ─────────────────────────────────────────────────────────────
function KanbanColumn({
  label, count, accent, accentBg, items,
}: {
  label: string
  count: number
  accent: string
  accentBg: string
  items: Issue[]
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      {/* Column header */}
      <div className="flex items-center gap-2">
        <span className={cn("text-[11px] font-bold uppercase tracking-[0.7px]", accent)}>{label}</span>
        <span className={cn("rounded px-1.5 py-0.5 font-mono text-[10px] font-bold", accentBg, accent)}>
          {count}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {items.length === 0 ? (
          <div className="border border-dashed border-[#c7d9f0] px-4 py-6 text-center text-[12px] text-[#4a7ab5]">
            None
          </div>
        ) : (
          items.map((issue) => <KanbanCard key={issue.id} issue={issue} />)
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function IssuesPage() {
  const [filter,   setFilter]   = useState<FilterType>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  const totalOpen     = issues.filter((i) => i.status === "open").length
  const totalErrors   = issues.filter((i) => i.severity === "error"   && i.status === "open").length
  const totalWarnings = issues.filter((i) => i.severity === "warning" && i.status === "open").length
  const totalResolved = issues.filter((i) => i.status === "resolved").length

  const filtered = issues.filter((i) => {
    if (filter === "all")      return true
    if (filter === "error")    return i.severity === "error"   && i.status === "open"
    if (filter === "warning")  return i.severity === "warning" && i.status === "open"
    if (filter === "resolved") return i.status === "resolved"
    return true
  })

  // ── List view: group by node, sorted by step ─────────────────────────────
  const groups = Object.entries(
    filtered.reduce<Record<string, typeof filtered>>((acc, issue) => {
      const bucket = acc[issue.nodeId] ?? []
      bucket.push(issue)
      acc[issue.nodeId] = bucket
      return acc
    }, {})
  ).sort(([a], [b]) => {
    const sa = nodesById[a]?.data.step ?? 0
    const sb = nodesById[b]?.data.step ?? 0
    return sa - sb
  })

  // ── Kanban view: three columns sorted by severity ─────────────────────────
  const kanbanErrors   = filtered.filter((i) => i.severity === "error"   && i.status === "open")
  const kanbanWarnings = filtered.filter((i) => i.severity === "warning" && i.status === "open")
  const kanbanResolved = filtered.filter((i) => i.status === "resolved")

  return (
    <div className="flex h-dvh bg-app-bg font-sans">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">

        {/* ── Stats bar ───────────────────────────────────────────────────── */}
        <div className="border-b border-ui-border bg-white">
          <div className="flex items-stretch divide-x divide-ui-border">
            {([
              { label: "OPEN ISSUES", value: totalOpen,     color: "text-[#1a2a33]"   },
              { label: "ERRORS",      value: totalErrors,   color: "text-red-500"      },
              { label: "WARNINGS",    value: totalWarnings, color: "text-amber-500"    },
              { label: "RESOLVED",    value: totalResolved, color: "text-emerald-500"  },
            ] as const).map((stat) => (
              <div key={stat.label} className="px-10 py-5 first:pl-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.8px] text-[#4a7ab5]">
                  {stat.label}
                </div>
                <div className={cn("mt-0.5 text-[30px] font-bold leading-none tabular-nums", stat.color)}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Filter + view toggle bar ─────────────────────────────────────── */}
        <div className="flex items-center gap-3 border-b border-ui-border bg-white px-8 py-3">
          <Filter className="h-3.5 w-3.5 text-ui-muted" />
          <span className="text-[12px] text-ui-muted">Filter:</span>
          <div className="flex items-center gap-1">
            {FILTERS.map((f) => (
              <Button
                key={f.id}
                type="button"
                size="xs"
                variant={filter === f.id ? "default" : "ghost"}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded px-3 py-1 text-[12px] font-semibold",
                  filter === f.id
                    ? "bg-[#1d6ef5] text-white hover:bg-[#1559d4]"
                    : "text-ui-muted hover:bg-app-bg hover:text-[#1d6ef5]"
                )}
              >
                {f.label}
              </Button>
            ))}
          </div>

          {/* View toggle */}
          <div className="ml-auto flex items-center gap-1 rounded border border-[#c7d9f0] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-medium transition-colors",
                viewMode === "list"
                  ? "bg-[#1d6ef5] text-white"
                  : "text-ui-muted hover:text-[#1d6ef5]"
              )}
            >
              <LayoutList className="h-3.5 w-3.5" />
              List
            </button>
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={cn(
                "flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-medium transition-colors",
                viewMode === "kanban"
                  ? "bg-[#1d6ef5] text-white"
                  : "text-ui-muted hover:text-[#1d6ef5]"
              )}
            >
              <KanbanSquare className="h-3.5 w-3.5" />
              Kanban
            </button>
          </div>

          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            className="text-ui-muted hover:text-[#1d6ef5]"
            aria-label="Refresh issues"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        {viewMode === "list" ? (

          // ── List view ──────────────────────────────────────────────────────
          <div className="flex-1 px-8 py-6">
            {groups.length === 0 && (
              <div className="py-20 text-center text-[13px] text-[#4a7ab5]">
                No issues match this filter.
              </div>
            )}
            {groups.map(([nodeId, nodeIssues]) => {
              const nd   = nodesById[nodeId]
              const meta = { step: nd?.data.step ?? 0, label: nd?.data.label ?? "Unknown" }
              return (
                <div key={nodeId} className="mb-6">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.8px] text-[#4a7ab5]">
                    Step {meta.step} · {meta.label}
                  </div>
                  <div className="overflow-hidden border border-[#c7d9f0] bg-white">
                    {nodeIssues.map((issue, idx) => (
                      <IssueRow key={issue.id} issue={issue} idx={idx} showBorder={idx !== 0} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

        ) : (

          // ── Kanban view ────────────────────────────────────────────────────
          <div className="flex flex-1 gap-5 overflow-x-auto px-8 py-6">
            <KanbanColumn
              label="Errors"
              count={kanbanErrors.length}
              accent="text-red-600"
              accentBg="bg-red-500/10"
              items={kanbanErrors}
            />
            <KanbanColumn
              label="Warnings"
              count={kanbanWarnings.length}
              accent="text-amber-600"
              accentBg="bg-amber-400/10"
              items={kanbanWarnings}
            />
            <KanbanColumn
              label="Resolved"
              count={kanbanResolved.length}
              accent="text-emerald-600"
              accentBg="bg-emerald-500/10"
              items={kanbanResolved}
            />
          </div>

        )}
      </div>
    </div>
  )
}
