import { Handle, Position, type NodeProps } from '@xyflow/react'

export type ScreenshotNodeData = {
  label: string
  url: string
  status: 'passed' | 'running' | 'pending'
  step: number
  imageSrc?: string
  duration?: string
}

const statusConfig = {
  passed: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', label: '✓ Passed' },
  running: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: '⟳ Running' },
  pending: { color: '#6366f1', bg: 'rgba(99,102,241,0.12)', label: '◦ Pending' },
}

export function ScreenshotNode({ data, selected }: NodeProps) {
  const nodeData = data as ScreenshotNodeData
  const status = statusConfig[nodeData.status]

  return (
    <div
      className={`screenshot-node ${selected ? 'selected' : ''} status-${nodeData.status}`}
    >
      {/* Top handle (target) */}
      <Handle type="target" position={Position.Left} className="flow-handle" />

      {/* Browser chrome bar */}
      <div className="browser-chrome">
        <div className="browser-url">{nodeData.url.replace(/^https?:\/\/[^/]+/, '') || '/'}</div>
        <div className="browser-step">
          <span className="step-badge">Step {nodeData.step}</span>
        </div>
      </div>

      {/* Screenshot area */}
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

      {/* Bottom handle (source) */}
      <Handle type="source" position={Position.Right} className="flow-handle" />
    </div>
  )
}
