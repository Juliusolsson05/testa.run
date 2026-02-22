"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { createCheckoutSession } from "@/store/billing-thunks"
import { bootstrapAppContext } from "@/store/app-thunks"
import { OnboardingBackground } from "@/components/onboarding/OnboardingBackground"

const proFeatures = [
  "Unlimited test runs",
  "More user journeys",
  "Security scanning included",
  "Priority support",
]

export default function OnboardingPlanPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const orgId = useAppSelector((s) => s.workspace.activeOrgId)
  const checkoutStatus = useAppSelector((s) => s.billing.checkoutStatus)
  const [error, setError] = useState<string | null>(null)

  async function startCheckout() {
    if (!orgId) return
    setError(null)

    const action = await dispatch(createCheckoutSession({ orgId }))
    if (createCheckoutSession.fulfilled.match(action)) {
      window.location.href = action.payload
      return
    }

    setError("Could not start checkout. Please try again.")
  }

  async function continueStarter() {
    await dispatch(bootstrapAppContext())
    router.replace("/")
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-white px-4 py-12">
      <OnboardingBackground />

      <div className="relative w-full max-w-lg rounded-2xl border border-ui-border bg-white p-7 shadow-[0_18px_50px_rgba(29,110,245,0.13)]">
        <div className="mb-3 inline-flex rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#1d6ef5]">
          Project created 🎉
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-[#1a2a33]">Unlock Pro for faster testing</h1>
        <p className="mt-2 text-sm text-ui-muted">
          You’re ready to go on Starter. Upgrade now if you want higher limits and full security coverage from day one.
        </p>

        <div className="mt-6 rounded-xl border border-[#bfdbfe] bg-[#f8fbff] p-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1a2a33]">Pro plan</p>
              <p className="text-xs text-ui-muted">Most popular for teams shipping weekly</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#1a2a33]">$29</p>
              <p className="text-xs text-ui-muted">per month</p>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {proFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-[#1a2a33]">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#dbeafe] text-[#1d6ef5]">
                  <Check className="h-3 w-3" />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          onClick={startCheckout}
          disabled={!orgId || checkoutStatus === "creating"}
          className="mt-6 w-full rounded bg-[#1d6ef5] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1559d4] disabled:opacity-60"
        >
          {checkoutStatus === "creating" ? "Preparing checkout..." : "Start Pro trial"}
        </button>

        <button
          onClick={continueStarter}
          className="mt-2 w-full rounded border border-ui-border px-3 py-2.5 text-sm font-semibold text-[#1a2a33]"
        >
          Continue with Starter
        </button>
      </div>
    </main>
  )
}
