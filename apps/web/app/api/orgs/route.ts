import { NextResponse } from 'next/server'
import { requireAppUser } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/orgs — list orgs for current user
export async function GET() {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user

  const memberships = await db.organizationMember.findMany({
    where: { userId: user.id },
    include: {
      org: {
        include: {
          billing: true,
          _count: { select: { projects: true, members: true } },
        },
      },
    },
  })

  type Membership = (typeof memberships)[number]

  return NextResponse.json({
    orgs: memberships.map((m: Membership) => ({
      id: m.org.id,
      name: m.org.name,
      slug: m.org.slug,
      role: m.role,
      plan: m.org.billing?.plan ?? 'starter',
      billingStatus: m.org.billing?.status ?? 'inactive',
      projectCount: m.org._count.projects,
      memberCount: m.org._count.members,
    })),
  })
}

// POST /api/orgs — create org (user becomes owner)
export async function POST(req: Request) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const name = String(body.name || '').trim()
  const slug = String(body.slug || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
  if (!name || !slug) {
    return NextResponse.json({ error: 'name and slug are required.' }, { status: 400 })
  }

  const existing = await db.organization.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json({ error: 'Slug already taken.' }, { status: 409 })
  }

  const org = await db.organization.create({
    data: {
      name,
      slug,
      members: {
        create: { userId: user.id, role: 'owner' },
      },
      billing: {
        create: {},
      },
    },
    include: { billing: true },
  })

  return NextResponse.json({ org }, { status: 201 })
}
