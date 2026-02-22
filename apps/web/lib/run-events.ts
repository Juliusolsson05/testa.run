import type { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import type { RunEventEnvelope } from '@/types/events'

type RunEventListener = (event: RunEventEnvelope) => void

const bus = globalThis as typeof globalThis & {
  __testaRunEventBus?: Map<string, Set<RunEventListener>>
}

if (!bus.__testaRunEventBus) bus.__testaRunEventBus = new Map()

function publishRunEvent(event: RunEventEnvelope) {
  const listeners = bus.__testaRunEventBus?.get(event.runId)
  if (!listeners || listeners.size === 0) return
  for (const listener of listeners) listener(event)
}

export function subscribeRunEvents(runId: string, listener: RunEventListener) {
  if (!bus.__testaRunEventBus?.has(runId)) bus.__testaRunEventBus?.set(runId, new Set())
  bus.__testaRunEventBus?.get(runId)?.add(listener)

  return () => {
    bus.__testaRunEventBus?.get(runId)?.delete(listener)
  }
}

export async function appendRunEvent(runId: string, type: string, payload: Record<string, unknown>) {
  const event = await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const run = await tx.testRun.update({
      where: { id: runId },
      data: { eventSeq: { increment: 1 } },
      select: { eventSeq: true },
    })

    const created = await tx.runEvent.create({
      data: {
        runId,
        seq: run.eventSeq,
        type,
        payload: payload as never,
      },
    })

    return {
      runId,
      seq: created.seq,
      at: created.createdAt.toISOString(),
      type: created.type,
      payload: created.payload as Record<string, unknown>,
    } satisfies RunEventEnvelope
  })

  publishRunEvent(event)
  return event
}

export async function listRunEvents(runId: string, afterSeq = 0, limit = 200) {
  const events = await db.runEvent.findMany({
    where: { runId, seq: { gt: afterSeq } },
    orderBy: { seq: 'asc' },
    take: Math.min(Math.max(limit, 1), 1000),
  })

  type EventItem = (typeof events)[number]

  return events.map((e: EventItem) => ({
    runId: e.runId,
    seq: e.seq,
    at: e.createdAt.toISOString(),
    type: e.type,
    payload: e.payload as Record<string, unknown>,
  }))
}

export type { RunEventEnvelope }
