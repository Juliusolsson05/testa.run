"use client"

import { useState } from "react"
import { AlertTriangle, Clock, XCircle } from "lucide-react"

import { Wordmark } from "@/components/ui/TestaRunLogo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useIssueContext } from "@/context/issue-context"
import { useWorkspaceData } from "@/context/workspace-data-context"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const {
    selectIssue, selectNode, activeIssueId, activeNodeId, clearSelection,
    issues, issuesByNodeId, openIssues, resolvedIssues,
  } = useIssueContext()
  const { run, nodes } = useWorkspaceData()
  const nodesById = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, (typeof nodes)[number]>

  // ── Global stats ────────────────────────────────────────────────────────
  const errorCount = openIssues.filter((issue) => issue.severity === "error").length
  const warningCount = openIssues.filter((issue) => issue.severity === "warning").length
  const sitesChecked = new Set(issues.map((issue) => issue.nodeId)).size

  // ── Focused node ─────────────────────────────────────────────────────────
  const focusedNode = activeNodeId
    ? nodes.find((n) => n.id === activeNodeId) ?? null
    : null
  const nodeIssues = activeNodeId ? (issuesByNodeId[activeNodeId] ?? []) : []
  const nodeOpenIssues = nodeIssues.filter((i) => i.status === "open")
  const nodeResolvedIssues = nodeIssues.filter((i) => i.status === "resolved")

  // ── Show-more state for global issue lists ───────────────────────────────
  const [showAllOpen,     setShowAllOpen]     = useState(false)
  const [showAllResolved, setShowAllResolved] = useState(false)
  const ISSUE_LIMIT = 3

  // ── Active issue ─────────────────────────────────────────────────────────
  const activeIssue = activeIssueId ? issues.find((i) => i.id === activeIssueId) ?? null : null

  const sidebarWidth = activeIssue ? 480 : focusedNode ? 420 : 320

  return (
    <aside
      className="flex h-full shrink-0 flex-col gap-4 overflow-y-auto border-r border-white/10 bg-[#1c2030] px-5 py-5 text-white transition-[width] duration-300 ease-in-out"
      style={{ width: sidebarWidth }}
    >
      <Wordmark variant="dark" className="text-[22px] font-normal" />

      {activeIssue ? (
        // ── ISSUE DETAIL VIEW ───────────────────────────────────────────────
        <div key={activeIssueId} className="node-focus-in flex w-[440px] flex-col gap-4">
          {/* Back */}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => selectNode(activeIssue.nodeId)}
            className="h-auto w-fit px-0 py-0 text-[11px] text-white/50 hover:bg-transparent hover:text-white/80"
          >
            ← Node issues
          </Button>

          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                  activeIssue.severity === "error" ? "bg-red-500" : "bg-amber-400",
                  activeIssue.status === "resolved" && "bg-emerald-500"
                )}
              />
              <h2 className="text-[15px] font-semibold leading-snug text-[#e8edf5]">
                {activeIssue.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "rounded-none border-transparent px-2 py-0.5 text-[10px] uppercase",
                  activeIssue.status === "resolved"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : activeIssue.severity === "error"
                    ? "bg-red-500/20 text-red-300"
                    : "bg-amber-400/20 text-amber-300"
                )}
              >
                {activeIssue.status === "resolved"
                  ? "✓ resolved"
                  : activeIssue.severity === "error"
                  ? "error"
                  : "warning"}
              </Badge>
              <code className="font-mono text-[11px] text-white/40">{activeIssue.element}</code>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.6px] text-white/40">
              Summary
            </div>
            <p className="text-[13px] leading-relaxed text-white/80">
              {activeIssue.description}
            </p>
          </div>

          <Separator className="bg-white/10" />

          {/* Reasoning */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.6px] text-white/40">
              Agent reasoning
            </div>
            <p className="text-[12px] leading-relaxed text-white/60">
              {activeIssue.reasoning}
            </p>
          </div>
        </div>

      ) : focusedNode ? (
        // ── FOCUSED NODE VIEW ───────────────────────────────────────────────
        <div key={activeNodeId} className="node-focus-in flex flex-col gap-4">
          {/* Back button + node header */}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={clearSelection}
            className="h-auto w-fit px-0 py-0 text-[11px] text-white/50 hover:bg-transparent hover:text-white/80"
          >
            ← All issues
          </Button>

          <Card className="rounded-none border-white/10 bg-white/5 text-white">
            <CardContent className="flex flex-col gap-1 p-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    focusedNode.data.status === "passed" && "bg-emerald-500",
                    focusedNode.data.status === "running" && "bg-[#1d6ef5]",
                    focusedNode.data.status === "pending" && "bg-indigo-400"
                  )}
                />
                <span className="text-[13px] font-semibold text-[#e8edf5]">
                  {focusedNode.data.label}
                </span>
                <span className="ml-auto text-[10px] font-mono text-white/40">
                  Step {focusedNode.data.step}
                </span>
              </div>
              <div className="truncate font-mono text-[11px] text-white/40">
                {focusedNode.data.url}
              </div>
            </CardContent>
          </Card>

          {/* Node issue stats */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="rounded-none border-white/10 bg-white/5 text-white">
              <CardContent className="flex flex-col gap-1 p-3">
                <div className="text-[20px] font-semibold leading-none text-red-400">
                  {nodeOpenIssues.filter((i) => i.severity === "error").length}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-white/50">Errors</div>
              </CardContent>
            </Card>
            <Card className="rounded-none border-white/10 bg-white/5 text-white">
              <CardContent className="flex flex-col gap-1 p-3">
                <div className="text-[20px] font-semibold leading-none text-amber-300">
                  {nodeOpenIssues.filter((i) => i.severity === "warning").length}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-white/50">Warnings</div>
              </CardContent>
            </Card>
            <Card className="rounded-none border-white/10 bg-white/5 text-white">
              <CardContent className="flex flex-col gap-1 p-3">
                <div className="text-[20px] font-semibold leading-none text-emerald-400">
                  {nodeResolvedIssues.length}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-white/50">Resolved</div>
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-white/10" />

          {/* Node issues list */}
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.6px] text-white/50">
            <span>Issues on this page</span>
            <Badge className="rounded-none bg-[#1d6ef5] text-[10px] font-bold">
              {nodeOpenIssues.length}
            </Badge>
          </div>

          {nodeIssues.length === 0 ? (
            <div className="rounded-none border border-white/10 bg-white/5 px-3 py-4 text-center text-[12px] text-white/40">
              No issues found
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {nodeIssues.map((issue) => {
                const isActive = activeIssueId === issue.id
                return (
                  <button
                    key={issue.id}
                    className={cn(
                      "w-full rounded-none border border-white/10 bg-white/5 px-2 py-2 text-left text-[11px] text-white/80",
                      "transition hover:-translate-y-0.5 hover:bg-white/10",
                      issue.status === "resolved" && "opacity-60",
                      issue.severity === "error" && issue.status === "open" && "border-l-4 border-l-red-500",
                      issue.severity === "warning" && issue.status === "open" && "border-l-4 border-l-amber-400",
                      isActive && "border-l-4 border-l-[#1d6ef5] bg-[#1d6ef5]/15 shadow-[0_0_0_1px_rgba(29,110,245,0.3)]"
                    )}
                    onClick={() => selectIssue(issue.id)}
                  >
                    <div className="mb-1 font-medium text-white">
                      {issue.title}
                    </div>
                    <p className="mb-2 line-clamp-2 text-[11px] leading-relaxed text-white/40">
                      {issue.reasoning}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-white/50">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-none border-transparent px-1.5 py-0.5 text-[9px] uppercase",
                          issue.severity === "error"
                            ? "bg-red-500/20 text-red-200"
                            : "bg-amber-400/20 text-amber-200",
                          issue.status === "resolved" && "bg-emerald-500/20 text-emerald-200"
                        )}
                      >
                        {issue.status === "resolved" ? "✓ resolved" : issue.severity === "error"
                          ? <span className="inline-flex items-center gap-1"><XCircle className="h-3 w-3" /> error</span>
                          : <span className="inline-flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> warning</span>}
                      </Badge>
                      <span className="truncate font-mono">{issue.element}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

      ) : (
        // ── GLOBAL VIEW ─────────────────────────────────────────────────────
        <>
          <Card className="rounded-none border-white/10 bg-white/5 text-white">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-none bg-white/10 text-xs">
                <Clock className="h-3.5 w-3.5 text-white/70" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold">{run.name}</div>
                <div className="truncate font-mono text-[11px] text-white/50">
                  {run.label ?? run.id}
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
                  {run.label ?? run.id.slice(0, 8)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/50">Started</span>
                <span className="text-[11px] text-white/60">{new Date(run.startedAt).toLocaleString("sv-SE")}</span>
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
            <Badge className="rounded-none bg-[#1d6ef5] text-[10px] font-bold">
              {openIssues.length}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="mb-2 rounded-none bg-[#1d6ef5]/20 px-2 py-1 text-center text-[10px] font-bold uppercase text-[#7eb3f5]">
                Open
              </div>
              {(showAllOpen ? openIssues : openIssues.slice(0, ISSUE_LIMIT)).map((issue) => {
                const nd = nodesById[issue.nodeId]; const meta = { step: nd?.data.step ?? 0, label: nd?.data.label ?? "Unknown" }
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
                        "border-l-4 border-l-[#1d6ef5] bg-[#1d6ef5]/15 shadow-[0_0_0_1px_rgba(29,110,245,0.3)]"
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
                          {issue.severity === "error"
                            ? <><XCircle className="h-3 w-3" /> error</>
                            : <><AlertTriangle className="h-3 w-3" /> warning</>}
                        </span>
                      </Badge>
                    </div>
                  </button>
                )
              })}
              {openIssues.length > ISSUE_LIMIT && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setShowAllOpen((v) => !v)}
                  className="h-auto w-full py-1 text-[10px] text-white/30 hover:bg-transparent hover:text-white/60"
                >
                  {showAllOpen ? "Show less" : `Show ${openIssues.length - ISSUE_LIMIT} more`}
                </Button>
              )}
            </div>

            <div>
              <div className="mb-2 rounded-none bg-emerald-500/20 px-2 py-1 text-center text-[10px] font-bold uppercase text-emerald-300">
                Resolved
              </div>
              {(showAllResolved ? resolvedIssues : resolvedIssues.slice(0, ISSUE_LIMIT)).map((issue) => {
                const nd = nodesById[issue.nodeId]; const meta = { step: nd?.data.step ?? 0, label: nd?.data.label ?? "Unknown" }
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
                )
              })}
              {resolvedIssues.length > ISSUE_LIMIT && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setShowAllResolved((v) => !v)}
                  className="h-auto w-full py-1 text-[10px] text-white/30 hover:bg-transparent hover:text-white/60"
                >
                  {showAllResolved ? "Show less" : `Show ${resolvedIssues.length - ISSUE_LIMIT} more`}
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Footer — always visible */}
      <div className="mt-auto flex items-center gap-2 rounded-none border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white/60">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            run.status === "running"
              ? "bg-[#1d6ef5] shadow-[0_0_6px_#1d6ef5]"
              : run.status === "passed"
                ? "bg-emerald-500"
                : run.status === "warning"
                  ? "bg-amber-400"
                  : "bg-red-500"
          )}
        />
        {run.status === "running"
          ? "Agent running"
          : run.status === "passed"
            ? "Run completed"
            : run.status === "warning"
              ? "Run completed with warnings"
              : "Run failed"}
      </div>
    </aside>
  )
}
