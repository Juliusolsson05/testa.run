import { createHash } from 'crypto'
import { headers } from 'next/headers'
import { db } from '@/lib/db'

function hashKey(raw: string): string {
  return createHash('sha256').update(raw).digest('hex')
}

/**
 * Generate a new API key. Returns the raw key (show once) and the DB row.
 */
export async function createApiKey(projectId: string, name: string) {
  const raw = `tsk_${crypto.randomUUID().replace(/-/g, '')}`
  const keyHash = hashKey(raw)
  const prefix = raw.slice(0, 8)
  const last4 = raw.slice(-4)

  const row = await db.apiKey.create({
    data: { projectId, name, keyHash, prefix, last4 },
  })

  return { raw, row }
}

/**
 * Authenticate an incoming request via X-API-Key header.
 * Returns the ApiKey row (with project) or null.
 */
export async function authenticateApiKey() {
  const h = await headers()
  const raw = h.get('x-api-key')
  if (!raw) return null

  const keyHash = hashKey(raw)

  const key = await db.apiKey.findUnique({
    where: { keyHash },
    include: { project: true },
  })

  if (!key || key.revokedAt) return null

  // Touch lastUsedAt (fire-and-forget)
  db.apiKey.update({ where: { id: key.id }, data: { lastUsedAt: new Date() } }).catch(() => {})

  return key
}
