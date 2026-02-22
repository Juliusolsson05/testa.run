import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type BillingUsage = {
  plan: "starter" | "pro"
  monthlyLimit: number | null
  used: number
  remaining: number | null
  resetAt: string
}

type BillingState = {
  plan: "starter" | "pro" | null
  status: "inactive" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | null
  checkoutStatus: "idle" | "creating" | "redirecting" | "error"
  usage: BillingUsage | null
  usageStatus: "idle" | "loading" | "loaded" | "error"
}

const initialState: BillingState = {
  plan: null,
  status: null,
  checkoutStatus: "idle",
  usage: null,
  usageStatus: "idle",
}

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    setBilling(state, action: PayloadAction<{ plan: BillingState["plan"]; status: BillingState["status"] }>) {
      state.plan = action.payload.plan
      state.status = action.payload.status
    },
    setCheckoutStatus(state, action: PayloadAction<BillingState["checkoutStatus"]>) {
      state.checkoutStatus = action.payload
    },
    setBillingUsageStatus(state, action: PayloadAction<BillingState["usageStatus"]>) {
      state.usageStatus = action.payload
    },
    setBillingUsage(state, action: PayloadAction<BillingUsage | null>) {
      state.usage = action.payload
      state.usageStatus = action.payload ? "loaded" : state.usageStatus
    },
    resetBilling() {
      return initialState
    },
  },
})

export const { setBilling, setCheckoutStatus, setBillingUsage, setBillingUsageStatus, resetBilling } = billingSlice.actions
export default billingSlice.reducer
