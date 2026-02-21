import { NextResponse } from 'next/server'
import { requireAppUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user

  // Fetch orgs + billing for context
  const memberships = await db.organizationMember.findMany({
    where: { userId: user.id },
    include: {
      org: {
        include: {
          billing: true,
          projects: { select: { id: true, name: true, slug: true, targetUrl: true } },
        },
      },
    },
  })

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
    orgs: memberships.map((m) => ({
      id: m.org.id,
      name: m.org.name,
      slug: m.org.slug,
      role: m.role,
      plan: m.org.billing?.plan ?? 'starter',
      billingStatus: m.org.billing?.status ?? 'inactive',
      projects: m.org.projects,
    })),
  })
}
