"use client"

import { useEffect, useMemo } from "react"
import { fetchProjectRuns, type ProjectRun } from "@/store/runs-slice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

export function useProjectRuns(
  selectedRunId?: string,
  take = 20,
  options?: { poll?: boolean; forceOnMount?: boolean }
) {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((s) => s.runs.loading)
  const project = useAppSelector((s) => s.runs.project)
  const runs = useAppSelector((s) => s.runs.runs)
  const accessToken = useAppSelector((s) => s.auth.accessToken)
  const poll = options?.poll ?? true
  const forceOnMount = options?.forceOnMount ?? true

  useEffect(() => {
    if (!accessToken) return

    void dispatch(fetchProjectRuns({ take, force: forceOnMount }))

    if (!poll) return

    const timer = setInterval(() => {
      void dispatch(fetchProjectRuns({ take }))
    }, 4000)

    return () => clearInterval(timer)
  }, [accessToken, dispatch, forceOnMount, poll, take])

  const selectedRun = useMemo(() => {
    if (!selectedRunId) return null
    return runs.find((r) => r.id === selectedRunId) ?? null
  }, [runs, selectedRunId])

  const runningRun = useMemo(() => runs.find((r) => r.status === "running") ?? null, [runs])

  const activeRun = selectedRun ?? runningRun

  return { loading, project, runs, activeRun, selectedRun, runningRun }
}

export type { ProjectRun }
