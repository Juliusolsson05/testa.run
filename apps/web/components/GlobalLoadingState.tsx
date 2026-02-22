"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useAppSelector } from "@/store/hooks"

const MIN_VISIBLE_MS = 250

function BlueCube({ size = 26 }: { size?: number }) {
  const half = size / 2

  return (
    <div
      style={{ width: size * 2, height: size * 2, display: "flex", alignItems: "center", justifyContent: "center" }}
      aria-hidden
    >
      <style>{`
        .gc-scene {
          perspective: 400px;
          position: relative;
        }
        .gc-body {
          width: ${size}px;
          height: ${size}px;
          position: relative;
          transform-style: preserve-3d;
          animation: gc-spin 1.6s cubic-bezier(.4,0,.2,1) infinite;
        }
        @keyframes gc-spin {
          0%   { transform: translateY(0) rotateX(-30deg) rotateY(0deg); }
          15%  { transform: translateY(-14px) rotateX(-30deg) rotateY(90deg); }
          30%  { transform: translateY(0) rotateX(-30deg) rotateY(180deg); }
          50%  { transform: translateY(0) rotateX(-30deg) rotateY(180deg); }
          65%  { transform: translateY(-14px) rotateX(-30deg) rotateY(270deg); }
          80%  { transform: translateY(0) rotateX(-30deg) rotateY(360deg); }
          100% { transform: translateY(0) rotateX(-30deg) rotateY(360deg); }
        }
        .gc-face {
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 3px;
        }
        .gc-front  { background: #1d6ef5; transform: translateZ(${half}px); }
        .gc-back   { background: #144fb3; transform: rotateY(180deg) translateZ(${half}px); }
        .gc-right  { background: #185fd3; transform: rotateY(90deg) translateZ(${half}px); }
        .gc-left   { background: #3b82f6; transform: rotateY(-90deg) translateZ(${half}px); }
        .gc-top    { background: #60a5fa; transform: rotateX(90deg) translateZ(${half}px); }
        .gc-bottom { background: #0b3b8f; transform: rotateX(-90deg) translateZ(${half}px); }
        .gc-shadow {
          width: ${size}px;
          height: 6px;
          background: radial-gradient(ellipse, rgba(29,110,245,0.35), transparent 70%);
          border-radius: 50%;
          position: absolute;
          bottom: -12px;
          left: 0;
          animation: gc-shadow 1.6s cubic-bezier(.4,0,.2,1) infinite;
        }
        @keyframes gc-shadow {
          0%, 30%, 50%, 80%, 100% { transform: scaleX(1); opacity: 0.5; }
          15%, 65% { transform: scaleX(0.65); opacity: 0.25; }
        }
      `}</style>
      <div className="gc-scene">
        <div className="gc-body">
          <div className="gc-face gc-front" />
          <div className="gc-face gc-back" />
          <div className="gc-face gc-right" />
          <div className="gc-face gc-left" />
          <div className="gc-face gc-top" />
          <div className="gc-face gc-bottom" />
        </div>
        <div className="gc-shadow" />
      </div>
    </div>
  )
}

export function GlobalLoadingState() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const authLoading = useAppSelector((s) => s.auth.loading)
  const authSyncing = useAppSelector((s) => s.auth.syncStatus === "syncing")
  const onboardingChecking = useAppSelector((s) => s.onboarding.stage === "check-auth")

  const [pendingRequests, setPendingRequests] = useState(0)
  const [routeChanging, setRouteChanging] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const originalFetch = window.fetch.bind(window)

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      setPendingRequests((n) => n + 1)
      try {
        return await originalFetch(...args)
      } finally {
        setPendingRequests((n) => Math.max(0, n - 1))
      }
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  useEffect(() => {
    setRouteChanging(true)
    const t = setTimeout(() => setRouteChanging(false), 220)
    return () => clearTimeout(t)
  }, [pathname, searchParams])

  const shouldShow = useMemo(() => {
    return authLoading || authSyncing || onboardingChecking || routeChanging || pendingRequests > 0
  }, [authLoading, authSyncing, onboardingChecking, routeChanging, pendingRequests])

  useEffect(() => {
    if (shouldShow) {
      setVisible(true)
      return
    }

    const t = setTimeout(() => setVisible(false), MIN_VISIBLE_MS)
    return () => clearTimeout(t)
  }, [shouldShow])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <div className="absolute right-4 top-3 rounded-md border border-ui-border bg-white/90 p-2 shadow-sm backdrop-blur-sm">
        <BlueCube size={22} />
      </div>
    </div>
  )
}
