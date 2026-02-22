import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/runs/:runId — run detail (no heavy graph)
export async function GET(_req: Request, { params }: { params: Promise<{ runId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { runId } = await params

  const run = await db.testRun.findUnique({
    where: { id: runId },
    include: {
      project: { select: { id: true, name: true, orgId: true, targetUrl: true } },
      _count: { select: { steps: true, issues: true, nodes: true } },
    },
  })
  if (!run) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const member = await requireOrgMember(user.id, run.project.orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  return NextResponse.json({ run })
}

// PATCH /api/runs/:runId — rename run
export async function PATCH(req: Request, { params }: { params: Promise<{ runId: string }> }) {
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

  const body = await req.json().catch(() => null)
  const name = String(body?.name || '').trim()
  if (!name) return NextResponse.json({ error: 'name is required.' }, { status: 400 })
  if (name.length > 120) return NextResponse.json({ error: 'name must be <= 120 characters.' }, { status: 400 })

  const updated = await db.testRun.update({
    where: { id: runId },
    data: { name },
    select: { id: true, name: true },
  })

  return NextResponse.json({ run: updated })
}
