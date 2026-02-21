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
    <svg width="15" height="9" viewBox="0 0 20 12" fill="none" style={{ display: "block" }}>
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
    const srcScreenX = sourceX * vpZoom + vpX
    const srcScreenY = sourceY * vpZoom + vpY
    const tgtScreenX = targetX * vpZoom + vpX
    const tgtScreenY = targetY * vpZoom + vpY

    const onScreen = (sx: number, sy: number) =>
      sx >= 0 && sx <= containerWidth && sy >= 0 && sy <= containerHeight

    // Both handles visible → simply centre on the bezier midpoint
    if (onScreen(srcScreenX, srcScreenY) && onScreen(tgtScreenX, tgtScreenY)) return 0.5

    if (isOutgoing) {
      // Right edge of canvas in flow coordinates
      const rightFlowX = (containerWidth - vpX) / vpZoom
      const midFlowX = (sourceX + rightFlowX) / 2
      return findTForFlowX(sourceX, sourceY, targetX, targetY, midFlowX)
    } else {
      // Left edge of canvas in flow coordinates
      const leftFlowX = -vpX / vpZoom
      const midFlowX = (leftFlowX + targetX) / 2
      return findTForFlowX(sourceX, sourceY, targetX, targetY, midFlowX)
    }
  }, [isFocused, isOutgoing, sourceX, sourceY, targetX, targetY, vpX, vpY, vpZoom, containerWidth, containerHeight])

  const [badgeX, badgeY] = bezierPoint(sourceX, sourceY, targetX, targetY, t)
  // Incoming edges point back (←), so flip 180°
  const badgeAngle = bezierAngle(sourceX, sourceY, targetX, targetY, t) + (isIncoming ? 180 : 0)
  // Clicking navigates to the other end of the edge
  const navigateTo = isOutgoing ? target : source

  const spring = useSpring({
    sx: sourceX,
    sy: sourceY,
    tx: targetX,
    ty: targetY,
    config: { tension: 260, friction: 18, mass: 1 },
  })

  const animatedD = to(
    [spring.sx, spring.sy, spring.tx, spring.ty],
    (sx: number, sy: number, tx: number, ty: number) =>
      getBezierPath({ sourceX: sx, sourceY: sy, targetX: tx, targetY: ty, sourcePosition, targetPosition })[0]
  )

  const labelX = (sourceX + targetX) / 2
  const labelY = (sourceY + targetY) / 2
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
            onClick={() => selectNode(navigateTo)}
            className="nodrag nopan"
            style={{
              position: "absolute",
              width: 28,
              height: 28,
              transform: `translate(-50%, -50%) translate(${badgeX}px, ${badgeY}px)`,
              pointerEvents: "all",
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            {/* Circle rotated to match the edge tangent (180° flip for back-step) */}
            <div
              style={{
                transform: `rotate(${badgeAngle}deg)`,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#1d6ef5",
                boxShadow: "0 0 0 2.5px #fff, 0 0 10px rgba(29,110,245,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
            >
              <ArrowIcon />
            </div>

            {/* Label floats below the circle; absolutely positioned so it can't shift the circle */}
            {label && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 7px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                  background: "rgba(255,255,255,0.93)",
                  border: "1px solid rgba(29,110,245,0.22)",
                  borderRadius: 4,
                  padding: "3px 8px",
                  color: "#1D4ED8",
                  fontSize: 11,
                  fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
                  boxShadow: "0 1px 4px rgba(29,110,245,0.1)",
                  pointerEvents: "none",
                }}
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
            <span style={labelStyle as React.CSSProperties}>{label as string}</span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
