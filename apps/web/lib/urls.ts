function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, "")
}

export const APP_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001")
export const LANDING_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_LANDING_URL ?? "http://localhost:3010")

export function landingHref(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${LANDING_URL}${normalizedPath}`
}
