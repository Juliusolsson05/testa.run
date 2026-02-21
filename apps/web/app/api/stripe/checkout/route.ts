import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { requireAppUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const priceId = String(body.priceId || '').trim()
  const orgId = String(body.orgId || '').trim()
  if (!priceId || !orgId) {
    return NextResponse.json({ error: 'priceId and orgId are required.' }, { status: 400 })
  }

  // Verify user is member of org
  const member = await db.organizationMember.findUnique({
    where: { orgId_userId: { orgId, userId: user.id } },
  })
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Get or create billing account
  let billing = await db.billingAccount.findUnique({ where: { orgId } })
  if (!billing) {
    billing = await db.billingAccount.create({ data: { orgId } })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/billing/cancelled`,
    ...(billing.stripeCustomerId ? { customer: billing.stripeCustomerId } : { customer_email: user.email }),
    subscription_data: {
      metadata: { orgId },
    },
  })

  return NextResponse.json({ url: session.url })
}
