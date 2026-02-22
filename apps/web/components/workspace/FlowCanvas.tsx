"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  applyNodeChanges,
  useNodes,
  useOnViewportChange,
  useReactFlow,
  type Node,
  type NodeChange,
  type NodeMouseHandler,
} from "@xyflow/react"

import { useIssueContext } from "@/context/issue-context"
import { useWorkspaceData } from "@/context/workspace-data-context"
import { NODE_WIDTH, NODE_WIDE } from "@/constants/flow"
import type { ScreenshotNodeData } from "@/types/flow"
import { ScreenshotNode } from "@/components/workspace/nodes/ScreenshotNode"
import { SpringEdge } from "@/components/workspace/edges/SpringEdge"
import { InlineLoading } from "@/components/loading/InlineLoading"

const nodeTypes = { screenshot: ScreenshotNode }
const edgeTypes = { spring: SpringEdge }

function autoLayoutNodes(nodes: Node<ScreenshotNodeData>[], edges: { source: string; target: string }[]) {
  if (nodes.length === 0) return nodes

  const byId = new Map(nodes.map((n) => [n.id, n]))
  const children = new Map<string, Set<string>>()
  const indegree = new Map<string, number>()

  for (const node of nodes) {
    children.set(node.id, new Set())
    indegree.set(node.id, 0)
  }

  for (const edge of edges) {
    if (!byId.has(edge.source) || !byId.has(edge.target)) continue
    children.get(edge.source)?.add(edge.target)
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1)
  }

  const roots = nodes.filter((n) => (indegree.get(n.id) ?? 0) === 0).map((n) => n.id)
  const firstNodeId = nodes[0]?.id
  if (!firstNodeId) return nodes
  const queue = roots.length > 0 ? [...roots] : [firstNodeId]
  const level = new Map<string, number>()

  for (const id of queue) level.set(id, 0)

  while (queue.length > 0) {
    const current = queue.shift()!
    const curLevel = level.get(current) ?? 0

    for (const child of children.get(current) ?? []) {
      const nextLevel = curLevel + 1
      if ((level.get(child) ?? -1) < nextLevel) level.set(child, nextLevel)
      queue.push(child)
    }
  }

  for (const node of nodes) {
    if (!level.has(node.id)) level.set(node.id, 0)
  }

  const lanes = new Map<number, string[]>()
  for (const node of nodes) {
    const l = level.get(node.id) ?? 0
    if (!lanes.has(l)) lanes.set(l, [])
    lanes.get(l)!.push(node.id)
  }

  const xGap = 560
  const yGap = 360

  return nodes.map((node) => {
    const l = level.get(node.id) ?? 0
    const lane = lanes.get(l) ?? []
    const i = lane.indexOf(node.id)
    return {
      ...node,
      position: {
        x: 180 + l * xGap,
        y: 120 + Math.max(0, i) * yGap,
      },
    }
  })
}

const MAX_ZOOM       = 4
const PINCH_SPEED    = 0.05  // zoom factor per deltaY unit during pinch (ctrlKey)
const PAN_SPEED      = 1.0   // scroll-to-pan multiplier

