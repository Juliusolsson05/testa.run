import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@supabase/supabase-js"

export type AuthStatus = "unknown" | "anonymous" | "authenticated"

type AuthState = {
  status: AuthStatus
  loading: boolean
  accessToken: string | null
  user: User | null
  syncStatus: "idle" | "syncing" | "synced" | "error"
}

const initialState: AuthState = {
  status: "unknown",
  loading: true,
  accessToken: null,
  user: null,
  syncStatus: "idle",
}

export const syncCurrentUser = createAsyncThunk("auth/syncCurrentUser", async (_, { getState }) => {
  const state = getState() as { auth: AuthState }
  const token = state.auth.accessToken
  if (!token) return { ok: false }

  const res = await fetch("/api/auth/sync-user", {
    method: "POST",
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  })

  return { ok: res.ok }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ accessToken: string | null; user: User | null }>) {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
      state.status = action.payload.accessToken ? "authenticated" : "anonymous"
      state.loading = false
      state.syncStatus = action.payload.accessToken ? state.syncStatus : "idle"
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCurrentUser.pending, (state) => {
        state.syncStatus = "syncing"
      })
      .addCase(syncCurrentUser.fulfilled, (state, action) => {
        state.syncStatus = action.payload.ok ? "synced" : "error"
      })
      .addCase(syncCurrentUser.rejected, (state) => {
        state.syncStatus = "error"
      })
  },
})

export const { setSession, setLoading } = authSlice.actions
export default authSlice.reducer
export type { AuthState }
