import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/projects/:projectId/issues?runId=<optional>
export async function GET(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { projectId } = await params

  const project = await db.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const member = await requireOrgMember(user.id, project.orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const url = new URL(req.url)
  const runId = url.searchParams.get('runId')
  const status = url.searchParams.get('status') as string | null
  const severity = url.searchParams.get('severity') as string | null
  const category = url.searchParams.get('category') as string | null
  const includeArchived = url.searchParams.get('includeArchived') === 'true'

  const issues = await db.issue.findMany({
    where: {
      run: { projectId },
      ...(runId ? { runId } : {}),
      ...(status ? { status: status as never } : {}),
      ...(!status && !includeArchived ? { status: { not: 'archived' as never } } : {}),
      ...(severity ? { severity: severity as never } : {}),
      ...(category ? { category: category as never } : {}),
    },
    orderBy: [{ status: 'asc' }, { severity: 'desc' }, { detectedAt: 'desc' }],
    include: {
      run: { select: { id: true, name: true, label: true, startedAt: true } },
      node: { select: { nodeKey: true, label: true } },
      step: { select: { index: true } },
    },
  })

  return NextResponse.json({
    issues: issues.map((i) => ({
      id: i.id,
      runId: i.runId,
      runName: i.run.label || i.run.name,
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
