"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthProvider"
import { useAppDispatch } from "@/store/hooks"
import { bootstrapAppContext } from "@/store/app-thunks"

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export default function OnboardingOrgPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { accessToken } = useAuth()

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugEdited, setSlugEdited] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const derivedSlug = useMemo(() => slugify(name), [name])
  const effectiveSlug = slugEdited ? slug : derivedSlug
  const slugValid = /^[a-z0-9-]{2,50}$/.test(effectiveSlug)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!accessToken || submitting) return

    setError(null)

    if (!name.trim()) {
      setError("Organization name is required.")
      return
    }

    if (!slugValid) {
      setError("Use a slug with 2-50 chars: lowercase letters, numbers, and dashes.")
      return
    }

    setSubmitting(true)

    const res = await fetch("/api/orgs", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name: name.trim(), slug: effectiveSlug }),
    })

    if (!res.ok) {
      const payload = await res.json().catch(() => ({ error: "Failed to create organization" }))
      setError(payload.error || "Failed to create organization")
      setSubmitting(false)
      return
    }

    await dispatch(bootstrapAppContext())
    router.replace("/onboarding/project")
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-app-bg px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-ui-border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1a2a33]">Create organization</h1>
        <p className="mt-1 text-sm text-ui-muted">Set up your workspace.</p>

        <label className="mt-6 block text-sm font-medium text-[#1a2a33]">Organization name</label>
        <input
          className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (!slugEdited) setSlug(slugify(e.target.value))
          }}
          placeholder="Acme Inc"
          required
        />

        <label className="mt-4 block text-sm font-medium text-[#1a2a33]">Workspace URL slug</label>
        <input
          className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm"
          value={effectiveSlug}
          onChange={(e) => {
            setSlugEdited(true)
            setSlug(slugify(e.target.value))
          }}
          placeholder="acme"
          required
        />
        <p className="mt-1 text-xs text-ui-muted">Lowercase letters, numbers, and dashes only.</p>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          disabled={submitting}
          className="mt-6 w-full rounded bg-[#1d6ef5] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Creating workspace..." : "Continue"}
        </button>
      </form>
    </main>
  )
}
