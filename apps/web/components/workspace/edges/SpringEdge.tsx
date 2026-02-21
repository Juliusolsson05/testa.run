"use client"

import { useSpring, animated, to } from "@react-spring/web"
import { EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react"

export function SpringEdge({
  id,
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
      getBezierPath({
        sourceX: sx,
        sourceY: sy,
        targetX: tx,
        targetY: ty,
        sourcePosition,
        targetPosition,
      })[0]
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

      {label && (
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
            <span style={labelStyle}>{label as string}</span>
          </animated.div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
