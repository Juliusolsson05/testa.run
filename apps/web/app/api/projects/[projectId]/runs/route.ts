import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'
import { enforceMonthlyRunLimit } from '@/lib/plan-limits'

// GET /api/projects/:projectId/runs — paginated run list for home page
export async function GET(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { projectId } = await params

  const project = await db.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const member = await requireOrgMember(user.id, project.orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const url = new URL(req.url)
  const status = url.searchParams.get('status') as string | null
  const category = url.searchParams.get('category') as string | null
  const cursor = url.searchParams.get('cursor') as string | null
  const take = Math.min(Number(url.searchParams.get('take')) || 20, 100)

  const runs = await db.testRun.findMany({
    where: {
      projectId,
      ...(status ? { status: status as never } : {}),
      ...(category ? { category: category as never } : {}),
    },
    orderBy: { startedAt: 'desc' },
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      _count: { select: { steps: true, issues: true } },
    },
  })

  const hasMore = runs.length > take
  const items = hasMore ? runs.slice(0, take) : runs

  type RunItem = (typeof items)[number]

  return NextResponse.json({
    runs: items.map((r: RunItem) => ({
      id: r.id,
      label: r.label,
      name: r.name,
      category: r.category,
      url: r.targetUrl,
      startedAt: r.startedAt,
      durationMs: r.durationMs,
      status: r.status,
      openIssues: { errors: r.openErrors, warnings: r.openWarnings },
      stepsCount: r._count.steps,
    })),
    nextCursor: hasMore ? items[items.length - 1]?.id : null,
  })
}

// POST /api/projects/:projectId/runs — manually create a run from UI
export async function POST(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { projectId } = await params

  const project = await db.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const member = await requireOrgMember(user.id, project.orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const quota = await enforceMonthlyRunLimit(project.orgId)
  if (!quota.ok) {
    return NextResponse.json(
      {
        error: 'Starter plan monthly run limit reached. Upgrade to Pro for unlimited runs.',
        code: 'PLAN_LIMIT_REACHED',
        plan: quota.plan,
        limit: quota.limit,
        used: quota.used,
      },
      { status: 402 }
    )
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const name = String(body.name || '').trim()
  const category = String(body.category || 'ux').trim()
  if (!name) return NextResponse.json({ error: 'name is required.' }, { status: 400 })

  const run = await db.testRun.create({
    data: {
      projectId,
      name,
      category: category as never,
      status: 'running',
      targetUrl: project.targetUrl,
      label: body.label || null,
    },
  })

  return NextResponse.json({ run }, { status: 201 })
}
