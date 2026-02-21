"use client"

import type { Edge, Node } from "@xyflow/react"
import type { Issue } from "@/types/domain"
import type { ScreenshotNodeData } from "@/types/flow"
import { IssueProvider } from "@/context/issue-context"
import { WorkspaceDataProvider, type WorkspaceRun } from "@/context/workspace-data-context"
import { FlowCanvas } from "@/components/workspace/FlowCanvas"
import { FloatingNav } from "@/components/workspace/FloatingNav"
import { SecurityOverlay } from "@/components/workspace/SecurityOverlay"
import { Sidebar } from "@/components/workspace/Sidebar"

export function WorkspacePage({
  run,
  nodes,
  edges,
  issues,
  initialIssueId,
  initialNodeId,
}: {
  run: WorkspaceRun
  nodes: Node<ScreenshotNodeData>[]
  edges: Edge[]
  issues: Issue[]
  initialIssueId?: string
  initialNodeId?: string
}) {
  return (
    <WorkspaceDataProvider value={{ run, nodes, edges, issues }}>
      <IssueProvider initialIssueId={initialIssueId} initialNodeId={initialNodeId}>
        <main className="flex h-dvh w-full overflow-hidden bg-[#eff6ff]">
          <Sidebar />
          <div className="relative flex flex-1 overflow-hidden">
            <FloatingNav />
            <SecurityOverlay />
            <FlowCanvas />
          </div>
        </main>
      </IssueProvider>
    </WorkspaceDataProvider>
  )
}
