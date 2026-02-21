"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  applyNodeChanges,
  useReactFlow,
  type Node,
  type NodeChange,
} from "@xyflow/react"

import { initialEdges, initialNodes } from "@/data/flow"
import { useIssueContext } from "@/context/issue-context"
import {
  CHROME_HEIGHT,
  NODE_WIDTH,
  NODE_WIDE,
  SCREENSHOT_RATIO,
} from "@/constants/flow"
import type { ScreenshotNodeData } from "@/types/flow"
import { ScreenshotNode } from "@/components/workspace/nodes/ScreenshotNode"
import { SpringEdge } from "@/components/workspace/edges/SpringEdge"

const nodeTypes = { screenshot: ScreenshotNode }
const edgeTypes = { spring: SpringEdge }

function FlowController({ nodes }: { nodes: Node<ScreenshotNodeData>[] }) {
  const { activeNodeId } = useIssueContext()
  const { setCenter } = useReactFlow()

  useEffect(() => {
    if (!activeNodeId) return
    const node = nodes.find((item) => item.id === activeNodeId)
    if (!node) return

    const width = node.data.isMain || node.data.isLarge ? NODE_WIDE : NODE_WIDTH
    const screenshotHeight = width * SCREENSHOT_RATIO
    const centerX = node.position.x + width / 2
    const centerY = node.position.y + CHROME_HEIGHT + screenshotHeight / 2

    setCenter(centerX, centerY, { zoom: 0.85, duration: 600 })
  }, [activeNodeId, nodes, setCenter])

  return null
}

export function FlowCanvas() {
  const [nodes, setNodes] = useState<Node<ScreenshotNodeData>[]>(initialNodes)
  const { clearSelection } = useIssueContext()

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<ScreenshotNodeData>>[]) => {
      setNodes((current) => applyNodeChanges(changes, current))
    },
    []
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
        onPaneClick={clearSelection}
        fitView
        fitViewOptions={{ padding: 0.22 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#1B3A6B"
          gap={28}
          size={2.5}
        />
        <Controls
          showInteractive={false}
          style={{
            background: "#ffffff",
            border: "1px solid #c0d4ec",
            borderRadius: 0,
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(37, 99, 235, 0.1)",
          }}
          className={`
            [&_.react-flow__controls-button]:border-0
            [&_.react-flow__controls-button]:border-b
            [&_.react-flow__controls-button]:border-b-[#c0d4ec]
            [&_.react-flow__controls-button]:bg-transparent
            [&_.react-flow__controls-button]:text-[#4a7ab5]
            [&_.react-flow__controls-button:hover]:bg-[#eff6ff]
            [&_.react-flow__controls-button:hover]:text-[#1d4ed8]
            [&_.react-flow__controls-button:last-child]:border-b-0
          `}
        />
        <FlowController nodes={nodes} />
      </ReactFlow>
    </div>
  )
}
