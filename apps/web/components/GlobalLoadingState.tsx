"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useAppSelector } from "@/store/hooks"

const MIN_VISIBLE_MS = 250

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
      <div className="h-0.5 w-full animate-pulse bg-[#1d6ef5]" />
      <div className="absolute right-4 top-3 rounded bg-[#1a2a33] px-2 py-1 text-[11px] font-semibold text-white shadow">
        Loading…
      </div>
    </div>
  )
}
