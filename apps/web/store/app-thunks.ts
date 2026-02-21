import { createAsyncThunk } from "@reduxjs/toolkit"
import { setOnboardingState } from "@/store/onboarding-slice"
import { setActiveOrgId, setActiveProjectId } from "@/store/workspace-slice"
import { setBilling } from "@/store/billing-slice"
import type { RootState } from "@/store"

type AuthMeResponse = {
  orgs: Array<{
    id: string
    projects: Array<{ id: string }>
    plan: "starter" | "pro"
    billingStatus: "inactive" | "trialing" | "active" | "past_due" | "canceled" | "unpaid"
  }>
}

export const bootstrapAppContext = createAsyncThunk<void, void, { state: RootState }>(
  "app/bootstrap",
  async (_, { getState, dispatch }) => {
    const token = getState().auth.accessToken

    if (!token) {
      dispatch(setOnboardingState({ stage: "sign-in", blockReason: "none" }))
      return
    }

    const headers = { Authorization: `Bearer ${token}` }

    const meRes = await fetch("/api/auth/me", { headers, cache: "no-store" })
    if (!meRes.ok) {
      dispatch(setOnboardingState({ stage: "sync-user" }))
      return
    }

    const me = (await meRes.json()) as AuthMeResponse
    const org = me.orgs[0]

    if (!org) {
      dispatch(setOnboardingState({ stage: "create-org", needsOrg: true, blockReason: "no_org" }))
      return
    }

    dispatch(setActiveOrgId(org.id))

    const project = org.projects[0]
    if (!project) {
      dispatch(setOnboardingState({ stage: "create-project", needsProject: true, blockReason: "no_project" }))
      return
    }

    dispatch(setActiveProjectId(project.id))

    const billingRes = await fetch(`/api/billing?orgId=${org.id}`, { headers, cache: "no-store" })
    if (billingRes.ok) {
      const b = await billingRes.json()
      dispatch(setBilling({ plan: b.billing.plan, status: b.billing.status }))

      const paymentBlocked = b.billing.status === "past_due" || b.billing.status === "unpaid"
      if (paymentBlocked) {
        dispatch(setOnboardingState({ stage: "select-plan", needsPlan: true, blockReason: "plan_required" }))
        return
      }
    }

    dispatch(setOnboardingState({
      stage: "done",
      needsOrg: false,
      needsProject: false,
      needsPlan: false,
      blockReason: "none",
    }))
  }
)
