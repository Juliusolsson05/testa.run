import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/runs/:runId/issues
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
  const status = url.searchParams.get('status') as string | null
  const severity = url.searchParams.get('severity') as string | null
  const category = url.searchParams.get('category') as string | null
  const includeArchived = url.searchParams.get('includeArchived') === 'true'

  const issues = await db.issue.findMany({
    where: {
      runId,
      ...(status ? { status: status as never } : {}),
      ...(!status && !includeArchived ? { status: { not: 'archived' as never } } : {}),
      ...(severity ? { severity: severity as never } : {}),
      ...(category ? { category: category as never } : {}),
    },
    orderBy: { detectedAt: 'asc' },
    include: {
      node: { select: { nodeKey: true, label: true } },
      step: { select: { index: true, action: true } },
    },
  })

  type IssueItem = (typeof issues)[number]

  return NextResponse.json({
    issues: issues.map((i: IssueItem) => ({
      id: i.id,
      nodeKey: i.node.nodeKey,
      nodeLabel: i.node.label,
      stepIndex: i.step?.index ?? null,
      category: i.category,
      severity: i.severity,
      status: i.status,
      title: i.title,
      description: i.description,
      reasoning: i.reasoning,
      element: i.element,
      detectedAt: i.detectedAt,
      resolvedAt: i.resolvedAt,
      resolutionNote: i.resolutionNote,
    })),
  })
}
