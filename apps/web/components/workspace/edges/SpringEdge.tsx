"use client"

import { useMemo } from "react"
import { useSpring, animated, to } from "@react-spring/web"
import {
  EdgeLabelRenderer,
  getBezierPath,
  useViewport,
  useStore,
  type EdgeProps,
} from "@xyflow/react"
import { useIssueContext } from "@/context/issue-context"
import { useWorkspaceData } from "@/context/workspace-data-context"

// Control points match React Flow's getBezierPath: both CPs sit at midX (0.5 × distance)
function bezierPoint(sx: number, sy: number, tx: number, ty: number, t: number): [number, number] {
  const midX = (sx + tx) / 2
  const mt = 1 - t
  const x = mt*mt*mt*sx + 3*mt*mt*t*midX + 3*mt*t*t*midX + t*t*t*tx
  const y = mt*mt*mt*sy + 3*mt*mt*t*sy   + 3*mt*t*t*ty   + t*t*t*ty
  return [x, y]
}

function bezierAngle(sx: number, sy: number, tx: number, ty: number, t: number): number {
  const midX = (sx + tx) / 2
  const mt = 1 - t
  const dx = 3*mt*mt*(midX - sx) + 3*t*t*(tx - midX)
  const dy = 6*mt*t*(ty - sy)
  return Math.atan2(dy, dx) * (180 / Math.PI)
}

// Binary search: find t where bezier x ≈ targetFlowX
function findTForFlowX(sx: number, sy: number, tx: number, ty: number, targetFlowX: number): number {
  const goingRight = tx >= sx
  let lo = 0, hi = 1
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    const [px] = bezierPoint(sx, sy, tx, ty, mid)
    if (goingRight ? px < targetFlowX : px > targetFlowX) lo = mid
    else hi = mid
  }
  return Math.max(0.05, Math.min(0.95, (lo + hi) / 2))
}

function ArrowIcon() {
  return (
    <svg width="15" height="9" viewBox="0 0 20 12" fill="none" className="block">
      <path d="M 0 4.5 L 12 4.5 L 12 2 L 20 6 L 12 10 L 12 7.5 L 0 7.5 Z" fill="white" />
    </svg>
  )
}

