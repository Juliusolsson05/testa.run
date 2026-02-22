import { NextResponse } from 'next/server'
import { parseAllowedScreenshotUrl } from '@/lib/screenshots'

// GET /api/screenshots/proxy?url=<encoded screenshot url>
export async function GET(req: Request) {
  const targetRaw = new URL(req.url).searchParams.get('url')
  const target = parseAllowedScreenshotUrl(targetRaw)

  if (!target) {
    return NextResponse.json({ error: 'Invalid screenshot url' }, { status: 400 })
  }

  let upstream: Response
  try {
    upstream = await fetch(target.toString(), {
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    return NextResponse.json({ error: 'Screenshot upstream unavailable' }, { status: 502 })
  }

  if (!upstream.ok) {
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') || 'text/plain; charset=utf-8',
        'cache-control': 'public, max-age=60',
      },
    })
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      'content-type': upstream.headers.get('content-type') || 'image/png',
      'cache-control': 'public, max-age=300',
    },
  })
}
