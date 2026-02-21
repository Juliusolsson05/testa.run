import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const priceId = String(body.priceId || '').trim()
  // TODO: get from Supabase auth session once wired
  const customerId = String(body.customerId || '').trim()
  const customerEmail = String(body.customerEmail || '').trim()

  if (!priceId) {
    return NextResponse.json({ error: 'priceId is required.' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/billing/cancelled`,
    ...(customerId ? { customer: customerId } : {}),
    ...(!customerId && customerEmail ? { customer_email: customerEmail } : {}),
    subscription_data: {
      metadata: {
        // TODO: attach internal user ID here once Supabase auth is wired
      },
    },
  })

  return NextResponse.json({ url: session.url })
}
