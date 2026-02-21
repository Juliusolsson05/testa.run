export const CONSENT_COOKIE_NAME = 'tr_cookie_consent'
export const CONSENT_VERSION = 1
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180

export type CookieConsent = {
  v: number
  ts: string
  necessary: true
  analytics: boolean
  marketing: boolean
}

export function makeConsent(input: Partial<CookieConsent>): CookieConsent {
  return {
    v: CONSENT_VERSION,
    ts: new Date().toISOString(),
    necessary: true,
    analytics: Boolean(input.analytics),
    marketing: Boolean(input.marketing),
  }
}

export function parseConsent(raw?: string | null): CookieConsent | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<CookieConsent>
    if (typeof parsed !== 'object' || parsed === null) return null
    if (parsed.v !== CONSENT_VERSION) return null
    return {
      v: CONSENT_VERSION,
      ts: typeof parsed.ts === 'string' ? parsed.ts : new Date().toISOString(),
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    }
  } catch {
    return null
  }
}

export function serializeConsent(consent: CookieConsent): string {
  return encodeURIComponent(JSON.stringify(consent))
}

export function cookieStringForConsent(consent: CookieConsent): string {
  return `${CONSENT_COOKIE_NAME}=${serializeConsent(consent)}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax; Secure`
}
