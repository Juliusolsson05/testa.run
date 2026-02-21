import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { requireAppUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { requireEnv } from '@/lib/env'

export async function POST(req: Request) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const orgId = String(body.orgId || '').trim()
  if (!orgId) return NextResponse.json({ error: 'orgId is required.' }, { status: 400 })

  // Verify membership
  const member = await db.organizationMember.findUnique({
    where: { orgId_userId: { orgId, userId: user.id } },
  })
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const billing = await db.billingAccount.findUnique({ where: { orgId } })
  if (!billing?.stripeCustomerId) {
    return NextResponse.json({ error: 'No billing account found.' }, { status: 404 })
  }

  const appUrl = requireEnv('NEXT_PUBLIC_APP_URL')

  const session = await getStripe().billingPortal.sessions.create({
    customer: billing.stripeCustomerId,
    return_url: `${appUrl}/workspace`,
  })

  return NextResponse.json({ url: session.url })
}
