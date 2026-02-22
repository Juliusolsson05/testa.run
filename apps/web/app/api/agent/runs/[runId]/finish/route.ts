import { NextResponse } from 'next/server'
import { authenticateApiKey } from '@/lib/api-key-auth'
import { db } from '@/lib/db'
import { finalizeRun } from '@/lib/run-finalize'

// POST /api/agent/runs/:runId/finish — finalize a run
export async function POST(req: Request, { params }: { params: Promise<{ runId: string }> }) {
  const apiKey = await authenticateApiKey()
  if (!apiKey) return NextResponse.json({ error: 'Invalid API key.' }, { status: 401 })
  const { runId } = await params

  const run = await db.testRun.findUnique({ where: { id: runId } })
  if (!run || run.projectId !== apiKey.projectId) {
    return NextResponse.json({ error: 'Run not found or not owned by this project.' }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const status = String(body.status || 'passed').trim() as 'passed' | 'failed' | 'warning'
  const updated = await finalizeRun(runId, {
    status,
    durationMs: body.durationMs != null ? Number(body.durationMs) : undefined,
    securitySynopsis: body.securitySynopsis ?? null,
  })

  return NextResponse.json({
    run: { id: updated.id, status: updated.status, finishedAt: updated.finishedAt, durationMs: updated.durationMs },
  })
}
