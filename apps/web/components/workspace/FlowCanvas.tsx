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
  const lastRef = useRef<{ nodeId: string; height: number } | null>(null)

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

      setCenter(centerX, centerY, { zoom: targetZoom, duration: 600 })
    }, 40)

    return () => clearTimeout(timer)
  }, [activeNodeId, nodes, setCenter])

  // ── Exit focus when user pans the node mostly off-screen ─────────────────
  const { x: vpX, y: vpY, zoom: vpZoom } = useViewport()
  const containerWidth = useStore((s) => s.width)
  const containerHeight = useStore((s) => s.height)

  useEffect(() => {
    // Only fire after the zoom has settled for THIS node specifically
    if (!activeNodeId || lastRef.current?.nodeId !== activeNodeId) return

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
