import { NextResponse } from 'next/server'
import { getRequestSupabaseUser } from '@/lib/supabase-auth'
import { upsertAppUserFromSupabaseUser } from '@/lib/auth'

export async function POST() {
  const supabaseUser = await getRequestSupabaseUser()
  if (!supabaseUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appUser = await upsertAppUserFromSupabaseUser(supabaseUser)

  return NextResponse.json({
    ok: true,
    user: {
      id: appUser.id,
      email: appUser.email,
      plan: appUser.plan,
      supabaseAuthId: appUser.supabaseAuthId,
      lastSeenAt: appUser.lastSeenAt,
    },
  })
}
