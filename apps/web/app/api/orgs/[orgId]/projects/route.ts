import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/orgs/:orgId/projects
export async function GET(_req: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { orgId } = await params

  const member = await requireOrgMember(user.id, orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const projects = await db.project.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { runs: true } } },
  })

  return NextResponse.json({ projects })
}

// POST /api/orgs/:orgId/projects
export async function POST(req: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { orgId } = await params

  const member = await requireOrgMember(user.id, orgId, 'admin')
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const name = String(body.name || '').trim()
  const slug = String(body.slug || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
  const targetUrl = String(body.targetUrl || '').trim()
  if (!name || !slug || !targetUrl) {
    return NextResponse.json({ error: 'name, slug, and targetUrl are required.' }, { status: 400 })
  }

  const existing = await db.project.findUnique({ where: { orgId_slug: { orgId, slug } } })
  if (existing) {
    return NextResponse.json({ error: 'Project slug already exists in this org.' }, { status: 409 })
  }

  const project = await db.project.create({
    data: { orgId, name, slug, targetUrl },
  })

  return NextResponse.json({ project }, { status: 201 })
}
