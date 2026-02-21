import type { User as SupabaseUser } from '@supabase/supabase-js'
import { db } from '@/lib/db'
import { getRequestSupabaseUser } from '@/lib/supabase-auth'

export async function upsertAppUserFromSupabaseUser(user: SupabaseUser) {
  const email = user.email?.trim().toLowerCase()
  if (!email) {
    throw new Error('Supabase user has no email')
  }

  const appUser = await db.user.upsert({
    where: { supabaseAuthId: user.id },
    update: {
      email,
      lastSeenAt: new Date(),
    },
    create: {
      supabaseAuthId: user.id,
      email,
      lastSeenAt: new Date(),
    },
  })

  return appUser
}

export async function requireAppUser() {
  const supabaseUser = await getRequestSupabaseUser()
  if (!supabaseUser) {
    throw new Error('Unauthorized')
  }

  return upsertAppUserFromSupabaseUser(supabaseUser)
}
