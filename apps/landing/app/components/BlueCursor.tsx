'use client'

import { useEffect, useRef } from 'react'

export function BlueCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cursorRef.current
    if (!el) return

    // Target position (where cursor wants to be)
    let targetX = typeof window !== 'undefined' ? window.innerWidth * 0.75 : 800
    let targetY = 300
    // Current rendered position
    let currentX = targetX
    let currentY = targetY

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX + 30
      targetY = e.clientY + 30
    }

    const handleScroll = () => {
      // Subtle vertical offset on scroll to make it feel alive
      targetY += 0.5
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })

    let raf: number
    const animate = () => {
      // Smooth lerp — the cursor lazily follows
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08

      el.style.transform = `translate(${currentX}px, ${currentY}px)`
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-50"
      style={{ willChange: 'transform' }}
    >
      <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 1L1 20L6 15.5L10 24L14 22.5L10 14L17 14L1 1Z"
          fill="#1d6ef5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
