const LEGACY_HOST = '76.13.77.252'
const LEGACY_PORT = '8088'
const SCREENSHOT_HOST = 'screenshots.testa.run'

function isAllowedRemote(url: URL) {
  const isLegacy = url.protocol === 'http:' && url.hostname === LEGACY_HOST && url.port === LEGACY_PORT
  const isHttpsHost = url.protocol === 'https:' && url.hostname === SCREENSHOT_HOST
  return (isLegacy || isHttpsHost) && url.pathname.startsWith('/runs/')
}

export function toScreenshotProxyUrl(raw: string | null | undefined) {
  if (!raw) return raw

  try {
    const parsed = new URL(raw)
    if (!isAllowedRemote(parsed)) return raw
    return `/api/screenshots/proxy?url=${encodeURIComponent(parsed.toString())}`
  } catch {
    return raw
  }
}

export function parseAllowedScreenshotUrl(raw: string | null) {
  if (!raw) return null
  try {
    const parsed = new URL(raw)
    return isAllowedRemote(parsed) ? parsed : null
  } catch {
    return null
  }
}
