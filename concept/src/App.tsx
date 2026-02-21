import { useState, useCallback } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  applyNodeChanges,
  type Edge,
  type Node,
  type NodeChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './App.css'
import { ScreenshotNode, type ScreenshotNodeData } from './nodes/ScreenshotNode'
import { SpringEdge } from './edges/SpringEdge'

const nodeTypes = { screenshot: ScreenshotNode }
const edgeTypes = { spring: SpringEdge }

type ErrorCard = {
  id: string
  title: string
  step: number
  stepLabel: string
  severity: 'error' | 'warning'
  status: 'open' | 'resolved'
}

const errors: ErrorCard[] = [
  { id: 'err1', title: 'Login timeout > 3s',      step: 2, stepLabel: 'Login',     severity: 'error',   status: 'open' },
  { id: 'err2', title: 'Dashboard render lag',     step: 3, stepLabel: 'Dashboard', severity: 'error',   status: 'open' },
  { id: 'err3', title: 'Low contrast on CTA',      step: 1, stepLabel: 'Landing',   severity: 'warning', status: 'open' },
  { id: 'err4', title: 'Missing alt text on hero', step: 1, stepLabel: 'Landing',   severity: 'warning', status: 'resolved' },
  { id: 'err5', title: 'Form label not bound',     step: 2, stepLabel: 'Login',     severity: 'warning', status: 'resolved' },
]

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
    type: 'spring',
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
    type: 'spring',
    zIndex: 10,
    style: { stroke: 'rgba(37,99,235,0.45)', strokeWidth: 2 },
    label: 'Submit credentials',
    labelStyle: { fill: '#1D4ED8', fontFamily: 'monospace', fontSize: 11 },
    labelBgStyle: { fill: 'rgba(255,255,255,0.88)', rx: 6, ry: 6 },
    labelBgPadding: [6, 8],
  },
]

export default function App() {
  const [nodes, setNodes] = useState(initialNodes)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes(nds => applyNodeChanges(changes, nds) as Node<ScreenshotNodeData>[]),
    [],
  )

  const openErrors    = errors.filter(e => e.status === 'open')
  const resolvedErrors = errors.filter(e => e.status === 'resolved')

  return (
    <div className="workspace">

      {/* Sidebar */}
      <aside className="workspace-sidebar">

        {/* Logo */}
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">testa<span className="logo-dot">.run</span></span>
        </div>

        {/* Site under test */}
        <div className="site-card">
          <img
            className="site-favicon"
            src="https://www.google.com/s2/favicons?sz=32&domain=timeedit.com"
            alt=""
          />
          <div className="site-info">
            <div className="site-name">TimeEdit</div>
            <div className="site-url">timeedit.com</div>
          </div>
          <div className="site-status-dot" />
        </div>

        {/* Run info */}
        <div className="run-info">
          <div className="run-row">
            <span className="run-label">Run</span>
            <span className="run-id">#a3f7c1</span>
          </div>
          <div className="run-row">
            <span className="run-label">Started</span>
            <span className="run-time">2m 14s ago</span>
          </div>
          <div className="run-row">
            <span className="run-label">Steps</span>
            <span className="run-steps">3 / 3</span>
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* Progress track */}
        <div className="section-label">Flow</div>
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

        <div className="sidebar-divider" />

        {/* Kanban errors */}
        <div className="section-label">
          Issues
          <span className="issue-count">{openErrors.length}</span>
        </div>

        <div className="kanban">
          <div className="kanban-col">
            <div className="kanban-col-header open">Open</div>
            {openErrors.map(e => (
              <div key={e.id} className={`kanban-card severity-${e.severity}`}>
                <div className="kanban-card-title">{e.title}</div>
                <div className="kanban-card-meta">
                  <span className="kanban-step">Step {e.step} · {e.stepLabel}</span>
                  <span className={`kanban-badge ${e.severity}`}>
                    {e.severity === 'error' ? '✕' : '⚠'} {e.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="kanban-col">
            <div className="kanban-col-header resolved">Resolved</div>
            {resolvedErrors.map(e => (
              <div key={e.id} className="kanban-card resolved">
                <div className="kanban-card-title">{e.title}</div>
                <div className="kanban-card-meta">
                  <span className="kanban-step">Step {e.step} · {e.stepLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-spacer" />

        {/* Agent pill */}
        <div className="agent-pill">
          <span className="agent-dot" />
          Agent running
        </div>

      </aside>

      {/* Canvas */}
      <div className="canvas-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          fitView
          fitViewOptions={{ padding: 0.2 }}
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
            className="flow-controls"
            showInteractive={false}
          />
        </ReactFlow>
      </div>

    </div>
  )
}
