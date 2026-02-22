"use client"

import Link from "next/link"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { useIssueContext } from "@/context/issue-context"
import { useWorkspaceData } from "@/context/workspace-data-context"

export function SecurityOverlay() {
  const { issues } = useIssueContext()
  const { run } = useWorkspaceData()

  const securityIssues = issues.filter((i) => i.category === "security")
  const openSec = securityIssues.filter((i) => i.status === "open")
  const criticalCount = openSec.filter((i) => i.severity === "error").length

  const riskLevel = criticalCount > 0
    ? "Critical"
    : openSec.length > 0
      ? "High"
      : securityIssues.length > 0
        ? "Low"
        : "None"

  const riskTone = {
    Critical: "text-red-700 border-red-300 bg-red-50/92",
    High: "text-amber-700 border-amber-300 bg-amber-50/92",
    Low: "text-amber-700 border-amber-300 bg-amber-50/92",
    None: "text-slate-700 border-slate-300 bg-white/95",
  }[riskLevel]

  return (
    <Link
      href={`/workspace/security?runId=${run.id}`}
      className={`pointer-events-auto absolute right-4 top-3 z-40 w-[188px] rounded-md border px-3 py-2 backdrop-blur-md transition-opacity hover:opacity-90 ${riskTone}`}
    >
      <div className="flex items-center gap-2">
        {riskLevel === "None"
          ? <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          : <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
        }
        <span className="text-[10px] font-bold uppercase tracking-[0.7px]">Security</span>
        <span className="ml-auto text-[10px] font-semibold uppercase">{riskLevel}</span>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[10px] tabular-nums">
        <div className="rounded bg-black/5 px-1.5 py-1">
          <div className="font-bold">{openSec.length}</div>
          <div className="opacity-70">open</div>
        </div>
        <div className="rounded bg-black/5 px-1.5 py-1">
          <div className="font-bold">{criticalCount}</div>
          <div className="opacity-70">critical</div>
        </div>
        <div className="rounded bg-black/5 px-1.5 py-1">
          <div className="font-bold">{securityIssues.filter((i) => i.status === "resolved").length}</div>
          <div className="opacity-70">resolved</div>
        </div>
      </div>
    </Link>
  )
}
