import { createTestRun, type TestRunEvent } from '@repo/testing'
import { appendRunEvent } from '@/lib/run-events'
import { applyAgentEvents, type AgentEvent } from '@/lib/agent-ingest'
import { finalizeRun } from '@/lib/run-finalize'
import { db } from '@/lib/db'

const globalRunner = globalThis as typeof globalThis & {
  __testaRunJobs?: Map<string, { cancel: () => void }>
  __testaRunRecoveryStarted?: boolean
}

if (!globalRunner.__testaRunJobs) globalRunner.__testaRunJobs = new Map()

function toAgentEvents(evt: TestRunEvent): AgentEvent[] {
  switch (evt.type) {
    case 'node.upserted':
      return [{
        type: 'node.upsert',
        node: {
          nodeKey: evt.node.nodeKey,
          label: evt.node.label,
          url: evt.node.url,
          status: evt.node.status,
          step: evt.node.step,
          durationMs: evt.node.durationMs,
          screenshotUrl: evt.node.imageUrl,
          position: { x: evt.node.step * 260, y: 200 },
          isMain: evt.node.step === 1,
        },
      }]
    case 'edge.upserted':
      return [{
        type: 'edge.upsert',
        edge: {
          edgeKey: evt.edge.edgeKey,
          sourceNodeKey: evt.edge.sourceNodeKey,
          targetNodeKey: evt.edge.targetNodeKey,
          label: evt.edge.label,
          type: 'spring',
        },
      }]
    case 'step.upserted':
      // AI output can emit steps before explicit nodes; seed node first to avoid skipped steps.
      return [
        {
          type: 'node.upsert',
          node: {
            nodeKey: evt.step.nodeKey,
            label: evt.step.nodeKey,
            url: evt.step.url,
            status: evt.step.status === 'failed' ? 'running' : 'passed',
            step: evt.step.index,
            position: { x: evt.step.index * 260, y: 200 },
            isMain: evt.step.index === 1,
          },
        },
        {
          type: 'step.create',
          step: {
            index: evt.step.index,
            nodeKey: evt.step.nodeKey,
            action: evt.step.action,
            target: evt.step.target,
            description: evt.step.description,
            reasoning: evt.step.reasoning,
            durationMs: evt.step.durationMs,
            status: evt.step.status,
          },
        },
      ]
    case 'issue.created':
      return [{
        type: 'issue.create',
        issue: {
          nodeKey: evt.issue.nodeKey,
          stepIndex: evt.issue.stepKey ? Number(evt.issue.stepKey.replace(/\D/g, '')) || undefined : undefined,
          category: evt.issue.category,
          severity: evt.issue.severity,
          title: evt.issue.title,
          description: evt.issue.description,
          reasoning: evt.issue.reasoning,
          element: evt.issue.element,
        },
      }]
    default:
      return []
  }
}

async function markStaleRunsFailed() {
  const staleBefore = new Date(Date.now() - 45 * 60 * 1000)
  const stale = await db.testRun.findMany({
    where: { status: 'running', startedAt: { lt: staleBefore } },
    select: { id: true },
    take: 50,
  })

  for (const run of stale) {
    try {
      await finalizeRun(run.id, {
        status: 'failed',
        securitySynopsis: 'Run was marked failed after exceeding max runtime.',
      })
    } catch {
      // best effort recovery
    }
  }
}

function startRecoveryLoop() {
  if (globalRunner.__testaRunRecoveryStarted) return
  globalRunner.__testaRunRecoveryStarted = true

  void markStaleRunsFailed()
  setInterval(() => {
    void markStaleRunsFailed()
  }, 5 * 60 * 1000)
}

export function cancelRunExecution(runId: string) {
  const job = globalRunner.__testaRunJobs?.get(runId)
  if (!job) return false
  job.cancel()
  globalRunner.__testaRunJobs?.delete(runId)
  return true
}

export function startRunExecution(input: {
  runId: string
  url: string
  prompt?: string
  runName?: string
  category?: 'security' | 'buttons' | 'ux'
}) {
  startRecoveryLoop()

  if (globalRunner.__testaRunJobs?.has(input.runId)) return

  const handle = createTestRun(
    {
      url: input.url,
      prompt: input.prompt,
    },
    {
      engineUrl: process.env.TESTING_ENGINE_URL,
      engineToken: process.env.TESTING_ENGINE_TOKEN,
    }
  )

  globalRunner.__testaRunJobs?.set(input.runId, { cancel: handle.cancel })

  void (async () => {
    let finalized = false
    let lastEventAt = Date.now()
    const startedAt = Date.now()

    const finalizeOnce = async (status: 'passed' | 'failed' | 'warning', securitySynopsis?: string | null) => {
      if (finalized) return
      finalized = true
      await finalizeRun(input.runId, { status, securitySynopsis: securitySynopsis ?? null })
    }

    const heartbeatTimer = setInterval(() => {
      if (finalized) return
      void appendRunEvent(input.runId, 'run.heartbeat', { at: new Date().toISOString() })
    }, 30000)

    const watchdogTimer = setInterval(() => {
      if (finalized) return
      const now = Date.now()
      if (now - startedAt > 12 * 60 * 1000) {
        handle.cancel()
        void finalizeOnce('failed', 'Run exceeded max runtime (12m watchdog).')
        return
      }
      if (now - lastEventAt > 90 * 1000) {
        handle.cancel()
        void finalizeOnce('failed', 'Run stalled: no events received for 90s.')
      }
    }, 15000)

    try {
      for await (const evt of handle.events) {
        lastEventAt = Date.now()
        if (evt.type === 'step.progress') {
          await appendRunEvent(input.runId, 'step.progress', {
            stepKey: evt.stepKey,
            message: evt.message,
            at: evt.at,
          })
          continue
        }

        if (evt.type === 'step.image') {
          await appendRunEvent(input.runId, 'step.image', {
            stepKey: evt.stepKey,
            nodeKey: evt.nodeKey,
            imageUrl: evt.imageUrl,
            at: evt.at,
          })
          continue
        }

        if (evt.type === 'run.warning') {
          await appendRunEvent(input.runId, 'run.warning', { message: evt.message, at: evt.at })
          continue
        }

        if (evt.type === 'run.failed') {
          await appendRunEvent(input.runId, 'run.warning', { message: evt.error.message, at: evt.at })
          await finalizeOnce('failed', evt.error.message)
          continue
        }

        if (evt.type === 'run.completed') {
          // Important policy: completed executions should not be marked failed by model findings.
          // Reserve `failed` for runtime/infra failures (timeouts, crashes, cancellations, parser failures).
          const completedStatus = evt.result.run.status === 'passed' ? 'passed' : 'warning'
          await finalizeOnce(completedStatus, evt.result.run.securitySynopsis)
          continue
        }

        const mapped = toAgentEvents(evt)
        if (mapped.length > 0) {
          await applyAgentEvents(input.runId, mapped)
        }
      }

      await handle.result

      if (!finalized) {
        await finalizeOnce('passed')
      }
    } catch (error) {
      await finalizeOnce('failed', error instanceof Error ? error.message : 'Runner execution failed.')
    } finally {
      clearInterval(heartbeatTimer)
      clearInterval(watchdogTimer)
      globalRunner.__testaRunJobs?.delete(input.runId)
    }
  })()
}
