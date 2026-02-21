"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import {
  Handle,
  Position,
  useUpdateNodeInternals,
  type NodeProps,
} from "@xyflow/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useIssueContext } from "@/context/issue-context"
import { issues } from "@/data/issues"
import { cn } from "@/lib/utils"
import type { ScreenshotNodeData } from "@/types/flow"

const statusConfig = {
  passed: {
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    label: "✓ Passed",
  },
  running: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    label: "⟳ Running",
  },
  pending: {
    color: "#6366f1",
    bg: "rgba(99,102,241,0.12)",
    label: "◦ Pending",
  },
}

const CHROME_HEIGHT = 36
const NODE_WIDTH = 280
const NODE_WIDE = 480
const SCREENSHOT_RATIO = 10 / 16

export function ScreenshotNode({ id, data, selected }: NodeProps) {
  const nodeData = data as ScreenshotNodeData
  const status = statusConfig[nodeData.status]
  const updateNodeInternals = useUpdateNodeInternals()

  const { activeIssueId, activeNodeId, selectIssue, clearSelection } =
    useIssueContext()

  const nodeIssues = useMemo(
    () => issues.filter((issue) => issue.nodeId === id),
    [id]
  )
  const openCount = nodeIssues.filter((issue) => issue.status === "open").length

  const isContextActive = activeNodeId === id
  const [localOpen, setLocalOpen] = useState(false)
  const panelOpen = localOpen || isContextActive

  useEffect(() => {
    updateNodeInternals(id)
  }, [panelOpen, id, updateNodeInternals])

  useEffect(() => {
    if (activeNodeId !== null && activeNodeId !== id) setLocalOpen(false)
  }, [activeNodeId, id])

  function handleToggle(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    if (isContextActive) {
      clearSelection()
      setLocalOpen(false)
    } else {
      setLocalOpen((prev) => !prev)
    }
  }

  function handleIssueClick(
    e: React.MouseEvent<HTMLButtonElement>,
    issueId: string
  ) {
    e.stopPropagation()
    selectIssue(issueId)
  }

  const nodeWidth = nodeData.isMain || nodeData.isLarge ? NODE_WIDE : NODE_WIDTH
  const screenshotHeight = nodeWidth * SCREENSHOT_RATIO
  const targetHandleTop = CHROME_HEIGHT + screenshotHeight / 2

  const sourceHandleStyle = nodeData.sourceHandleOffset
    ? {
        top: nodeData.sourceHandleOffset.top,
        left:
          nodeData.sourceHandleOffset.left !== undefined
            ? `${nodeData.sourceHandleOffset.left}%`
            : undefined,
        right: "auto",
        transform: "translate(-50%, -50%)",
      }
    : { top: targetHandleTop }

  const displayUrl = nodeData.url.replace(/^https?:\/\/[^/]+/, "") || "/"

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-none border-[3px] border-[#4a7ab5]",
        "bg-white/70 backdrop-blur-sm shadow-[0_1px_3px_rgba(29,110,245,0.08),0_4px_20px_rgba(29,110,245,0.1)]",
        "transition-shadow transition-colors",
        selected && "border-[#1d6ef5]",
        nodeData.isMain || nodeData.isLarge ? "w-[480px]" : "w-[280px]",
        nodeData.isMain &&
          "border-[#2d5a9e] shadow-[0_2px_6px_rgba(29,110,245,0.1),0_8px_32px_rgba(29,110,245,0.16)]",
        nodeData.status === "running" && "border-[#3a6fa0]",
        selected &&
          "shadow-[0_2px_6px_rgba(29,110,245,0.14),0_8px_32px_rgba(29,110,245,0.22)]",
        isContextActive &&
          "border-[#1d6ef5] shadow-[0_0_0_3px_rgba(29,110,245,0.2),0_4px_24px_rgba(29,110,245,0.2)]"
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="flow-handle"
        style={{ top: targetHandleTop }}
      />

      <div className="flex items-center gap-2 border-b-[3px] border-[#4a7ab5] bg-[#c7d9f0] px-3 py-2">
        <div className="flex-1 truncate rounded-none border border-[#7aaad4] bg-white/60 px-2.5 py-1 text-[11px] font-mono text-[#2d5282]">
          {displayUrl}
        </div>
        <span className="rounded-none border border-[#7aaad4] bg-[#dbeafe] px-2 py-0.5 text-[10px] font-semibold text-[#1559d4]">
          Step {nodeData.step}
        </span>
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#dbeafe]">
        {nodeData.imageSrc ? (
          <Image
            src={nodeData.imageSrc}
            alt={nodeData.label}
            fill
            sizes="(max-width: 768px) 90vw, 480px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 border-2 border-dashed border-[#dbeafe] text-xs text-[#93c5fd]">
            <span className="text-3xl opacity-50">🖼</span>
            <span>Screenshot pending</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t-[3px] border-[#4a7ab5] bg-[#c7d9f0] px-3 py-2">
        <div className="text-[13px] font-semibold tracking-[-0.2px] text-[#1a2a33]">
          {nodeData.label}
        </div>
        <Badge
          variant="outline"
          className="rounded-none border px-2.5 py-0.5 text-[11px] font-medium"
          style={{
            color: status.color,
            background: status.bg,
            borderColor: `${status.color}40`,
          }}
        >
          {status.label}
          {nodeData.duration && (
            <span className="text-[#1a2a33]/70"> · {nodeData.duration}</span>
          )}
        </Badge>
      </div>

      {nodeIssues.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className={cn(
            "h-auto w-full justify-start gap-2 rounded-none border-t-[3px] border-[#4a7ab5] bg-[#d4e5f7] px-3 py-2 text-[11px] font-medium text-[#2d5282]",
            "hover:bg-[#c0d4ec]",
            panelOpen && "bg-[#c0d4ec]",
            openCount > 0 && "text-[#dc2626]"
          )}
        >
          <span className="flex-1 text-left">
            {openCount > 0
              ? `${openCount} issue${openCount > 1 ? "s" : ""}`
              : "Issues"}
          </span>
          <span
            className={cn(
              "rounded-none px-1.5 py-0.5 text-[10px] font-bold",
              openCount > 0
                ? "bg-red-500/15 text-red-600"
                : "bg-emerald-500/15 text-emerald-600"
            )}
          >
            {openCount > 0 ? openCount : "✓"}
          </span>
          <span className="text-[10px] text-[#4a7ab5]">
            {panelOpen ? "▲" : "▼"}
          </span>
        </Button>
      )}

      {panelOpen && (
        <div className="issue-dropdown flex max-h-60 flex-col overflow-y-auto border-t border-[#c0d4ec] bg-white">
          {nodeIssues.map((issue) => (
            <button
              key={issue.id}
              className={cn(
                "flex w-full items-start gap-2 border-b border-[#dbeafe] px-3 py-2 text-left text-[11px] transition-colors",
                "hover:bg-[#eff6ff]",
                activeIssueId === issue.id &&
                  "bg-[#eff6ff] shadow-[inset_3px_0_0_#1d6ef5]",
                issue.status === "resolved" && "opacity-60"
              )}
              onClick={(event) => handleIssueClick(event, issue.id)}
            >
              <span
                className={cn(
                  "mt-1 h-2 w-2 shrink-0 rounded-full",
                  issue.severity === "error" ? "bg-red-500" : "bg-amber-500"
                )}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-[#1a2a33]">
                  {issue.title}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[10px] text-[#93c5fd]">
                  {issue.element}
                </span>
              </span>
              <span
                className={cn(
                  "mt-0.5 rounded-none px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                  issue.status === "open"
                    ? "bg-red-500/10 text-red-600"
                    : "bg-emerald-500/10 text-emerald-600"
                )}
              >
                {issue.status === "open" ? "Open" : "✓"}
              </span>
            </button>
          ))}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="flow-handle"
        style={sourceHandleStyle}
      />
    </div>
  )
}
