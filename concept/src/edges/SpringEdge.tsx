import { useSpring, animated, to } from '@react-spring/web'
import { getBezierPath, EdgeLabelRenderer, type EdgeProps } from '@xyflow/react'

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
        sourceX: sx as number,
        sourceY: sy as number,
        targetX: tx as number,
        targetY: ty as number,
        sourcePosition,
        targetPosition,
      })[0],
  )

  // Static midpoint for the label (close enough, avoids complex path math)
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

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'none',
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
