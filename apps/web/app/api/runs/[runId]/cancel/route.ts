import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'
import { cancelRunExecution } from '@/lib/run-runner'
import { finalizeRun } from '@/lib/run-finalize'

// POST /api/runs/:runId/cancel — cancel an active run
export async function POST(_req: Request, { params }: { params: Promise<{ runId: string }> }) {
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

  if (run.status !== 'running') {
    return NextResponse.json({ ok: true, alreadyFinal: true })
  }

  cancelRunExecution(runId)
  const updated = await finalizeRun(runId, {
    status: 'failed',
    securitySynopsis: 'Run cancelled by user.',
  })

  return NextResponse.json({ ok: true, run: { id: updated.id, status: updated.status } })
}
