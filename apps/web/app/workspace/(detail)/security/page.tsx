"use client"

import Link from "next/link"
import { ShieldAlert, ShieldCheck, XCircle, AlertTriangle } from "lucide-react"

import { AppSidebar } from "@/components/workspace/AppSidebar"
import { issues } from "@/data/issues"
import { runs } from "@/data/runs"
import { nodesById } from "@/data/flow"
import { cn } from "@/lib/utils"

const securityIssues  = issues.filter((i) => i.category === "security")
const openSec         = securityIssues.filter((i) => i.status === "open")
const resolvedSec     = securityIssues.filter((i) => i.status === "resolved")
const criticalCount   = openSec.filter((i) => i.severity === "error").length

const riskLevel = criticalCount > 0 ? "Critical" : openSec.length > 0 ? "High" : resolvedSec.length > 0 ? "Low" : "None"

const riskStyle = {
  Critical: { label: "CRITICAL", dot: "bg-red-500",    text: "text-red-600",    bg: "bg-red-500/10"    },
  High:     { label: "HIGH",     dot: "bg-amber-400",  text: "text-amber-600",  bg: "bg-amber-400/10"  },
  Low:      { label: "LOW",      dot: "bg-emerald-500",text: "text-emerald-600",bg: "bg-emerald-500/10"},
  None:     { label: "NONE",     dot: "bg-white/30",   text: "text-white/50",   bg: "bg-white/10"      },
}[riskLevel]

// Use the synopsis from the security run if available
const synopsis = runs.find((r) => r.category === "security")?.securitySynopsis

export default function SecurityPage() {
  return (
    <div className="flex h-dvh bg-[#eff6ff] font-sans">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">

        {/* ── Stats bar ─────────────────────────────────────────────────────── */}
        <div className="border-b border-[#c7d9f0] bg-white">
          <div className="flex items-stretch divide-x divide-[#c7d9f0]">
            {([
              { label: "RISK LEVEL",       value: riskLevel,         color: criticalCount > 0 ? "text-red-500" : "text-amber-500" },
              { label: "OPEN FINDINGS",    value: openSec.length,    color: "text-[#1a2a33]" },
              { label: "CRITICAL",         value: criticalCount,     color: "text-red-500"   },
              { label: "RESOLVED",         value: resolvedSec.length,color: "text-emerald-500"},
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

        <div className="flex-1 px-8 py-6 flex flex-col gap-6">

          {/* ── Synopsis ──────────────────────────────────────────────────────── */}
          {synopsis && (
            <div className="border border-[#c7d9f0] bg-white">
              <div className="flex items-center gap-3 border-b border-[#eff6ff] px-6 py-4">
                <ShieldAlert className="h-4 w-4 text-[#1d6ef5]" />
                <span className="text-[12px] font-bold uppercase tracking-[0.8px] text-[#4a7ab5]">
                  Security Analysis
                </span>
                <span className={cn(
                  "ml-auto flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-semibold",
                  riskStyle.text, riskStyle.bg
                )}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", riskStyle.dot)} />
                  {riskStyle.label}
                </span>
              </div>
              <div className="px-6 py-5">
                {synopsis.split("\n\n").map((para, i) => (
                  <p key={i} className={cn("text-[14px] leading-relaxed text-[#1a2a33]", i > 0 && "mt-4")}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* ── Findings list ─────────────────────────────────────────────────── */}
          <div>
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.8px] text-[#4a7ab5]">
              Findings
            </div>

            {securityIssues.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-center">
                <ShieldCheck className="h-8 w-8 text-emerald-500" />
                <p className="text-[13px] text-[#4a7ab5]">No security findings.</p>
              </div>
            ) : (
              <div className="overflow-hidden border border-[#c7d9f0] bg-white">
                {securityIssues.map((issue, idx) => {
                  const nd   = nodesById[issue.nodeId]
                  const step = nd?.data.step ?? 0
                  const isError    = issue.severity === "error"   && issue.status === "open"
                  const isWarning  = issue.severity === "warning" && issue.status === "open"
                  const isResolved = issue.status === "resolved"

                  return (
                    <Link
                      key={issue.id}
                      href={`/workspace?issueId=${issue.id}`}
                      className={cn(
                        "group flex flex-col gap-2.5 border-l-4 px-5 py-4 transition-colors cursor-pointer",
                        idx !== 0 && "border-t border-[#eff6ff]",
                        isError    && "border-l-red-500 bg-red-500/[0.03] hover:bg-red-500/[0.06]",
                        isWarning  && "border-l-amber-400 bg-amber-400/[0.03] hover:bg-amber-400/[0.06]",
                        isResolved && "border-l-emerald-400 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04]"
                      )}
                    >
                      {/* Top row: badge + title + element + step + arrow */}
                      <div className="flex items-center gap-5">
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
                          "min-w-0 flex-1 text-[13px] font-medium text-[#1a2a33]",
                          isResolved && "text-[#4a7ab5] line-through"
                        )}>
                          {issue.title}
                        </div>

                        <code className="shrink-0 font-mono text-[11px] text-[#4a7ab5]">
                          {issue.element}
                        </code>

                        <div className="shrink-0 rounded bg-[#dbeafe] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#1559d4]">
                          Step {step}
                        </div>

                        <span className="text-[#4a7ab5] opacity-0 transition-opacity group-hover:opacity-100">→</span>
                      </div>

                      {/* Description + reasoning */}
                      <div className="pl-[118px] flex flex-col gap-1.5">
                        <p className="text-[12px] text-[#1a2a33]">{issue.description}</p>
                        <p className="text-[12px] leading-relaxed text-[#4a7ab5]">{issue.reasoning}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
