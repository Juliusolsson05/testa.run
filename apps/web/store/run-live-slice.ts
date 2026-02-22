import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type RunStreamStatus = "idle" | "live" | "polling" | "reconnecting"

type RunLiveEntry = {
  status: RunStreamStatus
  lastSeq: number
  lastEventAt: string | null
}

type RunLiveState = {
  byRunId: Record<string, RunLiveEntry>
}

const initialState: RunLiveState = {
  byRunId: {},
}

const runLiveSlice = createSlice({
  name: "runLive",
  initialState,
  reducers: {
    setRunStreamStatus(state, action: PayloadAction<{ runId: string; status: RunStreamStatus }>) {
      const current = state.byRunId[action.payload.runId] ?? { status: "idle" as const, lastSeq: 0, lastEventAt: null }
      state.byRunId[action.payload.runId] = { ...current, status: action.payload.status }
    },
    ingestRunEventMeta(state, action: PayloadAction<{ runId: string; seq: number; at: string }>) {
      const current = state.byRunId[action.payload.runId] ?? { status: "idle" as const, lastSeq: 0, lastEventAt: null }
      state.byRunId[action.payload.runId] = {
        ...current,
        lastSeq: Math.max(current.lastSeq, action.payload.seq),
        lastEventAt: action.payload.at,
      }
    },
  },
})

export const { setRunStreamStatus, ingestRunEventMeta } = runLiveSlice.actions
export default runLiveSlice.reducer
