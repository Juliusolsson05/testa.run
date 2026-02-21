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
  const { activeNodeId } = useIssueContext()

  const { x: vpX, zoom: vpZoom } = useViewport()
  const containerWidth = useStore((s) => s.width)

  const isOutgoing = activeNodeId === source
  const isIncoming = activeNodeId === target
  const isFocused = isOutgoing || isIncoming

  const t = useMemo(() => {
    if (!isFocused || containerWidth === 0) return 0.5
    if (isOutgoing) {
      const rightFlowX = (containerWidth - vpX) / vpZoom
      const midFlowX = (sourceX + rightFlowX) / 2
      return findTForFlowX(sourceX, sourceY, targetX, targetY, midFlowX)
    } else {
      const leftFlowX = -vpX / vpZoom
      const midFlowX = (leftFlowX + targetX) / 2
      return findTForFlowX(sourceX, sourceY, targetX, targetY, midFlowX)
    }
  }, [isFocused, isOutgoing, sourceX, sourceY, targetX, targetY, vpX, vpZoom, containerWidth])

  const [badgeX, badgeY] = bezierPoint(sourceX, sourceY, targetX, targetY, t)
  const badgeAngle = bezierAngle(sourceX, sourceY, targetX, targetY, t)

  const spring = useSpring({
    sx: sourceX,
    sy: sourceY,
    tx: targetX,
    ty: targetY,
    config: { tension: 260, friction: 18, mass: 1 },
  })

  const animatedD = to(
    [spring.sx, spring.sy, spring.tx, spring.ty],
    (sx, sy, tx, ty) =>
      getBezierPath({ sourceX: sx, sourceY: sy, targetX: tx, targetY: ty, sourcePosition, targetPosition })[0]
  )

  const labelTransform = to(
    [spring.sx, spring.sy, spring.tx, spring.ty],
    (sx, sy, tx, ty) =>
      `translate(-50%, -50%) translate(${(sx + tx) / 2}px, ${(sy + ty) / 2}px)`
  )

  const [bgPadX, bgPadY] = Array.isArray(labelBgPadding)
    ? labelBgPadding
    : labelBgPadding !== undefined
      ? [labelBgPadding, labelBgPadding]
      : [6, 8]

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
          <div
            style={{
              position: "absolute",
              width: 28,
              height: 28,
              transform: `translate(-50%, -50%) translate(${badgeX}px, ${badgeY}px)`,
              pointerEvents: "none",
            }}
          >
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
              }}
            >
              <ArrowIcon />
            </div>

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
                }}
              >
                {String(label)}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}

      {label && !isFocused && (
        <EdgeLabelRenderer>
          <animated.div
            style={{
              position: "absolute",
              transform: labelTransform,
              pointerEvents: "none",
              ...(labelBgStyle ?? {}),
              padding: `${bgPadY}px ${bgPadX}px`,
              borderRadius: 6,
            }}
          >
            <span style={labelStyle}>{label}</span>
          </animated.div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
