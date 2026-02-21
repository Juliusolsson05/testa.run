"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { issues } from "@/data/issues"

type IssueContextValue = {
  activeIssueId: string | null
  activeNodeId: string | null
  selectIssue: (issueId: string) => void
  clearSelection: () => void
}

const IssueContext = createContext<IssueContextValue | null>(null)

export function IssueProvider({ children }: { children: ReactNode }) {
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null)
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)

  const selectIssue = useCallback((issueId: string) => {
    const issue = issues.find((item) => item.id === issueId)
    if (!issue) return
    setActiveIssueId(issueId)
    setActiveNodeId(issue.nodeId)
  }, [])

  const clearSelection = useCallback(() => {
    setActiveIssueId(null)
    setActiveNodeId(null)
  }, [])

  const value = useMemo(
    () => ({ activeIssueId, activeNodeId, selectIssue, clearSelection }),
    [activeIssueId, activeNodeId, selectIssue, clearSelection]
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
