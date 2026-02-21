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

import { initialEdges, initialNodes } from "@/data/flow"
import { useIssueContext } from "@/context/issue-context"
import { NODE_WIDTH, NODE_WIDE } from "@/constants/flow"
import type { ScreenshotNodeData } from "@/types/flow"
import { ScreenshotNode } from "@/components/workspace/nodes/ScreenshotNode"
import { SpringEdge } from "@/components/workspace/edges/SpringEdge"

const nodeTypes = { screenshot: ScreenshotNode }
const edgeTypes = { spring: SpringEdge }

const MAX_ZOOM       = 4
const PINCH_SPEED    = 0.05  // zoom factor per deltaY unit during pinch (ctrlKey)
const PAN_SPEED      = 1.0   // scroll-to-pan multiplier

// Reads live measured node dimensions from React Flow and re-zooms
// whenever the active node's height changes (e.g. dropdown opens/closes).
// Debounced so we wait for the node to fully expand before animating.
function FlowController() {
  const { activeNodeId, clearSelection } = useIssueContext()
  const { setCenter } = useReactFlow()
  const nodes = useNodes<Node<ScreenshotNodeData>>()
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
    if (!node?.measured?.height || !node.measured.width) return

    const nodeHeight = node.measured.height
    const prev = lastRef.current

    if (prev?.nodeId === activeNodeId && Math.abs(prev.height - nodeHeight) < 2) return

    const timer = setTimeout(() => {
      lastRef.current = { nodeId: activeNodeId, height: nodeHeight }

      const nodeWidth = node.data.isMain || node.data.isLarge ? NODE_WIDE : NODE_WIDTH
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
  const [nodes, setNodes] = useState(initialNodes)
  const { selectNode, clearSelection } = useIssueContext()

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<ScreenshotNodeData>>[]) => {
      setNodes((current) =>
        applyNodeChanges(changes, current) as Node<ScreenshotNodeData>[]
      )
    },
    []
  )

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      selectNode(node.id)
    },
    [selectNode]
  )

  const edges = useMemo(() => initialEdges, [])

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-white">
      <ReactFlow
        className="h-full w-full"
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
    </div>
  )
}
