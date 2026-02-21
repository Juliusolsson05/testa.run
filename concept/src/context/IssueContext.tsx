import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { issues } from '../data/issues'

type IssueContextValue = {
  activeIssueId:  string | null
  activeNodeId:   string | null
  selectIssue:    (issueId: string) => void
  clearSelection: () => void
}

const IssueContext = createContext<IssueContextValue | null>(null)

export function IssueProvider({ children }: { children: ReactNode }) {
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null)
  const [activeNodeId,  setActiveNodeId]  = useState<string | null>(null)

  const selectIssue = useCallback((issueId: string) => {
    const issue = issues.find(i => i.id === issueId)
    if (!issue) return
    setActiveIssueId(issueId)
    setActiveNodeId(issue.nodeId)
  }, [])

  const clearSelection = useCallback(() => {
    setActiveIssueId(null)
    setActiveNodeId(null)
  }, [])

  return (
    <IssueContext.Provider value={{ activeIssueId, activeNodeId, selectIssue, clearSelection }}>
      {children}
    </IssueContext.Provider>
  )
}

export function useIssueContext() {
  const ctx = useContext(IssueContext)
  if (!ctx) throw new Error('useIssueContext must be used inside IssueProvider')
  return ctx
}
