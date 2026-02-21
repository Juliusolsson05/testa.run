import { useState, useEffect } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { useIssueContext } from '../context/IssueContext'
import { issues } from '../data/issues'

export type ScreenshotNodeData = {
  label: string
  url: string
  status: 'passed' | 'running' | 'pending'
  step: number
  imageSrc?: string
  duration?: string
  isMain?: boolean
  isLarge?: boolean
  sourceHandleOffset?: { top: string; left: string }
}

const statusConfig = {
  passed:  { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   label: '✓ Passed' },
  running: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  label: '⟳ Running' },
  pending: { color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  label: '◦ Pending' },
}

export function ScreenshotNode({ id, data, selected }: NodeProps) {
  const nodeData = data as ScreenshotNodeData
  const status   = statusConfig[nodeData.status]

  const { activeIssueId, activeNodeId, selectIssue, clearSelection } = useIssueContext()

  const nodeIssues = issues.filter(i => i.nodeId === id)
  const openCount  = nodeIssues.filter(i => i.status === 'open').length

  const isContextActive = activeNodeId === id
  const [localOpen, setLocalOpen] = useState(false)
  const panelOpen = localOpen || isContextActive

  // Close this node's panel when another node is targeted
  useEffect(() => {
    if (activeNodeId !== null && activeNodeId !== id) setLocalOpen(false)
  }, [activeNodeId, id])

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    if (isContextActive) {
      clearSelection()
      setLocalOpen(false)
    } else {
      setLocalOpen(v => !v)
    }
  }

  function handleIssueClick(e: React.MouseEvent, issueId: string) {
    e.stopPropagation()
    selectIssue(issueId)
  }

  return (
    <div
      className={[
        'screenshot-node',
        selected          ? 'selected'    : '',
        `status-${nodeData.status}`,
        nodeData.isMain   ? 'main-node'   : '',
        nodeData.isLarge  ? 'large-node'  : '',
        isContextActive   ? 'node-active' : '',
      ].filter(Boolean).join(' ')}
    >
      <Handle type="target" position={Position.Left} className="flow-handle" />

      {/* Browser chrome */}
      <div className="browser-chrome">
        <div className="browser-url">{nodeData.url.replace(/^https?:\/\/[^/]+/, '') || '/'}</div>
        <div className="browser-step">
          <span className="step-badge">Step {nodeData.step}</span>
        </div>
      </div>

      {/* Screenshot */}
      <div className="screenshot-area">
        {nodeData.imageSrc ? (
          <img src={nodeData.imageSrc} alt={nodeData.label} className="screenshot-img" />
        ) : (
          <div className="screenshot-placeholder">
            <div className="placeholder-icon">🖼</div>
            <span>Screenshot pending</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="node-footer">
        <div className="node-label">{nodeData.label}</div>
        <div
          className="status-badge"
          style={{ color: status.color, background: status.bg, borderColor: status.color + '40' }}
        >
          {status.label}
          {nodeData.duration && <span className="duration"> · {nodeData.duration}</span>}
        </div>
      </div>

      {/* Issues toggle bar */}
      {nodeIssues.length > 0 && (
        <button
          className={`issues-toggle-bar ${panelOpen ? 'open' : ''} ${openCount > 0 ? 'has-open' : ''}`}
          onClick={handleToggle}
        >
          <span className="issues-toggle-label">
            {openCount > 0 ? `${openCount} issue${openCount > 1 ? 's' : ''}` : 'Issues'}
          </span>
          <span className={`issues-toggle-badge ${openCount > 0 ? 'error' : 'resolved'}`}>
            {openCount > 0 ? openCount : '✓'}
          </span>
          <span className="issues-toggle-chevron">{panelOpen ? '▲' : '▼'}</span>
        </button>
      )}

      {/* Issues dropdown */}
      {panelOpen && (
        <div className="issues-dropdown">
          {nodeIssues.map(issue => (
            <button
              key={issue.id}
              className={[
                'issue-row',
                `issue-row--${issue.severity}`,
                `issue-row--${issue.status}`,
                activeIssueId === issue.id ? 'issue-row--active' : '',
              ].filter(Boolean).join(' ')}
              onClick={e => handleIssueClick(e, issue.id)}
            >
              <span className={`issue-severity-dot sev-${issue.severity}`} />
              <div className="issue-row-body">
                <div className="issue-row-title">{issue.title}</div>
                <div className="issue-row-element">{issue.element}</div>
              </div>
              <span className={`issue-status-pill ${issue.status}`}>
                {issue.status === 'open' ? 'Open' : '✓'}
              </span>
            </button>
          ))}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="flow-handle"
        style={nodeData.sourceHandleOffset ? {
          top:       nodeData.sourceHandleOffset.top,
          left:      nodeData.sourceHandleOffset.left,
          right:     'auto',
          transform: 'translate(-50%, -50%)',
        } : undefined}
      />
    </div>
  )
}
