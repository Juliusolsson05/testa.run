const requiredBootVars = ['NEXT_PUBLIC_APP_URL'] as const

function missing(keys: readonly string[]) {
  return keys.filter((key) => !process.env[key] || String(process.env[key]).trim() === '')
}

export function validateBootEnv() {
  const missingVars = missing(requiredBootVars)
  if (missingVars.length > 0) {
    throw new Error(`[env] Missing required env vars: ${missingVars.join(', ')}`)
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value || value.trim() === '') {
    throw new Error(`[env] Missing required env var: ${name}`)
  }
  return value
}
