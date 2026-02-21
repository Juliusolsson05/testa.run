"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { issues, type Issue } from "@/data/issues"

type IssueContextValue = {
  issues: Issue[]
  activeIssueId: string | null
  activeNodeId: string | null
  selectIssue: (issueId: string) => void
  selectNode: (nodeId: string) => void
  clearSelection: () => void
}

const IssueContext = createContext<IssueContextValue | null>(null)

export function IssueProvider({
  children,
  initialIssueId,
  initialNodeId,
}: {
  children: ReactNode
  initialIssueId?: string
  initialNodeId?: string
}) {
  const seedIssue = initialIssueId ?? null
  const seedNode  = initialIssueId
    ? (issues.find((i) => i.id === initialIssueId)?.nodeId ?? null)
    : (initialNodeId ?? null)

  const [activeIssueId, setActiveIssueId] = useState<string | null>(seedIssue)
  const [activeNodeId,  setActiveNodeId]  = useState<string | null>(seedNode)

  const selectIssue = useCallback((issueId: string) => {
    const issue = issues.find((item) => item.id === issueId)
    if (!issue) return
    setActiveIssueId(issueId)
    setActiveNodeId(issue.nodeId)
  }, [])

  const selectNode = useCallback((nodeId: string) => {
    setActiveIssueId(null)
    setActiveNodeId(nodeId)
  }, [])

  const clearSelection = useCallback(() => {
    setActiveIssueId(null)
    setActiveNodeId(null)
  }, [])

  const value = useMemo(
    () => ({ issues, activeIssueId, activeNodeId, selectIssue, selectNode, clearSelection }),
    [activeIssueId, activeNodeId, selectIssue, selectNode, clearSelection]
  )

  return <IssueContext.Provider value={value}>{children}</IssueContext.Provider>
}

export function useIssueContext() {
  const ctx = useContext(IssueContext)
  if (!ctx) {
    throw new Error("useIssueContext must be used inside IssueProvider")
  }
  return ctx
}
