"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/workspace/AppSidebar"
import { useAuth } from "@/components/auth/AuthProvider"
import { useProjectRuns } from "@/components/workspace/useProjectRuns"

type SecurityIssue = {
  id: string
  stepIndex: number | null
  nodeLabel: string
  severity: "error" | "warning"
  status: "open" | "resolved"
  title: string
  description: string
  reasoning: string
  element: string
}

type RunDetail = { securitySynopsis: string | null }

export default function SecurityPage() {
  const { accessToken } = useAuth()
  const { activeRun } = useProjectRuns(undefined, 10)
  const [issues, setIssues] = useState<SecurityIssue[]>([])
  const [runDetail, setRunDetail] = useState<RunDetail | null>(null)

  useEffect(() => {
    async function load() {
      if (!accessToken || !activeRun?.id) return
      const headers = { Authorization: `Bearer ${accessToken}` }

      const [issuesRes, runRes] = await Promise.all([
        fetch(`/api/runs/${activeRun.id}/issues?category=security`, { headers, cache: "no-store" }),
        fetch(`/api/runs/${activeRun.id}`, { headers, cache: "no-store" }),
      ])

      if (issuesRes.ok) {
        const data = await issuesRes.json()
        setIssues(data.issues)
      }

      if (runRes.ok) {
        const data = await runRes.json()
        setRunDetail({ securitySynopsis: data.run.securitySynopsis ?? null })
      }
    }

    void load()
  }, [accessToken, activeRun?.id])

  const open = issues.filter((i) => i.status === "open")
  const critical = open.filter((i) => i.severity === "error")
  const resolved = issues.filter((i) => i.status === "resolved")

  return (
    <div className="flex h-dvh bg-[#eff6ff] font-sans">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto px-8 py-6">
        <h1 className="text-[22px] font-bold text-[#1a2a33]">Security</h1>
        <div className="mt-1 text-xs text-ui-muted">{activeRun ? activeRun.name : "No run selected"}</div>

        <div className="mt-4 grid grid-cols-4 gap-3">
          {[{ l: "OPEN", v: open.length }, { l: "CRITICAL", v: critical.length }, { l: "RESOLVED", v: resolved.length }, { l: "TOTAL", v: issues.length }].map((s) => (
            <div key={s.l} className="border border-ui-border bg-white px-4 py-3">
              <div className="text-[10px] text-ui-muted">{s.l}</div>
              <div className="text-2xl font-bold text-[#1a2a33]">{s.v}</div>
            </div>
          ))}
        </div>

        {runDetail?.securitySynopsis && (
          <div className="mt-4 border border-ui-border bg-white p-4 text-sm text-[#1a2a33]">
            {runDetail.securitySynopsis}
          </div>
        )}

        <div className="mt-4 space-y-2">
          {issues.map((issue) => (
            <Link
              key={issue.id}
              href={activeRun ? `/workspace/${activeRun.id}?issueId=${issue.id}` : "#"}
              className="block border border-ui-border bg-white px-4 py-3 hover:bg-[#eff6ff]"
            >
              <div className="text-sm font-semibold text-[#1a2a33]">{issue.title}</div>
              <div className="mt-1 text-xs text-ui-muted">Step {issue.stepIndex ?? "—"} · {issue.nodeLabel} · {issue.element}</div>
              <p className="mt-2 text-xs text-[#1a2a33]">{issue.description}</p>
              <p className="mt-1 text-xs text-ui-muted">{issue.reasoning}</p>
            </Link>
          ))}
          {issues.length === 0 && <div className="text-sm text-ui-muted">No security findings for this run.</div>}
        </div>
      </div>
    </div>
  )
}
