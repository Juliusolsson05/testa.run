import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db'
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
      const orgId = session.subscription
        ? ((await getStripe().subscriptions.retrieve(session.subscription as string)).metadata.orgId)
        : session.metadata?.orgId

      if (orgId) {
        await db.billingAccount.upsert({
          where: { orgId },
          update: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            status: 'active',
            plan: 'pro',
          },
          create: {
            orgId,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            status: 'active',
            plan: 'pro',
          },
        })
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const orgId = sub.metadata.orgId
      if (orgId) {
        const statusMap: Record<string, 'active' | 'past_due' | 'canceled' | 'unpaid' | 'trialing' | 'inactive'> = {
          active: 'active',
          past_due: 'past_due',
          canceled: 'canceled',
          unpaid: 'unpaid',
          trialing: 'trialing',
          incomplete: 'inactive',
          incomplete_expired: 'inactive',
          paused: 'inactive',
        }
        await db.billingAccount.update({
          where: { orgId },
          data: {
            status: statusMap[sub.status] ?? 'inactive',
            stripePriceId: sub.items.data[0]?.price.id ?? null,
            currentPeriodStart: (sub as unknown as { current_period_start: number }).current_period_start
              ? new Date((sub as unknown as { current_period_start: number }).current_period_start * 1000)
              : null,
            currentPeriodEnd: (sub as unknown as { current_period_end: number }).current_period_end
              ? new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000)
              : null,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const orgId = sub.metadata.orgId
      if (orgId) {
        await db.billingAccount.update({
          where: { orgId },
          data: {
            status: 'canceled',
            plan: 'starter',
            stripeSubscriptionId: null,
            stripePriceId: null,
          },
        })
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      console.error('[stripe] Payment failed:', invoice.id, 'customer:', invoice.customer)
      break
    }

    default:
      console.log('[stripe] Unhandled event type:', event.type)
  }

  return NextResponse.json({ received: true })
}
