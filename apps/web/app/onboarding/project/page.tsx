"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth/AuthProvider"
import { useAppSelector } from "@/store/hooks"
import { OnboardingBackground } from "@/components/onboarding/OnboardingBackground"

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export default function OnboardingProjectPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { accessToken } = useAuth()
  const activeOrgId = useAppSelector((s) => s.workspace.activeOrgId)

  const [orgId, setOrgId] = useState<string | null>(activeOrgId)
  const [name, setName] = useState("Main Project")
  const [slug, setSlug] = useState("main")
  const [slugEdited, setSlugEdited] = useState(false)
  const [targetUrl, setTargetUrl] = useState("https://")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (activeOrgId) setOrgId(activeOrgId)
  }, [activeOrgId])

  useEffect(() => {
    const incomingTargetUrl = params.get("targetUrl")
    if (!incomingTargetUrl) return
    const normalized = /^https?:\/\//i.test(incomingTargetUrl)
      ? incomingTargetUrl
      : `https://${incomingTargetUrl}`
    setTargetUrl(normalized)
  }, [params])

  const derivedSlug = useMemo(() => slugify(name), [name])
  const effectiveSlug = slugEdited ? slug : derivedSlug
  const slugValid = /^[a-z0-9-]{2,50}$/.test(effectiveSlug)
  const urlValid = /^https?:\/\//i.test(targetUrl.trim())

  useEffect(() => {
    async function loadOrg() {
      if (!accessToken || orgId) return
      const res = await fetch("/api/orgs", {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      })
      if (!res.ok) return
      const data = await res.json()
      setOrgId(data.orgs?.[0]?.id ?? null)
    }

    void loadOrg()
  }, [accessToken, orgId])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!accessToken || !orgId || submitting) return

    setError(null)

    if (!name.trim()) {
      setError("Project name is required.")
      return
    }

    if (!slugValid) {
      setError("Use a slug with 2-50 chars: lowercase letters, numbers, and dashes.")
      return
    }

    if (!urlValid) {
      setError("Target URL must start with http:// or https://")
      return
    }

    setSubmitting(true)

    const res = await fetch(`/api/orgs/${orgId}/projects`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name: name.trim(), slug: effectiveSlug, targetUrl: targetUrl.trim() }),
    })

    if (!res.ok) {
      const payload = await res.json().catch(() => ({ error: "Failed to create project" }))
      setError(payload.error || "Failed to create project")
      setSubmitting(false)
      return
    }

    router.replace("/onboarding/plan")
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-white px-4">
      <OnboardingBackground />
      <form onSubmit={onSubmit} className="relative w-full max-w-md rounded-lg border border-ui-border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1a2a33]">Create project</h1>
        <p className="mt-1 text-sm text-ui-muted">Add your first target application.</p>

        <label className="mt-6 block text-sm font-medium text-[#1a2a33]">Project name</label>
        <input
          className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (!slugEdited) setSlug(slugify(e.target.value))
          }}
          required
        />

        <label className="mt-4 block text-sm font-medium text-[#1a2a33]">Slug</label>
        <input
          className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm"
          value={effectiveSlug}
          onChange={(e) => {
            setSlugEdited(true)
            setSlug(slugify(e.target.value))
          }}
          required
        />

        <label className="mt-4 block text-sm font-medium text-[#1a2a33]">Target URL</label>
        <input
          className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          placeholder="https://your-app.com"
          required
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          className="mt-6 w-full rounded bg-[#1d6ef5] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          disabled={!orgId || submitting}
        >
          {submitting ? "Creating project..." : "Continue"}
        </button>
      </form>
    </main>
  )
}
