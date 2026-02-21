"use client"

import Link from "next/link"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { issues } from "@/data/issues"

const securityIssues = issues.filter((i) => i.category === "security")
const openSec        = securityIssues.filter((i) => i.status === "open")
const criticalCount  = openSec.filter((i) => i.severity === "error").length

const riskLevel = criticalCount > 0
  ? "Critical"
  : openSec.length > 0
    ? "High"
    : securityIssues.length > 0
      ? "Low"
      : "None"

const riskStyle = {
  Critical: { label: "CRITICAL", dot: "bg-red-500",     text: "text-red-600",     bg: "bg-red-500/10",    border: "border-red-200"    },
  High:     { label: "HIGH",     dot: "bg-amber-400",   text: "text-amber-600",   bg: "bg-amber-400/10",  border: "border-amber-200"  },
  Low:      { label: "LOW",      dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-500/10",border: "border-emerald-200" },
  None:     { label: "NONE",     dot: "bg-slate-300",   text: "text-slate-500",   bg: "bg-slate-100",     border: "border-slate-200"  },
}[riskLevel]

export function SecurityOverlay() {
  return (
    <Link
      href="/workspace/security"
      className={cn(
        "pointer-events-auto absolute right-4 top-16 z-40 flex w-[200px] flex-col gap-2 rounded border bg-white/90 px-3.5 py-3 shadow-sm backdrop-blur-sm transition-opacity hover:opacity-90",
        riskStyle.border
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        {riskLevel === "None"
          ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          : <ShieldAlert className={cn("h-3.5 w-3.5", riskStyle.text)} />
        }
        <span className="text-[10px] font-bold uppercase tracking-[0.7px] text-[#4a7ab5]">
          Security
        </span>
        <span className={cn(
          "ml-auto flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold",
          riskStyle.text, riskStyle.bg
        )}>
          <span className={cn("h-1 w-1 rounded-full", riskStyle.dot)} />
          {riskStyle.label}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 border-t border-[#eff6ff] pt-2">
        <div className="flex flex-col">
          <span className="text-[18px] font-bold leading-none tabular-nums text-[#1a2a33]">
            {openSec.length}
          </span>
          <span className="mt-0.5 text-[9px] uppercase tracking-[0.5px] text-[#4a7ab5]">open</span>
        </div>
        <div className="flex flex-col">
          <span className={cn("text-[18px] font-bold leading-none tabular-nums", criticalCount > 0 ? "text-red-500" : "text-[#1a2a33]")}>
            {criticalCount}
          </span>
          <span className="mt-0.5 text-[9px] uppercase tracking-[0.5px] text-[#4a7ab5]">critical</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[18px] font-bold leading-none tabular-nums text-emerald-500">
            {securityIssues.filter((i) => i.status === "resolved").length}
          </span>
          <span className="mt-0.5 text-[9px] uppercase tracking-[0.5px] text-[#4a7ab5]">resolved</span>
        </div>
      </div>

      <div className="text-[10px] text-[#4a7ab5]">View full report →</div>
    </Link>
  )
}
