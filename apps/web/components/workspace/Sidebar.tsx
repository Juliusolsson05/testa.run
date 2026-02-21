"use client"

import { AlertTriangle, Clock, Sparkles, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useIssueContext } from "@/context/issue-context"
import { nodeStepMap } from "@/data/flow"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { selectIssue, activeIssueId, issues } = useIssueContext()

  const openIssues = issues.filter((issue) => issue.status === "open")
  const resolvedIssues = issues.filter((issue) => issue.status === "resolved")
  const errorCount = openIssues.filter((issue) => issue.severity === "error").length
  const warningCount = openIssues.filter(
    (issue) => issue.severity === "warning"
  ).length
  const sitesChecked = new Set(issues.map((issue) => issue.nodeId)).size

  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col gap-4 overflow-y-auto border-r border-white/10 bg-[#111318] px-5 py-5 text-white">
      <div className="flex items-center gap-2 text-[17px] font-bold tracking-tight">
        <Sparkles className="h-5 w-5 text-[#2563eb]" />
        <span className="text-[#e8edf5]">
          testa<span className="text-[#2563eb]">.run</span>
        </span>
      </div>

      <Card className="rounded-none border-white/10 bg-white/5 text-white">
        <CardContent className="flex items-center gap-3 p-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-none bg-white/10 text-xs">
            <Clock className="h-3.5 w-3.5 text-white/70" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold">TimeEdit</div>
            <div className="truncate font-mono text-[11px] text-white/50">
              timeedit.com
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
        </CardContent>
      </Card>

      <Card className="rounded-none border-white/10 bg-white/5 text-white">
        <CardContent className="flex flex-col gap-1.5 p-3 text-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/50">Run</span>
            <span className="font-mono text-[12px] font-semibold text-[#7eb3f5]">
              #a3f7c1
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/50">Started</span>
            <span className="text-[11px] text-white/60">2m 14s ago</span>
          </div>
          <Button
            type="button"
            size="xs"
            variant="ghost"
            className="mt-1 h-auto w-fit rounded-none border border-white/10 px-2 py-1 text-[10px] text-white/70 hover:bg-white/10"
          >
            Open run log
          </Button>
        </CardContent>
      </Card>

      <Separator className="bg-white/10" />

      <div className="text-[10px] font-bold uppercase tracking-[0.6px] text-white/50">
        Stats
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Card className="rounded-none border-white/10 bg-white/5 text-white">
          <CardContent className="flex flex-col gap-1 p-3">
            <div className="text-[22px] font-semibold leading-none">
              {sitesChecked}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-white/50">
              Sites checked
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-white/10 bg-white/5 text-white">
          <CardContent className="flex flex-col gap-1 p-3">
            <div className="text-[22px] font-semibold leading-none text-red-400">
              {errorCount}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-white/50">
              Errors
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-white/10 bg-white/5 text-white">
          <CardContent className="flex flex-col gap-1 p-3">
            <div className="text-[22px] font-semibold leading-none text-amber-300">
              {warningCount}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-white/50">
              Warnings
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-white/10 bg-white/5 text-white">
          <CardContent className="flex flex-col gap-1 p-3">
            <div className="text-[22px] font-semibold leading-none text-emerald-400">
              {resolvedIssues.length}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-white/50">
              Resolved
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="bg-white/10" />

      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.6px] text-white/50">
        <span>Issues</span>
        <Badge className="rounded-none bg-[#2563eb] text-[10px] font-bold">
          {openIssues.length}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="mb-2 rounded-none bg-[#2563eb]/20 px-2 py-1 text-center text-[10px] font-bold uppercase text-[#7eb3f5]">
            Open
          </div>
          {openIssues.map((issue) => {
            const meta = nodeStepMap[issue.nodeId] ?? { step: 0, label: "Unknown" }
            const isActive = activeIssueId === issue.id
            return (
              <button
                key={issue.id}
                className={cn(
                  "mb-2 w-full rounded-none border border-white/10 bg-white/5 px-2 py-2 text-left text-[11px] text-white/80",
                  "transition hover:-translate-y-0.5 hover:bg-white/10",
                  issue.severity === "error" && "border-l-4 border-l-red-500",
                  issue.severity === "warning" && "border-l-4 border-l-amber-400",
                  isActive &&
                    "border-l-4 border-l-[#2563eb] bg-[#2563eb]/15 shadow-[0_0_0_1px_rgba(37,99,235,0.3)]"
                )}
                onClick={() => selectIssue(issue.id)}
              >
                <div className="mb-1 font-medium text-white">
                  {issue.title}
                </div>
                <div className="flex flex-col gap-1 text-[10px] text-white/50">
                  <span className="font-mono">
                    Step {meta.step} · {meta.label}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-none border-transparent px-1.5 py-0.5 text-[9px] uppercase",
                      issue.severity === "error"
                        ? "bg-red-500/20 text-red-200"
                        : "bg-amber-400/20 text-amber-200"
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      {issue.severity === "error" ? (
                        <XCircle className="h-3 w-3" />
                      ) : (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      {issue.severity}
                    </span>
                  </Badge>
                </div>
              </button>
            )
          })}
        </div>

        <div>
          <div className="mb-2 rounded-none bg-emerald-500/20 px-2 py-1 text-center text-[10px] font-bold uppercase text-emerald-300">
            Resolved
          </div>
          {resolvedIssues.map((issue) => {
            const meta = nodeStepMap[issue.nodeId] ?? { step: 0, label: "Unknown" }
            const isActive = activeIssueId === issue.id
            return (
              <button
                key={issue.id}
                className={cn(
                  "mb-2 w-full rounded-none border border-white/10 bg-white/5 px-2 py-2 text-left text-[11px] text-white/60",
                  "opacity-70 transition hover:-translate-y-0.5 hover:bg-white/10",
                  isActive && "bg-emerald-500/10"
                )}
                onClick={() => selectIssue(issue.id)}
              >
                <div className="mb-1 font-medium text-white/70">
                  {issue.title}
                </div>
                <div className="text-[10px] text-white/40">
                  Step {meta.step} · {meta.label}
                </div>
              </button>
            )}
          )}
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2 rounded-none border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white/60">
        <span className="h-2 w-2 rounded-full bg-[#2563eb] shadow-[0_0_6px_#2563eb]" />
        Agent running
      </div>
    </aside>
  )
}
