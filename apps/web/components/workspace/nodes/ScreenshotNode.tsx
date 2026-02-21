"use client"

import Image from "next/image"
import {
  Handle,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react"

import { Badge } from "@/components/ui/badge"
import { CHROME_HEIGHT, NODE_WIDTH, NODE_WIDE, SCREENSHOT_RATIO } from "@/constants/flow"
import { nodeStatusConfig } from "@/constants/status"
import { useIssueContext } from "@/context/issue-context"
import { cn } from "@/lib/utils"
import type { ScreenshotNodeData } from "@/types/flow"

export function ScreenshotNode({ id, data }: NodeProps<Node<ScreenshotNodeData>>) {
  const { issuesByNodeId, activeNodeId } = useIssueContext()
  const isActive = activeNodeId === id
  const nodeData = data
  const status = nodeStatusConfig[nodeData.status]

  const nodeIssues = issuesByNodeId[id] ?? []
  const errorCount = nodeIssues.filter((i) => i.severity === "error" && i.status === "open").length
  const warningCount = nodeIssues.filter((i) => i.severity === "warning" && i.status === "open").length

  const nodeWidth = nodeData.isMain || nodeData.isLarge ? NODE_WIDE : NODE_WIDTH
  const screenshotHeight = nodeWidth * SCREENSHOT_RATIO
  const targetHandleTop = CHROME_HEIGHT + screenshotHeight / 2

  const sourceHandleTop = nodeData.sourceHandle
    ? CHROME_HEIGHT + screenshotHeight * nodeData.sourceHandle.imageY
    : targetHandleTop
  const sourceHandlePosition = nodeData.sourceHandle?.side === "left" ? Position.Left : Position.Right

  const displayUrl = nodeData.url.replace(/^https?:\/\/[^/]+/, "") || "/"

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-none border-[3px] border-[#4a7ab5]",
        "bg-white/70 backdrop-blur-sm shadow-[0_1px_3px_rgba(29,110,245,0.08),0_4px_20px_rgba(29,110,245,0.1)]",
        "transition-shadow transition-colors",
        nodeData.isMain || nodeData.isLarge ? "w-[480px]" : "w-[280px]",
        nodeData.isMain && "border-[#2d5a9e] shadow-[0_2px_6px_rgba(29,110,245,0.1),0_8px_32px_rgba(29,110,245,0.16)]",
        nodeData.status === "running" && "border-[#3a6fa0]",
        isActive && "border-[#1d6ef5] shadow-[0_2px_6px_rgba(29,110,245,0.14),0_8px_32px_rgba(29,110,245,0.22)]",
      )}
    >
      <Handle type="target" position={Position.Left} className="flow-handle" style={{ top: targetHandleTop }} />

      {/* Chrome bar */}
      <div className="flex items-center gap-2 border-b-[3px] border-[#4a7ab5] bg-[#c7d9f0] px-3 py-2">
        <span className="shrink-0 truncate rounded border border-[#7aaad4] bg-white/50 px-2 py-0.5 text-[13px] font-mono text-[#2d5282]" style={{ maxWidth: "45%" }}>
          {displayUrl}
        </span>
        <div className="flex flex-1 items-center justify-around gap-2">
          <span className="rounded-none border border-[#7aaad4] bg-[#dbeafe] px-2.5 py-1 text-[12px] font-semibold text-[#1559d4]">
            Step {nodeData.step}
          </span>
          {(errorCount > 0 || warningCount > 0) && (
            <div className="flex items-center gap-2">
              {errorCount > 0 && (
                <span className="flex items-center gap-1 rounded bg-red-500/15 px-2 py-1 text-[12px] font-bold text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {errorCount}
                </span>
              )}
              {warningCount > 0 && (
                <span className="flex items-center gap-1 rounded bg-amber-400/15 px-2 py-1 text-[12px] font-bold text-amber-600">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  {warningCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Screenshot */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#dbeafe]">
        {nodeData.imageSrc ? (
          <Image src={nodeData.imageSrc} alt={nodeData.label} fill sizes="(max-width: 768px) 90vw, 480px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 border-2 border-dashed border-[#dbeafe] text-xs text-[#93c5fd]">
            <span className="text-3xl opacity-50">🖼</span>
            <span>Screenshot pending</span>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between border-t-[3px] border-[#4a7ab5] bg-[#c7d9f0] px-3 py-2">
        <div className="text-[15px] font-semibold tracking-[-0.2px] text-[#1a2a33]">
          {nodeData.label}
        </div>
        <Badge
          variant="outline"
          className="rounded-none border px-3 py-1 text-[13px] font-medium"
          style={{ color: status.color, background: status.bg, borderColor: `${status.color}40` }}
        >
          {status.label}
          {nodeData.duration && (
            <span className="text-[#1a2a33]/70"> · {nodeData.duration}</span>
          )}
        </Badge>
      </div>

      <Handle type="source" position={sourceHandlePosition} className="flow-handle" style={{ top: sourceHandleTop }} />
    </div>
  )
}
