import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'
import { PLAN_LIMITS, getOrgPlan } from '@/lib/plan-limits'

function startOfCurrentMonth() {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0))
}

function startOfNextMonth() {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0))
}

// GET /api/billing/usage?orgId=...
export async function GET(req: Request) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user

  const url = new URL(req.url)
  const orgId = url.searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId query param is required.' }, { status: 400 })

  const member = await requireOrgMember(user.id, orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const plan = await getOrgPlan(orgId)
  const monthlyLimit = PLAN_LIMITS[plan].monthlyRuns

  const used = await db.testRun.count({
    where: {
      startedAt: { gte: startOfCurrentMonth() },
      project: { orgId },
    },
  })

  const remaining = monthlyLimit == null ? null : Math.max(0, monthlyLimit - used)

  return NextResponse.json({
    usage: {
      plan,
      monthlyLimit,
      used,
      remaining,
      resetAt: startOfNextMonth().toISOString(),
    },
  })
}
