import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/store/auth-slice"
import onboardingReducer from "@/store/onboarding-slice"
import workspaceReducer from "@/store/workspace-slice"
import billingReducer from "@/store/billing-slice"
import runsReducer from "@/store/runs-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    onboarding: onboardingReducer,
    workspace: workspaceReducer,
    billing: billingReducer,
    runs: runsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