// Reads live measured node dimensions from React Flow and re-zooms
// whenever the active node's height changes (e.g. dropdown opens/closes).
// Debounced so we wait for the node to fully expand before animating.
function FlowController() {
  const { activeNodeId, clearSelection } = useIssueContext()
  const { setCenter } = useReactFlow()
  const nodes = useNodes<Node>()
  const lastRef      = useRef<{ nodeId: string; height: number } | null>(null)
  const animatingRef = useRef(true)    // start true to block fitView from clearing seeded state

  // Allow pan-to-clear after React Flow's initial fitView has had time to run
  useEffect(() => {
    const t = setTimeout(() => { animatingRef.current = false }, 300)
    return () => clearTimeout(t)
  }, [])

  // ── Auto-zoom when focused node changes or its height shifts ────────────
  useEffect(() => {
    if (!activeNodeId) {
      lastRef.current = null
      return
    }

    const node = nodes.find((n) => n.id === activeNodeId)
    if (!node || node.type !== "screenshot") return
    if (!node?.measured?.height || !node.measured.width) return

    const nodeHeight = node.measured.height
    const prev = lastRef.current

    if (prev?.nodeId === activeNodeId && Math.abs(prev.height - nodeHeight) < 2) return

    const timer = setTimeout(() => {
      lastRef.current = { nodeId: activeNodeId, height: nodeHeight }

      const nodeData = node.data as ScreenshotNodeData
      const nodeWidth = nodeData.isMain || nodeData.isLarge ? NODE_WIDE : NODE_WIDTH
      const targetZoom = Math.min((window.innerHeight * 0.8) / nodeHeight, MAX_ZOOM)
      const centerX = node.position.x + nodeWidth / 2
      const centerY = node.position.y + nodeHeight / 2

      // Block pan-exit detection for the duration of the animation + a small buffer
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const duration = reducedMotion ? 0 : 600
      animatingRef.current = true
      setCenter(centerX, centerY, { zoom: targetZoom, duration })
      const cooldown = setTimeout(() => { animatingRef.current = false }, duration + 120)
      return () => clearTimeout(cooldown)
    }, 40)

    return () => clearTimeout(timer)
  }, [activeNodeId, nodes, setCenter])

  // ── Unfocus when user initiates any viewport move (pan or zoom) ──────────
  useOnViewportChange({
    onStart: () => {
      if (!animatingRef.current) clearSelection()
    },
  })

  // ── Custom wheel: pinch = zoom (fast), scroll = pan (all directions) ───────
  const rf = useReactFlow()
  useEffect(() => {
    const el = document.querySelector(".react-flow") as HTMLElement | null
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const vp = rf.getViewport()

      if (e.ctrlKey) {
        // Trackpad pinch gesture → zoom toward cursor
        const rect   = el.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const factor  = Math.exp(-e.deltaY * PINCH_SPEED)
        const newZoom = Math.max(0.2, Math.min(MAX_ZOOM, vp.zoom * factor))
        const newX    = mouseX - (mouseX - vp.x) * (newZoom / vp.zoom)
        const newY    = mouseY - (mouseY - vp.y) * (newZoom / vp.zoom)

        rf.setViewport({ x: newX, y: newY, zoom: newZoom }, { duration: 0 })
      } else {
        // Two-finger scroll or mouse wheel → pan in scroll direction
        rf.setViewport(
          { ...vp, x: vp.x - e.deltaX * PAN_SPEED, y: vp.y - e.deltaY * PAN_SPEED },
          { duration: 0 }
        )
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [rf])

  return null
}

export function FlowCanvas() {
  const { run, nodes: workspaceNodes, edges } = useWorkspaceData()
  const layoutedNodes = useMemo(
    () => autoLayoutNodes(workspaceNodes, edges.map((e) => ({ source: String(e.source), target: String(e.target) }))),
    [workspaceNodes, edges]
  )
  const [nodes, setNodes] = useState<Node[]>(layoutedNodes)
  const { selectNode, clearSelection } = useIssueContext()
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [loadingAnchor, setLoadingAnchor] = useState({ x: 180, y: 120 })
  const hasSeededLoadingAnchor = useRef(false)

  useEffect(() => {
    setNodes(layoutedNodes)
  }, [layoutedNodes])

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      setNodes((current) => applyNodeChanges(changes, current))
    },
    []
  )

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      if (node.type !== "screenshot") return
      selectNode(node.id)
    },
    [selectNode]
  )

  useEffect(() => {
    if (nodes.length > 0) {
      hasSeededLoadingAnchor.current = false
      return
    }
    if (hasSeededLoadingAnchor.current) return

    const el = containerRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const worldX = (rect.width / 2 - viewport.x) / viewport.zoom
    const worldY = (rect.height / 2 - viewport.y) / viewport.zoom

    setLoadingAnchor({ x: worldX, y: worldY })
    hasSeededLoadingAnchor.current = true
  }, [nodes.length, viewport.x, viewport.y, viewport.zoom])

  const loadingLeft = loadingAnchor.x * viewport.zoom + viewport.x
  const loadingTop = loadingAnchor.y * viewport.zoom + viewport.y

  return (
    <div ref={containerRef} className="relative flex h-full flex-1 flex-col overflow-hidden bg-white">
      <ReactFlow
        className="h-full w-full"
        onInit={(instance) => setViewport(instance.getViewport())}
        onMove={(_event, nextViewport) => setViewport(nextViewport)}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onPaneClick={clearSelection}
        fitView
        fitViewOptions={{ padding: 0.22 }}
        minZoom={0.2}
        maxZoom={MAX_ZOOM}
        zoomOnScroll={false}
        panOnScroll={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#1B3A6B"
          gap={28}
          size={2.5}
        />
        <Controls className="flow-controls" showInteractive={false} />
        <FlowController />
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-30">
          <div
            className="absolute"
            style={{ left: loadingLeft, top: loadingTop, transform: "translate(-50%, -50%)" }}
          >
            <div className="w-[420px] rounded-lg border border-ui-border bg-white/95 p-6 text-center shadow-xl backdrop-blur">
              <InlineLoading
                label={run.status === "running" ? "Building workflow graph…" : "Preparing workspace…"}
                cubeSize={58}
                className="min-h-[220px]"
              />
              <p className="mt-1 text-xs text-ui-muted">
                We are ingesting streamed events and will render nodes as soon as they are available.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
