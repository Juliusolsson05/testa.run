import { db } from '@/lib/db'
import { appendRunEvent } from '@/lib/run-events'

type FinalizeInput = {
  status: 'passed' | 'failed' | 'warning'
  durationMs?: number
  securitySynopsis?: string | null
}

export async function finalizeRun(runId: string, input: FinalizeInput) {
  const run = await db.testRun.findUnique({ where: { id: runId } })
  if (!run) throw new Error('Run not found')
  // Idempotency/safety: never re-finalize an already terminal run.
  if (run.finishedAt) return run

  const now = new Date()
  const durationMs = input.durationMs != null
    ? Number(input.durationMs)
    : now.getTime() - run.startedAt.getTime()

  const openCounts = await db.issue.groupBy({
    by: ['severity'],
    where: { runId, status: 'open' },
    _count: true,
  })

  const updated = await db.testRun.update({
    where: { id: runId },
    data: {
      status: input.status,
      finishedAt: now,
      durationMs,
      securitySynopsis: input.securitySynopsis ?? run.securitySynopsis ?? null,
      openErrors: openCounts.find((c) => c.severity === 'error')?._count ?? 0,
      openWarnings: openCounts.find((c) => c.severity === 'warning')?._count ?? 0,
    },
  })

  await appendRunEvent(runId, 'run.updated', {
    run: {
      id: updated.id,
      status: updated.status,
      finishedAt: updated.finishedAt?.toISOString() ?? null,
      durationMs: updated.durationMs,
      openIssues: { errors: updated.openErrors, warnings: updated.openWarnings },
      securitySynopsis: updated.securitySynopsis,
    },
  })

  await appendRunEvent(runId, updated.status === 'failed' ? 'run.failed' : 'run.completed', {
    run: {
      id: updated.id,
      status: updated.status,
      finishedAt: updated.finishedAt?.toISOString() ?? null,
      durationMs: updated.durationMs,
    },
  })

  return updated
}
