import { NextResponse } from 'next/server'
import { authenticateApiKey } from '@/lib/api-key-auth'
import { db } from '@/lib/db'
import { appendRunEvent } from '@/lib/run-events'

// POST /api/agent/runs/:runId/finish — finalize a run
export async function POST(req: Request, { params }: { params: Promise<{ runId: string }> }) {
  const apiKey = await authenticateApiKey()
  if (!apiKey) return NextResponse.json({ error: 'Invalid API key.' }, { status: 401 })
  const { runId } = await params

  const run = await db.testRun.findUnique({ where: { id: runId } })
  if (!run || run.projectId !== apiKey.projectId) {
    return NextResponse.json({ error: 'Run not found or not owned by this project.' }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const status = String(body.status || 'passed').trim()
  const now = new Date()
  const durationMs = body.durationMs != null
    ? Number(body.durationMs)
    : now.getTime() - run.startedAt.getTime()

  // Compute final open issue counts
  const openCounts = await db.issue.groupBy({
    by: ['severity'],
    where: { runId, status: 'open' },
    _count: true,
  })

  const updated = await db.testRun.update({
    where: { id: runId },
    data: {
      status: status as never,
      finishedAt: now,
      durationMs,
      securitySynopsis: body.securitySynopsis ?? null,
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

  return NextResponse.json({
    run: { id: updated.id, status: updated.status, finishedAt: updated.finishedAt, durationMs: updated.durationMs },
  })
}
