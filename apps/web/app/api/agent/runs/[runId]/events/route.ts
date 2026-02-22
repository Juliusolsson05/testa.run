import { NextResponse } from 'next/server'
import { authenticateApiKey } from '@/lib/api-key-auth'
import { db } from '@/lib/db'
import { applyAgentEvents, type AgentEvent } from '@/lib/agent-ingest'

// POST /api/agent/runs/:runId/events — batch ingest pipe
export async function POST(req: Request, { params }: { params: Promise<{ runId: string }> }) {
  const apiKey = await authenticateApiKey()
  if (!apiKey) return NextResponse.json({ error: 'Invalid API key.' }, { status: 401 })
  const { runId } = await params

  const run = await db.testRun.findUnique({ where: { id: runId } })
  if (!run || run.projectId !== apiKey.projectId) {
    return NextResponse.json({ error: 'Run not found or not owned by this project.' }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.events || !Array.isArray(body.events)) {
    return NextResponse.json({ error: 'events array is required.' }, { status: 400 })
  }

  const result = await applyAgentEvents(runId, body.events as AgentEvent[])
  return NextResponse.json(result)
}
