import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function isNonDesktop(ua: string) {
  if (!ua) return false
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry|Opera Mini|Mobile/i.test(ua)
}

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || ""

  if (isNonDesktop(ua)) {
    return new NextResponse(
      "This dashboard is currently available on desktop/laptop only.",
      { status: 403, headers: { "content-type": "text/plain; charset=utf-8" } }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/workspace/:path*", "/settings", "/onboarding/:path*"],
}
