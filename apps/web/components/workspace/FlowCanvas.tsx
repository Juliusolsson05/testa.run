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
import type { ScreenshotNodeData } from "@/types/flow"
import { ScreenshotNode } from "@/components/workspace/nodes/ScreenshotNode"
import { SpringEdge } from "@/components/workspace/edges/SpringEdge"

const nodeTypes = { screenshot: ScreenshotNode }
const edgeTypes = { spring: SpringEdge }

const CHROME_HEIGHT = 36
const NODE_WIDTH = 280
const NODE_WIDE = 480
const SCREENSHOT_RATIO = 10 / 16

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
  const [nodes, setNodes] = useState(initialNodes)
  const { clearSelection } = useIssueContext()

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((current) =>
        applyNodeChanges(changes, current) as Node<ScreenshotNodeData>[]
      )
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
        <Controls className="flow-controls" showInteractive={false} />
        <FlowController nodes={nodes} />
      </ReactFlow>
    </div>
  )
}
