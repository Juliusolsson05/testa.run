import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  // TODO: get customerId from Supabase auth session once wired
  const customerId = String(body.customerId || '').trim()

  if (!customerId) {
    return NextResponse.json({ error: 'customerId is required.' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const portalConfigId = process.env.STRIPE_PORTAL_CONFIG_ID

  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/workspace`,
    ...(portalConfigId ? { configuration: portalConfigId } : {}),
  })

  return NextResponse.json({ url: session.url })
}
