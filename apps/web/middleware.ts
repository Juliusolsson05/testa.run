import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function isNonDesktop(ua: string) {
  if (!ua) return false
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry|Opera Mini|Mobile/i.test(ua)
}

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || ""

  if (isNonDesktop(ua)) {
    const url = req.nextUrl.clone()
    url.pathname = "/unsupported"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/workspace/:path*", "/settings", "/onboarding/:path*"],
}
