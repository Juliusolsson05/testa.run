import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

// PATCH /api/issues/:issueId — resolve / unresolve
export async function PATCH(req: Request, { params }: { params: Promise<{ issueId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { issueId } = await params

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { run: { include: { project: { select: { orgId: true } } } } },
  })
  if (!issue) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const member = await requireOrgMember(user.id, issue.run.project.orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const newStatus = body.status as 'open' | 'resolved' | 'archived' | undefined
  const resolutionNote = body.resolutionNote as string | undefined

  const data: Record<string, unknown> = {
    ...(newStatus === 'resolved'
      ? { status: 'resolved', resolvedAt: new Date(), resolvedById: user.id, resolutionNote: resolutionNote ?? null }
      : {}),
    ...(newStatus === 'open'
      ? { status: 'open', resolvedAt: null, resolvedById: null, resolutionNote: null }
      : {}),
    ...(newStatus === 'archived'
      ? { status: 'archived', resolvedAt: issue.resolvedAt ?? new Date(), resolvedById: issue.resolvedById ?? user.id }
      : {}),
  }

  const updated = await db.issue.update({
    where: { id: issueId },
    data: data as never,
  })

  // Update denormalized counts on run
  if (newStatus) {
    const openCounts = await db.issue.groupBy({
      by: ['severity'],
      where: { runId: issue.runId, status: 'open' },
      _count: true,
    })
    await db.testRun.update({
      where: { id: issue.runId },
      data: {
        openErrors: openCounts.find((c) => c.severity === 'error')?._count ?? 0,
        openWarnings: openCounts.find((c) => c.severity === 'warning')?._count ?? 0,
      },
    })
  }

  return NextResponse.json({ issue: updated })
}
