"use client"

import { useEffect } from "react"
import { Provider } from "react-redux"
import type { Session, User } from "@supabase/supabase-js"
import { getBrowserSupabase } from "@/lib/supabase-browser"
import { store } from "@/store"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setSession, syncCurrentUser } from "@/store/auth-slice"
import { bootstrapAppContext } from "@/store/app-thunks"

type AuthContextValue = {
  loading: boolean
  session: Session | null
  user: User | null
  accessToken: string | null
  signOut: () => Promise<void>
}

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const supabase = getBrowserSupabase()

    supabase.auth.getSession().then(({ data }) => {
      dispatch(setSession({ accessToken: data.session?.access_token ?? null, user: data.session?.user ?? null }))
      if (data.session?.access_token) {
        void dispatch(syncCurrentUser())
        void dispatch(bootstrapAppContext())
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      dispatch(setSession({ accessToken: nextSession?.access_token ?? null, user: nextSession?.user ?? null }))
      if (nextSession?.access_token) {
        void dispatch(syncCurrentUser())
        void dispatch(bootstrapAppContext())
      }
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [dispatch])

  return <>{children}</>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </Provider>
  )
}

export function useAuth(): AuthContextValue {
  const loading = useAppSelector((s) => s.auth.loading)
  const user = useAppSelector((s) => s.auth.user)
  const accessToken = useAppSelector((s) => s.auth.accessToken)

  return {
    loading,
    session: null,
    user,
    accessToken,
    signOut: async () => {
      const supabase = getBrowserSupabase()
      await supabase.auth.signOut()
    },
  }
}
