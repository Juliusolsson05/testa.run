"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthProvider"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { loading, accessToken } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!accessToken) {
      const next = encodeURIComponent(pathname || "/")
      router.replace(`/sign-in?next=${next}`)
      return
    }

    void fetch("/api/auth/sync-user", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    })
  }, [accessToken, loading, pathname, router])

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-app-bg text-ui-muted">
        Checking session…
      </div>
    )
  }

  if (!accessToken) {
    return null
  }

  return <>{children}</>
}
