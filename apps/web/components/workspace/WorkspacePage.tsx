"use client"

import { IssueProvider } from "@/context/issue-context"
import { FlowCanvas } from "@/components/workspace/FlowCanvas"
import { Sidebar } from "@/components/workspace/Sidebar"

export function WorkspacePage() {
  return (
    <IssueProvider>
      <main className="flex h-dvh w-full overflow-hidden bg-[#eff6ff]">
        <Sidebar />
        <FlowCanvas />
      </main>
    </IssueProvider>
  )
}
