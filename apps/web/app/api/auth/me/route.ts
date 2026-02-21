import { NextResponse } from 'next/server'
import { requireAppUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await requireAppUser()
    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        supabaseAuthId: user.supabaseAuthId,
        lastSeenAt: user.lastSeenAt,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
