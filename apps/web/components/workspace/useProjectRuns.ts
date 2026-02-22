"use client"

import { useEffect, useMemo } from "react"
import { fetchProjectRuns, type ProjectRun } from "@/store/runs-slice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

export function useProjectRuns(selectedRunId?: string, take = 20) {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((s) => s.runs.loading)
  const project = useAppSelector((s) => s.runs.project)
  const runs = useAppSelector((s) => s.runs.runs)
  const accessToken = useAppSelector((s) => s.auth.accessToken)

  useEffect(() => {
    if (!accessToken) return
    void dispatch(fetchProjectRuns({ take, force: true }))

    const timer = setInterval(() => {
      void dispatch(fetchProjectRuns({ take }))
    }, 4000)

    return () => clearInterval(timer)
  }, [accessToken, dispatch, take])

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
