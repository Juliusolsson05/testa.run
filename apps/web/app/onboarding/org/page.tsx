"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthProvider"
import { useAppDispatch } from "@/store/hooks"
import { bootstrapAppContext } from "@/store/app-thunks"

export default function OnboardingOrgPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { accessToken } = useAuth()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!accessToken) return

    const res = await fetch("/api/orgs", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name, slug }),
    })

    if (!res.ok) {
      const payload = await res.json().catch(() => ({ error: "Failed to create org" }))
      setError(payload.error || "Failed to create org")
      return
    }

    await dispatch(bootstrapAppContext())
    router.replace("/onboarding/project")
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-app-bg px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-ui-border bg-white p-6">
        <h1 className="text-2xl font-semibold text-[#1a2a33]">Create organization</h1>
        <p className="mt-1 text-sm text-ui-muted">Start by creating your workspace org.</p>

        <label className="mt-6 block text-sm font-medium text-[#1a2a33]">Organization name</label>
        <input className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} required />

        <label className="mt-4 block text-sm font-medium text-[#1a2a33]">Slug</label>
        <input className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm" value={slug} onChange={(e) => setSlug(e.target.value)} required />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button className="mt-6 w-full rounded bg-[#1d6ef5] px-3 py-2 text-sm font-semibold text-white">Continue</button>
      </form>
    </main>
  )
}
