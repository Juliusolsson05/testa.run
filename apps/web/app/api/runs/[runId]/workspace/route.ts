import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/runs/:runId/workspace — full canvas payload
export async function GET(_req: Request, { params }: { params: Promise<{ runId: string }> }) {
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

  const [nodes, edges, issues] = await Promise.all([
    db.flowNode.findMany({ where: { runId }, orderBy: { step: 'asc' } }),
    db.flowEdge.findMany({ where: { runId } }),
    db.issue.findMany({ where: { runId }, orderBy: { detectedAt: 'asc' } }),
  ])

  // Build nodeKey lookup for edges and issues
  const nodeById = new Map(nodes.map((n) => [n.id, n]))

  return NextResponse.json({
    run: {
      id: run.id,
      name: run.name,
      label: run.label,
      category: run.category,
      status: run.status,
      startedAt: run.startedAt,
      securitySynopsis: run.securitySynopsis,
    },
    nodes: nodes.map((n) => ({
      id: n.nodeKey,
      position: { x: n.positionX, y: n.positionY },
      data: {
        label: n.label,
        url: n.url,
        status: n.status,
        step: n.step,
        duration: n.durationMs ? `${(n.durationMs / 1000).toFixed(1)}s` : undefined,
        isMain: n.isMain,
        isLarge: n.isLarge,
        imageSrc: n.screenshotUrl || n.screenshotPath,
        sourceHandle: n.sourceHandleSide
          ? { side: n.sourceHandleSide, imageY: n.sourceHandleImageY }
          : undefined,
        ...((n.data as Record<string, unknown>) ?? {}),
      },
    })),
    edges: edges.map((e) => ({
      id: e.edgeKey,
      source: nodeById.get(e.sourceNodeId)?.nodeKey ?? e.sourceNodeId,
      target: nodeById.get(e.targetNodeId)?.nodeKey ?? e.targetNodeId,
      type: e.type,
      label: e.label,
      zIndex: e.zIndex,
      style: e.style,
    })),
    issues: issues.map((i) => ({
      id: i.id,
      nodeId: nodeById.get(i.nodeId)?.nodeKey ?? i.nodeId,
      runId: i.runId,
      category: i.category,
      severity: i.severity,
      status: i.status,
      title: i.title,
      description: i.description,
      reasoning: i.reasoning,
      element: i.element,
    })),
  })
}
