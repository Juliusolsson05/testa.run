"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthProvider"
import { useAppSelector } from "@/store/hooks"

function onboardingPath(stage: string) {
  if (stage === "create-org") return "/onboarding/org"
  if (stage === "create-project") return "/onboarding/project"
  if (stage === "select-plan" || stage === "checkout") return "/onboarding/plan"
  return null
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { loading, accessToken } = useAuth()
  const stage = useAppSelector((s) => s.onboarding.stage)

  useEffect(() => {
    if (loading) return

    if (!accessToken) {
      const next = encodeURIComponent(pathname || "/")
      router.replace(`/sign-in?next=${next}`)
      return
    }

    const redirect = onboardingPath(stage)
    const isOnboardingRoute = pathname.startsWith("/onboarding")

    if (redirect && !isOnboardingRoute) {
      router.replace(redirect)
      return
    }

    if (stage === "done" && isOnboardingRoute) {
      router.replace("/")
    }
  }, [accessToken, loading, pathname, router, stage])

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-app-bg text-ui-muted">
        Checking session…
      </div>
    )
  }

  if (!accessToken) return null

  return <>{children}</>
}
