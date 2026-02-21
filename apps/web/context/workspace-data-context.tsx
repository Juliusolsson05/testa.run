"use client"

import { createContext, useContext } from "react"
import type { Edge, Node } from "@xyflow/react"
import type { Issue } from "@/types/domain"
import type { ScreenshotNodeData } from "@/types/flow"

export type WorkspaceRun = {
  id: string
  name: string
  label: string | null
  category: string
  status: string
  startedAt: string
  securitySynopsis?: string | null
}

type WorkspaceDataContextValue = {
  run: WorkspaceRun
  nodes: Node<ScreenshotNodeData>[]
  edges: Edge[]
  issues: Issue[]
}

const WorkspaceDataContext = createContext<WorkspaceDataContextValue | null>(null)

export function WorkspaceDataProvider({
  value,
  children,
}: {
  value: WorkspaceDataContextValue
  children: React.ReactNode
}) {
  return <WorkspaceDataContext.Provider value={value}>{children}</WorkspaceDataContext.Provider>
}

export function useWorkspaceData() {
  const ctx = useContext(WorkspaceDataContext)
  if (!ctx) throw new Error("useWorkspaceData must be used inside WorkspaceDataProvider")
  return ctx
}
