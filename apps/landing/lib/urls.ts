function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, "")
}

export const APP_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001")
export const LANDING_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_LANDING_URL ?? "http://localhost:3010")

export function appHref(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${APP_URL}${normalizedPath}`
}

export function appSignUpWithTarget(targetUrl?: string) {
  if (!targetUrl) return appHref('/sign-up')
  const trimmed = targetUrl.trim()
  if (!trimmed) return appHref('/sign-up')

  const normalizedTarget = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  const next = `/onboarding/project?targetUrl=${encodeURIComponent(normalizedTarget)}`
  return `${appHref('/sign-up')}?next=${encodeURIComponent(next)}&targetUrl=${encodeURIComponent(normalizedTarget)}`
}
