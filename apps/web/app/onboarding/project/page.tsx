"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthProvider"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { bootstrapAppContext } from "@/store/app-thunks"

export default function OnboardingProjectPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { accessToken } = useAuth()
  const activeOrgId = useAppSelector((s) => s.workspace.activeOrgId)

  const [orgId, setOrgId] = useState<string | null>(activeOrgId)
  const [name, setName] = useState("Main Project")
  const [slug, setSlug] = useState("main")
  const [targetUrl, setTargetUrl] = useState("https://example.com")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (activeOrgId) setOrgId(activeOrgId)
  }, [activeOrgId])

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
    if (!accessToken || !orgId) return

    const res = await fetch(`/api/orgs/${orgId}/projects`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name, slug, targetUrl }),
    })

    if (!res.ok) {
      const payload = await res.json().catch(() => ({ error: "Failed to create project" }))
      setError(payload.error || "Failed to create project")
      return
    }

    await dispatch(bootstrapAppContext())
    router.replace("/onboarding/plan")
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-app-bg px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-ui-border bg-white p-6">
        <h1 className="text-2xl font-semibold text-[#1a2a33]">Create project</h1>
        <p className="mt-1 text-sm text-ui-muted">Add your first target application.</p>

        <label className="mt-6 block text-sm font-medium text-[#1a2a33]">Project name</label>
        <input className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} required />

        <label className="mt-4 block text-sm font-medium text-[#1a2a33]">Slug</label>
        <input className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm" value={slug} onChange={(e) => setSlug(e.target.value)} required />

        <label className="mt-4 block text-sm font-medium text-[#1a2a33]">Target URL</label>
        <input className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} required />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button className="mt-6 w-full rounded bg-[#1d6ef5] px-3 py-2 text-sm font-semibold text-white" disabled={!orgId}>
          Continue
        </button>
      </form>
    </main>
  )
}
