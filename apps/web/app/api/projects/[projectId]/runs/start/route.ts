import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'
import { appendRunEvent } from '@/lib/run-events'
import { startRunExecution } from '@/lib/run-runner'
import { enforceMonthlyRunLimit } from '@/lib/plan-limits'

// POST /api/projects/:projectId/runs/start — create and start a new run (user-auth)
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

  if (!process.env.TESTING_ENGINE_URL) {
    return NextResponse.json({ error: 'TESTING_ENGINE_URL is not configured.' }, { status: 500 })
  }

  const body = await req.json().catch(() => null)
  const name = String(body?.name || 'Manual Test Run').trim()
  const category = String(body?.category || 'ux').trim() as 'security' | 'buttons' | 'ux'
  const label = body?.label || `#${Date.now().toString(36)}`

  const run = await db.testRun.create({
    data: {
      projectId,
      name,
      category,
      status: 'running',
      targetUrl: project.targetUrl,
      label,
      metadata: body?.metadata || null,
    },
  })

  await appendRunEvent(run.id, 'run.started', {
    run: {
      id: run.id,
      name: run.name,
      label: run.label,
      category: run.category,
      status: run.status,
      startedAt: run.startedAt.toISOString(),
      targetUrl: run.targetUrl,
    },
  })

  startRunExecution({
    runId: run.id,
    url: run.targetUrl || project.targetUrl,
    prompt: typeof body?.prompt === 'string' ? body.prompt : undefined,
    runName: run.name,
    category,
  })

  return NextResponse.json({ run: { id: run.id } }, { status: 201 })
}
