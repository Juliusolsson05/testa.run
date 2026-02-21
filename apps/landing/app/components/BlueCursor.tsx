'use client'

import { useEffect, useRef, useState } from 'react'

const targets = [
  { selector: '[data-spot="cta-input"]', label: 'Try it' },
  { selector: '[data-spot="platform"]', label: 'Platform' },
  { selector: '[data-spot="steps"]', label: 'Three steps' },
  { selector: '[data-spot="pricing"]', label: 'Pricing' },
  { selector: '[data-spot="bottom-cta"]', label: 'Get started' },
]

export function BlueCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let currentX = window.innerWidth * 0.7
    let currentY = window.innerHeight * 0.35
    let targetX = currentX
    let targetY = currentY
    let raf: number

    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

    const updateTarget = () => {
      const centerY = window.innerHeight * 0.48

      let best: { idx: number; rect: DOMRect; distance: number } | null = null

      targets.forEach((t, idx) => {
        const el = document.querySelector(t.selector)
        if (!el) return
        const rect = el.getBoundingClientRect()

        // Skip if section is way outside viewport
        if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return

        const rectCenter = rect.top + rect.height / 2
        const distance = Math.abs(rectCenter - centerY)

        if (!best || distance < best.distance) best = { idx, rect, distance }
      })

      if (!best) {
        setVisible(false)
        return
      }

      const { idx, rect } = best

      // Position near right edge of active section, clamped to viewport so it never disappears.
      const x = clamp(rect.right + 14, 14, window.innerWidth - 44)
      const y = clamp(rect.top + rect.height / 2, 20, window.innerHeight - 20)

      targetX = x
      targetY = y
      setLabel(targets[idx].label)
      setVisible(true)
    }

    const animate = () => {
      // Snappy movement
      currentX += (targetX - currentX) * 0.2
      currentY += (targetY - currentY) * 0.2

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`
      }

      raf = requestAnimationFrame(animate)
    }

    const onScroll = () => updateTarget()
    const onResize = () => updateTarget()

    updateTarget()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      className={`pointer-events-none fixed top-0 left-0 z-[60] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ willChange: 'transform' }}
    >
      <div className="w-3 h-3 rounded-full bg-brand shadow-[0_0_12px_rgba(29,110,245,0.6)]" />
      {label && (
        <div className="absolute left-5 -top-1 bg-brand text-white text-[11px] px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
          {label}
        </div>
      )}
    </div>
  )
}
