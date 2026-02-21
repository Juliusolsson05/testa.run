import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const startedAt = Date.now()

  try {
    await db.$queryRaw`SELECT 1`

    return NextResponse.json({
      ok: true,
      service: 'db',
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: 'db',
        error: error instanceof Error ? error.message : 'Unknown error',
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
