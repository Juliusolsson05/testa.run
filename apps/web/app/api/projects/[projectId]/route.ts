import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/projects/:projectId
export async function GET(_req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { projectId } = await params

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { _count: { select: { runs: true, keys: true } } },
  })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const member = await requireOrgMember(user.id, project.orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  return NextResponse.json({ project })
}

// PATCH /api/projects/:projectId
export async function PATCH(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { projectId } = await params

  const project = await db.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const member = await requireOrgMember(user.id, project.orgId, 'admin')
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const updated = await db.project.update({
    where: { id: projectId },
    data: {
      ...(body.name ? { name: String(body.name).trim() } : {}),
      ...(body.targetUrl ? { targetUrl: String(body.targetUrl).trim() } : {}),
    },
  })

  return NextResponse.json({ project: updated })
}
