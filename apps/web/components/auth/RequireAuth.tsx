"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Monitor, ArrowRight } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthProvider"
import { InlineLoading } from "@/components/loading/InlineLoading"
import { OnboardingBackground } from "@/components/onboarding/OnboardingBackground"
import { useAppSelector } from "@/store/hooks"
import { landingHref } from "@/lib/urls"

const DESKTOP_MIN_VIEWPORT_WIDTH = 1024

function shouldEnforceDesktop(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/workspace") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/onboarding")
  )
}

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
  const [desktopAllowed, setDesktopAllowed] = useState(true)

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

  useEffect(() => {
    if (loading || !accessToken) return

    if (!shouldEnforceDesktop(pathname)) {
      setDesktopAllowed(true)
      return
    }

    const checkViewport = () => {
      const width = window.visualViewport?.width ?? window.innerWidth
      setDesktopAllowed(width >= DESKTOP_MIN_VIEWPORT_WIDTH)
    }

    checkViewport()

    window.addEventListener("resize", checkViewport)
    window.visualViewport?.addEventListener("resize", checkViewport)

    return () => {
      window.removeEventListener("resize", checkViewport)
      window.visualViewport?.removeEventListener("resize", checkViewport)
    }
  }, [accessToken, loading, pathname])

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-app-bg">
        <InlineLoading label="Checking session…" cubeSize={64} className="min-h-[60vh]" />
      </div>
    )
  }

  if (!accessToken) return null

  if (!desktopAllowed && shouldEnforceDesktop(pathname)) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-white px-4 py-10">
        <OnboardingBackground />
        <section className="relative w-full max-w-lg rounded-2xl border border-ui-border bg-white p-7 shadow-[0_18px_50px_rgba(29,110,245,0.13)]">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#1d6ef5]">
            <Monitor className="h-3.5 w-3.5" />
            Desktop only
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-[#1a2a33]">Best viewed on a bigger screen</h1>
          <p className="mt-2 text-sm text-ui-muted">
            testa.run workspace is optimized for desktop/laptop right now. Zoom out or use a larger screen.
          </p>

          <Link
            href={landingHref("/")}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded bg-[#1d6ef5] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1559d4]"
          >
            Go to landing page
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    )
  }

  return <>{children}</>
}
