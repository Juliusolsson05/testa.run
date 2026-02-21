'use client'

import { useEffect, useRef, useState } from 'react'

/*
  Blue dot indicator that snaps to key elements on the page
  as the user scrolls. Not a cursor — more like a spotlight
  that draws attention to important parts.
*/

const targets = [
  { selector: '[data-spot="cta-input"]', label: 'Try it' },
  { selector: '[data-spot="platform"]', label: 'How it works' },
  { selector: '[data-spot="steps"]', label: 'Three steps' },
  { selector: '[data-spot="pricing"]', label: 'Pick a plan' },
  { selector: '[data-spot="bottom-cta"]', label: 'Get started' },
]

export function BlueCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0
    let raf: number
    let activeIdx = -1

    const findActive = () => {
      const viewportMid = window.innerHeight * 0.5

      for (let i = targets.length - 1; i >= 0; i--) {
        const el = document.querySelector(targets[i].selector)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top < viewportMid + 100) {
          if (i !== activeIdx) {
            activeIdx = i
            const spotEl = el as HTMLElement
            // Position to the right of the element
            targetX = rect.right + 16
            targetY = rect.top + rect.height / 2
            setLabel(targets[i].label)
            setVisible(true)
          } else {
            // Update position as element scrolls
            const rect2 = el.getBoundingClientRect()
            targetX = rect2.right + 16
            targetY = rect2.top + rect2.height / 2
          }
          return
        }
      }
      setVisible(false)
    }

    const animate = () => {
      // Snappy lerp — fast snap, not slow drift
      currentX += (targetX - currentX) * 0.15
      currentY += (targetY - currentY) * 0.15

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`
      }

      raf = requestAnimationFrame(animate)
    }

    const handleScroll = () => findActive()

    // Initial
    setTimeout(findActive, 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      className={`pointer-events-none fixed top-0 left-0 z-[60] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ willChange: 'transform' }}
    >
      {/* Dot */}
      <div className="w-3 h-3 rounded-full bg-brand shadow-[0_0_12px_rgba(29,110,245,0.5)]" />

      {/* Label */}
      {label && (
        <div className="absolute left-5 -top-1 bg-brand text-white text-[11px] px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
          {label}
        </div>
      )}
    </div>
  )
}
