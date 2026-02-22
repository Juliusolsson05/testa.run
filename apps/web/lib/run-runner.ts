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

function parseStepIndex(stepKey?: string): number | undefined {
  if (!stepKey) return undefined
  const n = Number(stepKey.replace(/\D/g, ''))
  return Number.isFinite(n) && n > 0 ? n : undefined
}

function toAgentEvents(evt: TestRunEvent, ctx: { stepOffset: number }): AgentEvent[] {
  switch (evt.type) {
    case 'node.upserted':
      return [{
        type: 'node.upsert',
        node: {
          nodeKey: evt.node.nodeKey,
          label: evt.node.label,
          url: evt.node.url,
          status: evt.node.status,
          step: evt.node.step + ctx.stepOffset,
          durationMs: evt.node.durationMs,
          screenshotUrl: evt.node.imageUrl,
          position: { x: (evt.node.step + ctx.stepOffset) * 260, y: 200 },
          isMain: evt.node.step + ctx.stepOffset === 1,
        },
      }]
    case 'edge.upserted':
      return [{
        type: 'edge.upsert',
        edge: {
          edgeKey: `${ctx.stepOffset}-${evt.edge.edgeKey}`,
          sourceNodeKey: evt.edge.sourceNodeKey,
          targetNodeKey: evt.edge.targetNodeKey,
          label: evt.edge.label,
          type: 'spring',
        },
      }]
    case 'step.upserted': {
      const index = evt.step.index + ctx.stepOffset
      return [
        {
          type: 'node.upsert',
          node: {
            nodeKey: evt.step.nodeKey,
            label: evt.step.nodeKey,
            url: evt.step.url,
            status: evt.step.status === 'failed' ? 'running' : 'passed',
            step: index,
            position: { x: index * 260, y: 200 },
            isMain: index === 1,
          },
        },
        {
          type: 'step.create',
          step: {
            index,
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
    }
    case 'issue.created': {
      const localStepIndex = parseStepIndex(evt.issue.stepKey)
      return [{
        type: 'issue.create',
        issue: {
          nodeKey: evt.issue.nodeKey,
          stepIndex: localStepIndex ? localStepIndex + ctx.stepOffset : undefined,
          category: evt.issue.category,
          severity: evt.issue.severity,
          title: evt.issue.title,
          description: evt.issue.description,
          reasoning: evt.issue.reasoning,
          element: evt.issue.element,
        },
      }]
    }
    default:
      return []
  }
}

function buildContinuationPrompt(input: { prompt?: string; url: string }, cycle: number, previousSummary: string | null) {
  const base = input.prompt?.trim() ? `${input.prompt.trim()}\n\n` : ''
  if (cycle === 1) return `${base}Cycle 1/3: Initial deep exploration of ${input.url}.`

  return `${base}Cycle ${cycle}/3 continuation:\n- Continue from previous coverage, do NOT repeat already-tested flows unless validating fixes.\n- Explore deeper/adjacent paths and edge cases.\n- Focus additional security checks (authz, headers, API input validation, session handling).\n- Produce new meaningful steps/findings.\n${previousSummary ? `Previous cycle summary:\n${previousSummary}` : ''}`
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

  let activeCancel: () => void = () => {}
  globalRunner.__testaRunJobs?.set(input.runId, { cancel: () => activeCancel() })

  void (async () => {
    let finalized = false
    let lastEventAt = Date.now()
    const startedAt = Date.now()
    const cycles = Math.max(1, Number(process.env.TESTING_RUN_CYCLES ?? '3'))
    let stepOffset = 0
    let previousSummary: string | null = null

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
      if (now - startedAt > 20 * 60 * 1000) {
        activeCancel()
        void finalizeOnce('failed', 'Run exceeded max runtime (20m watchdog).')
        return
      }
      if (now - lastEventAt > 90 * 1000) {
        activeCancel()
        void finalizeOnce('failed', 'Run stalled: no events received for 90s.')
      }
    }, 15000)

    try {
      for (let cycle = 1; cycle <= cycles; cycle += 1) {
        if (finalized) break

        await appendRunEvent(input.runId, 'run.cycle.started', { cycle, totalCycles: cycles, at: new Date().toISOString() })

        const handle = createTestRun(
          {
            url: input.url,
            prompt: buildContinuationPrompt(input, cycle, previousSummary),
          },
          {
            engineUrl: process.env.TESTING_ENGINE_URL,
            engineToken: process.env.TESTING_ENGINE_TOKEN,
          }
        )
        activeCancel = handle.cancel

        let cycleSummary: string | null = null

        for await (const evt of handle.events) {
          lastEventAt = Date.now()

          if (evt.type === 'step.progress') {
            await appendRunEvent(input.runId, 'step.progress', {
              cycle,
              stepKey: evt.stepKey,
              message: evt.message,
              at: evt.at,
            })
            continue
          }

          if (evt.type === 'step.image') {
            await appendRunEvent(input.runId, 'step.image', {
              cycle,
              stepKey: evt.stepKey,
              nodeKey: evt.nodeKey,
              imageUrl: evt.imageUrl,
              at: evt.at,
            })
            continue
          }

          if (evt.type === 'run.warning') {
            await appendRunEvent(input.runId, 'run.warning', { cycle, message: evt.message, at: evt.at })
            continue
          }

          if (evt.type === 'run.failed') {
            await appendRunEvent(input.runId, 'run.warning', { cycle, message: evt.error.message, at: evt.at })
            throw new Error(evt.error.message)
          }

          if (evt.type === 'run.completed') {
            cycleSummary = evt.result.run.securitySynopsis ?? evt.result.run.summary ?? null
            continue
          }

          const mapped = toAgentEvents(evt, { stepOffset })
          if (mapped.length > 0) {
            await applyAgentEvents(input.runId, mapped)
          }
        }

        const cycleResult = await handle.result
        previousSummary = cycleSummary ?? cycleResult.run.securitySynopsis ?? cycleResult.run.summary ?? previousSummary
        stepOffset += cycleResult.steps.length

        await appendRunEvent(input.runId, 'run.cycle.completed', {
          cycle,
          totalCycles: cycles,
          stepsInCycle: cycleResult.steps.length,
          issuesInCycle: cycleResult.issues.length,
          summary: previousSummary,
          at: new Date().toISOString(),
        })

        if (cycle > 1 && cycleResult.steps.length === 0 && cycleResult.issues.length === 0) {
          await appendRunEvent(input.runId, 'run.warning', {
            message: `Stopping early at cycle ${cycle}: no additional coverage produced.`,
            at: new Date().toISOString(),
          })
          break
        }
      }

      if (!finalized) {
        const failedSteps = await db.runStep.count({ where: { runId: input.runId, status: 'failed' } })
        const openErrors = await db.issue.count({ where: { runId: input.runId, status: 'open', severity: 'error' } })
        const openWarnings = await db.issue.count({ where: { runId: input.runId, status: 'open', severity: 'warning' } })

        const status: 'passed' | 'warning' =
          failedSteps > 0 || openErrors > 0 || openWarnings > 0 ? 'warning' : 'passed'

        await finalizeOnce(status, previousSummary)
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
