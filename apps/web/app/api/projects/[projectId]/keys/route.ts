import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'
import { createApiKey } from '@/lib/api-key-auth'

// GET /api/projects/:projectId/keys
export async function GET(_req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { projectId } = await params

  const project = await db.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const member = await requireOrgMember(user.id, project.orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const keys = await db.apiKey.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      prefix: true,
      last4: true,
      createdAt: true,
      lastUsedAt: true,
      revokedAt: true,
    },
  })

  return NextResponse.json({ keys })
}

// POST /api/projects/:projectId/keys
export async function POST(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { projectId } = await params

  const project = await db.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const member = await requireOrgMember(user.id, project.orgId, 'admin')
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const name = String(body.name || '').trim()
  if (!name) return NextResponse.json({ error: 'name is required.' }, { status: 400 })

  const { raw, row } = await createApiKey(projectId, name)

  return NextResponse.json({
    key: {
      id: row.id,
      name: row.name,
      prefix: row.prefix,
      last4: row.last4,
      createdAt: row.createdAt,
      raw,
    },
  }, { status: 201 })
}
