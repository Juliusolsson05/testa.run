import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'
import { listRunEvents, subscribeRunEvents, type RunEventEnvelope } from '@/lib/run-events'

function encodeSse(event: RunEventEnvelope) {
  return `id: ${event.seq}\nevent: run-event\ndata: ${JSON.stringify(event)}\n\n`
}

// GET /api/runs/:runId/stream?afterSeq=0
export async function GET(req: Request, { params }: { params: Promise<{ runId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { runId } = await params

  const run = await db.testRun.findUnique({
    where: { id: runId },
    include: { project: { select: { orgId: true } } },
  })
  if (!run) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const member = await requireOrgMember(user.id, run.project.orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const url = new URL(req.url)
  const afterSeq = Number(url.searchParams.get('afterSeq') ?? '0')

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder()

      const backlog = await listRunEvents(runId, Number.isFinite(afterSeq) ? afterSeq : 0, 500)
      for (const event of backlog) controller.enqueue(enc.encode(encodeSse(event)))

      const interval = setInterval(() => {
        controller.enqueue(enc.encode('event: ping\ndata: {}\n\n'))
      }, 15000)

      const unsubscribe = subscribeRunEvents(runId, (event) => {
        controller.enqueue(enc.encode(encodeSse(event)))
      })

      const cleanup = () => {
        clearInterval(interval)
        unsubscribe()
      }

      req.signal.addEventListener('abort', () => {
        cleanup()
        controller.close()
      })
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
