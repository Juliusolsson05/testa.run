"use client"

import { useEffect, useRef, useState } from "react"
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

type RunEventEnvelope = {
  runId: string
  seq: number
  at: string
  type: string
  payload: Record<string, unknown>
}

function applyEvent(current: WorkspaceApiPayload, event: RunEventEnvelope): WorkspaceApiPayload {
  switch (event.type) {
    case "run.updated":
    case "run.started": {
      const runPayload = event.payload.run as Partial<WorkspaceRun> | undefined
      if (!runPayload) return current
      return { ...current, run: { ...current.run, ...runPayload } }
    }

    case "node.upserted": {
      const node = event.payload.node as WorkspaceApiPayload["nodes"][number] | undefined
      if (!node) return current
      const nextNodes = [...current.nodes]
      const index = nextNodes.findIndex((n) => n.id === node.id)
      if (index >= 0) nextNodes[index] = node
      else nextNodes.push(node)
      return { ...current, nodes: nextNodes }
    }

    case "edge.upserted": {
      const edge = event.payload.edge as Edge | undefined
      if (!edge) return current
      const nextEdges = [...current.edges]
      const index = nextEdges.findIndex((e) => e.id === edge.id)
      if (index >= 0) nextEdges[index] = edge
      else nextEdges.push(edge)
      return { ...current, edges: nextEdges }
    }

    case "issue.created": {
      const issue = event.payload.issue as Issue | undefined
      if (!issue) return current
      if (current.issues.some((i) => i.id === issue.id)) return current
      return { ...current, issues: [...current.issues, issue] }
    }

    case "run.completed":
    case "run.failed": {
      const runPayload = event.payload.run as Partial<WorkspaceRun> | undefined
      if (!runPayload) return current
      return { ...current, run: { ...current.run, ...runPayload } }
    }

    default:
      return current
  }
}

async function parseSseResponse(
  response: Response,
  onEvent: (event: RunEventEnvelope) => void,
  signal?: AbortSignal
) {
  if (!response.body) throw new Error("Missing SSE body")

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    if (signal?.aborted) break
    let chunk: ReadableStreamReadResult<Uint8Array>
    try {
      chunk = await reader.read()
    } catch {
      if (signal?.aborted) return
      throw new Error('SSE read failed')
    }
    const { done, value } = chunk
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    let idx = buffer.indexOf("\n\n")
    while (idx !== -1) {
      const block = buffer.slice(0, idx)
      buffer = buffer.slice(idx + 2)

      const lines = block.split("\n")
      const eventName = lines.find((l) => l.startsWith("event:"))?.slice(6).trim()
      const data = lines.find((l) => l.startsWith("data:"))?.slice(5).trim()

      if (eventName === "run-event" && data) {
        try {
          onEvent(JSON.parse(data) as RunEventEnvelope)
        } catch {
          // ignore malformed event
        }
      }

      idx = buffer.indexOf("\n\n")
    }
  }
}

export default function WorkspaceRunRoute() {
  const params = useParams<{ runId: string }>()
  const search = useSearchParams()
  const { accessToken } = useAuth()

  const [payload, setPayload] = useState<WorkspaceApiPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [streamState, setStreamState] = useState<"idle" | "live" | "polling">("idle")
  const lastSeq = useRef(0)

  useEffect(() => {
    async function loadSnapshot() {
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

    void loadSnapshot().catch(() => setError("Failed to load workspace"))
  }, [accessToken, params.runId])

  useEffect(() => {
    if (!accessToken || !params.runId) return

    const abort = new AbortController()
    let pollingTimer: ReturnType<typeof setInterval> | null = null

    const startPolling = () => {
      setStreamState("polling")
      pollingTimer = setInterval(async () => {
        const res = await fetch(`/api/runs/${params.runId}/events?afterSeq=${lastSeq.current}&limit=200`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        })
        if (!res.ok) return
        const data = await res.json()
        const events = (data.events ?? []) as RunEventEnvelope[]
        for (const event of events) {
          lastSeq.current = Math.max(lastSeq.current, event.seq)
          setPayload((cur) => (cur ? applyEvent(cur, event) : cur))
        }
      }, 2500)
    }

    async function startLive() {
      try {
        const res = await fetch(`/api/runs/${params.runId}/stream?afterSeq=${lastSeq.current}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
          signal: abort.signal,
        })

        if (!res.ok) throw new Error("SSE stream failed")
        setStreamState("live")

        await parseSseResponse(
          res,
          (event) => {
            lastSeq.current = Math.max(lastSeq.current, event.seq)
            setPayload((cur) => (cur ? applyEvent(cur, event) : cur))
          },
          abort.signal
        )
      } catch {
        if (!abort.signal.aborted) startPolling()
      }
    }

    void startLive().catch(() => {
      // swallow unexpected stream errors in dev/HMR cleanup paths
    })

    return () => {
      try {
        abort.abort(new DOMException("workspace stream cleanup", "AbortError"))
      } catch {
        // ignore cleanup abort noise
      }
      if (pollingTimer) clearInterval(pollingTimer)
    }
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
    <>
      <div className="fixed right-3 top-3 z-[2000] rounded bg-black/70 px-2 py-1 text-[11px] text-white">
        {streamState === "live" ? "Live" : streamState === "polling" ? "Polling" : "Idle"}
      </div>
      <WorkspacePage
        run={payload.run}
        nodes={nodes}
        edges={payload.edges}
        issues={payload.issues}
        initialIssueId={search.get("issueId") ?? undefined}
        initialNodeId={search.get("nodeId") ?? undefined}
      />
    </>
  )
}
