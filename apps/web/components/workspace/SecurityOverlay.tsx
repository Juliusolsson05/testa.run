"use client"

import Link from "next/link"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { useIssueContext } from "@/context/issue-context"

export function SecurityOverlay() {
  const { issues } = useIssueContext()

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

  const riskStyle = {
    Critical: { label: "CRITICAL" },
    High: { label: "HIGH" },
    Low: { label: "LOW" },
    None: { label: "NONE" },
  }[riskLevel]

  return (
    <Link
      href="/workspace/security"
      className="pointer-events-auto absolute right-4 top-4 z-40 flex h-[38px] w-[340px] items-center gap-3 border border-red-300 bg-red-50/90 px-4 backdrop-blur-md transition-opacity hover:opacity-90"
    >
      {riskLevel === "None"
        ? <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
        : <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-red-500" />
      }

      <span className="text-[11px] font-bold uppercase tracking-[0.7px] text-red-700">
        Security
      </span>

      <span className="flex items-center gap-1 rounded bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-600">
        <span className="h-1 w-1 rounded-full bg-red-500" />
        {riskStyle.label}
      </span>

      <div className="mx-1 h-3.5 w-px bg-red-200" />

      <div className="flex items-center gap-3 text-[11px] tabular-nums text-red-700">
        <span><span className="font-bold">{openSec.length}</span> open</span>
        <span><span className="font-bold text-red-500">{criticalCount}</span> critical</span>
        <span><span className="font-bold text-red-400">{securityIssues.filter((i) => i.status === "resolved").length}</span> resolved</span>
      </div>

      <span className="ml-auto text-[11px] text-red-400">→</span>
    </Link>
  )
}
