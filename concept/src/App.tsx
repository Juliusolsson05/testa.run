import { useState, useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  applyNodeChanges,
  useReactFlow,
  type Edge,
  type Node,
  type NodeChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './App.css'
import { ScreenshotNode, type ScreenshotNodeData } from './nodes/ScreenshotNode'
import { SpringEdge } from './edges/SpringEdge'
import { IssueProvider, useIssueContext } from './context/IssueContext'
import { issues } from './data/issues'

const nodeTypes = { screenshot: ScreenshotNode }
const edgeTypes = { spring: SpringEdge }

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
      sourceHandleOffset: { top: '47px', left: '78%' },
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
      sourceHandleOffset: { top: '158px', left: '84%' },
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
      isLarge: true,
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

// Lives inside <ReactFlow> so it can call useReactFlow()
function FlowController({ nodes }: { nodes: Node<ScreenshotNodeData>[] }) {
  const { activeNodeId } = useIssueContext()
  const { setCenter }    = useReactFlow()

  useEffect(() => {
    if (!activeNodeId) return
    const node = nodes.find(n => n.id === activeNodeId)
    if (!node) return
    const w = (node.data.isMain || node.data.isLarge) ? 460 : 260
    setCenter(node.position.x + w / 2, node.position.y + 160, { zoom: 0.85, duration: 600 })
  }, [activeNodeId, nodes, setCenter])

  return null
}

const nodeStepMap: Record<string, { step: number; label: string }> = {
  '1': { step: 1, label: 'Landing' },
  '2': { step: 2, label: 'Login' },
  '3': { step: 3, label: 'Dashboard' },
}

function Workspace() {
  const [nodes, setNodes] = useState(initialNodes)
  const { selectIssue, activeIssueId } = useIssueContext()

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes(nds => applyNodeChanges(changes, nds) as Node<ScreenshotNodeData>[]),
    [],
  )

  const openIssues     = issues.filter(i => i.status === 'open')
  const resolvedIssues = issues.filter(i => i.status === 'resolved')
  const errorCount     = issues.filter(i => i.severity === 'error'   && i.status === 'open').length
  const warningCount   = issues.filter(i => i.severity === 'warning' && i.status === 'open').length
  const sitesChecked   = new Set(issues.map(i => i.nodeId)).size

  return (
    <div className="workspace">

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
        </div>

        <div className="sidebar-divider" />

        {/* Stats */}
        <div className="section-label">Stats</div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{sitesChecked}</div>
            <div className="stat-label">Sites checked</div>
          </div>
          <div className="stat-card">
            <div className="stat-value stat-error">{errorCount}</div>
            <div className="stat-label">Errors</div>
          </div>
          <div className="stat-card">
            <div className="stat-value stat-warning">{warningCount}</div>
            <div className="stat-label">Warnings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value stat-resolved">{resolvedIssues.length}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* Kanban */}
        <div className="section-label">
          Issues
          <span className="issue-count">{openIssues.length}</span>
        </div>

        <div className="kanban">
          <div className="kanban-col">
            <div className="kanban-col-header open">Open</div>
            {openIssues.map(issue => {
              const meta     = nodeStepMap[issue.nodeId]
              const isActive = activeIssueId === issue.id
              return (
                <div
                  key={issue.id}
                  className={['kanban-card', `severity-${issue.severity}`, isActive ? 'kanban-card--active' : ''].filter(Boolean).join(' ')}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectIssue(issue.id)}
                  onKeyDown={e => e.key === 'Enter' && selectIssue(issue.id)}
                >
                  <div className="kanban-card-title">{issue.title}</div>
                  <div className="kanban-card-meta">
                    <span className="kanban-step">Step {meta.step} · {meta.label}</span>
                    <span className={`kanban-badge ${issue.severity}`}>
                      {issue.severity === 'error' ? '✕' : '⚠'} {issue.severity}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="kanban-col">
            <div className="kanban-col-header resolved">Resolved</div>
            {resolvedIssues.map(issue => {
              const meta     = nodeStepMap[issue.nodeId]
              const isActive = activeIssueId === issue.id
              return (
                <div
                  key={issue.id}
                  className={['kanban-card resolved', isActive ? 'kanban-card--active' : ''].filter(Boolean).join(' ')}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectIssue(issue.id)}
                  onKeyDown={e => e.key === 'Enter' && selectIssue(issue.id)}
                >
                  <div className="kanban-card-title">{issue.title}</div>
                  <div className="kanban-card-meta">
                    <span className="kanban-step">Step {meta.step} · {meta.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="sidebar-spacer" />

        <div className="agent-pill">
          <span className="agent-dot" />
          Agent running
        </div>

      </aside>

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
          <Background variant={BackgroundVariant.Dots} color="#1B3A6B" gap={28} size={2.5} />
          <Controls className="flow-controls" showInteractive={false} />
          <FlowController nodes={nodes} />
        </ReactFlow>
      </div>

    </div>
  )
}

export default function App() {
  return (
    <IssueProvider>
      <Workspace />
    </IssueProvider>
  )
}
