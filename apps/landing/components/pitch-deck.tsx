'use client'

import { useState, useCallback, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Shield, Bug, Zap, FileText, AlertTriangle, Check } from 'lucide-react'

const slides = [
  {
    id: 'stat',
    icon: AlertTriangle,
    topLabel: 'The reality',
    heading: '$3.1 trillion.',
    body: "That's how much businesses lose to bad software every year.",
    source: 'CISQ 2024',
    accent: true,
  },
  {
    id: 'problem',
    icon: Bug,
    topLabel: 'The problem',
    heading: 'You ship fast. But every deploy is a gamble.',
    body: 'Bugs slip through. Security holes go unnoticed. Your users find them before you do.',
  },
  {
    id: 'broken',
    icon: AlertTriangle,
    topLabel: "Why it's still broken",
    heading: 'Manual QA is slow. Test scripts break every sprint.',
    body: "Security testing? That's a separate team, a separate budget, a separate timeline. So most teams just… ship and hope.",
  },
  {
    id: 'whatif',
    icon: Zap,
    topLabel: 'A better way',
    heading: "What if you didn't have to?",
    body: 'Paste a URL. Describe what a user does — "sign up, add to cart, check out." An AI agent opens a real browser and does it for you.',
  },
  {
    id: 'how',
    icon: Shield,
    topLabel: 'What it does',
    heading: 'It clicks through your app. Then breaks it.',
    bullets: [
      'Finds broken flows, dead buttons, failed logins',
      'Probes for auth bypass, exposed data, missing rate limits',
      'Gives you a report — ranked by severity, with screenshots',
    ],
  },
  {
    id: 'value',
    icon: FileText,
    topLabel: 'The result',
    heading: 'QA + Security. One pass. Minutes.',
    bullets: [
      'No scripts to write',
      'No tests to maintain',
      'No separate security audit',
    ],
    subtext: 'Just paste, describe, and get the report.',
  },
  {
    id: 'cta',
    icon: null,
    topLabel: null,
    heading: "Your app has bugs you don't know about yet.",
    body: 'Find out in minutes.',
    cta: true,
  },
]

export default function PitchDeck() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [isAnimating, setIsAnimating] = useState(false)

  const goTo = useCallback(
    (idx: number, dir: 'left' | 'right') => {
      if (isAnimating || idx < 0 || idx >= slides.length) return
      setDirection(dir)
      setIsAnimating(true)
      setTimeout(() => {
        setCurrent(idx)
        setTimeout(() => setIsAnimating(false), 50)
      }, 250)
    },
    [isAnimating],
  )

  const prev = useCallback(() => goTo(current - 1, 'left'), [current, goTo])
  const next = useCallback(() => goTo(current + 1, 'right'), [current, goTo])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  const slide = slides[current]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-8">
        {/* Section heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl tracking-tight text-gray-900">
            Why testa<span className="text-brand">.run</span>?
          </h2>
        </div>

        {/* Deck container */}
        <div className="relative rounded-2xl border border-gray-200 bg-gray-50/50 overflow-hidden shadow-lg shadow-gray-200/50">
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

          {/* Soft radial glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-brand/[0.04] rounded-full blur-[80px] pointer-events-none" />

          {/* Slide content */}
          <div
            className="relative z-10 min-h-[420px] flex flex-col items-center justify-center text-center px-8 md:px-16 py-14 transition-all duration-300 ease-out"
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating
                ? `translateX(${direction === 'right' ? '30px' : '-30px'})`
                : 'translateX(0)',
            }}
          >
            {/* Top label */}
            {slide.topLabel && (
              <div className="flex items-center gap-2 mb-5">
                {slide.icon && (
                  <span className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center">
                    <slide.icon className="w-3.5 h-3.5 text-brand" />
                  </span>
                )}
                <span className="text-[12px] text-gray-400 uppercase tracking-widest">
                  {slide.topLabel}
                </span>
              </div>
            )}

            {/* Heading */}
            <h3
              className={`tracking-tight leading-[1.15] mb-4 max-w-2xl ${
                slide.accent
                  ? 'text-4xl md:text-6xl text-brand'
                  : 'text-2xl md:text-4xl text-gray-900'
              }`}
            >
              {slide.heading}
            </h3>

            {/* Body text */}
            {slide.body && (
              <p className="text-[15px] md:text-[16px] text-gray-500 leading-relaxed max-w-md">
                {slide.body}
              </p>
            )}

            {/* Source citation */}
            {slide.source && (
              <p className="text-[11px] text-gray-300 mt-3 uppercase tracking-wider">
                Source: {slide.source}
              </p>
            )}

            {/* Bullets */}
            {slide.bullets && (
              <ul className="mt-2 space-y-3 text-left max-w-md">
                {slide.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[14px] md:text-[15px] text-gray-600">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {/* Subtext */}
            {slide.subtext && (
              <p className="text-[14px] text-gray-400 mt-5">{slide.subtext}</p>
            )}

            {/* CTA button */}
            {slide.cta && (
              <a
                href="#pricing"
                className="mt-8 inline-flex items-center gap-2 h-12 px-8 rounded-lg bg-primary text-primary-foreground text-[14px] font-medium hover:bg-primary/90 transition-colors"
              >
                Test my site
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Bottom bar: navigation + dots */}
          {/* Navigation — arrows centered vertically on sides, dots at bottom */}
          {/* Left arrow */}
          <button
            onClick={prev}
            disabled={current === 0}
            className="absolute z-20 left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 flex items-center justify-center text-white/90 hover:text-white transition-all disabled:opacity-0 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Right arrow */}
          <button
            onClick={next}
            disabled={current === slides.length - 1}
            className="absolute z-20 right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 flex items-center justify-center text-white/90 hover:text-white transition-all disabled:opacity-0 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Dots at bottom center */}
          <div className="relative z-10 flex items-center justify-center pb-5">
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? 'right' : 'left')}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-6 bg-brand'
                      : 'w-1.5 bg-gray-200 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
