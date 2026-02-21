import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type BillingState = {
  plan: "starter" | "pro" | null
  status: "inactive" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | null
  checkoutStatus: "idle" | "creating" | "redirecting" | "error"
}

const initialState: BillingState = {
  plan: null,
  status: null,
  checkoutStatus: "idle",
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
    resetBilling() {
      return initialState
    },
  },
})

export const { setBilling, setCheckoutStatus, resetBilling } = billingSlice.actions
export default billingSlice.reducer
