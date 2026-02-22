import { createAsyncThunk } from "@reduxjs/toolkit"
import { setCheckoutStatus } from "@/store/billing-slice"
import type { RootState } from "@/store"

export const createCheckoutSession = createAsyncThunk<string, { orgId: string }, { state: RootState }>(
  "billing/createCheckoutSession",
  async ({ orgId }, { getState, dispatch, rejectWithValue }) => {
    const token = getState().auth.accessToken
    if (!token) return rejectWithValue("No auth token") as never

    dispatch(setCheckoutStatus("creating"))

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orgId, priceId }),
    })

    if (!res.ok) {
      dispatch(setCheckoutStatus("error"))
      return rejectWithValue("Failed to create checkout") as never
    }

    const data = await res.json()
    dispatch(setCheckoutStatus("redirecting"))
    return data.url as string
  }
)