export function SpringEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  label,
  labelStyle,
  labelBgStyle,
  labelBgPadding,
}: EdgeProps) {
  const { activeNodeId, selectNode } = useIssueContext()
  const { nodes, edges } = useWorkspaceData()
  const nodesById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes])
  const hasReverseEdge = useMemo(
    () => edges.some((e) => e.source === target && e.target === source && e.id !== id),
    [edges, id, source, target]
  )

  const laneOffset = hasReverseEdge ? (source < target ? -18 : 18) : 0
  const sx = sourceX
  const sy = sourceY + laneOffset
  const tx = targetX
  const ty = targetY + laneOffset

  // Reactive viewport: x/y = canvas pan offset in px, zoom = scale
  const { x: vpX, y: vpY, zoom: vpZoom } = useViewport()
  // Dimensions of the ReactFlow container element in px
  const containerWidth  = useStore((s) => s.width)
  const containerHeight = useStore((s) => s.height)

  const isOutgoing = activeNodeId === source
  const isIncoming = activeNodeId === target
  const isFocused = isOutgoing || isIncoming

  // Recompute t whenever the viewport pans/zooms so the badge stays visually centred
  const t = useMemo(() => {
    if (!isFocused || containerWidth === 0) return 0.5

    // Convert flow-space handle positions to screen pixels
    const srcScreenX = sx * vpZoom + vpX
    const srcScreenY = sy * vpZoom + vpY
    const tgtScreenX = tx * vpZoom + vpX
    const tgtScreenY = ty * vpZoom + vpY

    const onScreen = (sx: number, sy: number) =>
      sx >= 0 && sx <= containerWidth && sy >= 0 && sy <= containerHeight

    // Both handles visible → simply centre on the bezier midpoint
    if (onScreen(srcScreenX, srcScreenY) && onScreen(tgtScreenX, tgtScreenY)) return 0.5

    if (isOutgoing) {
      // Right edge of canvas in flow coordinates
      const rightFlowX = (containerWidth - vpX) / vpZoom
      const midFlowX = (sx + rightFlowX) / 2
      return findTForFlowX(sx, sy, tx, ty, midFlowX)
    } else {
      // Left edge of canvas in flow coordinates
      const leftFlowX = -vpX / vpZoom
      const midFlowX = (leftFlowX + tx) / 2
      return findTForFlowX(sx, sy, tx, ty, midFlowX)
    }
  }, [isFocused, isOutgoing, sx, sy, tx, ty, vpX, vpY, vpZoom, containerWidth, containerHeight])

  const [badgeX, badgeY] = bezierPoint(sx, sy, tx, ty, t)
  // Incoming edges point back (←), so flip 180°
  const badgeAngle = bezierAngle(sx, sy, tx, ty, t) + (isIncoming ? 180 : 0)
  // Clicking navigates to the other end of the edge
  const navigateTo = isOutgoing ? target : source
  const navigateLabel = nodesById[navigateTo]?.data.label ?? "node"

  const spring = useSpring({
    sx: sx,
    sy: sy,
    tx: tx,
    ty: ty,
    config: { tension: 260, friction: 18, mass: 1 },
  })

  const animatedD = to(
    [spring.sx, spring.sy, spring.tx, spring.ty],
    (sx: number, sy: number, tx: number, ty: number) =>
      getBezierPath({ sourceX: sx, sourceY: sy, targetX: tx, targetY: ty, sourcePosition, targetPosition })[0]
  )

  const labelX = (sx + tx) / 2
  const labelY = (sy + ty) / 2
  const [bgPadX, bgPadY] = (labelBgPadding as [number, number]) ?? [6, 8]

  return (
    <>
      <animated.path
        id={id}
        className="react-flow__edge-path react-flow__edge-path--animated"
        d={animatedD}
        style={style}
        fill="none"
      />

      {isFocused && (
        <EdgeLabelRenderer>
          {/*
            Outer div: exactly 28×28 (the circle size).
            translate(-50%,-50%) centers it pixel-perfectly on the bezier point.
            Nothing inside affects this centering — label is absolutely positioned.
          */}
          <button
            type="button"
            aria-label={`Focus ${navigateLabel}`}
            onClick={(e) => { e.stopPropagation(); selectNode(navigateTo) }}
            onMouseDown={(e) => e.stopPropagation()}
            className="nodrag nopan absolute h-7 w-7 cursor-pointer border-none bg-transparent p-0"
            style={{
              transform: `translate(-50%, -50%) translate(${badgeX}px, ${badgeY}px)`,
              pointerEvents: "all",
              zIndex: 1000,
            }}
          >
            {/* Circle rotated to match the edge tangent (180° flip for back-step) */}
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full bg-brand shadow-[0_0_0_2.5px_#fff,0_0_10px_rgba(29,110,245,0.45)] transition-[transform,box-shadow] duration-150"
              style={{
                transform: `rotate(${badgeAngle}deg)`,
              }}
            >
              <ArrowIcon />
            </div>

            {/* Label floats below the circle; absolutely positioned so it can't shift the circle */}
            {label && (
              <div
                className="pointer-events-none absolute left-1/2 top-[calc(100%+7px)] -translate-x-1/2 rounded border border-[rgba(29,110,245,0.22)] bg-white/95 px-2 py-0.5 font-mono text-[11px] text-[#1D4ED8] shadow-[0_1px_4px_rgba(29,110,245,0.1)] max-w-[260px] truncate"
              >
                {String(label)}
              </div>
            )}
          </button>
        </EdgeLabelRenderer>
      )}

      {/* Default midpoint label — only shown when not in focus mode */}
      {label && !isFocused && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "none",
              ...(labelBgStyle as React.CSSProperties),
              padding: `${bgPadY}px ${bgPadX}px`,
              borderRadius: 6,
            }}
          >
            <span className="block max-w-[260px] truncate" style={labelStyle as React.CSSProperties}>{label as string}</span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
