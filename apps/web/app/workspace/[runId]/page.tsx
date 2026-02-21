"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import type { Edge, Node } from "@xyflow/react"
import { WorkspacePage } from "@/components/workspace/WorkspacePage"
import { useAuth } from "@/components/auth/AuthProvider"
import type { Issue, NodeStatus } from "@/types/domain"
import type { ScreenshotNodeData } from "@/types/flow"
import type { WorkspaceRun } from "@/context/workspace-data-context"

type WorkspaceApiPayload = {
  run: WorkspaceRun
  nodes: Array<{
    id: string
    position: { x: number; y: number }
    data: {
      label: string
      url: string
      status: NodeStatus
      step: number
      duration?: string
      isMain?: boolean
      isLarge?: boolean
      imageSrc?: string
      sourceHandle?: { side: "left" | "right"; imageY: number }
    }
  }>
  edges: Edge[]
  issues: Issue[]
}

export default function WorkspaceRunRoute() {
  const params = useParams<{ runId: string }>()
  const search = useSearchParams()
  const { accessToken } = useAuth()

  const [payload, setPayload] = useState<WorkspaceApiPayload | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!params.runId || !accessToken) return

      const res = await fetch(`/api/runs/${params.runId}/workspace`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!res.ok) {
        setError("Failed to load workspace")
        return
      }

      const data = (await res.json()) as WorkspaceApiPayload
      setPayload(data)
    }

    void load().catch(() => setError("Failed to load workspace"))
  }, [accessToken, params.runId])

  if (error) {
    return <div className="flex h-dvh items-center justify-center bg-app-bg text-ui-muted">{error}</div>
  }

  if (!payload) {
    return <div className="flex h-dvh items-center justify-center bg-app-bg text-ui-muted">Loading workspace…</div>
  }

  const nodes: Node<ScreenshotNodeData>[] = payload.nodes.map((n) => ({
    id: n.id,
    type: "screenshot",
    position: n.position,
    data: n.data,
  }))

  return (
    <WorkspacePage
      run={payload.run}
      nodes={nodes}
      edges={payload.edges}
      issues={payload.issues}
      initialIssueId={search.get("issueId") ?? undefined}
      initialNodeId={search.get("nodeId") ?? undefined}
    />
  )
}
