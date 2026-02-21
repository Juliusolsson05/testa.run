import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/orgs/:orgId
export async function GET(_req: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { orgId } = await params

  const member = await requireOrgMember(user.id, orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const org = await db.organization.findUnique({
    where: { id: orgId },
    include: {
      billing: true,
      members: { include: { user: { select: { id: true, email: true, name: true, avatarUrl: true } } } },
      projects: { select: { id: true, name: true, slug: true, targetUrl: true } },
    },
  })

  return NextResponse.json({ org })
}

// PATCH /api/orgs/:orgId
export async function PATCH(req: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { orgId } = await params

  const member = await requireOrgMember(user.id, orgId, 'admin')
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const org = await db.organization.update({
    where: { id: orgId },
    data: {
      ...(body.name ? { name: String(body.name).trim() } : {}),
    },
  })

  return NextResponse.json({ org })
}
