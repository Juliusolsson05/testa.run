import Stripe from 'stripe'
import { requireEnv } from '@/lib/env'
import { validateStripeEnv } from '@/lib/stripe-config'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    validateStripeEnv()
    const key = requireEnv('STRIPE_SECRET_KEY')
    _stripe = new Stripe(key, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    })
  }
  return _stripe
}
