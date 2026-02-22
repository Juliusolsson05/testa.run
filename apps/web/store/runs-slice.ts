import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { toast } from "sonner"
import type { RootState } from "@/store"
import type { RunEventEnvelope } from "@/types/events"

export type ProjectRef = {
  id: string
  name: string
  slug: string
  targetUrl: string
}

export type ProjectRun = {
  id: string
  label: string | null
  name: string
  category: "security" | "buttons" | "ux"
  url: string
  startedAt: string
  durationMs: number | null
  status: "running" | "passed" | "warning" | "failed"
  openIssues: { errors: number; warnings: number }
  stepsCount: number
}

type RunsState = {
  loading: boolean
  project: ProjectRef | null
  runs: ProjectRun[]
  lastFetchedAt: number | null
}

const initialState: RunsState = {
  loading: false,
  project: null,
  runs: [],
  lastFetchedAt: null,
}

type ApiMeResponse = {
  orgs: Array<{ projects: ProjectRef[] }>
}

type ApiRunsResponse = {
  runs: ProjectRun[]
}

export const fetchProjectRuns = createAsyncThunk<ProjectRun[], { take?: number; force?: boolean } | undefined, { state: RootState }>(
  "runs/fetchProjectRuns",
  async (args, { getState, dispatch }) => {
    const take = args?.take ?? 20
    const force = args?.force ?? false
    const state = getState()
    const token = state.auth.accessToken
    if (!token) return []

    const now = Date.now()
    const lastFetchedAt = state.runs.lastFetchedAt ?? 0
    if (!force && now - lastFetchedAt < 2500 && state.runs.runs.length > 0) {
      return state.runs.runs
    }

    const headers = { Authorization: `Bearer ${token}` }

    let project = state.runs.project
    if (!project) {
      const meRes = await fetch("/api/auth/me", { headers, cache: "no-store" })
      if (!meRes.ok) throw new Error("Failed to load user context")
      const me = (await meRes.json()) as ApiMeResponse
      project = me.orgs?.[0]?.projects?.[0] ?? null
      dispatch(setProject(project))
    }

    if (!project) return []

    const prevById = new Map(state.runs.runs.map((r) => [r.id, r]))

    const runsRes = await fetch(`/api/projects/${project.id}/runs?take=${take}`, {
      headers,
      cache: "no-store",
    })
    if (!runsRes.ok) throw new Error("Failed to load runs")

    const payload = (await runsRes.json()) as ApiRunsResponse

    for (const run of payload.runs) {
      const prev = prevById.get(run.id)
      if (prev && prev.status === "running" && run.status !== "running") {
        const text = run.status === "failed" ? "failed" : run.status === "warning" ? "completed with warnings" : "completed"
        toast(`Run ${run.label ?? run.id.slice(0, 8)} ${text}`)
      }
    }

    return payload.runs
  }
)

const runsSlice = createSlice({
  name: "runs",
  initialState,
  reducers: {
    setProject(state, action: PayloadAction<ProjectRef | null>) {
      state.project = action.payload
    },
    setRuns(state, action: PayloadAction<ProjectRun[]>) {
      state.runs = action.payload
      state.lastFetchedAt = Date.now()
    },
    applyRunEvent(state, action: PayloadAction<RunEventEnvelope>) {
      const evt = action.payload
      const idx = state.runs.findIndex((r) => r.id === evt.runId)
      if (idx < 0) return
      const run = state.runs[idx]
      if (!run) return

      if (evt.type === "run.updated" || evt.type === "run.completed" || evt.type === "run.failed") {
        const runPayload = (evt.payload.run ?? {}) as Partial<ProjectRun>
        if (runPayload.status) run.status = runPayload.status
        if (typeof runPayload.durationMs === "number") run.durationMs = runPayload.durationMs
      }

      if (evt.type === "step.upserted") {
        const step = (evt.payload.step ?? {}) as { index?: number }
        if (typeof step.index === "number") {
          run.stepsCount = Math.max(run.stepsCount, step.index)
        }
      }

      if (evt.type === "issue.created") {
        const issue = (evt.payload.issue ?? {}) as { severity?: "error" | "warning" }
        if (issue.severity === "error") run.openIssues.errors += 1
        if (issue.severity === "warning") run.openIssues.warnings += 1
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectRuns.pending, (state) => {
        // Avoid full-page loading flicker during background refresh polling.
        state.loading = state.runs.length === 0
      })
      .addCase(fetchProjectRuns.fulfilled, (state, action) => {
        state.loading = false
        state.runs = action.payload
        state.lastFetchedAt = Date.now()
      })
      .addCase(fetchProjectRuns.rejected, (state) => {
        state.loading = false
      })
  },
})

export const { setProject, setRuns, applyRunEvent } = runsSlice.actions
export default runsSlice.reducer
