import { NextResponse } from 'next/server'
import { authenticateApiKey } from '@/lib/api-key-auth'
import { db } from '@/lib/db'
import { appendRunEvent } from '@/lib/run-events'

// POST /api/agent/runs — create a new run for a project
export async function POST(req: Request) {
  const apiKey = await authenticateApiKey()
  if (!apiKey) return NextResponse.json({ error: 'Invalid API key.' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const name = String(body.name || '').trim()
  const category = String(body.category || 'ux').trim()
  if (!name) return NextResponse.json({ error: 'name is required.' }, { status: 400 })

  const run = await db.testRun.create({
    data: {
      projectId: apiKey.projectId,
      name,
      category: category as never,
      status: 'running',
      targetUrl: apiKey.project.targetUrl,
      label: body.label || null,
      metadata: body.metadata || null,
    },
  })

  await appendRunEvent(run.id, 'run.started', {
    run: {
      id: run.id,
      name: run.name,
      label: run.label,
      category: run.category,
      status: run.status,
      startedAt: run.startedAt.toISOString(),
    },
  })

  return NextResponse.json({ run: { id: run.id } }, { status: 201 })
}
