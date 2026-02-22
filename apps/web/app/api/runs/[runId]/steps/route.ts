import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/runs/:runId/steps
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

  const steps = await db.runStep.findMany({
    where: { runId },
    orderBy: { index: 'asc' },
    include: {
      node: { select: { nodeKey: true, label: true, url: true } },
    },
  })

  type StepItem = (typeof steps)[number]

  return NextResponse.json({
    steps: steps.map((s: StepItem) => ({
      id: s.id,
      index: s.index,
      action: s.action,
      target: s.target,
      description: s.description,
      reasoning: s.reasoning,
      durationMs: s.durationMs,
      status: s.status,
      nodeKey: s.node.nodeKey,
      nodeLabel: s.node.label,
      nodeUrl: s.node.url,
    })),
  })
}
