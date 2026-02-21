"use client"

import { IssueProvider } from "@/context/issue-context"
import { FlowCanvas } from "@/components/workspace/FlowCanvas"
import { FloatingNav } from "@/components/workspace/FloatingNav"
import { SecurityOverlay } from "@/components/workspace/SecurityOverlay"
import { Sidebar } from "@/components/workspace/Sidebar"

export function WorkspacePage({
  initialIssueId,
  initialNodeId,
}: {
  initialIssueId?: string
  initialNodeId?: string
}) {
  return (
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
  )
}
