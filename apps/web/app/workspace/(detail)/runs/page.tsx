"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Eye,
  MousePointerClick,
  ShieldAlert,
} from "lucide-react"

import { AppSidebar } from "@/components/workspace/AppSidebar"
import { runs, type Run } from "@/data/runs"
import { issues } from "@/data/issues"
import { cn } from "@/lib/utils"

// ── helpers ──────────────────────────────────────────────────────────────────

const categoryIcon = {
  security: ShieldAlert,
  buttons:  MousePointerClick,
  ux:       Eye,
}

const categoryColor = {
  security: { icon: "text-red-400",     bg: "bg-red-500/10"     },
  buttons:  { icon: "text-[#1d6ef5]",   bg: "bg-[#1d6ef5]/10"  },
  ux:       { icon: "text-purple-400",  bg: "bg-purple-500/10"  },
}

const runStatusBadge: Record<Run["status"], { label: string; color: string; bg: string; dot: string }> = {
  running: { label: "Running", color: "text-amber-600",  bg: "bg-amber-400/10",  dot: "bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.6)]" },
  passed:  { label: "Passed",  color: "text-emerald-600",bg: "bg-emerald-500/10", dot: "bg-emerald-500" },
  warning: { label: "Warning", color: "text-amber-600",  bg: "bg-amber-400/10",  dot: "bg-amber-400"   },
  failed:  { label: "Failed",  color: "text-red-600",    bg: "bg-red-500/10",     dot: "bg-red-500"    },
}

const stepStatusDot: Record<string, string> = {
  passed:  "bg-emerald-500",
  warning: "bg-amber-400",
  failed:  "bg-red-500",
}

const actionIcon: Record<string, string> = {
  navigate:   "→",
  scroll:     "↕",
  audit:      "◎",
  click:      "↵",
  wait:       "⏱",
  fill:       "✎",
  resize:     "⤢",
  screenshot: "▣",
}

function issueCountsForRun(run: Run) {
  const runIssues = issues.filter((i) => i.runId === run.id && i.status === "open")
  return {
    errors:   runIssues.filter((i) => i.severity === "error").length,
    warnings: runIssues.filter((i) => i.severity === "warning").length,
  }
}

// ── component ─────────────────────────────────────────────────────────────────

export default function RunsPage() {
  const [openRunId, setOpenRunId] = useState<string | null>(null)

  const totalRunning  = runs.filter((r) => r.status === "running").length
  const totalFailed   = runs.flatMap((r) => r.steps).filter((s) => s.status === "failed").length
  const totalWarnings = runs.flatMap((r) => r.steps).filter((s) => s.status === "warning").length

  return (
    <div className="flex h-dvh bg-[#eff6ff] font-sans">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">

        {/* Stats bar */}
        <div className="border-b border-[#c7d9f0] bg-white">
          <div className="flex items-stretch divide-x divide-[#c7d9f0]">
            {([
              { label: "TOTAL RUNS",   value: runs.length,   color: "text-[#1a2a33]"  },
              { label: "RUNNING",      value: totalRunning,  color: "text-amber-500"  },
              { label: "STEP WARNINGS",value: totalWarnings, color: "text-amber-500"  },
              { label: "STEP FAILURES",value: totalFailed,   color: "text-red-500"    },
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

        {/* Run list */}
        <div className="flex-1 px-8 py-6">
          <div className="flex flex-col gap-3">
            {runs.map((run) => {
              const isOpen = openRunId === run.id
              const Icon   = categoryIcon[run.category]
              const cc     = categoryColor[run.category]
              const sb     = runStatusBadge[run.status]
              const { errors, warnings } = issueCountsForRun(run)

              return (
                <div key={run.id} className="overflow-hidden border border-[#c7d9f0] bg-white">
                  {/* Run header row */}
                  <button
                    onClick={() => setOpenRunId(isOpen ? null : run.id)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#eff6ff]"
                  >
                    {/* Category icon */}
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded", cc.bg)}>
                      <Icon className={cn("h-4 w-4", cc.icon)} />
                    </div>

                    {/* Name + meta */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold text-[#1a2a33]">{run.name}</span>
                        <span className="font-mono text-[11px] text-[#4a7ab5]">{run.label}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 font-mono text-[11px] text-[#4a7ab5]">
                        <span>{run.url}</span>
                        <span className="text-[#c7d9f0]">·</span>
                        <span>{run.date}</span>
                        <span className="text-[#c7d9f0]">·</span>
                        <span>{run.duration}</span>
                        <span className="text-[#c7d9f0]">·</span>
                        <span>{run.steps.length} steps</span>
                      </div>
                    </div>

                    {/* Issue counts */}
                    <div className="flex shrink-0 items-center gap-2 text-[11px] font-medium">
                      {errors > 0 && (
                        <span className="rounded bg-red-500/10 px-2 py-0.5 text-red-600">
                          {errors} error{errors > 1 ? "s" : ""}
                        </span>
                      )}
                      {warnings > 0 && (
                        <span className="rounded bg-amber-400/10 px-2 py-0.5 text-amber-600">
                          {warnings} warning{warnings > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {/* Status badge */}
                    <span className={cn("shrink-0 flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-semibold", sb.color, sb.bg)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", sb.dot)} />
                      {sb.label}
                    </span>

                    {/* Chevron */}
                    {isOpen
                      ? <ChevronDown className="h-4 w-4 shrink-0 text-[#4a7ab5]" />
                      : <ChevronRight className="h-4 w-4 shrink-0 text-[#4a7ab5]" />
                    }
                  </button>

                  {/* Expanded steps */}
                  {isOpen && (
                    <div className="border-t border-[#eff6ff]">
                      {run.steps.map((step, idx) => (
                        <div
                          key={step.id}
                          className={cn(
                            "flex items-center gap-4 px-5 py-2.5",
                            idx !== 0 && "border-t border-[#eff6ff]",
                            "bg-[#f9fbff]"
                          )}
                        >
                          {/* Step number */}
                          <span className="w-5 shrink-0 text-right font-mono text-[10px] text-[#c7d9f0]">
                            {step.index}
                          </span>

                          {/* Action icon */}
                          <span className="w-4 shrink-0 text-center text-[12px] text-[#4a7ab5]">
                            {actionIcon[step.action] ?? "·"}
                          </span>

                          {/* Action type pill */}
                          <span className="shrink-0 rounded bg-[#eff6ff] px-1.5 py-0.5 font-mono text-[10px] text-[#4a7ab5]">
                            {step.action}
                          </span>

                          {/* Description */}
                          <span className="flex-1 truncate text-[12px] text-[#1a2a33]">
                            {step.description}
                          </span>

                          {/* Target */}
                          <code className="max-w-[180px] shrink-0 truncate font-mono text-[10px] text-[#4a7ab5]">
                            {step.target}
                          </code>

                          {/* Duration */}
                          <span className="w-10 shrink-0 text-right font-mono text-[10px] text-[#4a7ab5]">
                            {step.duration}
                          </span>

                          {/* Status dot */}
                          <span className={cn("h-2 w-2 shrink-0 rounded-full", stepStatusDot[step.status])} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
