"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getBrowserSupabase } from "@/lib/supabase-browser"
import { useAuth } from "@/components/auth/AuthProvider"

export default function SignUpPage() {
  const router = useRouter()
  const params = useSearchParams()
  const incomingTargetUrl = params.get("targetUrl")
  const normalizedTargetUrl = incomingTargetUrl
    ? (/^https?:\/\//i.test(incomingTargetUrl) ? incomingTargetUrl : `https://${incomingTargetUrl}`)
    : null
  const next = params.get("next") || (normalizedTargetUrl
    ? `/onboarding/project?targetUrl=${encodeURIComponent(normalizedTargetUrl)}`
    : "/")
  const { accessToken, loading } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && accessToken) router.replace(next)
  }, [accessToken, loading, next, router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const supabase = getBrowserSupabase()
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      setError(signUpError.message)
      setSubmitting(false)
      return
    }

    if (!data.session) {
      setError("Account created. Please confirm your email, then sign in.")
      setSubmitting(false)
      return
    }

    router.replace(next)
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-app-bg px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-ui-border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1a2a33]">Create account</h1>
        <p className="mt-1 text-sm text-ui-muted">Start using testa.run.</p>

        <label className="mt-6 block text-sm font-medium text-[#1a2a33]">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm"
        />

        <label className="mt-4 block text-sm font-medium text-[#1a2a33]">Password</label>
        <input
          type="password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm"
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded bg-[#1d6ef5] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-4 text-sm text-ui-muted">
          Already have an account?{" "}
          <Link href={`/sign-in?next=${encodeURIComponent(next)}${normalizedTargetUrl ? `&targetUrl=${encodeURIComponent(normalizedTargetUrl)}` : ""}`} className="font-medium text-[#1d6ef5]">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  )
}
