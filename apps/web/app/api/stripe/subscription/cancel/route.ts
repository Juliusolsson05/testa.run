import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { requireAppUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const orgId = String(body.orgId || '').trim()
  if (!orgId) return NextResponse.json({ error: 'orgId is required.' }, { status: 400 })

  const member = await db.organizationMember.findUnique({ where: { orgId_userId: { orgId, userId: user.id } } })
  if (!member || member.role === 'member') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const billing = await db.billingAccount.findUnique({ where: { orgId } })
  if (!billing?.stripeSubscriptionId) {
    return NextResponse.json({ error: 'No active subscription found.' }, { status: 404 })
  }

  const sub = await getStripe().subscriptions.update(billing.stripeSubscriptionId, {
    cancel_at_period_end: true,
  })

  await db.billingAccount.update({
    where: { orgId },
    data: {
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      status: sub.status === 'active' ? 'active' : 'inactive',
    },
  })

  return NextResponse.json({ ok: true, cancelAtPeriodEnd: sub.cancel_at_period_end })
}
