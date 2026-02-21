"use client"

import { ErrorBoundary } from "@/components/error-boundary"
import { FlowCanvas } from "@/components/workspace/FlowCanvas"
import { Sidebar } from "@/components/workspace/Sidebar"
import { IssueProvider } from "@/context/issue-context"

export function WorkspaceClient() {
  return (
    <IssueProvider>
      <Sidebar />
      <ErrorBoundary>
        <FlowCanvas />
      </ErrorBoundary>
    </IssueProvider>
  )
}
