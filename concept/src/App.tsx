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
    position: { x: 80, y: 120 },
    data: {
      label: 'Landing Page',
      url: 'https://testa.run',
      status: 'passed',
      step: 1,
      duration: '1.2s',
      isMain: true,
      imageSrc: '/screenshots/landing.png',
      sourceHandleOffset: { top: '12%', left: '78%' },
    },
  },
  {
    id: '2',
    type: 'screenshot',
    position: { x: 860, y: 20 },
    data: {
      label: 'Login Flow',
      url: 'https://testa.run/login',
      status: 'passed',
      step: 2,
      duration: '0.8s',
      imageSrc: '/screenshots/login.png',
      sourceHandleOffset: { top: '58%', left: '84%' },
    },
  },
  {
    id: '3',
    type: 'screenshot',
    position: { x: 1480, y: 120 },
    data: {
      label: 'User Dashboard',
      url: 'https://testa.run/dashboard',
      status: 'running',
      step: 3,
      imageSrc: '/screenshots/dashboard.png',
    },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    zIndex: 10,
    style: { stroke: 'rgba(37,99,235,0.45)', strokeWidth: 2 },
    label: 'Click "Get Started"',
    labelStyle: { fill: '#1D4ED8', fontFamily: 'monospace', fontSize: 11 },
    labelBgStyle: { fill: 'rgba(255,255,255,0.88)', rx: 6, ry: 6 },
    labelBgPadding: [6, 8],
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    zIndex: 10,
    style: { stroke: 'rgba(37,99,235,0.45)', strokeWidth: 2 },
    label: 'Submit credentials',
    labelStyle: { fill: '#1D4ED8', fontFamily: 'monospace', fontSize: 11 },
    labelBgStyle: { fill: 'rgba(255,255,255,0.88)', rx: 6, ry: 6 },
    labelBgPadding: [6, 8],
  },
]

export default function App() {
  return (
    <div className="workspace">
      {/* Sidebar */}
      <aside className="workspace-sidebar">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">testa<span className="logo-dot">.run</span></span>
        </div>

        <div className="run-info">
          <span className="run-label">Run</span>
          <span className="run-id">#a3f7c1</span>
          <span className="run-time">2m 14s ago</span>
        </div>

        <div className="sidebar-divider" />

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

        <div className="sidebar-spacer" />

        <div className="agent-pill">
          <span className="agent-dot" />
          Agent running
        </div>
      </aside>

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
            color="#2563EB"
            gap={28}
            size={2.5}
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
