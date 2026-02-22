import { db } from '@/lib/db'
import { appendRunEvent } from '@/lib/run-events'

export type AgentEvent =
  | { type: 'node.upsert'; node: Record<string, unknown> }
  | { type: 'edge.upsert'; edge: Record<string, unknown> }
  | { type: 'step.create'; step: Record<string, unknown> }
  | { type: 'issue.create'; issue: Record<string, unknown> }
  | { type: 'artifact.create'; artifact: Record<string, unknown> }

export async function applyAgentEvents(runId: string, events: AgentEvent[]) {
  async function resolveNodeId(nodeKey: string): Promise<string | null> {
    const node = await db.flowNode.findUnique({ where: { runId_nodeKey: { runId, nodeKey } } })
    return node?.id ?? null
  }

  const errors: Array<{ index: number; type: string; message: string }> = []
  let accepted = 0
  let skipped = 0
  let lastSeq: number | null = null

  // Two-pass processing improves resilience when events arrive out of order.
  const withIndex = events.map((evt, index) => ({ evt, index }))
  const passA = withIndex.filter(({ evt }) => evt.type === 'node.upsert' || evt.type === 'step.create')
  const passB = withIndex.filter(({ evt }) => evt.type === 'edge.upsert' || evt.type === 'issue.create' || evt.type === 'artifact.create')

  for (const { evt, index } of [...passA, ...passB]) {
    try {
      switch (evt.type) {
        case 'node.upsert': {
          const n = evt.node
          const node = await db.flowNode.upsert({
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

          const event = await appendRunEvent(runId, 'node.upserted', {
            node: {
              id: node.nodeKey,
              position: { x: node.positionX, y: node.positionY },
              data: {
                label: node.label,
                url: node.url,
                status: node.status,
                step: node.step,
                duration: node.durationMs ? `${(node.durationMs / 1000).toFixed(1)}s` : undefined,
                isMain: node.isMain,
                isLarge: node.isLarge,
                imageSrc: node.screenshotUrl || node.screenshotPath,
                sourceHandle: node.sourceHandleSide
                  ? { side: node.sourceHandleSide, imageY: node.sourceHandleImageY }
                  : undefined,
                ...((node.data as Record<string, unknown>) ?? {}),
              },
            },
          })
          lastSeq = event.seq
          accepted += 1
          break
        }

        case 'step.create': {
          const s = evt.step
          const nodeId = await resolveNodeId(String(s.nodeKey))
          if (!nodeId) {
            skipped += 1
            break
          }

          const step = await db.runStep.upsert({
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
            include: { node: { select: { nodeKey: true, label: true, url: true } } },
          })

          const stepCount = await db.runStep.count({ where: { runId } })
          await db.testRun.update({ where: { id: runId }, data: { totalSteps: stepCount } })

          const event = await appendRunEvent(runId, 'step.upserted', {
            step: {
              id: step.id,
              index: step.index,
              action: step.action,
              target: step.target,
              description: step.description,
              reasoning: step.reasoning,
              durationMs: step.durationMs,
              status: step.status,
              nodeKey: step.node.nodeKey,
              nodeLabel: step.node.label,
              nodeUrl: step.node.url,
            },
          })
          lastSeq = event.seq
          accepted += 1
          break
        }

        case 'edge.upsert': {
          const e = evt.edge
          const sourceId = await resolveNodeId(String(e.sourceNodeKey ?? e.source))
          const targetId = await resolveNodeId(String(e.targetNodeKey ?? e.target))
          if (!sourceId || !targetId) {
            skipped += 1
            break
          }

          const edge = await db.flowEdge.upsert({
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

          const sourceNode = await db.flowNode.findUnique({ where: { id: edge.sourceNodeId }, select: { nodeKey: true } })
          const targetNode = await db.flowNode.findUnique({ where: { id: edge.targetNodeId }, select: { nodeKey: true } })

          const event = await appendRunEvent(runId, 'edge.upserted', {
            edge: {
              id: edge.edgeKey,
              source: sourceNode?.nodeKey ?? edge.sourceNodeId,
              target: targetNode?.nodeKey ?? edge.targetNodeId,
              type: edge.type,
              label: edge.label,
              zIndex: edge.zIndex,
              style: edge.style,
            },
          })
          lastSeq = event.seq
          accepted += 1
          break
        }

        case 'issue.create': {
          const i = evt.issue

          // Prefer step-based attribution for correctness; fallback to nodeKey.
          let stepId: string | null = null
          let nodeId: string | null = null
          if (i.stepIndex != null) {
            const step = await db.runStep.findUnique({
              where: { runId_index: { runId, index: Number(i.stepIndex) } },
              select: { id: true, nodeId: true },
            })
            stepId = step?.id ?? null
            nodeId = step?.nodeId ?? null
          }
          if (!nodeId && i.nodeKey != null) {
            nodeId = await resolveNodeId(String(i.nodeKey))
          }
          if (!nodeId) {
            skipped += 1
            break
          }

          const title = String(i.title ?? '')
          const element = String(i.element ?? '')

          // Lightweight dedupe for retries/replays.
          const duplicate = await db.issue.findFirst({
            where: {
              runId,
              nodeId,
              stepId,
              title,
              element,
              status: 'open',
            },
            select: { id: true },
          })
          if (duplicate) {
            skipped += 1
            break
          }

          const created = await db.issue.create({
            data: {
              runId,
              nodeId,
              stepId,
              category: (i.category as never) ?? 'other',
              severity: (i.severity as never) ?? 'warning',
              title,
              description: String(i.description ?? ''),
              reasoning: String(i.reasoning ?? ''),
              element,
            },
            include: {
              node: { select: { nodeKey: true, label: true } },
              step: { select: { index: true } },
            },
          })

          const openCounts = await db.issue.groupBy({
            by: ['severity'],
            where: { runId, status: 'open' },
            _count: true,
          })
          type OpenCount = (typeof openCounts)[number]

          await db.testRun.update({
            where: { id: runId },
            data: {
              openErrors: openCounts.find((c: OpenCount) => c.severity === 'error')?._count ?? 0,
              openWarnings: openCounts.find((c: OpenCount) => c.severity === 'warning')?._count ?? 0,
            },
          })

          const event = await appendRunEvent(runId, 'issue.created', {
            issue: {
              id: created.id,
              nodeId: created.node.nodeKey,
              runId: created.runId,
              category: created.category,
              severity: created.severity,
              status: created.status,
              title: created.title,
              description: created.description,
              reasoning: created.reasoning,
              element: created.element,
              stepIndex: created.step?.index ?? null,
            },
          })
          lastSeq = event.seq
          accepted += 1
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

          const artifact = await db.artifact.create({
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

          const event = await appendRunEvent(runId, 'artifact.created', {
            artifact: {
              id: artifact.id,
              type: artifact.type,
              url: artifact.url,
              path: artifact.path,
              bucket: artifact.bucket,
              mimeType: artifact.mimeType,
              sizeBytes: artifact.sizeBytes,
              width: artifact.width,
              height: artifact.height,
            },
          })
          lastSeq = event.seq
          accepted += 1
          break
        }
      }
    } catch (error) {
      errors.push({
        index,
        type: evt.type,
        message: error instanceof Error ? error.message : 'Unknown event ingest error',
      })
    }
  }

  await db.testRun.update({ where: { id: runId }, data: { updatedAt: new Date() } })

  return { ok: errors.length === 0, accepted, skipped, errors, lastSeq }
}
