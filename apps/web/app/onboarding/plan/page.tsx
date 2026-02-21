"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { createCheckoutSession } from "@/store/billing-thunks"
import { setOnboardingState } from "@/store/onboarding-slice"

export default function OnboardingPlanPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const orgId = useAppSelector((s) => s.workspace.activeOrgId)
  const checkoutStatus = useAppSelector((s) => s.billing.checkoutStatus)
  const [priceId, setPriceId] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function startCheckout() {
    if (!orgId || !priceId) return
    setError(null)

    const action = await dispatch(createCheckoutSession({ orgId, priceId }))
    if (createCheckoutSession.fulfilled.match(action)) {
      window.location.href = action.payload
      return
    }

    setError("Could not create checkout session")
  }

  function continueStarter() {
    dispatch(setOnboardingState({ stage: "done", needsPlan: false, blockReason: "none" }))
    router.replace("/")
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-app-bg px-4">
      <div className="w-full max-w-md rounded-lg border border-ui-border bg-white p-6">
        <h1 className="text-2xl font-semibold text-[#1a2a33]">Choose plan</h1>
        <p className="mt-1 text-sm text-ui-muted">You can stay on Starter or continue to Stripe checkout for Pro.</p>

        <label className="mt-6 block text-sm font-medium text-[#1a2a33]">Pro priceId</label>
        <input
          className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm"
          value={priceId}
          onChange={(e) => setPriceId(e.target.value)}
          placeholder="price_..."
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={startCheckout}
          disabled={!orgId || !priceId || checkoutStatus === "creating"}
          className="mt-6 w-full rounded bg-[#1d6ef5] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {checkoutStatus === "creating" ? "Preparing checkout..." : "Continue to Stripe"}
        </button>

        <button
          onClick={continueStarter}
          className="mt-2 w-full rounded border border-ui-border px-3 py-2 text-sm font-semibold text-[#1a2a33]"
        >
          Continue with Starter
        </button>
      </div>
    </main>
  )
}
