import { headers } from 'next/headers'
import { getSupabaseAnon } from '@/lib/supabase'

export async function getRequestSupabaseUser() {
  const h = await headers()
  const authHeader = h.get('authorization') || h.get('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.slice('Bearer '.length).trim()
  if (!token) return null

  const supabase = getSupabaseAnon()
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) return null
  return data.user
}
