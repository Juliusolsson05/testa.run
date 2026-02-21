'use client'

import { useEffect, useRef, useState } from 'react'

/*
  Autonomous blue cursor that follows the scroll position.
  It moves to predefined waypoints as the user scrolls,
  pointing at key sections of the page.
*/

interface Waypoint {
  scrollPct: number  // 0–1, percentage of total page scroll
  x: number          // viewport % from left
  y: number          // viewport % from top
  label?: string     // optional tooltip
}

const waypoints: Waypoint[] = [
  { scrollPct: 0.00, x: 72, y: 18, label: 'Welcome' },
  { scrollPct: 0.06, x: 58, y: 52, label: 'Try it' },
  { scrollPct: 0.14, x: 70, y: 40 },
  { scrollPct: 0.25, x: 75, y: 35 },
  { scrollPct: 0.35, x: 30, y: 50 },
  { scrollPct: 0.45, x: 68, y: 42, label: 'Check this out' },
  { scrollPct: 0.55, x: 50, y: 38 },
  { scrollPct: 0.65, x: 35, y: 55 },
  { scrollPct: 0.80, x: 55, y: 45, label: 'Pick a plan' },
  { scrollPct: 0.92, x: 58, y: 52, label: 'Try it' },
  { scrollPct: 1.00, x: 72, y: 60 },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function BlueCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string | undefined>(waypoints[0].label)

  useEffect(() => {
    let currentX = waypoints[0].x
    let currentY = waypoints[0].y
    let targetX = currentX
    let targetY = currentY
    let raf: number

    const getScrollPct = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      return docHeight > 0 ? scrollTop / docHeight : 0
    }

    const updateTarget = () => {
      const pct = getScrollPct()

      // Find surrounding waypoints
      let i = 0
      for (; i < waypoints.length - 1; i++) {
        if (pct <= waypoints[i + 1].scrollPct) break
      }
      const a = waypoints[i]
      const b = waypoints[Math.min(i + 1, waypoints.length - 1)]

      const range = b.scrollPct - a.scrollPct
      const t = range > 0 ? (pct - a.scrollPct) / range : 0

      targetX = lerp(a.x, b.x, t)
      targetY = lerp(a.y, b.y, t)

      // Show label from the closer waypoint
      const closest = t < 0.5 ? a : b
      setLabel(closest.label)
    }

    const animate = () => {
      currentX += (targetX - currentX) * 0.06
      currentY += (targetY - currentY) * 0.06

      if (cursorRef.current) {
        const px = (currentX / 100) * window.innerWidth
        const py = (currentY / 100) * window.innerHeight
        cursorRef.current.style.transform = `translate(${px}px, ${py}px)`
      }

      raf = requestAnimationFrame(animate)
    }

    const handleScroll = () => updateTarget()

    updateTarget()
    window.addEventListener('scroll', handleScroll, { passive: true })
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[60]"
      style={{ willChange: 'transform' }}
    >
      {/* Cursor */}
      <svg width="28" height="32" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 1L1 20L6 15.5L10 24L14 22.5L10 14L17 14L1 1Z"
          fill="#1d6ef5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Label bubble */}
      {label && (
        <div
          ref={labelRef}
          className="absolute left-7 top-0 bg-brand text-white text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap shadow-md transition-opacity duration-300"
        >
          {label}
        </div>
      )}

      {/* Subtle pulse ring */}
      <div className="absolute -top-2 -left-2 w-10 h-10 rounded-full border border-brand/30 animate-ping" />
    </div>
  )
}
