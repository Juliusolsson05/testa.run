import { NextResponse } from 'next/server'
import { appSignUpWithTarget } from '@/lib/urls'

export function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url') ?? undefined

  return NextResponse.redirect(appSignUpWithTarget(url))
}
