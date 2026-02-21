"use client"

import { useState } from "react"
import { AlertTriangle, Filter, RefreshCw, XCircle } from "lucide-react"

import { FloatingNav } from "@/components/workspace/FloatingNav"
import { issues } from "@/data/issues"
import { nodeStepMap } from "@/data/flow"
import { cn } from "@/lib/utils"

type FilterType = "all" | "error" | "warning" | "resolved"

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "all",      label: "All" },
  { id: "error",    label: "Errors" },
  { id: "warning",  label: "Warnings" },
  { id: "resolved", label: "Resolved" },
]

export default function IssuesPage() {
  const [filter, setFilter] = useState<FilterType>("all")

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

  // Group by nodeId, sorted by step number
  const groups = Object.entries(
    filtered.reduce<Record<string, typeof filtered>>((acc, issue) => {
      acc[issue.nodeId] ??= []
      acc[issue.nodeId].push(issue)
      return acc
    }, {})
  ).sort(([a], [b]) => Number(a) - Number(b))

  return (
    <div className="min-h-dvh bg-[#eff6ff] font-sans">
      <FloatingNav />

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <div className="border-b border-[#c7d9f0] bg-white pt-16">
        <div className="flex items-stretch divide-x divide-[#c7d9f0]">
          {([
            { label: "OPEN ISSUES", value: totalOpen,     color: "text-[#1a2a33]" },
            { label: "ERRORS",      value: totalErrors,   color: "text-red-500"    },
            { label: "WARNINGS",    value: totalWarnings, color: "text-amber-500"  },
            { label: "RESOLVED",    value: totalResolved, color: "text-emerald-500"},
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

      {/* ── Filter bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-[#c7d9f0] bg-white px-8 py-3">
        <Filter className="h-3.5 w-3.5 text-[#4a7ab5]" />
        <span className="text-[12px] text-[#4a7ab5]">Filter:</span>
        <div className="flex items-center gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded px-3 py-1 text-[12px] font-semibold transition-colors",
                filter === f.id
                  ? "bg-[#1d6ef5] text-white"
                  : "text-[#4a7ab5] hover:bg-[#eff6ff] hover:text-[#1d6ef5]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="ml-auto text-[#4a7ab5] transition-colors hover:text-[#1d6ef5]">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Issue list ────────────────────────────────────────────────────── */}
      <div className="px-8 py-6">
        {groups.length === 0 && (
          <div className="py-20 text-center text-[13px] text-[#4a7ab5]">
            No issues match this filter.
          </div>
        )}

        {groups.map(([nodeId, nodeIssues]) => {
          const meta = nodeStepMap[nodeId] ?? { step: 0, label: "Unknown" }

          return (
            <div key={nodeId} className="mb-6">
              {/* Group header */}
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.8px] text-[#4a7ab5]">
                Step {meta.step} · {meta.label}
              </div>

              {/* Rows */}
              <div className="overflow-hidden rounded-none border border-[#c7d9f0] bg-white">
                {nodeIssues.map((issue, idx) => {
                  const isError    = issue.severity === "error"   && issue.status === "open"
                  const isWarning  = issue.severity === "warning" && issue.status === "open"
                  const isResolved = issue.status === "resolved"

                  return (
                    <div
                      key={issue.id}
                      className={cn(
                        "group flex items-center gap-5 px-5 py-3.5 transition-colors hover:bg-[#eff6ff]",
                        idx !== 0 && "border-t border-[#eff6ff]"
                      )}
                    >
                      {/* Severity badge */}
                      <div
                        className={cn(
                          "flex w-[90px] shrink-0 items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-semibold",
                          isResolved && "bg-emerald-500/10 text-emerald-600",
                          isError    && "bg-red-500/10 text-red-600",
                          isWarning  && "bg-amber-400/10 text-amber-600"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            isResolved && "bg-emerald-500",
                            isError    && "bg-red-500",
                            isWarning  && "bg-amber-400"
                          )}
                        />
                        {isResolved ? "Resolved" : isError ? "Error" : "Warning"}
                      </div>

                      {/* Title */}
                      <div
                        className={cn(
                          "flex-1 text-[13px] font-medium text-[#1a2a33]",
                          isResolved && "text-[#4a7ab5] line-through"
                        )}
                      >
                        {issue.title}
                      </div>

                      {/* Element selector */}
                      <code className="shrink-0 font-mono text-[11px] text-[#4a7ab5]">
                        {issue.element}
                      </code>

                      {/* Dot summary */}
                      <div className="flex shrink-0 items-center gap-3 font-mono text-[11px]">
                        <span className="flex items-center gap-1 text-red-500">
                          <XCircle className="h-3 w-3" />
                          {isError ? 1 : 0}
                        </span>
                        <span className="flex items-center gap-1 text-amber-500">
                          <AlertTriangle className="h-3 w-3" />
                          {isWarning ? 1 : 0}
                        </span>
                      </div>

                      {/* Step pill */}
                      <div className="shrink-0 rounded bg-[#dbeafe] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#1559d4]">
                        Step {meta.step}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
