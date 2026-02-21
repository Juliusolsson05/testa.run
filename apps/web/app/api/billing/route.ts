import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/billing?orgId=...
export async function GET(req: Request) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user

  const url = new URL(req.url)
  const orgId = url.searchParams.get('orgId')
  if (!orgId) return NextResponse.json({ error: 'orgId query param is required.' }, { status: 400 })

  const member = await requireOrgMember(user.id, orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const billing = await db.billingAccount.findUnique({ where: { orgId } })

  return NextResponse.json({
    billing: billing
      ? {
          plan: billing.plan,
          status: billing.status,
          stripeCustomerId: billing.stripeCustomerId,
          currentPeriodEnd: billing.currentPeriodEnd,
          cancelAtPeriodEnd: billing.cancelAtPeriodEnd,
        }
      : { plan: 'starter', status: 'inactive' },
  })
}
