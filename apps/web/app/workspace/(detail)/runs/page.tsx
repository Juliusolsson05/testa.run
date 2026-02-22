"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { AppSidebar } from "@/components/workspace/AppSidebar"
import { useAuth } from "@/components/auth/AuthProvider"
import { InlineLoading } from "@/components/loading/InlineLoading"
import { useProjectRuns, type ProjectRun } from "@/components/workspace/useProjectRuns"

type RunStep = {
  id: string
  index: number
  action: string
  description: string
  target: string
  status: "passed" | "warning" | "failed"
  durationMs: number | null
}

function duration(ms: number | null) {
  if (!ms || ms <= 0) return "—"
  return `${Math.floor(ms / 1000)}s`
}

export default function RunsPage() {
  const { accessToken } = useAuth()
  const { loading, runs } = useProjectRuns(undefined, 30)
  const [openRunId, setOpenRunId] = useState<string | null>(null)
  const [stepsByRun, setStepsByRun] = useState<Record<string, RunStep[]>>({})

  useEffect(() => {
    async function loadSteps(run: ProjectRun) {
      if (!accessToken || stepsByRun[run.id]) return
      const res = await fetch(`/api/runs/${run.id}/steps`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      })
      if (!res.ok) return
      const data = await res.json()
      setStepsByRun((prev) => ({ ...prev, [run.id]: data.steps }))
    }

    const run = runs.find((r) => r.id === openRunId)
    if (run) void loadSteps(run)
  }, [accessToken, openRunId, runs, stepsByRun])

  return (
    <div className="flex h-dvh bg-app-bg font-sans">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto px-8 py-6">
        <h1 className="mb-4 text-[22px] font-bold text-[#1a2a33]">Runs</h1>

        <div className="space-y-3">
          {loading && runs.length === 0 ? (
            <InlineLoading label="Loading runs…" cubeSize={52} className="min-h-[280px]" />
          ) : (
            <>
          {runs.map((run) => {
            const isOpen = openRunId === run.id
            const steps = stepsByRun[run.id] ?? []
            return (
              <div key={run.id} className="border border-ui-border bg-white">
                <button
                  type="button"
                  onClick={() => setOpenRunId(isOpen ? null : run.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#eff6ff]"
                >
                  {isOpen ? <ChevronDown className="h-4 w-4 text-ui-muted" /> : <ChevronRight className="h-4 w-4 text-ui-muted" />}
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#1a2a33]">{run.name}</div>
                    <div className="text-xs text-ui-muted">{run.label ?? run.id.slice(0, 8)} · {new Date(run.startedAt).toLocaleString("sv-SE")}</div>
                  </div>
                  <div className="text-xs text-ui-muted">{run.status}</div>
                </button>

                {isOpen && (
                  <div className="border-t border-ui-border px-4 py-2">
                    {steps.length === 0 ? (
                      <div className="text-xs text-ui-muted">No steps yet.</div>
                    ) : (
                      <div className="space-y-1">
                        {steps.map((step) => (
                          <div key={step.id} className="flex items-center gap-3 py-1 text-xs">
                            <span className="w-5 text-ui-muted">{step.index}</span>
                            <span className="w-16 rounded bg-app-bg px-1.5 py-0.5 font-mono">{step.action}</span>
                            <span className="flex-1 text-[#1a2a33]">{step.description}</span>
                            <span className="text-ui-muted">{step.target}</span>
                            <span className="w-8 text-right text-ui-muted">{duration(step.durationMs)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          {runs.length === 0 && <div className="text-sm text-ui-muted">No runs yet.</div>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
