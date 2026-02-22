import { requireEnv } from '@/lib/env'

export type StripeMode = 'test' | 'live'

function inferModeFromSecret(secretKey: string): StripeMode {
  if (secretKey.startsWith('sk_live_')) return 'live'
  if (secretKey.startsWith('sk_test_')) return 'test'
  throw new Error('[stripe] STRIPE_SECRET_KEY must start with sk_test_ or sk_live_.')
}

function assertPublishableMatchesMode(mode: StripeMode, publishableKey: string) {
  const expectedPrefix = mode === 'live' ? 'pk_live_' : 'pk_test_'
  if (!publishableKey.startsWith(expectedPrefix)) {
    throw new Error(`[stripe] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with ${expectedPrefix} when STRIPE_SECRET_KEY is ${mode}.`)
  }
}

export function getStripeMode(): StripeMode {
  return inferModeFromSecret(requireEnv('STRIPE_SECRET_KEY'))
}

export function validateStripeEnv() {
  const mode = getStripeMode()
  const publishable = requireEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
  assertPublishableMatchesMode(mode, publishable)
}

export function getProMonthlyPriceId(): string {
  const mode = getStripeMode()

  const modeSpecific = mode === 'live'
    ? process.env.STRIPE_PRO_MONTHLY_PRICE_ID_LIVE
    : process.env.STRIPE_PRO_MONTHLY_PRICE_ID_TEST

  const fallback = process.env.STRIPE_PRO_MONTHLY_PRICE_ID
  const priceId = (modeSpecific || fallback || '').trim()

  if (!priceId) {
    const expected = mode === 'live' ? 'STRIPE_PRO_MONTHLY_PRICE_ID_LIVE' : 'STRIPE_PRO_MONTHLY_PRICE_ID_TEST'
    throw new Error(`[stripe] Missing Pro monthly price id. Set ${expected} (or STRIPE_PRO_MONTHLY_PRICE_ID as fallback).`)
  }

  return priceId
}
