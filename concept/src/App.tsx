import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './App.css'
import { ScreenshotNode, type ScreenshotNodeData } from './nodes/ScreenshotNode'

const nodeTypes = { screenshot: ScreenshotNode }

const initialNodes: Node<ScreenshotNodeData>[] = [
  {
    id: '1',
    type: 'screenshot',
    position: { x: 60, y: 200 },
    data: {
      label: 'Landing Page',
      url: 'https://testa.run',
      status: 'passed',
      step: 1,
      duration: '1.2s',
      // imageSrc: '/screenshots/landing.png',
    },
  },
  {
    id: '2',
    type: 'screenshot',
    position: { x: 560, y: 80 },
    data: {
      label: 'Login Flow',
      url: 'https://testa.run/login',
      status: 'passed',
      step: 2,
      duration: '0.8s',
      // imageSrc: '/screenshots/login.png',
    },
  },
  {
    id: '3',
    type: 'screenshot',
    position: { x: 1060, y: 200 },
    data: {
      label: 'User Dashboard',
      url: 'https://testa.run/dashboard',
      status: 'running',
      step: 3,
      // imageSrc: '/screenshots/dashboard.png',
    },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 2 },
    label: 'Click "Get Started"',
    labelStyle: { fill: '#a5b4fc', fontFamily: 'monospace', fontSize: 11 },
    labelBgStyle: { fill: 'rgba(15,15,28,0.85)', rx: 6, ry: 6 },
    labelBgPadding: [6, 8],
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 2 },
    label: 'Submit credentials',
    labelStyle: { fill: '#a5b4fc', fontFamily: 'monospace', fontSize: 11 },
    labelBgStyle: { fill: 'rgba(15,15,28,0.85)', rx: 6, ry: 6 },
    labelBgPadding: [6, 8],
  },
]

export default function App() {
  return (
    <div className="workspace">
      {/* Header */}
      <header className="workspace-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">testa<span className="logo-dot">.run</span></span>
          </div>
          <div className="header-divider" />
          <div className="run-info">
            <span className="run-label">Run</span>
            <span className="run-id">#a3f7c1</span>
            <span className="run-time">· 2m 14s ago</span>
          </div>
        </div>
        <div className="header-center">
          <div className="progress-track">
            <div className="progress-step done">
              <span>1</span>
              <label>Landing</label>
            </div>
            <div className="progress-line done" />
            <div className="progress-step done">
              <span>2</span>
              <label>Login</label>
            </div>
            <div className="progress-line active" />
            <div className="progress-step active">
              <span>3</span>
              <label>Dashboard</label>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="agent-pill">
            <span className="agent-dot" />
            Agent running
          </div>
        </div>
      </header>

      {/* Canvas */}
      <div className="canvas-wrapper">
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            color="rgba(99,102,241,0.15)"
            gap={28}
            size={1.5}
          />
          <Controls
            className="flow-controls"
            showInteractive={false}
          />
        </ReactFlow>
      </div>
    </div>
  )
}
