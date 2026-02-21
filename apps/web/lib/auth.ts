import type { User as SupabaseUser } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getRequestSupabaseUser } from '@/lib/supabase-auth'

/**
 * Ensure a Prisma User row exists for a Supabase auth user.
 * User.id IS the Supabase auth.users.id (UUID).
 */
export async function upsertAppUser(supabaseUser: SupabaseUser) {
  const email = supabaseUser.email?.trim().toLowerCase()
  if (!email) throw new Error('Supabase user has no email')

  return db.user.upsert({
    where: { id: supabaseUser.id },
    update: { email },
    create: {
      id: supabaseUser.id,
      email,
      name: supabaseUser.user_metadata?.full_name ?? null,
      avatarUrl: supabaseUser.user_metadata?.avatar_url ?? null,
    },
  })
}

/**
 * Resolve the current authenticated user (Supabase → Prisma).
 * Returns the Prisma User or null.
 */
export async function getAppUser() {
  const supabaseUser = await getRequestSupabaseUser()
  if (!supabaseUser) return null
  return upsertAppUser(supabaseUser)
}

/**
 * Like getAppUser but returns 401 NextResponse if not authenticated.
 * Use in route handlers: const user = await requireAppUser(); if (user instanceof NextResponse) return user;
 */
export async function requireAppUser() {
  const user = await getAppUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return user
}

/**
 * Verify that a user is a member of an org (with optional minimum role).
 */
export async function requireOrgMember(userId: string, orgId: string, minRole?: 'owner' | 'admin') {
  const member = await db.organizationMember.findUnique({
    where: { orgId_userId: { orgId, userId } },
  })
  if (!member) return null
  if (minRole === 'owner' && member.role !== 'owner') return null
  if (minRole === 'admin' && member.role === 'member') return null
  return member
}
