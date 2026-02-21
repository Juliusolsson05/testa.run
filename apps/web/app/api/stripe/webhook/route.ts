import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import type Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('[stripe webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('[stripe] Checkout completed:', session.id, 'customer:', session.customer)
      // TODO: activate subscription in DB
      // - Look up user by session.customer or session.subscription metadata
      // - Set plan to 'pro', store stripe_customer_id + stripe_subscription_id
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      console.log('[stripe] Subscription updated:', sub.id, 'status:', sub.status)
      // TODO: sync plan status
      // - If status === 'active', ensure plan matches price
      // - If status === 'past_due', flag account
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      console.log('[stripe] Subscription cancelled:', sub.id)
      // TODO: downgrade to free
      // - Set plan to 'starter', clear stripe_subscription_id
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      console.log('[stripe] Invoice paid:', invoice.id, 'customer:', invoice.customer)
      // TODO: record payment, extend billing period if needed
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      console.error('[stripe] Payment failed:', invoice.id, 'customer:', invoice.customer)
      // TODO: notify user, set grace period
      break
    }

    default:
      console.log('[stripe] Unhandled event type:', event.type)
  }

  return NextResponse.json({ received: true })
}
