"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/components/auth/AuthProvider"

type ProjectRef = {
  id: string
  name: string
  slug: string
  targetUrl: string
}

type ApiMeResponse = {
  orgs: Array<{ projects: ProjectRef[] }>
}

type ProjectRun = {
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

type ApiRunsResponse = {
  runs: ProjectRun[]
}

export function useProjectRuns(selectedRunId?: string, take = 20) {
  const { accessToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<ProjectRef | null>(null)
  const [runs, setRuns] = useState<ProjectRun[]>([])

  useEffect(() => {
    let mounted = true

    async function load() {
      if (!accessToken) return
      setLoading(true)

      const headers = { Authorization: `Bearer ${accessToken}` }

      const meRes = await fetch("/api/auth/me", { headers, cache: "no-store" })
      if (!meRes.ok) throw new Error("Failed to load user context")

      const me = (await meRes.json()) as ApiMeResponse
      const nextProject = me.orgs?.[0]?.projects?.[0]

      if (!mounted) return
      if (!nextProject) {
        setProject(null)
        setRuns([])
        setLoading(false)
        return
      }

      setProject(nextProject)

      const runsRes = await fetch(`/api/projects/${nextProject.id}/runs?take=${take}`, {
        headers,
        cache: "no-store",
      })
      if (!runsRes.ok) throw new Error("Failed to load runs")

      const payload = (await runsRes.json()) as ApiRunsResponse
      if (!mounted) return

      setRuns(payload.runs)
      setLoading(false)
    }

    void load().catch(() => {
      if (!mounted) return
      setLoading(false)
      setRuns([])
    })

    return () => {
      mounted = false
    }
  }, [accessToken, take])

  const activeRun = useMemo(() => {
    if (selectedRunId) {
      const selected = runs.find((r) => r.id === selectedRunId)
      if (selected) return selected
    }

    return runs.find((r) => r.status === "running") ?? runs[0] ?? null
  }, [runs, selectedRunId])

  return { loading, project, runs, activeRun }
}

export type { ProjectRun }
