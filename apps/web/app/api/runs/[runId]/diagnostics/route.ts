import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/runs/:runId/diagnostics
export async function GET(_req: Request, { params }: { params: Promise<{ runId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { runId } = await params

  const run = await db.testRun.findUnique({
    where: { id: runId },
    include: { project: { select: { orgId: true } } },
  })
  if (!run) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const member = await requireOrgMember(user.id, run.project.orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const lastEvent = await db.runEvent.findFirst({
    where: { runId },
    orderBy: { seq: 'desc' },
    select: { seq: true, type: true, createdAt: true },
  })

  const eventStats = await db.runEvent.groupBy({
    by: ['type'],
    where: { runId },
    _count: true,
  })

  const now = Date.now()
  const lastEventAgeMs = lastEvent ? now - new Date(lastEvent.createdAt).getTime() : null

  return NextResponse.json({
    run: {
      id: run.id,
      label: run.label,
      status: run.status,
      startedAt: run.startedAt,
      finishedAt: run.finishedAt,
      durationMs: run.durationMs,
      totalSteps: run.totalSteps,
      openErrors: run.openErrors,
      openWarnings: run.openWarnings,
      eventSeq: run.eventSeq,
      updatedAt: run.updatedAt,
    },
    lastEvent,
    lastEventAgeMs,
    eventStats,
  })
}
