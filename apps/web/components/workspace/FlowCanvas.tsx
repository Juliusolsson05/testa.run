"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  applyNodeChanges,
  useNodes,
  useReactFlow,
  useViewport,
  useStore,
  type Node,
  type NodeChange,
  type NodeMouseHandler,
} from "@xyflow/react"

const ZOOM_SPEED   = 0.25  // fractional zoom change per scroll tick
const PAN_SPEED    = 1.0   // horizontal pan multiplier

import { initialEdges, initialNodes } from "@/data/flow"
import { useIssueContext } from "@/context/issue-context"
import { NODE_WIDTH, NODE_WIDE } from "@/constants/flow"
import type { ScreenshotNodeData } from "@/types/flow"
import { ScreenshotNode } from "@/components/workspace/nodes/ScreenshotNode"
import { SpringEdge } from "@/components/workspace/edges/SpringEdge"

const nodeTypes = { screenshot: ScreenshotNode }
const edgeTypes = { spring: SpringEdge }

const MAX_ZOOM = 4

// Reads live measured node dimensions from React Flow and re-zooms
// whenever the active node's height changes (e.g. dropdown opens/closes).
// Debounced so we wait for the node to fully expand before animating.
function FlowController() {
  const { activeNodeId, clearSelection } = useIssueContext()
  const { setCenter } = useReactFlow()
  const nodes = useNodes<ScreenshotNodeData>()
  const lastRef      = useRef<{ nodeId: string; height: number } | null>(null)
  const animatingRef = useRef(false)   // true while a zoom animation is in flight

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
      const centerX = node.position.x + nodeWidth / 2 + 200 / targetZoom
      const centerY = node.position.y + nodeHeight / 2

      // Block pan-exit detection for the duration of the animation + a small buffer
      animatingRef.current = true
      setCenter(centerX, centerY, { zoom: targetZoom, duration: 600 })
      const cooldown = setTimeout(() => { animatingRef.current = false }, 700)
      return () => clearTimeout(cooldown)
    }, 40)

    return () => clearTimeout(timer)
  }, [activeNodeId, nodes, setCenter])

  // ── Exit focus when user pans the node mostly off-screen ─────────────────
  const { x: vpX, y: vpY, zoom: vpZoom } = useViewport()
  const containerWidth = useStore((s) => s.width)
  const containerHeight = useStore((s) => s.height)

  useEffect(() => {
    // Only fire after the zoom has settled for THIS node, and not during an animation
    if (!activeNodeId || lastRef.current?.nodeId !== activeNodeId || animatingRef.current) return

    const node = nodes.find((n) => n.id === activeNodeId)
    if (!node?.measured?.height) return

    const nodeWidth = node.data.isMain || node.data.isLarge ? NODE_WIDE : NODE_WIDTH
    const nodeHeight = node.measured.height

    // Node bounding box in screen (canvas-relative) pixels
    const screenLeft   = node.position.x * vpZoom + vpX
    const screenTop    = node.position.y * vpZoom + vpY
    const screenRight  = screenLeft + nodeWidth  * vpZoom
    const screenBottom = screenTop  + nodeHeight * vpZoom

    // Overlap with the canvas rect
    const overlapX = Math.max(0, Math.min(screenRight, containerWidth)  - Math.max(screenLeft, 0))
    const overlapY = Math.max(0, Math.min(screenBottom, containerHeight) - Math.max(screenTop,  0))
    const visibleFraction = (overlapX * overlapY) / (nodeWidth * vpZoom * nodeHeight * vpZoom)

    // Exit focus when less than 30 % of the node is still visible
    if (visibleFraction < 0.3) clearSelection()
  }, [activeNodeId, nodes, vpX, vpY, vpZoom, containerWidth, containerHeight, clearSelection])

  // ── Custom wheel: vertical = zoom (fast), horizontal = pan ───────────────
  const rf = useReactFlow()
  useEffect(() => {
    const el = document.querySelector(".react-flow") as HTMLElement | null
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()

      const vp = rf.getViewport()

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Horizontal scroll → pan left/right
        rf.setViewport({ ...vp, x: vp.x - e.deltaX * PAN_SPEED }, { duration: 0 })
      } else {
        // Vertical scroll → zoom toward cursor
        const rect = el.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const direction  = e.deltaY > 0 ? -1 : 1
        const scale      = 1 + direction * ZOOM_SPEED
        const newZoom    = Math.max(0.2, Math.min(MAX_ZOOM, vp.zoom * scale))
        const newX       = mouseX - (mouseX - vp.x) * (newZoom / vp.zoom)
        const newY       = mouseY - (mouseY - vp.y) * (newZoom / vp.zoom)

        rf.setViewport({ x: newX, y: newY, zoom: newZoom }, { duration: 0 })
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
    (changes: NodeChange[]) => {
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
