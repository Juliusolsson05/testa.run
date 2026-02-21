import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'
import { listRunEvents } from '@/lib/run-events'

// GET /api/runs/:runId/events?afterSeq=0&limit=200
export async function GET(req: Request, { params }: { params: Promise<{ runId: string }> }) {
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

  const url = new URL(req.url)
  const afterSeq = Number(url.searchParams.get('afterSeq') ?? '0')
  const limit = Number(url.searchParams.get('limit') ?? '200')

  const events = await listRunEvents(runId, Number.isFinite(afterSeq) ? afterSeq : 0, Number.isFinite(limit) ? limit : 200)

  return NextResponse.json({
    events,
    latestSeq: events.at(-1)?.seq ?? afterSeq,
    hasMore: events.length === Math.min(Math.max(limit, 1), 1000),
  })
}
