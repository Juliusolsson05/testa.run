import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type OnboardingStage =
  | "check-auth"
  | "sign-in"
  | "sync-user"
  | "create-org"
  | "create-project"
  | "select-plan"
  | "checkout"
  | "done"

type OnboardingState = {
  stage: OnboardingStage
  needsOrg: boolean
  needsProject: boolean
  needsPlan: boolean
  blockReason: "none" | "no_org" | "no_project" | "plan_required"
}

const initialState: OnboardingState = {
  stage: "check-auth",
  needsOrg: false,
  needsProject: false,
  needsPlan: false,
  blockReason: "none",
}

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setOnboardingState(state, action: PayloadAction<Partial<OnboardingState>>) {
      Object.assign(state, action.payload)
    },
    resetOnboarding() {
      return initialState
    },
  },
})

export const { setOnboardingState, resetOnboarding } = onboardingSlice.actions
export default onboardingSlice.reducer
