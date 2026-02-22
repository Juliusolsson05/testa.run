import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { toast } from "sonner"
import type { RootState } from "@/store"

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectRuns.pending, (state) => {
        state.loading = true
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

export const { setProject, setRuns } = runsSlice.actions
export default runsSlice.reducer
