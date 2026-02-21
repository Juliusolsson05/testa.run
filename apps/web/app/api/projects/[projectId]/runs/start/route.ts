import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'
import { appendRunEvent } from '@/lib/run-events'

// POST /api/projects/:projectId/runs/start — create a new run (user-auth)
export async function POST(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { projectId } = await params

  const project = await db.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const member = await requireOrgMember(user.id, project.orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const name = String(body?.name || 'Manual Test Run').trim()
  const category = String(body?.category || 'ux').trim()

  const run = await db.testRun.create({
    data: {
      projectId,
      name,
      category: category as never,
      status: 'running',
      targetUrl: project.targetUrl,
      label: body?.label || null,
      metadata: body?.metadata || null,
    },
  })

  await appendRunEvent(run.id, 'run.started', {
    run: {
      id: run.id,
      name: run.name,
      label: run.label,
      category: run.category,
      status: run.status,
      startedAt: run.startedAt.toISOString(),
      targetUrl: run.targetUrl,
    },
  })

  return NextResponse.json({ run: { id: run.id } }, { status: 201 })
}
