import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type WorkspaceState = {
  activeOrgId: string | null
  activeProjectId: string | null
  activeRunId: string | null
}

const initialState: WorkspaceState = {
  activeOrgId: null,
  activeProjectId: null,
  activeRunId: null,
}

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setActiveOrgId(state, action: PayloadAction<string | null>) {
      state.activeOrgId = action.payload
    },
    setActiveProjectId(state, action: PayloadAction<string | null>) {
      state.activeProjectId = action.payload
    },
    setActiveRunId(state, action: PayloadAction<string | null>) {
      state.activeRunId = action.payload
    },
  },
})

export const { setActiveOrgId, setActiveProjectId, setActiveRunId } = workspaceSlice.actions
export default workspaceSlice.reducer
