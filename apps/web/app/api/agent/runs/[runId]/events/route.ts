import { NextResponse } from 'next/server'
import { authenticateApiKey } from '@/lib/api-key-auth'
import { db } from '@/lib/db'

type Event =
  | { type: 'node.upsert'; node: Record<string, unknown> }
  | { type: 'edge.upsert'; edge: Record<string, unknown> }
  | { type: 'step.create'; step: Record<string, unknown> }
  | { type: 'issue.create'; issue: Record<string, unknown> }
  | { type: 'artifact.create'; artifact: Record<string, unknown> }

// POST /api/agent/runs/:runId/events — batch ingest pipe
export async function POST(req: Request, { params }: { params: Promise<{ runId: string }> }) {
  const apiKey = await authenticateApiKey()
  if (!apiKey) return NextResponse.json({ error: 'Invalid API key.' }, { status: 401 })
  const { runId } = await params

  // Verify run belongs to this project
  const run = await db.testRun.findUnique({ where: { id: runId } })
  if (!run || run.projectId !== apiKey.projectId) {
    return NextResponse.json({ error: 'Run not found or not owned by this project.' }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.events || !Array.isArray(body.events)) {
    return NextResponse.json({ error: 'events array is required.' }, { status: 400 })
  }

  const events = body.events as Event[]

  // Resolve nodeKey → id within this run
  async function resolveNodeId(nodeKey: string): Promise<string | null> {
    const node = await db.flowNode.findUnique({ where: { runId_nodeKey: { runId, nodeKey } } })
    return node?.id ?? null
  }

  for (const evt of events) {
    switch (evt.type) {
      case 'node.upsert': {
        const n = evt.node
        await db.flowNode.upsert({
          where: { runId_nodeKey: { runId, nodeKey: String(n.nodeKey) } },
          update: {
            label: String(n.label ?? ''),
            url: String(n.url ?? ''),
            status: (n.status as never) ?? 'pending',
            step: Number(n.step ?? 0),
            durationMs: n.durationMs != null ? Number(n.durationMs) : null,
            isMain: Boolean(n.isMain),
            isLarge: Boolean(n.isLarge),
            positionX: Number((n.position as { x?: number })?.x ?? n.positionX ?? 0),
            positionY: Number((n.position as { y?: number })?.y ?? n.positionY ?? 0),
            screenshotUrl: n.screenshotUrl ? String(n.screenshotUrl) : null,
            screenshotPath: n.screenshotPath ? String(n.screenshotPath) : null,
            sourceHandleSide: n.sourceHandle
              ? ((n.sourceHandle as { side?: string }).side as never) ?? null
              : null,
            sourceHandleImageY: n.sourceHandle
              ? Number((n.sourceHandle as { imageY?: number }).imageY ?? 0)
              : null,
            data: (n.data as object) ?? null,
          },
          create: {
            runId,
            nodeKey: String(n.nodeKey),
            label: String(n.label ?? ''),
            url: String(n.url ?? ''),
            status: (n.status as never) ?? 'pending',
            step: Number(n.step ?? 0),
            durationMs: n.durationMs != null ? Number(n.durationMs) : null,
            isMain: Boolean(n.isMain),
            isLarge: Boolean(n.isLarge),
            positionX: Number((n.position as { x?: number })?.x ?? n.positionX ?? 0),
            positionY: Number((n.position as { y?: number })?.y ?? n.positionY ?? 0),
            screenshotUrl: n.screenshotUrl ? String(n.screenshotUrl) : null,
            screenshotPath: n.screenshotPath ? String(n.screenshotPath) : null,
            sourceHandleSide: n.sourceHandle
              ? ((n.sourceHandle as { side?: string }).side as never) ?? null
              : null,
            sourceHandleImageY: n.sourceHandle
              ? Number((n.sourceHandle as { imageY?: number }).imageY ?? 0)
              : null,
            data: (n.data as object) ?? null,
          },
        })
        break
      }

      case 'edge.upsert': {
        const e = evt.edge
        const sourceId = await resolveNodeId(String(e.sourceNodeKey ?? e.source))
        const targetId = await resolveNodeId(String(e.targetNodeKey ?? e.target))
        if (!sourceId || !targetId) break // skip if nodes don't exist yet

        await db.flowEdge.upsert({
          where: { runId_edgeKey: { runId, edgeKey: String(e.edgeKey ?? e.id) } },
          update: {
            sourceNodeId: sourceId,
            targetNodeId: targetId,
            type: e.type ? String(e.type) : null,
            label: e.label ? String(e.label) : null,
            zIndex: e.zIndex != null ? Number(e.zIndex) : null,
            style: (e.style as object) ?? null,
          },
          create: {
            runId,
            edgeKey: String(e.edgeKey ?? e.id),
            sourceNodeId: sourceId,
            targetNodeId: targetId,
            type: e.type ? String(e.type) : null,
            label: e.label ? String(e.label) : null,
            zIndex: e.zIndex != null ? Number(e.zIndex) : null,
            style: (e.style as object) ?? null,
          },
        })
        break
      }

      case 'step.create': {
        const s = evt.step
        const nodeId = await resolveNodeId(String(s.nodeKey))
        if (!nodeId) break

        await db.runStep.upsert({
          where: { runId_index: { runId, index: Number(s.index) } },
          update: {
            action: s.action as never,
            target: String(s.target ?? ''),
            description: String(s.description ?? ''),
            reasoning: String(s.reasoning ?? ''),
            durationMs: s.durationMs != null ? Number(s.durationMs) : null,
            status: (s.status as never) ?? 'passed',
          },
          create: {
            runId,
            nodeId,
            index: Number(s.index),
            action: s.action as never,
            target: String(s.target ?? ''),
            description: String(s.description ?? ''),
            reasoning: String(s.reasoning ?? ''),
            durationMs: s.durationMs != null ? Number(s.durationMs) : null,
            status: (s.status as never) ?? 'passed',
          },
        })

        // Update total steps count
        const stepCount = await db.runStep.count({ where: { runId } })
        await db.testRun.update({ where: { id: runId }, data: { totalSteps: stepCount } })
        break
      }

      case 'issue.create': {
        const i = evt.issue
        const nodeId = await resolveNodeId(String(i.nodeKey))
        if (!nodeId) break

        let stepId: string | null = null
        if (i.stepIndex != null) {
          const step = await db.runStep.findUnique({
            where: { runId_index: { runId, index: Number(i.stepIndex) } },
          })
          stepId = step?.id ?? null
        }

        await db.issue.create({
          data: {
            runId,
            nodeId,
            stepId,
            category: (i.category as never) ?? 'other',
            severity: (i.severity as never) ?? 'warning',
            title: String(i.title ?? ''),
            description: String(i.description ?? ''),
            reasoning: String(i.reasoning ?? ''),
            element: String(i.element ?? ''),
          },
        })

        // Update denormalized counts
        const openCounts = await db.issue.groupBy({
          by: ['severity'],
          where: { runId, status: 'open' },
          _count: true,
        })
        await db.testRun.update({
          where: { id: runId },
          data: {
            openErrors: openCounts.find((c) => c.severity === 'error')?._count ?? 0,
            openWarnings: openCounts.find((c) => c.severity === 'warning')?._count ?? 0,
          },
        })
        break
      }

      case 'artifact.create': {
        const a = evt.artifact
        const nodeId = a.nodeKey ? await resolveNodeId(String(a.nodeKey)) : null
        let stepId: string | null = null
        if (a.stepIndex != null) {
          const step = await db.runStep.findUnique({
            where: { runId_index: { runId, index: Number(a.stepIndex) } },
          })
          stepId = step?.id ?? null
        }

        await db.artifact.create({
          data: {
            runId,
            nodeId,
            stepId,
            type: (a.type as never) ?? 'other',
            storage: (a.storage as never) ?? 'supabase',
            bucket: a.bucket ? String(a.bucket) : null,
            path: a.path ? String(a.path) : null,
            url: a.url ? String(a.url) : null,
            mimeType: a.mimeType ? String(a.mimeType) : null,
            sizeBytes: a.sizeBytes != null ? Number(a.sizeBytes) : null,
            width: a.width != null ? Number(a.width) : null,
            height: a.height != null ? Number(a.height) : null,
          },
        })
        break
      }
    }
  }

  await db.testRun.update({ where: { id: runId }, data: { updatedAt: new Date() } })

  return NextResponse.json({ ok: true })
}
