#!/usr/bin/env npx tsx
import { readFileSync } from 'fs'

// Load .env.local manually
const envFile = readFileSync('.env.local', 'utf-8')
for (const line of envFile.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx)
  const val = trimmed.slice(eqIdx + 1)
  if (!process.env[key]) process.env[key] = val
}

/**
 * End-to-end test script for all testa.run API endpoints.
 * 
 * Prerequisites:
 *   - `pnpm -C apps/web dev` running on port 3001
 *   - .env.local configured with Supabase credentials
 * 
 * Usage:
 *   cd apps/web && npx tsx scripts/test-endpoints.ts
 */

const BASE = 'http://localhost:3001'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const TEST_EMAIL = `test-${Date.now()}@testa.run`
const TEST_PASSWORD = 'TestPassword123!'

let accessToken = ''
let userId = ''
let orgId = ''
let projectId = ''
let runId = ''
let nodeId = ''
let issueId = ''
let apiKeyRaw = ''

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function api(method: string, path: string, body?: unknown, headers?: Record<string, string>) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json: unknown
  try { json = JSON.parse(text) } catch { json = text }
  return { status: res.status, json, ok: res.ok }
}

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${msg}`)
    process.exit(1)
  }
  console.log(`  ✅ ${msg}`)
}

function section(name: string) {
  console.log(`\n━━━ ${name} ━━━`)
}

// ─── Test flow ────────────────────────────────────────────────────────────────

async function main() {
  console.log('🧪 testa.run API endpoint test suite\n')

  // ── 0. Create test user in Supabase ──────────────────────────────────────
  section('0. Create Supabase test user')

  // Create user via admin API (bypasses email validation + rate limits)
  const createUserRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD, email_confirm: true }),
  })
  const createUserData = await createUserRes.json()
  assert(createUserRes.ok, `Created user ${TEST_EMAIL}`)
  userId = createUserData.id
  assert(!!userId, `Got userId: ${userId}`)

  // Sign in to get access token
  const signInRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
  })
  const signInData = await signInRes.json()
  assert(signInRes.ok, `Signed in ${TEST_EMAIL}`)
  accessToken = signInData.access_token
  assert(!!accessToken, `Got access token (${accessToken?.slice(0, 20)}...)`)

  // ── 1. Health check ──────────────────────────────────────────────────────
  section('1. Health check')
  const health = await api('GET', '/api/health/db')
  assert(health.ok, `GET /api/health/db → ${health.status}`)
  assert((health.json as any).ok === true, 'DB health ok')

  // ── 2. Auth sync + me ────────────────────────────────────────────────────
  section('2. Auth: sync-user + me')

  const sync = await api('POST', '/api/auth/sync-user')
  assert(sync.ok, `POST /api/auth/sync-user → ${sync.status}`)
  assert((sync.json as any).ok === true, 'User synced')
  assert((sync.json as any).user.id === userId, 'User ID matches Supabase')

  const me = await api('GET', '/api/auth/me')
  assert(me.ok, `GET /api/auth/me → ${me.status}`)
  assert((me.json as any).user.email === TEST_EMAIL, 'Email matches')

  // ── 3. Organizations ─────────────────────────────────────────────────────
  section('3. Organizations')

  const createOrg = await api('POST', '/api/orgs', {
    name: 'Test Org',
    slug: `test-org-${Date.now()}`,
  })
  assert(createOrg.status === 201, `POST /api/orgs → ${createOrg.status}`)
  orgId = (createOrg.json as any).org.id
  assert(!!orgId, `Created org: ${orgId}`)

  const listOrgs = await api('GET', '/api/orgs')
  assert(listOrgs.ok, `GET /api/orgs → ${listOrgs.status}`)
  assert((listOrgs.json as any).orgs.length >= 1, 'At least 1 org')

  const getOrg = await api('GET', `/api/orgs/${orgId}`)
  assert(getOrg.ok, `GET /api/orgs/${orgId} → ${getOrg.status}`)
  assert((getOrg.json as any).org.name === 'Test Org', 'Org name matches')

  const patchOrg = await api('PATCH', `/api/orgs/${orgId}`, { name: 'Updated Org' })
  assert(patchOrg.ok, `PATCH /api/orgs/${orgId} → ${patchOrg.status}`)
  assert((patchOrg.json as any).org.name === 'Updated Org', 'Org name updated')

  // ── 4. Projects ───────────────────────────────────────────────────────────
  section('4. Projects')

  const createProject = await api('POST', `/api/orgs/${orgId}/projects`, {
    name: 'TimeEdit',
    slug: 'timeedit',
    targetUrl: 'https://timeedit.com',
  })
  assert(createProject.status === 201, `POST /api/orgs/${orgId}/projects → ${createProject.status}`)
  projectId = (createProject.json as any).project.id
  assert(!!projectId, `Created project: ${projectId}`)

  const listProjects = await api('GET', `/api/orgs/${orgId}/projects`)
  assert(listProjects.ok, `GET /api/orgs/${orgId}/projects → ${listProjects.status}`)
  assert((listProjects.json as any).projects.length >= 1, 'At least 1 project')

  const getProject = await api('GET', `/api/projects/${projectId}`)
  assert(getProject.ok, `GET /api/projects/${projectId} → ${getProject.status}`)

  const patchProject = await api('PATCH', `/api/projects/${projectId}`, { name: 'TimeEdit Updated' })
  assert(patchProject.ok, `PATCH /api/projects/${projectId} → ${patchProject.status}`)

  // ── 5. Runs (UI) ─────────────────────────────────────────────────────────
  section('5. Runs (UI-created)')

  const createRun = await api('POST', `/api/projects/${projectId}/runs`, {
    name: 'Security Audit',
    category: 'security',
    label: '#test1',
  })
  assert(createRun.status === 201, `POST /api/projects/${projectId}/runs → ${createRun.status}`)
  runId = (createRun.json as any).run.id
  assert(!!runId, `Created run: ${runId}`)

  const listRuns = await api('GET', `/api/projects/${projectId}/runs`)
  assert(listRuns.ok, `GET /api/projects/${projectId}/runs → ${listRuns.status}`)
  assert((listRuns.json as any).runs.length >= 1, 'At least 1 run')

  const listRunsFiltered = await api('GET', `/api/projects/${projectId}/runs?status=running&category=security`)
  assert(listRunsFiltered.ok, `GET /api/projects/${projectId}/runs?status=running&category=security → ${listRunsFiltered.status}`)

  const getRun = await api('GET', `/api/runs/${runId}`)
  assert(getRun.ok, `GET /api/runs/${runId} → ${getRun.status}`)

  // ── 6. Agent ingest (API key auth) ────────────────────────────────────────
  section('6. Agent ingest — create API key first')

  const createKey = await api('POST', `/api/projects/${projectId}/keys`, {
    name: 'Test Agent Key',
  })
  assert(createKey.status === 201, `POST /api/projects/${projectId}/keys → ${createKey.status}`)
  assert(!!(createKey.json as any).key?.id, `Created API key: ${(createKey.json as any).key.id}`)
  apiKeyRaw = (createKey.json as any).key.raw
  assert(!!apiKeyRaw, 'Received raw API key (one-time)')
  console.log(`  🔑 Raw key (for agent): ${apiKeyRaw.slice(0, 12)}...`)

  // ── 7. Agent: create run ──────────────────────────────────────────────────
  section('7. Agent: create run')

  const agentRun = await api('POST', '/api/agent/runs', {
    name: 'Agent Security Scan',
    category: 'security',
    label: '#agent1',
  }, { 'x-api-key': apiKeyRaw })
  assert(agentRun.status === 201, `POST /api/agent/runs → ${agentRun.status}`)
  const agentRunId = (agentRun.json as any).run.id
  assert(!!agentRunId, `Agent run created: ${agentRunId}`)

  // ── 8. Agent: send events ─────────────────────────────────────────────────
  section('8. Agent: send events batch')

  const events = await api('POST', `/api/agent/runs/${agentRunId}/events`, {
    events: [
      {
        type: 'node.upsert',
        node: {
          nodeKey: 'landing',
          label: 'Landing Page',
          url: 'https://timeedit.com',
          status: 'passed',
          step: 1,
          position: { x: 100, y: 200 },
          isMain: true,
          durationMs: 1200,
          sourceHandle: { side: 'right', imageY: 0.06 },
        },
      },
      {
        type: 'node.upsert',
        node: {
          nodeKey: 'login',
          label: 'Login Page',
          url: 'https://timeedit.com/login',
          status: 'running',
          step: 2,
          position: { x: 400, y: 200 },
        },
      },
      {
        type: 'edge.upsert',
        edge: {
          edgeKey: 'e-landing-login',
          sourceNodeKey: 'landing',
          targetNodeKey: 'login',
          type: 'spring',
          label: 'Click "Get Started"',
        },
      },
      {
        type: 'step.create',
        step: {
          index: 1,
          nodeKey: 'landing',
          action: 'navigate',
          target: 'https://timeedit.com',
          description: 'Navigated to landing page',
          reasoning: 'Starting test flow at root URL',
          durationMs: 800,
          status: 'passed',
        },
      },
      {
        type: 'step.create',
        step: {
          index: 2,
          nodeKey: 'landing',
          action: 'audit',
          target: 'HTTP response headers',
          description: 'Checked for Content-Security-Policy header',
          reasoning: 'CSP prevents XSS attacks by controlling resource loading',
          durationMs: 200,
          status: 'failed',
        },
      },
      {
        type: 'issue.create',
        issue: {
          nodeKey: 'landing',
          stepIndex: 2,
          category: 'security',
          severity: 'error',
          title: 'Missing Content-Security-Policy',
          description: 'No CSP header found on landing page response',
          reasoning: 'Without CSP, the page is vulnerable to XSS attacks via injected scripts',
          element: 'HTTP response headers',
        },
      },
      {
        type: 'issue.create',
        issue: {
          nodeKey: 'landing',
          category: 'security',
          severity: 'warning',
          title: 'Missing X-Frame-Options',
          description: 'No X-Frame-Options header found',
          reasoning: 'Page could be embedded in iframes for clickjacking attacks',
          element: 'HTTP response headers',
        },
      },
    ],
  }, { 'x-api-key': apiKeyRaw })
  assert(events.ok, `POST /api/agent/runs/${agentRunId}/events → ${events.status}`)

  // ── 9. Verify workspace endpoint ──────────────────────────────────────────
  section('9. Verify workspace payload')

  const workspace = await api('GET', `/api/runs/${agentRunId}/workspace`)
  assert(workspace.ok, `GET /api/runs/${agentRunId}/workspace → ${workspace.status}`)

  const ws = workspace.json as any
  assert(ws.nodes.length === 2, `2 nodes returned (got ${ws.nodes.length})`)
  assert(ws.nodes[0].id === 'landing', `First node is "landing"`)
  assert(ws.nodes[1].id === 'login', `Second node is "login"`)
  assert(ws.edges.length === 1, `1 edge returned`)
  assert(ws.edges[0].id === 'e-landing-login', `Edge is "e-landing-login"`)
  assert(ws.edges[0].source === 'landing', 'Edge source = landing')
  assert(ws.edges[0].target === 'login', 'Edge target = login')
  assert(ws.issues.length === 2, `2 issues returned (got ${ws.issues.length})`)

  // ── 10. Verify steps endpoint ─────────────────────────────────────────────
  section('10. Verify steps')

  const steps = await api('GET', `/api/runs/${agentRunId}/steps`)
  assert(steps.ok, `GET /api/runs/${agentRunId}/steps → ${steps.status}`)
  assert((steps.json as any).steps.length === 2, `2 steps returned`)
  assert((steps.json as any).steps[0].action === 'navigate', 'Step 1 = navigate')
  assert((steps.json as any).steps[1].action === 'audit', 'Step 2 = audit')

  // ── 11. Verify issues endpoint ────────────────────────────────────────────
  section('11. Verify issues')

  const issues = await api('GET', `/api/runs/${agentRunId}/issues`)
  assert(issues.ok, `GET /api/runs/${agentRunId}/issues → ${issues.status}`)
  assert((issues.json as any).issues.length === 2, `2 issues returned`)
  issueId = (issues.json as any).issues[0].id

  const issuesFiltered = await api('GET', `/api/runs/${agentRunId}/issues?severity=error`)
  assert(issuesFiltered.ok, `GET /api/runs/${agentRunId}/issues?severity=error → ${issuesFiltered.status}`)
  assert((issuesFiltered.json as any).issues.length === 1, '1 error issue')

  // ── 12. Resolve issue ─────────────────────────────────────────────────────
  section('12. Resolve issue')

  const resolve = await api('PATCH', `/api/issues/${issueId}`, {
    status: 'resolved',
    resolutionNote: 'Added CSP header',
  })
  assert(resolve.ok, `PATCH /api/issues/${issueId} → ${resolve.status}`)
  assert((resolve.json as any).issue.status === 'resolved', 'Issue resolved')

  // Verify run counts updated
  const runAfterResolve = await api('GET', `/api/runs/${agentRunId}`)
  assert(runAfterResolve.ok, 'Run fetched after resolve')
  // openErrors should be 0 now (1 error was resolved), openWarnings should be 1
  const runData = (runAfterResolve.json as any).run
  console.log(`  ℹ️  Run openErrors=${runData.openErrors}, openWarnings=${runData.openWarnings}`)

  // Unresolve it
  const unresolve = await api('PATCH', `/api/issues/${issueId}`, { status: 'open' })
  assert(unresolve.ok, 'Issue unreresolved')

  // ── 13. Agent: finish run ─────────────────────────────────────────────────
  section('13. Agent: finish run')

  const finish = await api('POST', `/api/agent/runs/${agentRunId}/finish`, {
    status: 'failed',
    securitySynopsis: 'Missing critical security headers on landing page.',
  }, { 'x-api-key': apiKeyRaw })
  assert(finish.ok, `POST /api/agent/runs/${agentRunId}/finish → ${finish.status}`)
  assert((finish.json as any).run.status === 'failed', 'Run status = failed')
  assert((finish.json as any).run.durationMs > 0, 'Duration calculated')

  // ── 14. Billing ───────────────────────────────────────────────────────────
  section('14. Billing')

  const billing = await api('GET', `/api/billing?orgId=${orgId}`)
  assert(billing.ok, `GET /api/billing?orgId=${orgId} → ${billing.status}`)
  assert((billing.json as any).billing.plan === 'starter', 'Plan = starter')

  // ── 15. Auth: forbidden for wrong org ─────────────────────────────────────
  section('15. Access control')

  const fakeOrgId = '00000000-0000-0000-0000-000000000000'
  const forbidden = await api('GET', `/api/orgs/${fakeOrgId}`)
  assert(forbidden.status === 403, `GET /api/orgs/fake → 403 (got ${forbidden.status})`)

  const noKey = await api('POST', '/api/agent/runs', { name: 'x', category: 'ux' })
  assert(noKey.status === 401, `POST /api/agent/runs without key → 401 (got ${noKey.status})`)

  // ── Cleanup ───────────────────────────────────────────────────────────────
  section('Cleanup')

  // Delete test user from Supabase auth
  await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  })

  // Cascade deletes should clean up org → projects → runs etc.
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  await prisma.organization.delete({ where: { id: orgId } }).catch(() => {})
  await prisma.user.delete({ where: { id: userId } }).catch(() => {})
  await prisma.$disconnect()

  console.log(`  🧹 Cleaned up test data`)

  console.log('\n' + '═'.repeat(50))
  console.log('🎉 ALL TESTS PASSED')
  console.log('═'.repeat(50))
}

main().catch((err) => {
  console.error('\n💥 Test failed with error:', err)
  process.exit(1)
})
