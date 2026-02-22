# Workspace Report

Generated: 2026-02-22T03:54:37

Included files: **50**  \nIncluded lines: **4998**

## Project tree (build/artifact folders ignored)

```text
testa.run
├── .vscode
│   └── settings.json
├── apps
│   ├── docs
│   │   ├── app
│   │   │   ├── fonts
│   │   │   │   ├── GeistMonoVF.woff
│   │   │   │   └── GeistVF.woff
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.module.css
│   │   │   └── page.tsx
│   │   ├── public
│   │   │   ├── file-text.svg
│   │   │   ├── globe.svg
│   │   │   ├── next.svg
│   │   │   ├── turborepo-dark.svg
│   │   │   ├── turborepo-light.svg
│   │   │   ├── vercel.svg
│   │   │   └── window.svg
│   │   ├── .gitignore
│   │   ├── eslint.config.js
│   │   ├── next-env.d.ts
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── README.md
│   │   └── tsconfig.json
│   ├── landing
│   │   ├── app
│   │   │   ├── about
│   │   │   │   └── page.tsx
│   │   │   ├── acceptable-use
│   │   │   │   └── page.tsx
│   │   │   ├── api
│   │   │   │   └── contact
│   │   │   │       └── route.ts
│   │   │   ├── components
│   │   │   │   ├── BackgroundSystem.tsx
│   │   │   │   ├── ConsentAwareScripts.tsx
│   │   │   │   ├── CookieConsentBanner.tsx
│   │   │   │   ├── LegalPage.tsx
│   │   │   │   └── SiteNav.tsx
│   │   │   ├── contact
│   │   │   │   └── page.tsx
│   │   │   ├── cookie-preferences
│   │   │   │   └── page.tsx
│   │   │   ├── cookies
│   │   │   │   └── page.tsx
│   │   │   ├── dpa
│   │   │   │   └── page.tsx
│   │   │   ├── features
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password
│   │   │   │   └── page.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   ├── pricing
│   │   │   │   └── page.tsx
│   │   │   ├── privacy
│   │   │   │   └── page.tsx
│   │   │   ├── signup
│   │   │   │   └── page.tsx
│   │   │   ├── subprocessors
│   │   │   │   └── page.tsx
│   │   │   ├── terms
│   │   │   │   └── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── page.tsx
│   │   ├── components
│   │   │   ├── ui
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   └── separator.tsx
│   │   │   └── pitch-deck.tsx
│   │   ├── lib
│   │   │   ├── cookie-consent.ts
│   │   │   └── utils.ts
│   │   ├── public
│   │   │   └── logos
│   │   │       ├── linear.svg
│   │   │       ├── lovable.svg
│   │   │       ├── notion.svg
│   │   │       ├── stripe.svg
│   │   │       ├── supabase.svg
│   │   │       └── vercel.svg
│   │   ├── .env.example
│   │   ├── .gitignore
│   │   ├── components.json
│   │   ├── next-env.d.ts
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── postcss.config.mjs
│   │   ├── tsconfig.json
│   │   └── tsconfig.tsbuildinfo
│   └── web
│       ├── app
│       │   ├── api
│       │   │   ├── agent
│       │   │   │   └── runs
│       │   │   │       ├── [runId]
│       │   │   │       │   ├── events
│       │   │   │       │   │   └── route.ts
│       │   │   │       │   └── finish
│       │   │   │       │       └── route.ts
│       │   │   │       └── route.ts
│       │   │   ├── auth
│       │   │   │   ├── me
│       │   │   │   │   └── route.ts
│       │   │   │   └── sync-user
│       │   │   │       └── route.ts
│       │   │   ├── billing
│       │   │   │   └── route.ts
│       │   │   ├── health
│       │   │   │   └── db
│       │   │   │       └── route.ts
│       │   │   ├── issues
│       │   │   │   └── [issueId]
│       │   │   │       └── route.ts
│       │   │   ├── orgs
│       │   │   │   ├── [orgId]
│       │   │   │   │   ├── projects
│       │   │   │   │   │   └── route.ts
│       │   │   │   │   └── route.ts
│       │   │   │   └── route.ts
│       │   │   ├── projects
│       │   │   │   └── [projectId]
│       │   │   │       ├── issues
│       │   │   │       │   └── route.ts
│       │   │   │       ├── keys
│       │   │   │       │   └── route.ts
│       │   │   │       ├── runs
│       │   │   │       │   ├── start
│       │   │   │       │   │   └── route.ts
│       │   │   │       │   └── route.ts
│       │   │   │       └── route.ts
│       │   │   ├── runs
│       │   │   │   └── [runId]
│       │   │   │       ├── cancel
│       │   │   │       │   └── route.ts
│       │   │   │       ├── diagnostics
│       │   │   │       │   └── route.ts
│       │   │   │       ├── events
│       │   │   │       │   └── route.ts
│       │   │   │       ├── issues
│       │   │   │       │   └── route.ts
│       │   │   │       ├── state
│       │   │   │       │   └── route.ts
│       │   │   │       ├── steps
│       │   │   │       │   └── route.ts
│       │   │   │       ├── stream
│       │   │   │       │   └── route.ts
│       │   │   │       ├── workspace
│       │   │   │       │   └── route.ts
│       │   │   │       └── route.ts
│       │   │   └── stripe
│       │   │       ├── checkout
│       │   │       │   └── route.ts
│       │   │       ├── portal
│       │   │       │   └── route.ts
│       │   │       └── webhook
│       │   │           └── route.ts
│       │   ├── billing
│       │   │   ├── cancelled
│       │   │   │   └── page.tsx
│       │   │   └── success
│       │   │       └── page.tsx
│       │   ├── fonts
│       │   │   ├── GeistMonoVF.woff
│       │   │   └── GeistVF.woff
│       │   ├── onboarding
│       │   │   ├── org
│       │   │   │   └── page.tsx
│       │   │   ├── plan
│       │   │   │   └── page.tsx
│       │   │   ├── project
│       │   │   │   └── page.tsx
│       │   │   └── layout.tsx
│       │   ├── settings
│       │   │   └── page.tsx
│       │   ├── sign-in
│       │   │   └── page.tsx
│       │   ├── sign-up
│       │   │   └── page.tsx
│       │   ├── workspace
│       │   │   ├── (detail)
│       │   │   │   ├── issues
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── runs
│       │   │   │   │   └── page.tsx
│       │   │   │   └── security
│       │   │   │       └── page.tsx
│       │   │   ├── [runId]
│       │   │   │   └── page.tsx
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── favicon.ico
│       │   ├── globals.css
│       │   ├── icon.svg
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── components
│       │   ├── auth
│       │   │   ├── AuthProvider.tsx
│       │   │   └── RequireAuth.tsx
│       │   ├── loading
│       │   │   ├── BlueCube.tsx
│       │   │   └── InlineLoading.tsx
│       │   ├── ui
│       │   │   ├── badge.tsx
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── separator.tsx
│       │   │   └── TestaRunLogo.tsx
│       │   ├── workspace
│       │   │   ├── edges
│       │   │   │   └── SpringEdge.tsx
│       │   │   ├── nodes
│       │   │   │   └── ScreenshotNode.tsx
│       │   │   ├── AppSidebar.tsx
│       │   │   ├── Breadcrumbs.tsx
│       │   │   ├── FloatingNav.tsx
│       │   │   ├── FlowCanvas.tsx
│       │   │   ├── IssueCard.tsx
│       │   │   ├── RunStepCard.tsx
│       │   │   ├── SecurityOverlay.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   ├── useProjectRuns.ts
│       │   │   ├── WorkspaceClient.tsx
│       │   │   └── WorkspacePage.tsx
│       │   ├── error-boundary.tsx
│       │   ├── GlobalLoadingState.tsx
│       │   └── Providers.tsx
│       ├── constants
│       │   ├── flow.ts
│       │   └── status.ts
│       ├── context
│       │   ├── issue-context.tsx
│       │   └── workspace-data-context.tsx
│       ├── data
│       │   ├── flow.ts
│       │   ├── issues.ts
│       │   ├── runs.ts
│       │   └── runSummaries.ts
│       ├── lib
│       │   ├── agent-ingest.ts
│       │   ├── api-key-auth.ts
│       │   ├── auth.ts
│       │   ├── db.ts
│       │   ├── env.ts
│       │   ├── run-events.ts
│       │   ├── run-finalize.ts
│       │   ├── run-runner.ts
│       │   ├── stripe.ts
│       │   ├── supabase-auth.ts
│       │   ├── supabase-browser.ts
│       │   ├── supabase.ts
│       │   └── utils.ts
│       ├── prisma
│       │   ├── migrations
│       │   │   ├── 20260221230000_init
│       │   │   │   └── migration.sql
│       │   │   ├── 20260222000500_run_events
│       │   │   │   └── migration.sql
│       │   │   └── migration_lock.toml
│       │   └── schema.prisma
│       ├── public
│       │   └── screenshots
│       │       ├── dashboard.png
│       │       ├── dashboard.svg
│       │       ├── landing.png
│       │       ├── landing.svg
│       │       ├── login.png
│       │       └── login.svg
│       ├── scripts
│       │   └── test-endpoints.ts
│       ├── store
│       │   ├── app-thunks.ts
│       │   ├── auth-slice.ts
│       │   ├── billing-slice.ts
│       │   ├── billing-thunks.ts
│       │   ├── hooks.ts
│       │   ├── index.ts
│       │   ├── onboarding-slice.ts
│       │   ├── run-live-slice.ts
│       │   ├── runs-slice.ts
│       │   └── workspace-slice.ts
│       ├── types
│       │   ├── domain.ts
│       │   └── flow.ts
│       ├── .env
│       ├── .env.example
│       ├── .env.local
│       ├── .env.local.example
│       ├── .gitignore
│       ├── components.json
│       ├── eslint.config.js
│       ├── middleware.ts
│       ├── next-env.d.ts
│       ├── next.config.js
│       ├── package.json
│       ├── postcss.config.mjs
│       ├── README.md
│       └── tsconfig.json
├── infra
│   └── stripe
│       ├── .terraform
│       │   └── providers
│       │       └── registry.terraform.io
│       │           └── lukasaron
│       │               └── stripe
│       │                   └── 2.0.0
│       │                       └── darwin_arm64
│       │                           ├── CHANGELOG.md
│       │                           ├── LICENSE
│       │                           ├── README.md
│       │                           └── terraform-provider-stripe_v2.0.0
│       ├── .gitignore
│       ├── .terraform.lock.hcl
│       ├── main.tf
│       ├── outputs.tf
│       ├── README.md
│       ├── terraform.tfstate
│       ├── terraform.tfstate.backup
│       ├── terraform.tfvars.example
│       └── variables.tf
├── packages
│   ├── api-client
│   │   ├── src
│   │   │   └── index.ts
│   │   └── package.json
│   ├── config-tailwind
│   │   ├── package.json
│   │   └── tailwind.config.ts
│   ├── eslint-config
│   │   ├── base.js
│   │   ├── next.js
│   │   ├── package.json
│   │   ├── react-internal.js
│   │   └── README.md
│   ├── testing
│   │   ├── src
│   │   │   ├── client.ts
│   │   │   ├── engine.ts
│   │   │   ├── index.ts
│   │   │   ├── parser.ts
│   │   │   ├── prompt.ts
│   │   │   └── types.ts
│   │   ├── package.json
│   │   ├── test-smoke.mts
│   │   └── tsconfig.json
│   ├── typescript-config
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   ├── package.json
│   │   └── react-library.json
│   ├── ui
│   │   ├── src
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── code.tsx
│   │   ├── eslint.config.mjs
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── utils
│       ├── src
│       │   └── index.ts
│       └── package.json
├── .gitignore
├── .npmrc
├── docker-compose.yml
├── OPENCLAW_QA_AGENT_API_BLUEPRINT.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── turbo.json
```

## Included files and relevance

| File | Lines | Why relevant to workspace |
|---|---:|---|
| `apps/web/app/page.tsx` | 325 | Top-level route/page behavior for jobs + workspace views. |
| `apps/web/app/workspace/layout.tsx` | 5 | Top-level route/page behavior for jobs + workspace views. |
| `apps/web/app/workspace/page.tsx` | 11 | Top-level route/page behavior for jobs + workspace views. |
| `apps/web/app/workspace/[runId]/page.tsx` | 282 | Top-level route/page behavior for jobs + workspace views. |
| `apps/web/app/workspace/(detail)/runs/page.tsx` | 98 | Top-level route/page behavior for jobs + workspace views. |
| `apps/web/components/workspace/WorkspacePage.tsx` | 42 | Primary workspace UI rendering and interaction logic. |
| `apps/web/components/workspace/WorkspaceClient.tsx` | 17 | Primary workspace UI rendering and interaction logic. |
| `apps/web/components/workspace/FlowCanvas.tsx` | 301 | Primary workspace UI rendering and interaction logic. |
| `apps/web/components/workspace/Sidebar.tsx` | 481 | Primary workspace UI rendering and interaction logic. |
| `apps/web/components/workspace/AppSidebar.tsx` | 171 | Primary workspace UI rendering and interaction logic. |
| `apps/web/components/workspace/FloatingNav.tsx` | 49 | Primary workspace UI rendering and interaction logic. |
| `apps/web/components/workspace/SecurityOverlay.tsx` | 61 | Primary workspace UI rendering and interaction logic. |
| `apps/web/components/workspace/RunStepCard.tsx` | 77 | Primary workspace UI rendering and interaction logic. |
| `apps/web/components/workspace/IssueCard.tsx` | 62 | Primary workspace UI rendering and interaction logic. |
| `apps/web/components/workspace/nodes/ScreenshotNode.tsx` | 138 | Primary workspace UI rendering and interaction logic. |
| `apps/web/components/workspace/edges/SpringEdge.tsx` | 221 | Primary workspace UI rendering and interaction logic. |
| `apps/web/components/workspace/useProjectRuns.ts` | 46 | Primary workspace UI rendering and interaction logic. |
| `apps/web/context/workspace-data-context.tsx` | 41 | Shared state contracts for workspace payload and issue focus. |
| `apps/web/context/issue-context.tsx` | 101 | Shared state contracts for workspace payload and issue focus. |
| `apps/web/app/api/projects/[projectId]/runs/route.ts` | 88 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/projects/[projectId]/runs/start/route.ts` | 61 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/projects/[projectId]/issues/route.ts` | 59 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/runs/[runId]/route.ts` | 24 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/runs/[runId]/workspace/route.ts` | 79 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/runs/[runId]/events/route.ts` | 32 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/runs/[runId]/stream/route.ts` | 62 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/runs/[runId]/steps/route.ts` | 43 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/runs/[runId]/issues/route.ts` | 57 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/runs/[runId]/state/route.ts` | 39 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/runs/[runId]/diagnostics/route.ts` | 53 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/runs/[runId]/cancel/route.ts` | 33 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/agent/runs/route.ts` | 42 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/agent/runs/[runId]/events/route.ts` | 24 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/agent/runs/[runId]/finish/route.ts` | 30 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/app/api/issues/[issueId]/route.ts` | 55 | Workspace/run backend API surface used by jobs/workspace pages. |
| `apps/web/lib/run-runner.ts` | 290 | Core run execution/event ingestion/finalization pipeline. |
| `apps/web/lib/agent-ingest.ts` | 359 | Core run execution/event ingestion/finalization pipeline. |
| `apps/web/lib/run-events.ts` | 81 | Core run execution/event ingestion/finalization pipeline. |
| `apps/web/lib/run-finalize.ts` | 60 | Core run execution/event ingestion/finalization pipeline. |
| `apps/web/lib/db.ts` | 16 | Shared DB client used by workspace/run APIs. |
| `apps/web/store/index.ts` | 21 | Client state management for runs, live stream status, and workspace data. |
| `apps/web/store/runs-slice.ts` | 161 | Client state management for runs, live stream status, and workspace data. |
| `apps/web/store/run-live-slice.ts` | 39 | Client state management for runs, live stream status, and workspace data. |
| `apps/web/store/workspace-slice.ts` | 32 | Client state management for runs, live stream status, and workspace data. |
| `apps/web/store/app-thunks.ts` | 72 | Client state management for runs, live stream status, and workspace data. |
| `apps/web/store/hooks.ts` | 5 | Client state management for runs, live stream status, and workspace data. |
| `apps/web/prisma/schema.prisma` | 431 | Database schema/events model backing run/workspace behavior. |
| `apps/web/prisma/migrations/20260222000500_run_events/migration.sql` | 21 | Database schema/events model backing run/workspace behavior. |
| `apps/web/types/domain.ts` | 87 | Domain and flow typing used across workspace frontend/backend. |
| `apps/web/types/flow.ts` | 13 | Domain and flow typing used across workspace frontend/backend. |

## File contents


===== apps/web/app/page.tsx =====

```
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Play, X } from "lucide-react"
import { AppSidebar } from "@/components/workspace/AppSidebar"
import { Badge } from "@/components/ui/badge"
import { RequireAuth } from "@/components/auth/RequireAuth"
import { useAuth } from "@/components/auth/AuthProvider"
import { InlineLoading } from "@/components/loading/InlineLoading"
import { useProjectRuns } from "@/components/workspace/useProjectRuns"
import type { Run, RunStatus } from "@/types/domain"
import { cn } from "@/lib/utils"

const statusConfig = {
  running: {
    label: "Running",
    dot: "bg-[#1d6ef5] shadow-[0_0_6px_rgba(29,110,245,0.7)]",
    badge: "bg-[#1d6ef5]/10 text-[#1d6ef5]",
  },
  passed: { label: "Passed", dot: "bg-emerald-500 shadow-[0_0_6px_#22c55e]", badge: "bg-emerald-500/10 text-emerald-600" },
  warning: { label: "Warning", dot: "bg-amber-400 shadow-[0_0_6px_#f59e0b]", badge: "bg-amber-400/10 text-amber-600" },
  failed: { label: "Failed", dot: "bg-red-500 shadow-[0_0_6px_#ef4444]", badge: "bg-red-500/10 text-red-600" },
} satisfies Record<RunStatus, { label: string; dot: string; badge: string }>

type FilterType = "all" | "running" | "passed" | "warning" | "failed"

type ApiRun = {
  id: string
  label: string | null
  name: string
  url: string
  startedAt: string
  durationMs: number | null
  status: RunStatus
  openIssues: { errors: number; warnings: number }
  stepsCount: number
}

function formatDuration(durationMs: number | null, startedAt?: string, isRunning?: boolean, nowMs?: number) {
  let effectiveDuration = durationMs ?? 0

  if (isRunning && startedAt && nowMs) {
    const elapsed = Math.max(0, nowMs - new Date(startedAt).getTime())
    effectiveDuration = Math.max(effectiveDuration, elapsed)
  }

  if (!effectiveDuration || effectiveDuration <= 0) return "—"
  const sec = Math.floor(effectiveDuration / 1000)
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${s}s`
}

function formatDate(iso: string) {
  const date = new Date(iso)
  return date.toLocaleString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function mapApiRunToUi(run: ApiRun, nowMs: number): Run {
  return {
    id: run.id,
    label: run.label ?? "#—",
    name: run.name,
    category: "ux",
    url: run.url,
    date: formatDate(run.startedAt),
    ago: "",
    duration: formatDuration(run.durationMs, run.startedAt, run.status === "running", nowMs),
    status: run.status,
    steps: Array.from({ length: run.stepsCount }, (_, i) => ({
      id: `${run.id}-step-${i + 1}`,
      index: i + 1,
      action: "audit",
      target: "",
      description: "",
      reasoning: "",
      duration: "",
      status: "passed",
      nodeId: "",
    })),
  }
}

function RunsHome() {
  const router = useRouter()
  const { accessToken } = useAuth()
  const [filter, setFilter] = useState<FilterType>("all")
  const [showConfirm, setShowConfirm] = useState(false)
  const [starting, setStarting] = useState(false)
  const { loading: loadingRuns, project, runs: projectRuns } = useProjectRuns(undefined, 30)
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const runs = useMemo(() => projectRuns.map((run) => mapApiRunToUi(run as ApiRun, nowMs)), [nowMs, projectRuns])
  const issueCounts = useMemo(
    () =>
      Object.fromEntries(
        projectRuns.map((run) => [
          run.id,
          { errors: run.openIssues.errors ?? 0, warnings: run.openIssues.warnings ?? 0 },
        ])
      ),
    [projectRuns]
  )
  const hasProject = !!project

  const totalRunning = runs.filter((r) => r.status === "running").length
  const totalPassed = runs.filter((r) => r.status === "passed").length
  const totalFailed = runs.filter((r) => r.status === "failed").length
  const totalWarning = runs.filter((r) => r.status === "warning").length
  const openIssues = useMemo(
    () => Object.values(issueCounts).reduce((sum, count) => sum + count.errors + count.warnings, 0),
    [issueCounts]
  )

  const startNewRun = useCallback(async () => {
    if (!accessToken || !project?.id) return
    setStarting(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/runs/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: "New Test Run", category: "ux" }),
      })
      if (!res.ok) throw new Error("Failed to start run")
      const data = await res.json()
      setShowConfirm(false)
      router.push(`/workspace/${data.run.id}`)
    } catch {
      setStarting(false)
    }
  }, [accessToken, project?.id, router])

  const filtered = filter === "all" ? runs : runs.filter((r) => r.status === filter)

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: "all", label: "All runs", count: runs.length },
    { id: "running", label: "Running", count: totalRunning },
    { id: "passed", label: "Passed", count: totalPassed },
    { id: "warning", label: "Warnings", count: totalWarning },
    { id: "failed", label: "Failed", count: totalFailed },
  ]

  return (
    <div className="flex h-dvh bg-app-bg font-sans">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="border-b border-ui-border bg-white">
          <div className="flex items-stretch divide-x divide-ui-border">
            {([
              { label: "TOTAL RUNS", value: runs.length, color: "text-[#1a2a33]" },
              { label: "RUNNING", value: totalRunning, color: "text-[#1d6ef5]" },
              { label: "FAILED", value: totalFailed, color: "text-red-500" },
              { label: "OPEN ISSUES", value: openIssues, color: "text-red-500" },
            ] as const).map((stat) => (
              <div key={stat.label} className="px-10 py-5 first:pl-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.8px] text-ui-muted">{stat.label}</div>
                <div className={cn("mt-0.5 text-[30px] font-bold leading-none tabular-nums", stat.color)}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-ui-border bg-white px-8 py-3">
          <span className="text-[12px] text-ui-muted">Filter:</span>
          <div className="flex items-center gap-1">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded px-3 py-1 text-[12px] font-semibold transition-colors",
                  filter === f.id ? "bg-[#1d6ef5] text-white" : "text-ui-muted hover:bg-app-bg hover:text-[#1d6ef5]"
                )}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 px-8 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-[22px] font-bold tracking-tight text-[#1a2a33]">Test runs</h1>
            {hasProject && (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 rounded bg-[#1d6ef5] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1557d0]"
              >
                <Play className="h-3.5 w-3.5" />
                New Run
              </button>
            )}
          </div>

          {showConfirm && (
            <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/40">
              <div className="w-full max-w-sm rounded-lg border border-ui-border bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-semibold text-[#1a2a33]">Start new run?</h2>
                  <button onClick={() => setShowConfirm(false)} className="text-ui-muted hover:text-[#1a2a33]">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-ui-muted">
                  This will start a new test run against your project target. The agent will begin testing immediately.
                </p>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 rounded border border-ui-border px-3 py-2 text-sm font-semibold text-[#1a2a33]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => void startNewRun()}
                    disabled={starting}
                    className="flex-1 rounded bg-[#1d6ef5] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {starting ? "Starting…" : "Start Run"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {loadingRuns ? (
            <InlineLoading label="Loading runs…" cubeSize={56} className="min-h-[360px]" />
          ) : !hasProject ? (
            <div className="rounded border border-ui-border bg-white p-4 text-sm text-ui-muted">
              You are signed in but do not have a project yet.
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded border border-ui-border bg-white p-4 text-sm text-ui-muted">No runs yet.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((run) => {
                const s = statusConfig[run.status]
                const { errors, warnings } = issueCounts[run.id] ?? { errors: 0, warnings: 0 }
                return (
                  <Link
                    key={run.id}
                    href={`/workspace/${run.id}`}
                    className="group relative flex items-center gap-5 border border-ui-border bg-white px-5 py-4 transition-shadow hover:shadow-[0_4px_16px_rgba(29,110,245,0.12)]"
                  >
                    {run.status === "running" && (
                      <>
                        <span className="absolute left-0 top-0 h-full w-1 bg-[#1d6ef5]/90" />
                        <span className="pointer-events-none absolute inset-y-0 left-0 w-[42%] animate-[pulse_1.6s_ease-in-out_infinite] bg-gradient-to-r from-[#1d6ef5]/20 via-[#60a5fa]/35 to-transparent" />
                      </>
                    )}
                    <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", s.dot)} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[14px] font-semibold text-[#1a2a33] transition-colors group-hover:text-[#1d6ef5]">{run.name}</span>
                        <span className="font-mono text-[11px] text-ui-muted">{run.label}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 font-mono text-[11px] text-ui-muted">
                        <span>{run.url}</span>
                        <span className="text-ui-border">·</span>
                        <span>{run.date}</span>
                        <span className="text-ui-border">·</span>
                        <span>{run.duration}</span>
                        <span className="text-ui-border">·</span>
                        <span>{run.steps.length} steps</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-[11px] font-medium">
                      {errors > 0 && (
                        <Badge className="rounded bg-red-500/10 px-2 py-0.5 text-red-600 hover:bg-red-500/10">
                          {errors} error{errors > 1 ? "s" : ""}
                        </Badge>
                      )}
                      {warnings > 0 && (
                        <Badge className="rounded bg-amber-400/10 px-2 py-0.5 text-amber-600 hover:bg-amber-400/10">
                          {warnings} warning{warnings > 1 ? "s" : ""}
                        </Badge>
                      )}
                      {errors === 0 && warnings === 0 && (
                        <Badge className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-600 hover:bg-emerald-500/10">Clean</Badge>
                      )}
                    </div>

                    <span className={cn("shrink-0 rounded px-2.5 py-1 text-[11px] font-semibold", s.badge)}>
                      {run.status === "running" && <span className="mr-1 inline-block h-2.5 w-2.5 animate-spin rounded-full border border-[#1d6ef5] border-t-transparent align-[-1px]" />}
                      {s.label}
                    </span>

                    <span className="text-ui-muted opacity-0 transition-opacity group-hover:opacity-100">→</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <RequireAuth>
      <RunsHome />
    </RequireAuth>
  )
}
```


===== apps/web/app/workspace/layout.tsx =====

```
import { RequireAuth } from "@/components/auth/RequireAuth"

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>
}
```


===== apps/web/app/workspace/page.tsx =====

```
import Link from "next/link"

export default function WorkspaceRoute() {
  return (
    <main className="flex h-dvh items-center justify-center bg-app-bg p-6">
      <div className="max-w-md rounded border border-ui-border bg-white p-5 text-sm text-ui-muted">
        No run selected. Go back to <Link href="/" className="font-medium text-[#1d6ef5]">runs</Link> and open one.
      </div>
    </main>
  )
}
```


===== apps/web/app/workspace/[runId]/page.tsx =====

```
"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import type { Edge, Node } from "@xyflow/react"
import { WorkspacePage } from "@/components/workspace/WorkspacePage"
import { useAuth } from "@/components/auth/AuthProvider"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { applyRunEvent } from "@/store/runs-slice"
import { ingestRunEventMeta, setRunStreamStatus } from "@/store/run-live-slice"
import type { Issue, NodeStatus } from "@/types/domain"
import type { ScreenshotNodeData } from "@/types/flow"
import type { WorkspaceRun } from "@/context/workspace-data-context"

type WorkspaceApiPayload = {
  run: WorkspaceRun
  nodes: Array<{
    id: string
    position: { x: number; y: number }
    data: {
      label: string
      url: string
      status: NodeStatus
      step: number
      duration?: string
      isMain?: boolean
      isLarge?: boolean
      imageSrc?: string
      sourceHandle?: { side: "left" | "right"; imageY: number }
    }
  }>
  edges: Edge[]
  issues: Issue[]
}

type RunEventEnvelope = {
  runId: string
  seq: number
  at: string
  type: string
  payload: Record<string, unknown>
}

function applyEvent(current: WorkspaceApiPayload, event: RunEventEnvelope): WorkspaceApiPayload {
  switch (event.type) {
    case "run.updated":
    case "run.started": {
      const runPayload = event.payload.run as Partial<WorkspaceRun> | undefined
      if (!runPayload) return current
      return { ...current, run: { ...current.run, ...runPayload } }
    }

    case "node.upserted": {
      const node = event.payload.node as WorkspaceApiPayload["nodes"][number] | undefined
      if (!node) return current
      const nextNodes = [...current.nodes]
      const index = nextNodes.findIndex((n) => n.id === node.id)
      if (index >= 0) nextNodes[index] = node
      else nextNodes.push(node)
      return { ...current, nodes: nextNodes }
    }

    case "edge.upserted": {
      const edge = event.payload.edge as Edge | undefined
      if (!edge) return current
      const nextEdges = [...current.edges]
      const index = nextEdges.findIndex((e) => e.id === edge.id)
      if (index >= 0) nextEdges[index] = edge
      else nextEdges.push(edge)
      return { ...current, edges: nextEdges }
    }

    case "issue.created": {
      const issue = event.payload.issue as Issue | undefined
      if (!issue) return current
      if (current.issues.some((i) => i.id === issue.id)) return current
      return { ...current, issues: [...current.issues, issue] }
    }

    case "run.completed":
    case "run.failed": {
      const runPayload = event.payload.run as Partial<WorkspaceRun> | undefined
      if (!runPayload) return current
      return { ...current, run: { ...current.run, ...runPayload } }
    }

    default:
      return current
  }
}

async function parseSseResponse(
  response: Response,
  onEvent: (event: RunEventEnvelope) => void,
  signal?: AbortSignal
) {
  if (!response.body) throw new Error("Missing SSE body")

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    if (signal?.aborted) break
    let chunk: ReadableStreamReadResult<Uint8Array>
    try {
      chunk = await reader.read()
    } catch {
      if (signal?.aborted) return
      throw new Error('SSE read failed')
    }
    const { done, value } = chunk
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    let idx = buffer.indexOf("\n\n")
    while (idx !== -1) {
      const block = buffer.slice(0, idx)
      buffer = buffer.slice(idx + 2)

      const lines = block.split("\n")
      const eventName = lines.find((l) => l.startsWith("event:"))?.slice(6).trim()
      const data = lines.find((l) => l.startsWith("data:"))?.slice(5).trim()

      if (eventName === "run-event" && data) {
        try {
          onEvent(JSON.parse(data) as RunEventEnvelope)
        } catch {
          // ignore malformed event
        }
      }

      idx = buffer.indexOf("\n\n")
    }
  }
}

export default function WorkspaceRunRoute() {
  const params = useParams<{ runId: string }>()
  const search = useSearchParams()
  const { accessToken } = useAuth()
  const dispatch = useAppDispatch()

  const [payload, setPayload] = useState<WorkspaceApiPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const streamState = useAppSelector((s) => s.runLive.byRunId[params.runId]?.status ?? "idle")
  const lastSeq = useRef(0)

  useEffect(() => {
    async function loadSnapshot() {
      if (!params.runId || !accessToken) return

      const res = await fetch(`/api/runs/${params.runId}/workspace`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!res.ok) {
        setError("Failed to load workspace")
        return
      }

      const data = (await res.json()) as WorkspaceApiPayload
      setPayload(data)
    }

    void loadSnapshot().catch(() => setError("Failed to load workspace"))
  }, [accessToken, params.runId])

  useEffect(() => {
    if (!accessToken || !params.runId) return

    const abort = new AbortController()
    let pollingTimer: ReturnType<typeof setInterval> | null = null

    const startPolling = () => {
      dispatch(setRunStreamStatus({ runId: params.runId, status: "polling" }))
      pollingTimer = setInterval(async () => {
        const res = await fetch(`/api/runs/${params.runId}/events?afterSeq=${lastSeq.current}&limit=200`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        })
        if (!res.ok) return
        const data = await res.json()
        const events = (data.events ?? []) as RunEventEnvelope[]
        for (const event of events) {
          lastSeq.current = Math.max(lastSeq.current, event.seq)
          dispatch(ingestRunEventMeta({ runId: event.runId, seq: event.seq, at: event.at }))
          dispatch(applyRunEvent(event))
          setPayload((cur) => (cur ? applyEvent(cur, event) : cur))
        }
      }, 2500)
    }

    async function startLive() {
      try {
        const res = await fetch(`/api/runs/${params.runId}/stream?afterSeq=${lastSeq.current}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
          signal: abort.signal,
        })

        if (!res.ok) throw new Error("SSE stream failed")
        dispatch(setRunStreamStatus({ runId: params.runId, status: "live" }))

        await parseSseResponse(
          res,
          (event) => {
            lastSeq.current = Math.max(lastSeq.current, event.seq)
            dispatch(ingestRunEventMeta({ runId: event.runId, seq: event.seq, at: event.at }))
            dispatch(applyRunEvent(event))
            setPayload((cur) => (cur ? applyEvent(cur, event) : cur))
          },
          abort.signal
        )
      } catch {
        if (!abort.signal.aborted) {
          dispatch(setRunStreamStatus({ runId: params.runId, status: "reconnecting" }))
          startPolling()
        }
      }
    }

    void startLive().catch(() => {
      // swallow unexpected stream errors in dev/HMR cleanup paths
    })

    return () => {
      try {
        // Pass an explicit AbortError reason to avoid runtime "aborted without reason" noise.
        abort.abort(new DOMException("Workspace route cleanup", "AbortError"))
      } catch {
        // ignore cleanup abort noise
      }
      if (pollingTimer) clearInterval(pollingTimer)
      dispatch(setRunStreamStatus({ runId: params.runId, status: "idle" }))
    }
  }, [accessToken, dispatch, params.runId])

  if (error) {
    return <div className="flex h-dvh items-center justify-center bg-app-bg text-ui-muted">{error}</div>
  }

  const effectivePayload: WorkspaceApiPayload = payload ?? {
    run: {
      id: params.runId,
      name: "Loading workspace…",
      label: null,
      category: "ux",
      status: "running",
      startedAt: new Date().toISOString(),
      securitySynopsis: null,
    },
    nodes: [],
    edges: [],
    issues: [],
  }

  const nodes: Node<ScreenshotNodeData>[] = effectivePayload.nodes.map((n) => ({
    id: n.id,
    type: "screenshot",
    position: n.position,
    data: n.data,
  }))

  return (
    <>
      <div className="fixed left-[252px] top-3 z-[2000] rounded bg-black/70 px-2 py-1 text-[11px] text-white">
        {streamState === "live" ? "Live" : streamState === "polling" ? "Polling" : streamState === "reconnecting" ? "Reconnecting" : "Idle"}
      </div>
      <WorkspacePage
        run={effectivePayload.run}
        nodes={nodes}
        edges={effectivePayload.edges}
        issues={effectivePayload.issues}
        initialIssueId={search.get("issueId") ?? undefined}
        initialNodeId={search.get("nodeId") ?? undefined}
      />
    </>
  )
}
```


===== apps/web/app/workspace/(detail)/runs/page.tsx =====

```
"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { AppSidebar } from "@/components/workspace/AppSidebar"
import { useAuth } from "@/components/auth/AuthProvider"
import { useProjectRuns, type ProjectRun } from "@/components/workspace/useProjectRuns"

type RunStep = {
  id: string
  index: number
  action: string
  description: string
  target: string
  status: "passed" | "warning" | "failed"
  durationMs: number | null
}

function duration(ms: number | null) {
  if (!ms || ms <= 0) return "—"
  return `${Math.floor(ms / 1000)}s`
}

export default function RunsPage() {
  const { accessToken } = useAuth()
  const { runs } = useProjectRuns(undefined, 30)
  const [openRunId, setOpenRunId] = useState<string | null>(null)
  const [stepsByRun, setStepsByRun] = useState<Record<string, RunStep[]>>({})

  useEffect(() => {
    async function loadSteps(run: ProjectRun) {
      if (!accessToken || stepsByRun[run.id]) return
      const res = await fetch(`/api/runs/${run.id}/steps`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      })
      if (!res.ok) return
      const data = await res.json()
      setStepsByRun((prev) => ({ ...prev, [run.id]: data.steps }))
    }

    const run = runs.find((r) => r.id === openRunId)
    if (run) void loadSteps(run)
  }, [accessToken, openRunId, runs, stepsByRun])

  return (
    <div className="flex h-dvh bg-app-bg font-sans">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto px-8 py-6">
        <h1 className="mb-4 text-[22px] font-bold text-[#1a2a33]">Runs</h1>

        <div className="space-y-3">
          {runs.map((run) => {
            const isOpen = openRunId === run.id
            const steps = stepsByRun[run.id] ?? []
            return (
              <div key={run.id} className="border border-ui-border bg-white">
                <button
                  type="button"
                  onClick={() => setOpenRunId(isOpen ? null : run.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#eff6ff]"
                >
                  {isOpen ? <ChevronDown className="h-4 w-4 text-ui-muted" /> : <ChevronRight className="h-4 w-4 text-ui-muted" />}
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#1a2a33]">{run.name}</div>
                    <div className="text-xs text-ui-muted">{run.label ?? run.id.slice(0, 8)} · {new Date(run.startedAt).toLocaleString("sv-SE")}</div>
                  </div>
                  <div className="text-xs text-ui-muted">{run.status}</div>
                </button>

                {isOpen && (
                  <div className="border-t border-ui-border px-4 py-2">
                    {steps.length === 0 ? (
                      <div className="text-xs text-ui-muted">No steps yet.</div>
                    ) : (
                      <div className="space-y-1">
                        {steps.map((step) => (
                          <div key={step.id} className="flex items-center gap-3 py-1 text-xs">
                            <span className="w-5 text-ui-muted">{step.index}</span>
                            <span className="w-16 rounded bg-app-bg px-1.5 py-0.5 font-mono">{step.action}</span>
                            <span className="flex-1 text-[#1a2a33]">{step.description}</span>
                            <span className="text-ui-muted">{step.target}</span>
                            <span className="w-8 text-right text-ui-muted">{duration(step.durationMs)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          {runs.length === 0 && <div className="text-sm text-ui-muted">No runs yet.</div>}
        </div>
      </div>
    </div>
  )
}
```


===== apps/web/components/workspace/WorkspacePage.tsx =====

```
"use client"

import type { Edge, Node } from "@xyflow/react"
import type { Issue } from "@/types/domain"
import type { ScreenshotNodeData } from "@/types/flow"
import { IssueProvider } from "@/context/issue-context"
import { WorkspaceDataProvider, type WorkspaceRun } from "@/context/workspace-data-context"
import { FlowCanvas } from "@/components/workspace/FlowCanvas"
import { FloatingNav } from "@/components/workspace/FloatingNav"
import { SecurityOverlay } from "@/components/workspace/SecurityOverlay"
import { Sidebar } from "@/components/workspace/Sidebar"

export function WorkspacePage({
  run,
  nodes,
  edges,
  issues,
  initialIssueId,
  initialNodeId,
}: {
  run: WorkspaceRun
  nodes: Node<ScreenshotNodeData>[]
  edges: Edge[]
  issues: Issue[]
  initialIssueId?: string
  initialNodeId?: string
}) {
  return (
    <WorkspaceDataProvider value={{ run, nodes, edges, issues }}>
      <IssueProvider initialIssueId={initialIssueId} initialNodeId={initialNodeId}>
        <main className="flex h-dvh w-full overflow-hidden bg-[#eff6ff]">
          <Sidebar />
          <div className="relative flex flex-1 overflow-hidden">
            <FloatingNav />
            <SecurityOverlay />
            <FlowCanvas />
          </div>
        </main>
      </IssueProvider>
    </WorkspaceDataProvider>
  )
}
```


===== apps/web/components/workspace/WorkspaceClient.tsx =====

```
"use client"

import { ErrorBoundary } from "@/components/error-boundary"
import { FlowCanvas } from "@/components/workspace/FlowCanvas"
import { Sidebar } from "@/components/workspace/Sidebar"
import { IssueProvider } from "@/context/issue-context"

export function WorkspaceClient() {
  return (
    <IssueProvider>
      <Sidebar />
      <ErrorBoundary>
        <FlowCanvas />
      </ErrorBoundary>
    </IssueProvider>
  )
}
```


===== apps/web/components/workspace/FlowCanvas.tsx =====

```
"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  applyNodeChanges,
  useNodes,
  useOnViewportChange,
  useReactFlow,
  type Node,
  type NodeChange,
  type NodeMouseHandler,
} from "@xyflow/react"

import { useIssueContext } from "@/context/issue-context"
import { useWorkspaceData } from "@/context/workspace-data-context"
import { NODE_WIDTH, NODE_WIDE } from "@/constants/flow"
import type { ScreenshotNodeData } from "@/types/flow"
import { ScreenshotNode } from "@/components/workspace/nodes/ScreenshotNode"
import { SpringEdge } from "@/components/workspace/edges/SpringEdge"
import { InlineLoading } from "@/components/loading/InlineLoading"

const nodeTypes = { screenshot: ScreenshotNode }
const edgeTypes = { spring: SpringEdge }

function autoLayoutNodes(nodes: Node<ScreenshotNodeData>[], edges: { source: string; target: string }[]) {
  if (nodes.length === 0) return nodes

  const byId = new Map(nodes.map((n) => [n.id, n]))
  const children = new Map<string, Set<string>>()
  const indegree = new Map<string, number>()

  for (const node of nodes) {
    children.set(node.id, new Set())
    indegree.set(node.id, 0)
  }

  for (const edge of edges) {
    if (!byId.has(edge.source) || !byId.has(edge.target)) continue
    children.get(edge.source)?.add(edge.target)
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1)
  }

  const roots = nodes.filter((n) => (indegree.get(n.id) ?? 0) === 0).map((n) => n.id)
  const firstNodeId = nodes[0]?.id
  if (!firstNodeId) return nodes
  const queue = roots.length > 0 ? [...roots] : [firstNodeId]
  const level = new Map<string, number>()

  for (const id of queue) level.set(id, 0)

  while (queue.length > 0) {
    const current = queue.shift()!
    const curLevel = level.get(current) ?? 0

    for (const child of children.get(current) ?? []) {
      const nextLevel = curLevel + 1
      if ((level.get(child) ?? -1) < nextLevel) level.set(child, nextLevel)
      queue.push(child)
    }
  }

  for (const node of nodes) {
    if (!level.has(node.id)) level.set(node.id, 0)
  }

  const lanes = new Map<number, string[]>()
  for (const node of nodes) {
    const l = level.get(node.id) ?? 0
    if (!lanes.has(l)) lanes.set(l, [])
    lanes.get(l)!.push(node.id)
  }

  const xGap = 560
  const yGap = 360

  return nodes.map((node) => {
    const l = level.get(node.id) ?? 0
    const lane = lanes.get(l) ?? []
    const i = lane.indexOf(node.id)
    return {
      ...node,
      position: {
        x: 180 + l * xGap,
        y: 120 + Math.max(0, i) * yGap,
      },
    }
  })
}

const MAX_ZOOM       = 4
const PINCH_SPEED    = 0.05  // zoom factor per deltaY unit during pinch (ctrlKey)
const PAN_SPEED      = 1.0   // scroll-to-pan multiplier

// Reads live measured node dimensions from React Flow and re-zooms
// whenever the active node's height changes (e.g. dropdown opens/closes).
// Debounced so we wait for the node to fully expand before animating.
function FlowController() {
  const { activeNodeId, clearSelection } = useIssueContext()
  const { setCenter } = useReactFlow()
  const nodes = useNodes<Node>()
  const lastRef      = useRef<{ nodeId: string; height: number } | null>(null)
  const animatingRef = useRef(true)    // start true to block fitView from clearing seeded state

  // Allow pan-to-clear after React Flow's initial fitView has had time to run
  useEffect(() => {
    const t = setTimeout(() => { animatingRef.current = false }, 300)
    return () => clearTimeout(t)
  }, [])

  // ── Auto-zoom when focused node changes or its height shifts ────────────
  useEffect(() => {
    if (!activeNodeId) {
      lastRef.current = null
      return
    }

    const node = nodes.find((n) => n.id === activeNodeId)
    if (!node || node.type !== "screenshot") return
    if (!node?.measured?.height || !node.measured.width) return

    const nodeHeight = node.measured.height
    const prev = lastRef.current

    if (prev?.nodeId === activeNodeId && Math.abs(prev.height - nodeHeight) < 2) return

    const timer = setTimeout(() => {
      lastRef.current = { nodeId: activeNodeId, height: nodeHeight }

      const nodeData = node.data as ScreenshotNodeData
      const nodeWidth = nodeData.isMain || nodeData.isLarge ? NODE_WIDE : NODE_WIDTH
      const targetZoom = Math.min((window.innerHeight * 0.8) / nodeHeight, MAX_ZOOM)
      const centerX = node.position.x + nodeWidth / 2
      const centerY = node.position.y + nodeHeight / 2

      // Block pan-exit detection for the duration of the animation + a small buffer
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const duration = reducedMotion ? 0 : 600
      animatingRef.current = true
      setCenter(centerX, centerY, { zoom: targetZoom, duration })
      const cooldown = setTimeout(() => { animatingRef.current = false }, duration + 120)
      return () => clearTimeout(cooldown)
    }, 40)

    return () => clearTimeout(timer)
  }, [activeNodeId, nodes, setCenter])

  // ── Unfocus when user initiates any viewport move (pan or zoom) ──────────
  useOnViewportChange({
    onStart: () => {
      if (!animatingRef.current) clearSelection()
    },
  })

  // ── Custom wheel: pinch = zoom (fast), scroll = pan (all directions) ───────
  const rf = useReactFlow()
  useEffect(() => {
    const el = document.querySelector(".react-flow") as HTMLElement | null
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const vp = rf.getViewport()

      if (e.ctrlKey) {
        // Trackpad pinch gesture → zoom toward cursor
        const rect   = el.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const factor  = Math.exp(-e.deltaY * PINCH_SPEED)
        const newZoom = Math.max(0.2, Math.min(MAX_ZOOM, vp.zoom * factor))
        const newX    = mouseX - (mouseX - vp.x) * (newZoom / vp.zoom)
        const newY    = mouseY - (mouseY - vp.y) * (newZoom / vp.zoom)

        rf.setViewport({ x: newX, y: newY, zoom: newZoom }, { duration: 0 })
      } else {
        // Two-finger scroll or mouse wheel → pan in scroll direction
        rf.setViewport(
          { ...vp, x: vp.x - e.deltaX * PAN_SPEED, y: vp.y - e.deltaY * PAN_SPEED },
          { duration: 0 }
        )
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [rf])

  return null
}

export function FlowCanvas() {
  const { run, nodes: workspaceNodes, edges } = useWorkspaceData()
  const layoutedNodes = useMemo(
    () => autoLayoutNodes(workspaceNodes, edges.map((e) => ({ source: String(e.source), target: String(e.target) }))),
    [workspaceNodes, edges]
  )
  const [nodes, setNodes] = useState<Node[]>(layoutedNodes)
  const { selectNode, clearSelection } = useIssueContext()
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [loadingAnchor, setLoadingAnchor] = useState({ x: 180, y: 120 })
  const hasSeededLoadingAnchor = useRef(false)

  useEffect(() => {
    setNodes(layoutedNodes)
  }, [layoutedNodes])

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      setNodes((current) => applyNodeChanges(changes, current))
    },
    []
  )

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      if (node.type !== "screenshot") return
      selectNode(node.id)
    },
    [selectNode]
  )

  useEffect(() => {
    if (nodes.length > 0) {
      hasSeededLoadingAnchor.current = false
      return
    }
    if (hasSeededLoadingAnchor.current) return

    const el = containerRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const worldX = (rect.width / 2 - viewport.x) / viewport.zoom
    const worldY = (rect.height / 2 - viewport.y) / viewport.zoom

    setLoadingAnchor({ x: worldX, y: worldY })
    hasSeededLoadingAnchor.current = true
  }, [nodes.length, viewport.x, viewport.y, viewport.zoom])

  const loadingLeft = loadingAnchor.x * viewport.zoom + viewport.x
  const loadingTop = loadingAnchor.y * viewport.zoom + viewport.y

  return (
    <div ref={containerRef} className="relative flex h-full flex-1 flex-col overflow-hidden bg-white">
      <ReactFlow
        className="h-full w-full"
        onInit={(instance) => setViewport(instance.getViewport())}
        onMove={(_event, nextViewport) => setViewport(nextViewport)}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onPaneClick={clearSelection}
        fitView
        fitViewOptions={{ padding: 0.22 }}
        minZoom={0.2}
        maxZoom={MAX_ZOOM}
        zoomOnScroll={false}
        panOnScroll={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#1B3A6B"
          gap={28}
          size={2.5}
        />
        <Controls className="flow-controls" showInteractive={false} />
        <FlowController />
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-30">
          <div
            className="absolute"
            style={{ left: loadingLeft, top: loadingTop, transform: "translate(-50%, -50%)" }}
          >
            <div className="w-[420px] rounded-lg border border-ui-border bg-white/95 p-6 text-center shadow-xl backdrop-blur">
              <InlineLoading
                label={run.status === "running" ? "Building workflow graph…" : "Preparing workspace…"}
                cubeSize={58}
                className="min-h-[220px]"
              />
              <p className="mt-1 text-xs text-ui-muted">
                We are ingesting streamed events and will render nodes as soon as they are available.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```


===== apps/web/components/workspace/Sidebar.tsx =====

```
"use client"

import { useState } from "react"
import { AlertTriangle, Clock, XCircle } from "lucide-react"

import { Wordmark } from "@/components/ui/TestaRunLogo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useIssueContext } from "@/context/issue-context"
import { useWorkspaceData } from "@/context/workspace-data-context"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const {
    selectIssue, selectNode, activeIssueId, activeNodeId, clearSelection,
    issues, issuesByNodeId, openIssues, resolvedIssues,
  } = useIssueContext()
  const { run, nodes } = useWorkspaceData()
  const nodesById = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, (typeof nodes)[number]>

  // ── Global stats ────────────────────────────────────────────────────────
  const errorCount = openIssues.filter((issue) => issue.severity === "error").length
  const warningCount = openIssues.filter((issue) => issue.severity === "warning").length
  const sitesChecked = new Set(issues.map((issue) => issue.nodeId)).size

  // ── Focused node ─────────────────────────────────────────────────────────
  const focusedNode = activeNodeId
    ? nodes.find((n) => n.id === activeNodeId) ?? null
    : null
  const nodeIssues = activeNodeId ? (issuesByNodeId[activeNodeId] ?? []) : []
  const nodeOpenIssues = nodeIssues.filter((i) => i.status === "open")
  const nodeResolvedIssues = nodeIssues.filter((i) => i.status === "resolved")

  // ── Show-more state for global issue lists ───────────────────────────────
  const [showAllOpen,     setShowAllOpen]     = useState(false)
  const [showAllResolved, setShowAllResolved] = useState(false)
  const ISSUE_LIMIT = 3

  // ── Active issue ─────────────────────────────────────────────────────────
  const activeIssue = activeIssueId ? issues.find((i) => i.id === activeIssueId) ?? null : null

  const sidebarWidth = activeIssue ? 480 : focusedNode ? 420 : 320

  return (
    <aside
      className="flex h-full shrink-0 flex-col gap-4 overflow-y-auto border-r border-white/10 bg-[#1c2030] px-5 py-5 text-white transition-[width] duration-300 ease-in-out"
      style={{ width: sidebarWidth }}
    >
      <Wordmark variant="dark" className="text-[22px] font-normal" />

      {activeIssue ? (
        // ── ISSUE DETAIL VIEW ───────────────────────────────────────────────
        <div key={activeIssueId} className="node-focus-in flex w-[440px] flex-col gap-4">
          {/* Back */}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => selectNode(activeIssue.nodeId)}
            className="h-auto w-fit px-0 py-0 text-[11px] text-white/50 hover:bg-transparent hover:text-white/80"
          >
            ← Node issues
          </Button>

          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                  activeIssue.severity === "error" ? "bg-red-500" : "bg-amber-400",
                  activeIssue.status === "resolved" && "bg-emerald-500"
                )}
              />
              <h2 className="text-[15px] font-semibold leading-snug text-[#e8edf5]">
                {activeIssue.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "rounded-none border-transparent px-2 py-0.5 text-[10px] uppercase",
                  activeIssue.status === "resolved"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : activeIssue.severity === "error"
                    ? "bg-red-500/20 text-red-300"
                    : "bg-amber-400/20 text-amber-300"
                )}
              >
                {activeIssue.status === "resolved"
                  ? "✓ resolved"
                  : activeIssue.severity === "error"
                  ? "error"
                  : "warning"}
              </Badge>
              <code className="font-mono text-[11px] text-white/40">{activeIssue.element}</code>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.6px] text-white/40">
              Summary
            </div>
            <p className="text-[13px] leading-relaxed text-white/80">
              {activeIssue.description}
            </p>
          </div>

          <Separator className="bg-white/10" />

          {/* Reasoning */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.6px] text-white/40">
              Agent reasoning
            </div>
            <p className="text-[12px] leading-relaxed text-white/60">
              {activeIssue.reasoning}
            </p>
          </div>
        </div>

      ) : focusedNode ? (
        // ── FOCUSED NODE VIEW ───────────────────────────────────────────────
        <div key={activeNodeId} className="node-focus-in flex flex-col gap-4">
          {/* Back button + node header */}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={clearSelection}
            className="h-auto w-fit px-0 py-0 text-[11px] text-white/50 hover:bg-transparent hover:text-white/80"
          >
            ← All issues
          </Button>

          <Card className="rounded-none border-white/10 bg-white/5 text-white">
            <CardContent className="flex flex-col gap-1 p-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    focusedNode.data.status === "passed" && "bg-emerald-500",
                    focusedNode.data.status === "running" && "bg-[#1d6ef5]",
                    focusedNode.data.status === "pending" && "bg-indigo-400"
                  )}
                />
                <span className="text-[13px] font-semibold text-[#e8edf5]">
                  {focusedNode.data.label}
                </span>
                <span className="ml-auto text-[10px] font-mono text-white/40">
                  Step {focusedNode.data.step}
                </span>
              </div>
              <div className="truncate font-mono text-[11px] text-white/40">
                {focusedNode.data.url}
              </div>
            </CardContent>
          </Card>

          {/* Node issue stats */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="rounded-none border-white/10 bg-white/5 text-white">
              <CardContent className="flex flex-col gap-1 p-3">
                <div className="text-[20px] font-semibold leading-none text-red-400">
                  {nodeOpenIssues.filter((i) => i.severity === "error").length}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-white/50">Errors</div>
              </CardContent>
            </Card>
            <Card className="rounded-none border-white/10 bg-white/5 text-white">
              <CardContent className="flex flex-col gap-1 p-3">
                <div className="text-[20px] font-semibold leading-none text-amber-300">
                  {nodeOpenIssues.filter((i) => i.severity === "warning").length}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-white/50">Warnings</div>
              </CardContent>
            </Card>
            <Card className="rounded-none border-white/10 bg-white/5 text-white">
              <CardContent className="flex flex-col gap-1 p-3">
                <div className="text-[20px] font-semibold leading-none text-emerald-400">
                  {nodeResolvedIssues.length}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-white/50">Resolved</div>
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-white/10" />

          {/* Node issues list */}
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.6px] text-white/50">
            <span>Issues on this page</span>
            <Badge className="rounded-none bg-[#1d6ef5] text-[10px] font-bold">
              {nodeOpenIssues.length}
            </Badge>
          </div>

          {nodeIssues.length === 0 ? (
            <div className="rounded-none border border-white/10 bg-white/5 px-3 py-4 text-center text-[12px] text-white/40">
              No issues found
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {nodeIssues.map((issue) => {
                const isActive = activeIssueId === issue.id
                return (
                  <button
                    key={issue.id}
                    className={cn(
                      "w-full rounded-none border border-white/10 bg-white/5 px-2 py-2 text-left text-[11px] text-white/80",
                      "transition hover:-translate-y-0.5 hover:bg-white/10",
                      issue.status === "resolved" && "opacity-60",
                      issue.severity === "error" && issue.status === "open" && "border-l-4 border-l-red-500",
                      issue.severity === "warning" && issue.status === "open" && "border-l-4 border-l-amber-400",
                      isActive && "border-l-4 border-l-[#1d6ef5] bg-[#1d6ef5]/15 shadow-[0_0_0_1px_rgba(29,110,245,0.3)]"
                    )}
                    onClick={() => selectIssue(issue.id)}
                  >
                    <div className="mb-1 font-medium text-white">
                      {issue.title}
                    </div>
                    <p className="mb-2 line-clamp-2 text-[11px] leading-relaxed text-white/40">
                      {issue.reasoning}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-white/50">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-none border-transparent px-1.5 py-0.5 text-[9px] uppercase",
                          issue.severity === "error"
                            ? "bg-red-500/20 text-red-200"
                            : "bg-amber-400/20 text-amber-200",
                          issue.status === "resolved" && "bg-emerald-500/20 text-emerald-200"
                        )}
                      >
                        {issue.status === "resolved" ? "✓ resolved" : issue.severity === "error"
                          ? <span className="inline-flex items-center gap-1"><XCircle className="h-3 w-3" /> error</span>
                          : <span className="inline-flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> warning</span>}
                      </Badge>
                      <span className="truncate font-mono">{issue.element}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

      ) : (
        // ── GLOBAL VIEW ─────────────────────────────────────────────────────
        <>
          <Card className="rounded-none border-white/10 bg-white/5 text-white">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-none bg-white/10 text-xs">
                <Clock className="h-3.5 w-3.5 text-white/70" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold">{run.name}</div>
                <div className="truncate font-mono text-[11px] text-white/50">
                  {run.label ?? run.id}
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
            </CardContent>
          </Card>

          <Card className="rounded-none border-white/10 bg-white/5 text-white">
            <CardContent className="flex flex-col gap-1.5 p-3 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/50">Run</span>
                <span className="font-mono text-[12px] font-semibold text-[#7eb3f5]">
                  {run.label ?? run.id.slice(0, 8)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/50">Started</span>
                <span className="text-[11px] text-white/60">{new Date(run.startedAt).toLocaleString("sv-SE")}</span>
              </div>
              <Button
                type="button"
                size="xs"
                variant="ghost"
                className="mt-1 h-auto w-fit rounded-none border border-white/10 px-2 py-1 text-[10px] text-white/70 hover:bg-white/10"
              >
                Open run log
              </Button>
            </CardContent>
          </Card>

          <Separator className="bg-white/10" />

          <div className="text-[10px] font-bold uppercase tracking-[0.6px] text-white/50">
            Stats
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Card className="rounded-none border-white/10 bg-white/5 text-white">
              <CardContent className="flex flex-col gap-1 p-3">
                <div className="text-[22px] font-semibold leading-none">
                  {sitesChecked}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-white/50">
                  Sites checked
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-none border-white/10 bg-white/5 text-white">
              <CardContent className="flex flex-col gap-1 p-3">
                <div className="text-[22px] font-semibold leading-none text-red-400">
                  {errorCount}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-white/50">
                  Errors
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-none border-white/10 bg-white/5 text-white">
              <CardContent className="flex flex-col gap-1 p-3">
                <div className="text-[22px] font-semibold leading-none text-amber-300">
                  {warningCount}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-white/50">
                  Warnings
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-none border-white/10 bg-white/5 text-white">
              <CardContent className="flex flex-col gap-1 p-3">
                <div className="text-[22px] font-semibold leading-none text-emerald-400">
                  {resolvedIssues.length}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-white/50">
                  Resolved
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-white/10" />

          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.6px] text-white/50">
            <span>Issues</span>
            <Badge className="rounded-none bg-[#1d6ef5] text-[10px] font-bold">
              {openIssues.length}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="mb-2 rounded-none bg-[#1d6ef5]/20 px-2 py-1 text-center text-[10px] font-bold uppercase text-[#7eb3f5]">
                Open
              </div>
              {(showAllOpen ? openIssues : openIssues.slice(0, ISSUE_LIMIT)).map((issue) => {
                const nd = nodesById[issue.nodeId]; const meta = { step: nd?.data.step ?? 0, label: nd?.data.label ?? "Unknown" }
                const isActive = activeIssueId === issue.id
                return (
                  <button
                    key={issue.id}
                    className={cn(
                      "mb-2 w-full rounded-none border border-white/10 bg-white/5 px-2 py-2 text-left text-[11px] text-white/80",
                      "transition hover:-translate-y-0.5 hover:bg-white/10",
                      issue.severity === "error" && "border-l-4 border-l-red-500",
                      issue.severity === "warning" && "border-l-4 border-l-amber-400",
                      isActive &&
                        "border-l-4 border-l-[#1d6ef5] bg-[#1d6ef5]/15 shadow-[0_0_0_1px_rgba(29,110,245,0.3)]"
                    )}
                    onClick={() => selectIssue(issue.id)}
                  >
                    <div className="mb-1 font-medium text-white">
                      {issue.title}
                    </div>
                    <div className="flex flex-col gap-1 text-[10px] text-white/50">
                      <span className="font-mono">
                        Step {meta.step} · {meta.label}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-none border-transparent px-1.5 py-0.5 text-[9px] uppercase",
                          issue.severity === "error"
                            ? "bg-red-500/20 text-red-200"
                            : "bg-amber-400/20 text-amber-200"
                        )}
                      >
                        <span className="inline-flex items-center gap-1">
                          {issue.severity === "error"
                            ? <><XCircle className="h-3 w-3" /> error</>
                            : <><AlertTriangle className="h-3 w-3" /> warning</>}
                        </span>
                      </Badge>
                    </div>
                  </button>
                )
              })}
              {openIssues.length > ISSUE_LIMIT && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setShowAllOpen((v) => !v)}
                  className="h-auto w-full py-1 text-[10px] text-white/30 hover:bg-transparent hover:text-white/60"
                >
                  {showAllOpen ? "Show less" : `Show ${openIssues.length - ISSUE_LIMIT} more`}
                </Button>
              )}
            </div>

            <div>
              <div className="mb-2 rounded-none bg-emerald-500/20 px-2 py-1 text-center text-[10px] font-bold uppercase text-emerald-300">
                Resolved
              </div>
              {(showAllResolved ? resolvedIssues : resolvedIssues.slice(0, ISSUE_LIMIT)).map((issue) => {
                const nd = nodesById[issue.nodeId]; const meta = { step: nd?.data.step ?? 0, label: nd?.data.label ?? "Unknown" }
                const isActive = activeIssueId === issue.id
                return (
                  <button
                    key={issue.id}
                    className={cn(
                      "mb-2 w-full rounded-none border border-white/10 bg-white/5 px-2 py-2 text-left text-[11px] text-white/60",
                      "opacity-70 transition hover:-translate-y-0.5 hover:bg-white/10",
                      isActive && "bg-emerald-500/10"
                    )}
                    onClick={() => selectIssue(issue.id)}
                  >
                    <div className="mb-1 font-medium text-white/70">
                      {issue.title}
                    </div>
                    <div className="text-[10px] text-white/40">
                      Step {meta.step} · {meta.label}
                    </div>
                  </button>
                )
              })}
              {resolvedIssues.length > ISSUE_LIMIT && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setShowAllResolved((v) => !v)}
                  className="h-auto w-full py-1 text-[10px] text-white/30 hover:bg-transparent hover:text-white/60"
                >
                  {showAllResolved ? "Show less" : `Show ${resolvedIssues.length - ISSUE_LIMIT} more`}
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Footer — always visible */}
      <div className="mt-auto flex items-center gap-2 rounded-none border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white/60">
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            run.status === "running"
              ? "bg-[#1d6ef5] shadow-[0_0_6px_#1d6ef5]"
              : run.status === "passed"
                ? "bg-emerald-500"
                : run.status === "warning"
                  ? "bg-amber-400"
                  : "bg-red-500"
          )}
        />
        {run.status === "running"
          ? "Agent running"
          : run.status === "passed"
            ? "Run completed"
            : run.status === "warning"
              ? "Run completed with warnings"
              : "Run failed"}
      </div>
    </aside>
  )
}
```


===== apps/web/components/workspace/AppSidebar.tsx =====

```
"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  AlertTriangle,
  ChevronDown,
  CirclePlay,
  Clock,
  LogOut,
  Settings,
  ShieldAlert,
  User,
} from "lucide-react"
import { Wordmark } from "@/components/ui/TestaRunLogo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/AuthProvider"
import { useProjectRuns } from "@/components/workspace/useProjectRuns"

const runStatusDot = {
  running: "bg-[#1d6ef5] shadow-[0_0_5px_rgba(29,110,245,0.6)]",
  warning: "bg-amber-400",
  passed: "bg-emerald-500",
  failed: "bg-red-500",
} as const

function fromNow(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.max(0, Math.floor(diff / 60000))
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function AppSidebar() {
  const pathname = usePathname()
  const params = useSearchParams()
  const router = useRouter()
  const { user, signOut } = useAuth()

  const selectedRunId = params.get("runId") ?? (pathname.startsWith("/workspace/") ? pathname.split("/")[2] : undefined)
  const isHome = pathname === "/"
  const { project, runs, activeRun, selectedRun, runningRun } = useProjectRuns(
    selectedRunId,
    isHome ? 30 : 5,
    { poll: !isHome }
  )

  const initials = (user?.email?.slice(0, 2) || "TR").toUpperCase()
  const contextRun = selectedRun ?? runningRun
  const runQuery = contextRun ? `?runId=${contextRun.id}` : ""

  const nav = [
    { label: "Runs", href: "/", icon: CirclePlay },
    { label: "Issues", href: `/workspace/issues${runQuery}`, icon: AlertTriangle },
    { label: "Security", href: `/workspace/security${runQuery}`, icon: ShieldAlert },
    { label: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-white/8 bg-[#1c2030] text-white">
      <div className="px-5 py-5">
        <Wordmark variant="dark" className="text-[15px]" />
      </div>

      <div className="mx-3 mb-4">
        <Button type="button" variant="ghost" className="h-auto w-full justify-between rounded border border-white/10 bg-white/5 px-3 py-2.5 text-left hover:bg-white/10">
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-[0.6px] text-white/40">Project</div>
            <div className="truncate text-[13px] font-semibold text-[#e8edf5]">{project?.name || "No project"}</div>
            <div className="truncate font-mono text-[10px] text-white/40">{project?.targetUrl || "—"}</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/40" />
        </Button>
      </div>

      <div className="mx-3 mb-4 border-t border-white/8" />

      <nav className="flex flex-col gap-0.5 px-3">
        <div className="mb-1 px-2 text-[10px] font-bold uppercase tracking-[0.6px] text-white/30">Navigate</div>
        {nav.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href.startsWith("/workspace/") && pathname.startsWith(href.split("?")[0] ?? ""))
          return (
            <Link key={href} href={href} className={cn("flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] font-medium transition-colors", isActive ? "bg-[#1d6ef5]/15 text-[#7eb3f5]" : "text-white/60 hover:bg-white/8 hover:text-white")}>
              <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-[#1d6ef5]" : "text-white/40")} />
              {label}
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#1d6ef5]" />}
            </Link>
          )
        })}
      </nav>

      <div className="mx-3 my-4 border-t border-white/8" />

      <div className="px-3">
        <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.6px] text-white/30">
          {runningRun ? "Active Run" : selectedRun ? "Selected Run" : "Run Context"}
        </div>
        <div className="rounded border border-white/10 bg-white/5 px-3 py-2.5">
          {activeRun ? (
            <>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] font-semibold text-[#7eb3f5]">{activeRun.label ?? activeRun.id.slice(0, 8)}</span>
                <span className="flex items-center gap-1 text-[10px] text-white/50">
                  <span className={cn("h-1.5 w-1.5 rounded-full", runStatusDot[activeRun.status])} />
                  {activeRun.status}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-white/40">
                <Clock className="h-3 w-3" />
                Started {fromNow(activeRun.startedAt)}
              </div>
            </>
          ) : (
            <div className="text-[10px] text-white/40">No run currently running</div>
          )}
        </div>
      </div>

      <div className="mx-3 my-4 border-t border-white/8" />

      <div className="flex-1 overflow-y-auto px-3">
        <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.6px] text-white/30">Recent Runs</div>
        <div className="flex flex-col gap-0.5">
          {runs.slice(0, 3).map((run) => (
            <Link key={run.id} href={`/workspace/${run.id}`} className="flex h-auto w-full items-center justify-start gap-2.5 rounded px-2.5 py-2 text-left hover:bg-white/8">
              <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", runStatusDot[run.status])} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] font-medium text-white/70">{run.name}</div>
                <div className="font-mono text-[10px] text-white/30">{run.label ?? run.id.slice(0, 8)}</div>
              </div>
              <span className="shrink-0 text-[10px] text-white/30">{fromNow(run.startedAt)}</span>
            </Link>
          ))}
          {runs.length === 0 && <div className="px-2 text-[10px] text-white/40">No runs yet</div>}
        </div>
      </div>

      <div className="mx-3 mt-3 border-t border-white/8 py-3">
        <div className="flex items-center gap-2.5 rounded px-2 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1d6ef5]/30 text-[11px] font-bold text-[#7eb3f5]">{initials}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-semibold text-[#e8edf5]">{user?.user_metadata?.full_name || "testa.run user"}</div>
            <div className="truncate font-mono text-[10px] text-white/40">{user?.email || ""}</div>
          </div>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            className="text-white/30 hover:text-white/60"
            aria-label="Log out"
            onClick={async () => {
              await signOut()
              router.replace("/sign-in")
            }}
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>

        <Link href="/settings" className="mt-1 flex items-center gap-2 rounded px-2 py-1.5 text-[11px] text-white/40 transition hover:bg-white/8 hover:text-white/70">
          <User className="h-3 w-3" />
          Account & billing
        </Link>
      </div>
    </aside>
  )
}
```


===== apps/web/components/workspace/FloatingNav.tsx =====

```
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Wordmark } from "@/components/ui/TestaRunLogo"

export function FloatingNav() {
  const pathname = usePathname()

  const links = [
    { label: "Home", href: "/" },
    { label: "Issues", href: "/workspace/issues" },
    { label: "Runs", href: "/workspace/runs" },
    { label: "Security", href: "/workspace/security" },
  ]

  return (
    <nav className="pointer-events-none absolute inset-x-0 top-4 z-50 flex justify-center">
      <div className="pointer-events-auto flex w-[520px] items-center gap-1 rounded-none border border-[#c7d9f0] bg-white/85 px-4 py-2 backdrop-blur-md">
        <Link href="/" className="mr-3">
          <Wordmark variant="light" />
        </Link>

        <div className="mx-2 h-4 w-px bg-gray-200" />

        <div className="flex flex-1 items-center">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex-1 rounded-md px-3 py-1 text-center text-[13px] font-medium transition-colors",
                  isActive
                    ? "text-brand"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
```


===== apps/web/components/workspace/SecurityOverlay.tsx =====

```
"use client"

import Link from "next/link"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { useIssueContext } from "@/context/issue-context"
import { useWorkspaceData } from "@/context/workspace-data-context"

export function SecurityOverlay() {
  const { issues } = useIssueContext()
  const { run } = useWorkspaceData()

  const securityIssues = issues.filter((i) => i.category === "security")
  const openSec = securityIssues.filter((i) => i.status === "open")
  const criticalCount = openSec.filter((i) => i.severity === "error").length

  const riskLevel = criticalCount > 0
    ? "Critical"
    : openSec.length > 0
      ? "High"
      : securityIssues.length > 0
        ? "Low"
        : "None"

  const riskTone = {
    Critical: "text-red-700 border-red-300 bg-red-50/92",
    High: "text-amber-700 border-amber-300 bg-amber-50/92",
    Low: "text-amber-700 border-amber-300 bg-amber-50/92",
    None: "text-slate-700 border-slate-300 bg-white/95",
  }[riskLevel]

  return (
    <Link
      href={`/workspace/security?runId=${run.id}`}
      className={`pointer-events-auto absolute right-4 top-3 z-40 w-[188px] rounded-md border px-3 py-2 backdrop-blur-md transition-opacity hover:opacity-90 ${riskTone}`}
    >
      <div className="flex items-center gap-2">
        {riskLevel === "None"
          ? <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          : <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
        }
        <span className="text-[10px] font-bold uppercase tracking-[0.7px]">Security</span>
        <span className="ml-auto text-[10px] font-semibold uppercase">{riskLevel}</span>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[10px] tabular-nums">
        <div className="rounded bg-black/5 px-1.5 py-1">
          <div className="font-bold">{openSec.length}</div>
          <div className="opacity-70">open</div>
        </div>
        <div className="rounded bg-black/5 px-1.5 py-1">
          <div className="font-bold">{criticalCount}</div>
          <div className="opacity-70">critical</div>
        </div>
        <div className="rounded bg-black/5 px-1.5 py-1">
          <div className="font-bold">{securityIssues.filter((i) => i.status === "resolved").length}</div>
          <div className="opacity-70">resolved</div>
        </div>
      </div>
    </Link>
  )
}
```


===== apps/web/components/workspace/RunStepCard.tsx =====

```
import Image from "next/image"
import type { RunStep } from "@/types/domain"
import { useWorkspaceData } from "@/context/workspace-data-context"
import { actionIcons, stepStatusConfig } from "@/constants/status"
import { cn } from "@/lib/utils"

const stepStatusCircleClass = {
  passed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/25",
  warning: "bg-amber-400/10 text-amber-600 border-amber-400/25",
  failed: "bg-red-500/10 text-red-600 border-red-500/25",
} as const

const stepStatusBadgeClass = {
  passed: "bg-emerald-500/10 text-emerald-600",
  warning: "bg-amber-400/10 text-amber-600",
  failed: "bg-red-500/10 text-red-600",
} as const

export function RunStepCard({ step }: { step: RunStep }) {
  const { nodes } = useWorkspaceData()
  const s = stepStatusConfig[step.status]
  const node = nodes.find((n) => n.id === step.nodeId)
  const media = node?.data.imageSrc ? { imageSrc: node.data.imageSrc, label: node.data.label } : undefined
  const nodeStep = node?.data.step ?? 0
  const nodeLabel = node?.data.label ?? "Unknown"
  const icon = actionIcons[step.action] ?? "·"

  return (
    <div className="relative flex gap-4">
      {/* Circle */}
      <div
        className={cn(
          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-bold shadow-[0_1px_4px_rgba(0,0,0,0.1)]",
          stepStatusCircleClass[step.status]
        )}
      >
        {icon}
      </div>

      {/* Card */}
      <div className="flex flex-1 overflow-hidden border border-[#c7d9f0] bg-white shadow-[0_1px_4px_rgba(29,110,245,0.06)]">
        <div className="flex-1 px-5 py-4">
          <div className="mb-2 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#4a7ab5]">#{step.index}</span>
                <span className="text-[13px] font-semibold text-[#1a2a33]">{step.description}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-[#4a7ab5]">
                <span className="rounded bg-[#eff6ff] px-1.5 py-0.5 text-[10px]">{step.action}</span>
                <span className="max-w-[200px] truncate">{step.target}</span>
                <span className="text-[#c7d9f0]">·</span>
                <span>Step {nodeStep} · {nodeLabel}</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className={cn("rounded px-2 py-0.5 text-[10px] font-bold uppercase", stepStatusBadgeClass[step.status])}>
                {s.label}
              </span>
              <span className="font-mono text-[10px] text-[#4a7ab5]">{step.duration}</span>
            </div>
          </div>
          <div className="border-t border-[#eff6ff] pt-3">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#4a7ab5]">Agent reasoning</div>
            <p className="text-[12px] leading-relaxed text-[#4a7ab5]">{step.reasoning}</p>
          </div>
        </div>

        {media?.imageSrc && (
          <div className="flex max-w-[160px] shrink-0 items-center justify-center border-l border-[#eff6ff] p-3">
            <Image src={media.imageSrc} alt={media.label} width={320} height={200} className="h-auto w-full" />
          </div>
        )}
      </div>
    </div>
  )
}
```


===== apps/web/components/workspace/IssueCard.tsx =====

```
import Image from "next/image"
import type { Issue } from "@/types/domain"
import { useWorkspaceData } from "@/context/workspace-data-context"
import { cn } from "@/lib/utils"

export function IssueCard({ issue, variant = "open" }: { issue: Issue; variant?: "open" | "resolved" }) {
  const { nodes } = useWorkspaceData()
  const node = nodes.find((n) => n.id === issue.nodeId)
  const step = node?.data.step ?? 0
  const label = node?.data.label ?? "Unknown"
  const media = node?.data.imageSrc ? { imageSrc: node.data.imageSrc, label } : undefined
  const isResolved = variant === "resolved"

  return (
    <div
      className={cn(
        "flex gap-0 border border-[#c7d9f0] bg-white shadow-[0_1px_4px_rgba(29,110,245,0.06)]",
        isResolved && "bg-white/60 opacity-70",
        !isResolved && issue.severity === "error" && "border-l-4 border-l-red-500",
        !isResolved && issue.severity === "warning" && "border-l-4 border-l-amber-400",
      )}
    >
      <div className="flex-1 px-5 py-4">
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <div className={cn("text-[14px] font-semibold text-[#1a2a33]", isResolved && "line-through")}>
              {issue.title}
            </div>
            <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-[#4a7ab5]">
              <span>Step {step} · {label}</span>
              <span className="text-[#c7d9f0]">·</span>
              <span>{issue.element}</span>
            </div>
          </div>
          {isResolved ? (
            <span className="shrink-0 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600">
              resolved
            </span>
          ) : (
            <span className={cn(
              "shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase",
              issue.severity === "error" ? "bg-red-500/10 text-red-600" : "bg-amber-400/10 text-amber-600"
            )}>
              {issue.severity}
            </span>
          )}
        </div>
        <p className="mb-3 text-[13px] leading-relaxed text-[#2d5282]">{issue.description}</p>
        <div className="border-t border-[#eff6ff] pt-3">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#4a7ab5]">Agent reasoning</div>
          <p className="text-[12px] leading-relaxed text-[#4a7ab5]">{issue.reasoning}</p>
        </div>
      </div>

      {media?.imageSrc && (
        <div className="flex max-w-[160px] shrink-0 items-center justify-center border-l border-[#eff6ff] p-3">
          <Image src={media.imageSrc} alt={media.label} width={320} height={200} className={cn("h-auto w-full", isResolved && "grayscale")} />
        </div>
      )}
    </div>
  )
}
```


===== apps/web/components/workspace/nodes/ScreenshotNode.tsx =====

```
"use client"

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react"
import {
  Handle,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react"
import { Camera, ImageOff } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { CHROME_HEIGHT, NODE_WIDTH, NODE_WIDE, SCREENSHOT_RATIO } from "@/constants/flow"
import { nodeStatusConfig } from "@/constants/status"
import { useIssueContext } from "@/context/issue-context"
import { cn } from "@/lib/utils"
import type { ScreenshotNodeData } from "@/types/flow"

const nodeStatusBadgeClass = {
  passed: "border-emerald-500/25 bg-emerald-500/10 text-emerald-600",
  running: "border-[#1d6ef5]/25 bg-[#1d6ef5]/10 text-[#1d6ef5]",
  pending: "border-indigo-500/25 bg-indigo-500/10 text-indigo-600",
} as const

export function ScreenshotNode({ id, data }: NodeProps<Node<ScreenshotNodeData>>) {
  const { issuesByNodeId, activeNodeId } = useIssueContext()
  const isActive = activeNodeId === id
  const nodeData = data
  const status = nodeStatusConfig[nodeData.status]
  const [imageBlocked, setImageBlocked] = useState(false)

  useEffect(() => {
    setImageBlocked(false)
  }, [nodeData.imageSrc])

  const nodeIssues = issuesByNodeId[id] ?? []
  const errorCount = nodeIssues.filter((i) => i.severity === "error" && i.status === "open").length
  const warningCount = nodeIssues.filter((i) => i.severity === "warning" && i.status === "open").length

  const nodeWidth = nodeData.isMain || nodeData.isLarge ? NODE_WIDE : NODE_WIDTH
  const screenshotHeight = nodeWidth * SCREENSHOT_RATIO
  const targetHandleTop = CHROME_HEIGHT + screenshotHeight / 2

  const sourceHandleTop = nodeData.sourceHandle
    ? CHROME_HEIGHT + screenshotHeight * nodeData.sourceHandle.imageY
    : targetHandleTop
  const sourceHandlePosition = nodeData.sourceHandle?.side === "left" ? Position.Left : Position.Right

  const displayUrl = nodeData.url.replace(/^https?:\/\/[^/]+/, "") || "/"

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-none border-[3px] border-[#4a7ab5]",
        "bg-white/70 backdrop-blur-sm shadow-[0_1px_3px_rgba(29,110,245,0.08),0_4px_20px_rgba(29,110,245,0.1)]",
        "transition-shadow transition-colors",
        nodeData.isMain || nodeData.isLarge ? "w-[480px]" : "w-[280px]",
        nodeData.isMain && "border-[#2d5a9e] shadow-[0_2px_6px_rgba(29,110,245,0.1),0_8px_32px_rgba(29,110,245,0.16)]",
        nodeData.status === "running" && "border-[#3a6fa0]",
        isActive && "border-[#1d6ef5] shadow-[0_2px_6px_rgba(29,110,245,0.14),0_8px_32px_rgba(29,110,245,0.22)]",
      )}
    >
      <Handle type="target" position={Position.Left} className="flow-handle" style={{ top: targetHandleTop }} />

      {/* Chrome bar */}
      <div className="flex items-center gap-2 border-b-[3px] border-[#4a7ab5] bg-[#c7d9f0] px-3 py-2">
        <span className="max-w-[45%] shrink-0 truncate rounded border border-[#7aaad4] bg-white/50 px-2 py-0.5 text-[13px] font-mono text-[#2d5282]">
          {displayUrl}
        </span>
        <div className="flex flex-1 items-center justify-around gap-2">
          <span className="rounded-none border border-[#7aaad4] bg-[#dbeafe] px-2.5 py-1 text-[12px] font-semibold text-[#1559d4]">
            Step {nodeData.step}
          </span>
          {(errorCount > 0 || warningCount > 0) && (
            <div className="flex items-center gap-2">
              {errorCount > 0 && (
                <span className="flex items-center gap-1 rounded bg-red-500/15 px-2 py-1 text-[12px] font-bold text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {errorCount}
                </span>
              )}
              {warningCount > 0 && (
                <span className="flex items-center gap-1 rounded bg-amber-400/15 px-2 py-1 text-[12px] font-bold text-amber-600">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  {warningCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Screenshot */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#dbeafe]">
        {nodeData.imageSrc && !imageBlocked ? (
          // Use regular img to avoid Next image optimizer restrictions/noise in dev.
          <img
            src={nodeData.imageSrc}
            alt={nodeData.label}
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageBlocked(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 border-2 border-dashed border-[#dbeafe] text-xs text-[#93c5fd]">
            {nodeData.imageSrc ? (
              <ImageOff className="h-8 w-8 opacity-60" aria-hidden="true" />
            ) : (
              <Camera className="h-8 w-8 opacity-60" aria-hidden="true" />
            )}
            <span>{nodeData.imageSrc ? "Screenshot unavailable (403)" : "Screenshot pending"}</span>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between border-t-[3px] border-[#4a7ab5] bg-[#c7d9f0] px-3 py-2">
        <div className="text-[15px] font-semibold tracking-[-0.2px] text-[#1a2a33]">
          {nodeData.label}
        </div>
        <Badge
          variant="outline"
          className={cn("rounded-none border px-3 py-1 text-[13px] font-medium", nodeStatusBadgeClass[nodeData.status])}
        >
          {status.label}
          {nodeData.duration && (
            <span className="text-[#1a2a33]/70"> · {nodeData.duration}</span>
          )}
        </Badge>
      </div>

      <Handle type="source" position={sourceHandlePosition} className="flow-handle" style={{ top: sourceHandleTop }} />
    </div>
  )
}
```


===== apps/web/components/workspace/edges/SpringEdge.tsx =====

```
"use client"

import { useMemo } from "react"
import { useSpring, animated, to } from "@react-spring/web"
import {
  EdgeLabelRenderer,
  getBezierPath,
  useViewport,
  useStore,
  type EdgeProps,
} from "@xyflow/react"
import { useIssueContext } from "@/context/issue-context"
import { useWorkspaceData } from "@/context/workspace-data-context"

// Control points match React Flow's getBezierPath: both CPs sit at midX (0.5 × distance)
function bezierPoint(sx: number, sy: number, tx: number, ty: number, t: number): [number, number] {
  const midX = (sx + tx) / 2
  const mt = 1 - t
  const x = mt*mt*mt*sx + 3*mt*mt*t*midX + 3*mt*t*t*midX + t*t*t*tx
  const y = mt*mt*mt*sy + 3*mt*mt*t*sy   + 3*mt*t*t*ty   + t*t*t*ty
  return [x, y]
}

function bezierAngle(sx: number, sy: number, tx: number, ty: number, t: number): number {
  const midX = (sx + tx) / 2
  const mt = 1 - t
  const dx = 3*mt*mt*(midX - sx) + 3*t*t*(tx - midX)
  const dy = 6*mt*t*(ty - sy)
  return Math.atan2(dy, dx) * (180 / Math.PI)
}

// Binary search: find t where bezier x ≈ targetFlowX
function findTForFlowX(sx: number, sy: number, tx: number, ty: number, targetFlowX: number): number {
  const goingRight = tx >= sx
  let lo = 0, hi = 1
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    const [px] = bezierPoint(sx, sy, tx, ty, mid)
    if (goingRight ? px < targetFlowX : px > targetFlowX) lo = mid
    else hi = mid
  }
  return Math.max(0.05, Math.min(0.95, (lo + hi) / 2))
}

function ArrowIcon() {
  return (
    <svg width="15" height="9" viewBox="0 0 20 12" fill="none" className="block">
      <path d="M 0 4.5 L 12 4.5 L 12 2 L 20 6 L 12 10 L 12 7.5 L 0 7.5 Z" fill="white" />
    </svg>
  )
}

export function SpringEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  label,
  labelStyle,
  labelBgStyle,
  labelBgPadding,
}: EdgeProps) {
  const { activeNodeId, selectNode } = useIssueContext()
  const { nodes, edges } = useWorkspaceData()
  const nodesById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes])
  const hasReverseEdge = useMemo(
    () => edges.some((e) => e.source === target && e.target === source && e.id !== id),
    [edges, id, source, target]
  )

  const laneOffset = hasReverseEdge ? (source < target ? -18 : 18) : 0
  const sx = sourceX
  const sy = sourceY + laneOffset
  const tx = targetX
  const ty = targetY + laneOffset

  // Reactive viewport: x/y = canvas pan offset in px, zoom = scale
  const { x: vpX, y: vpY, zoom: vpZoom } = useViewport()
  // Dimensions of the ReactFlow container element in px
  const containerWidth  = useStore((s) => s.width)
  const containerHeight = useStore((s) => s.height)

  const isOutgoing = activeNodeId === source
  const isIncoming = activeNodeId === target
  const isFocused = isOutgoing || isIncoming

  // Recompute t whenever the viewport pans/zooms so the badge stays visually centred
  const t = useMemo(() => {
    if (!isFocused || containerWidth === 0) return 0.5

    // Convert flow-space handle positions to screen pixels
    const srcScreenX = sx * vpZoom + vpX
    const srcScreenY = sy * vpZoom + vpY
    const tgtScreenX = tx * vpZoom + vpX
    const tgtScreenY = ty * vpZoom + vpY

    const onScreen = (sx: number, sy: number) =>
      sx >= 0 && sx <= containerWidth && sy >= 0 && sy <= containerHeight

    // Both handles visible → simply centre on the bezier midpoint
    if (onScreen(srcScreenX, srcScreenY) && onScreen(tgtScreenX, tgtScreenY)) return 0.5

    if (isOutgoing) {
      // Right edge of canvas in flow coordinates
      const rightFlowX = (containerWidth - vpX) / vpZoom
      const midFlowX = (sx + rightFlowX) / 2
      return findTForFlowX(sx, sy, tx, ty, midFlowX)
    } else {
      // Left edge of canvas in flow coordinates
      const leftFlowX = -vpX / vpZoom
      const midFlowX = (leftFlowX + tx) / 2
      return findTForFlowX(sx, sy, tx, ty, midFlowX)
    }
  }, [isFocused, isOutgoing, sx, sy, tx, ty, vpX, vpY, vpZoom, containerWidth, containerHeight])

  const [badgeX, badgeY] = bezierPoint(sx, sy, tx, ty, t)
  // Incoming edges point back (←), so flip 180°
  const badgeAngle = bezierAngle(sx, sy, tx, ty, t) + (isIncoming ? 180 : 0)
  // Clicking navigates to the other end of the edge
  const navigateTo = isOutgoing ? target : source
  const navigateLabel = nodesById[navigateTo]?.data.label ?? "node"

  const spring = useSpring({
    sx: sx,
    sy: sy,
    tx: tx,
    ty: ty,
    config: { tension: 260, friction: 18, mass: 1 },
  })

  const animatedD = to(
    [spring.sx, spring.sy, spring.tx, spring.ty],
    (sx: number, sy: number, tx: number, ty: number) =>
      getBezierPath({ sourceX: sx, sourceY: sy, targetX: tx, targetY: ty, sourcePosition, targetPosition })[0]
  )

  const labelX = (sx + tx) / 2
  const labelY = (sy + ty) / 2
  const [bgPadX, bgPadY] = (labelBgPadding as [number, number]) ?? [6, 8]

  return (
    <>
      <animated.path
        id={id}
        className="react-flow__edge-path react-flow__edge-path--animated"
        d={animatedD}
        style={style}
        fill="none"
      />

      {isFocused && (
        <EdgeLabelRenderer>
          {/*
            Outer div: exactly 28×28 (the circle size).
            translate(-50%,-50%) centers it pixel-perfectly on the bezier point.
            Nothing inside affects this centering — label is absolutely positioned.
          */}
          <button
            type="button"
            aria-label={`Focus ${navigateLabel}`}
            onClick={(e) => { e.stopPropagation(); selectNode(navigateTo) }}
            onMouseDown={(e) => e.stopPropagation()}
            className="nodrag nopan absolute h-7 w-7 cursor-pointer border-none bg-transparent p-0"
            style={{
              transform: `translate(-50%, -50%) translate(${badgeX}px, ${badgeY}px)`,
              pointerEvents: "all",
              zIndex: 1000,
            }}
          >
            {/* Circle rotated to match the edge tangent (180° flip for back-step) */}
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full bg-brand shadow-[0_0_0_2.5px_#fff,0_0_10px_rgba(29,110,245,0.45)] transition-[transform,box-shadow] duration-150"
              style={{
                transform: `rotate(${badgeAngle}deg)`,
              }}
            >
              <ArrowIcon />
            </div>

            {/* Label floats below the circle; absolutely positioned so it can't shift the circle */}
            {label && (
              <div
                className="pointer-events-none absolute left-1/2 top-[calc(100%+7px)] -translate-x-1/2 rounded border border-[rgba(29,110,245,0.22)] bg-white/95 px-2 py-1 font-mono text-[11px] leading-tight text-[#1D4ED8] shadow-[0_1px_4px_rgba(29,110,245,0.1)] max-w-[320px] whitespace-normal break-words"
              >
                {String(label)}
              </div>
            )}
          </button>
        </EdgeLabelRenderer>
      )}

      {/* Default midpoint label — only shown when not in focus mode */}
      {label && !isFocused && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "none",
              ...(labelBgStyle as React.CSSProperties),
              padding: `${bgPadY}px ${bgPadX}px`,
              borderRadius: 6,
              maxWidth: 360,
              textAlign: 'center',
              whiteSpace: 'normal',
              lineHeight: 1.2,
            }}
          >
            <span className="block max-w-[360px] whitespace-normal break-words leading-tight" style={labelStyle as React.CSSProperties}>{label as string}</span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
```


===== apps/web/components/workspace/useProjectRuns.ts =====

```
"use client"

import { useEffect, useMemo } from "react"
import { fetchProjectRuns, type ProjectRun } from "@/store/runs-slice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

export function useProjectRuns(
  selectedRunId?: string,
  take = 20,
  options?: { poll?: boolean; forceOnMount?: boolean }
) {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((s) => s.runs.loading)
  const project = useAppSelector((s) => s.runs.project)
  const runs = useAppSelector((s) => s.runs.runs)
  const accessToken = useAppSelector((s) => s.auth.accessToken)
  const poll = options?.poll ?? true
  const forceOnMount = options?.forceOnMount ?? true

  useEffect(() => {
    if (!accessToken) return

    void dispatch(fetchProjectRuns({ take, force: forceOnMount }))

    if (!poll) return

    const timer = setInterval(() => {
      void dispatch(fetchProjectRuns({ take }))
    }, 4000)

    return () => clearInterval(timer)
  }, [accessToken, dispatch, forceOnMount, poll, take])

  const selectedRun = useMemo(() => {
    if (!selectedRunId) return null
    return runs.find((r) => r.id === selectedRunId) ?? null
  }, [runs, selectedRunId])

  const runningRun = useMemo(() => runs.find((r) => r.status === "running") ?? null, [runs])

  const activeRun = selectedRun ?? runningRun

  return { loading, project, runs, activeRun, selectedRun, runningRun }
}

export type { ProjectRun }
```


===== apps/web/context/workspace-data-context.tsx =====

```
"use client"

import { createContext, useContext } from "react"
import type { Edge, Node } from "@xyflow/react"
import type { Issue } from "@/types/domain"
import type { ScreenshotNodeData } from "@/types/flow"

export type WorkspaceRun = {
  id: string
  name: string
  label: string | null
  category: string
  status: string
  startedAt: string
  securitySynopsis?: string | null
}

type WorkspaceDataContextValue = {
  run: WorkspaceRun
  nodes: Node<ScreenshotNodeData>[]
  edges: Edge[]
  issues: Issue[]
}

const WorkspaceDataContext = createContext<WorkspaceDataContextValue | null>(null)

export function WorkspaceDataProvider({
  value,
  children,
}: {
  value: WorkspaceDataContextValue
  children: React.ReactNode
}) {
  return <WorkspaceDataContext.Provider value={value}>{children}</WorkspaceDataContext.Provider>
}

export function useWorkspaceData() {
  const ctx = useContext(WorkspaceDataContext)
  if (!ctx) throw new Error("useWorkspaceData must be used inside WorkspaceDataProvider")
  return ctx
}
```


===== apps/web/context/issue-context.tsx =====

```
"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { Issue } from "@/types/domain"
import { useWorkspaceData } from "@/context/workspace-data-context"

type IssueContextValue = {
  issues: Issue[]
  issuesByNodeId: Record<string, Issue[]>
  openIssues: Issue[]
  resolvedIssues: Issue[]
  activeIssueId: string | null
  activeNodeId: string | null
  selectIssue: (issueId: string) => void
  selectNode: (nodeId: string) => void
  clearSelection: () => void
}

const IssueContext = createContext<IssueContextValue | null>(null)

export function IssueProvider({
  children,
  initialIssueId,
  initialNodeId,
}: {
  children: ReactNode
  initialIssueId?: string
  initialNodeId?: string
}) {
  const { issues } = useWorkspaceData()

  const issuesByNodeId = useMemo<Record<string, Issue[]>>(() => {
    const byNode: Record<string, Issue[]> = {}
    for (const issue of issues) (byNode[issue.nodeId] ||= []).push(issue)
    return byNode
  }, [issues])

  const openIssues = useMemo(() => issues.filter((i) => i.status === "open"), [issues])
  const resolvedIssues = useMemo(() => issues.filter((i) => i.status === "resolved"), [issues])

  const seedIssue = initialIssueId ?? null
  const seedNode = initialIssueId
    ? (issues.find((i) => i.id === initialIssueId)?.nodeId ?? null)
    : (initialNodeId ?? null)

  const [activeIssueId, setActiveIssueId] = useState<string | null>(seedIssue)
  const [activeNodeId, setActiveNodeId] = useState<string | null>(seedNode)

  const selectIssue = useCallback(
    (issueId: string) => {
      const issue = issues.find((item) => item.id === issueId)
      if (!issue) return
      setActiveIssueId(issueId)
      setActiveNodeId(issue.nodeId)
    },
    [issues]
  )

  const selectNode = useCallback((nodeId: string) => {
    setActiveIssueId(null)
    setActiveNodeId(nodeId)
  }, [])

  const clearSelection = useCallback(() => {
    setActiveIssueId(null)
    setActiveNodeId(null)
  }, [])

  const value = useMemo(
    () => ({
      issues,
      issuesByNodeId,
      openIssues,
      resolvedIssues,
      activeIssueId,
      activeNodeId,
      selectIssue,
      selectNode,
      clearSelection,
    }),
    [issues, issuesByNodeId, openIssues, resolvedIssues, activeIssueId, activeNodeId, selectIssue, selectNode, clearSelection]
  )

  return <IssueContext.Provider value={value}>{children}</IssueContext.Provider>
}

export function useIssueContext() {
  const ctx = useContext(IssueContext)
  if (!ctx) {
    throw new Error("useIssueContext must be used inside IssueProvider")
  }
  return ctx
}
```


===== apps/web/app/api/projects/[projectId]/runs/route.ts =====

```
import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

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

  return NextResponse.json({
    runs: items.map((r) => ({
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
```


===== apps/web/app/api/projects/[projectId]/runs/start/route.ts =====

```
import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'
import { appendRunEvent } from '@/lib/run-events'
import { startRunExecution } from '@/lib/run-runner'

// POST /api/projects/:projectId/runs/start — create and start a new run (user-auth)
export async function POST(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { projectId } = await params

  const project = await db.project.findUnique({ where: { id: projectId } })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const member = await requireOrgMember(user.id, project.orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

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
```


===== apps/web/app/api/projects/[projectId]/issues/route.ts =====

```
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

  const issues = await db.issue.findMany({
    where: {
      run: { projectId },
      ...(runId ? { runId } : {}),
      ...(status ? { status: status as never } : {}),
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
```


===== apps/web/app/api/runs/[runId]/route.ts =====

```
import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/runs/:runId — run detail (no heavy graph)
export async function GET(_req: Request, { params }: { params: Promise<{ runId: string }> }) {
  const user = await requireAppUser()
  if (user instanceof NextResponse) return user
  const { runId } = await params

  const run = await db.testRun.findUnique({
    where: { id: runId },
    include: {
      project: { select: { id: true, name: true, orgId: true, targetUrl: true } },
      _count: { select: { steps: true, issues: true, nodes: true } },
    },
  })
  if (!run) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const member = await requireOrgMember(user.id, run.project.orgId)
  if (!member) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  return NextResponse.json({ run })
}
```


===== apps/web/app/api/runs/[runId]/workspace/route.ts =====

```
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
```


===== apps/web/app/api/runs/[runId]/events/route.ts =====

```
import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'
import { listRunEvents } from '@/lib/run-events'

// GET /api/runs/:runId/events?afterSeq=0&limit=200
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
  const afterSeq = Number(url.searchParams.get('afterSeq') ?? '0')
  const limit = Number(url.searchParams.get('limit') ?? '200')

  const events = await listRunEvents(runId, Number.isFinite(afterSeq) ? afterSeq : 0, Number.isFinite(limit) ? limit : 200)

  return NextResponse.json({
    events,
    latestSeq: events.at(-1)?.seq ?? afterSeq,
    hasMore: events.length === Math.min(Math.max(limit, 1), 1000),
  })
}
```


===== apps/web/app/api/runs/[runId]/stream/route.ts =====

```
import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'
import { listRunEvents, subscribeRunEvents, type RunEventEnvelope } from '@/lib/run-events'

function encodeSse(event: RunEventEnvelope) {
  return `id: ${event.seq}\nevent: run-event\ndata: ${JSON.stringify(event)}\n\n`
}

// GET /api/runs/:runId/stream?afterSeq=0
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
  const afterSeq = Number(url.searchParams.get('afterSeq') ?? '0')

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder()

      const backlog = await listRunEvents(runId, Number.isFinite(afterSeq) ? afterSeq : 0, 500)
      for (const event of backlog) controller.enqueue(enc.encode(encodeSse(event)))

      const interval = setInterval(() => {
        controller.enqueue(enc.encode('event: ping\ndata: {}\n\n'))
      }, 15000)

      const unsubscribe = subscribeRunEvents(runId, (event) => {
        controller.enqueue(enc.encode(encodeSse(event)))
      })

      const cleanup = () => {
        clearInterval(interval)
        unsubscribe()
      }

      req.signal.addEventListener('abort', () => {
        cleanup()
        controller.close()
      })
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
```


===== apps/web/app/api/runs/[runId]/steps/route.ts =====

```
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

  return NextResponse.json({
    steps: steps.map((s) => ({
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
```


===== apps/web/app/api/runs/[runId]/issues/route.ts =====

```
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

  const issues = await db.issue.findMany({
    where: {
      runId,
      ...(status ? { status: status as never } : {}),
      ...(severity ? { severity: severity as never } : {}),
      ...(category ? { category: category as never } : {}),
    },
    orderBy: { detectedAt: 'asc' },
    include: {
      node: { select: { nodeKey: true, label: true } },
      step: { select: { index: true, action: true } },
    },
  })

  return NextResponse.json({
    issues: issues.map((i) => ({
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
```


===== apps/web/app/api/runs/[runId]/state/route.ts =====

```
import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/runs/:runId/state — lightweight run live state
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

  const lastEvent = await db.runEvent.findFirst({
    where: { runId },
    orderBy: { seq: 'desc' },
    select: { seq: true, createdAt: true, type: true },
  })

  return NextResponse.json({
    run: {
      id: run.id,
      status: run.status,
      startedAt: run.startedAt,
      finishedAt: run.finishedAt,
      eventSeq: run.eventSeq,
      totalSteps: run.totalSteps,
      openErrors: run.openErrors,
      openWarnings: run.openWarnings,
    },
    lastEvent,
  })
}
```


===== apps/web/app/api/runs/[runId]/diagnostics/route.ts =====

```
import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/runs/:runId/diagnostics
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

  const lastEvent = await db.runEvent.findFirst({
    where: { runId },
    orderBy: { seq: 'desc' },
    select: { seq: true, type: true, createdAt: true },
  })

  const eventStats = await db.runEvent.groupBy({
    by: ['type'],
    where: { runId },
    _count: true,
  })

  const now = Date.now()
  const lastEventAgeMs = lastEvent ? now - new Date(lastEvent.createdAt).getTime() : null

  return NextResponse.json({
    run: {
      id: run.id,
      label: run.label,
      status: run.status,
      startedAt: run.startedAt,
      finishedAt: run.finishedAt,
      durationMs: run.durationMs,
      totalSteps: run.totalSteps,
      openErrors: run.openErrors,
      openWarnings: run.openWarnings,
      eventSeq: run.eventSeq,
      updatedAt: run.updatedAt,
    },
    lastEvent,
    lastEventAgeMs,
    eventStats,
  })
}
```


===== apps/web/app/api/runs/[runId]/cancel/route.ts =====

```
import { NextResponse } from 'next/server'
import { requireAppUser, requireOrgMember } from '@/lib/auth'
import { db } from '@/lib/db'
import { cancelRunExecution } from '@/lib/run-runner'
import { finalizeRun } from '@/lib/run-finalize'

// POST /api/runs/:runId/cancel — cancel an active run
export async function POST(_req: Request, { params }: { params: Promise<{ runId: string }> }) {
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

  if (run.status !== 'running') {
    return NextResponse.json({ ok: true, alreadyFinal: true })
  }

  cancelRunExecution(runId)
  const updated = await finalizeRun(runId, {
    status: 'failed',
    securitySynopsis: 'Run cancelled by user.',
  })

  return NextResponse.json({ ok: true, run: { id: updated.id, status: updated.status } })
}
```


===== apps/web/app/api/agent/runs/route.ts =====

```
import { NextResponse } from 'next/server'
import { authenticateApiKey } from '@/lib/api-key-auth'
import { db } from '@/lib/db'
import { appendRunEvent } from '@/lib/run-events'

// POST /api/agent/runs — create a new run for a project
export async function POST(req: Request) {
  const apiKey = await authenticateApiKey()
  if (!apiKey) return NextResponse.json({ error: 'Invalid API key.' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const name = String(body.name || '').trim()
  const category = String(body.category || 'ux').trim()
  if (!name) return NextResponse.json({ error: 'name is required.' }, { status: 400 })

  const run = await db.testRun.create({
    data: {
      projectId: apiKey.projectId,
      name,
      category: category as never,
      status: 'running',
      targetUrl: apiKey.project.targetUrl,
      label: body.label || null,
      metadata: body.metadata || null,
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
    },
  })

  return NextResponse.json({ run: { id: run.id } }, { status: 201 })
}
```


===== apps/web/app/api/agent/runs/[runId]/events/route.ts =====

```
import { NextResponse } from 'next/server'
import { authenticateApiKey } from '@/lib/api-key-auth'
import { db } from '@/lib/db'
import { applyAgentEvents, type AgentEvent } from '@/lib/agent-ingest'

// POST /api/agent/runs/:runId/events — batch ingest pipe
export async function POST(req: Request, { params }: { params: Promise<{ runId: string }> }) {
  const apiKey = await authenticateApiKey()
  if (!apiKey) return NextResponse.json({ error: 'Invalid API key.' }, { status: 401 })
  const { runId } = await params

  const run = await db.testRun.findUnique({ where: { id: runId } })
  if (!run || run.projectId !== apiKey.projectId) {
    return NextResponse.json({ error: 'Run not found or not owned by this project.' }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.events || !Array.isArray(body.events)) {
    return NextResponse.json({ error: 'events array is required.' }, { status: 400 })
  }

  const result = await applyAgentEvents(runId, body.events as AgentEvent[])
  return NextResponse.json(result)
}
```


===== apps/web/app/api/agent/runs/[runId]/finish/route.ts =====

```
import { NextResponse } from 'next/server'
import { authenticateApiKey } from '@/lib/api-key-auth'
import { db } from '@/lib/db'
import { finalizeRun } from '@/lib/run-finalize'

// POST /api/agent/runs/:runId/finish — finalize a run
export async function POST(req: Request, { params }: { params: Promise<{ runId: string }> }) {
  const apiKey = await authenticateApiKey()
  if (!apiKey) return NextResponse.json({ error: 'Invalid API key.' }, { status: 401 })
  const { runId } = await params

  const run = await db.testRun.findUnique({ where: { id: runId } })
  if (!run || run.projectId !== apiKey.projectId) {
    return NextResponse.json({ error: 'Run not found or not owned by this project.' }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const status = String(body.status || 'passed').trim() as 'passed' | 'failed' | 'warning'
  const updated = await finalizeRun(runId, {
    status,
    durationMs: body.durationMs != null ? Number(body.durationMs) : undefined,
    securitySynopsis: body.securitySynopsis ?? null,
  })

  return NextResponse.json({
    run: { id: updated.id, status: updated.status, finishedAt: updated.finishedAt, durationMs: updated.durationMs },
  })
}
```


===== apps/web/app/api/issues/[issueId]/route.ts =====

```
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

  const newStatus = body.status as 'open' | 'resolved' | undefined
  const resolutionNote = body.resolutionNote as string | undefined

  const updated = await db.issue.update({
    where: { id: issueId },
    data: {
      ...(newStatus === 'resolved'
        ? { status: 'resolved', resolvedAt: new Date(), resolvedById: user.id, resolutionNote: resolutionNote ?? null }
        : {}),
      ...(newStatus === 'open'
        ? { status: 'open', resolvedAt: null, resolvedById: null, resolutionNote: null }
        : {}),
    },
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
```


===== apps/web/lib/run-runner.ts =====

```
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
      if (now - startedAt > 30 * 60 * 1000) {
        activeCancel()
        void finalizeOnce('failed', 'Run exceeded max runtime (30m watchdog).')
        return
      }
      // Intentionally no inactivity timeout; long-running/noisy-sparse runs are allowed.
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
```


===== apps/web/lib/agent-ingest.ts =====

```
import { db } from '@/lib/db'
import { appendRunEvent } from '@/lib/run-events'

export type AgentEvent =
  | { type: 'node.upsert'; node: Record<string, unknown> }
  | { type: 'edge.upsert'; edge: Record<string, unknown> }
  | { type: 'step.create'; step: Record<string, unknown> }
  | { type: 'issue.create'; issue: Record<string, unknown> }
  | { type: 'artifact.create'; artifact: Record<string, unknown> }

export async function applyAgentEvents(runId: string, events: AgentEvent[]) {
  async function resolveNodeId(nodeKey: string): Promise<string | null> {
    const node = await db.flowNode.findUnique({ where: { runId_nodeKey: { runId, nodeKey } } })
    return node?.id ?? null
  }

  const errors: Array<{ index: number; type: string; message: string }> = []
  let accepted = 0
  let skipped = 0
  let lastSeq: number | null = null

  // Two-pass processing improves resilience when events arrive out of order.
  const withIndex = events.map((evt, index) => ({ evt, index }))
  const passA = withIndex.filter(({ evt }) => evt.type === 'node.upsert' || evt.type === 'step.create')
  const passB = withIndex.filter(({ evt }) => evt.type === 'edge.upsert' || evt.type === 'issue.create' || evt.type === 'artifact.create')

  for (const { evt, index } of [...passA, ...passB]) {
    try {
      switch (evt.type) {
        case 'node.upsert': {
          const n = evt.node
          const node = await db.flowNode.upsert({
            where: { runId_nodeKey: { runId, nodeKey: String(n.nodeKey) } },
            update: {
              label: String(n.label ?? ''),
              url: String(n.url ?? ''),
              status: (n.status as never) ?? 'pending',
              step: Number(n.step ?? 0),
              durationMs: n.durationMs != null ? Number(n.durationMs) : null,
              isMain: Boolean(n.isMain),
              isLarge: Boolean(n.isLarge),
              positionX: Number((n.position as { x?: number })?.x ?? n.positionX ?? 0),
              positionY: Number((n.position as { y?: number })?.y ?? n.positionY ?? 0),
              screenshotUrl: n.screenshotUrl ? String(n.screenshotUrl) : null,
              screenshotPath: n.screenshotPath ? String(n.screenshotPath) : null,
              sourceHandleSide: n.sourceHandle
                ? ((n.sourceHandle as { side?: string }).side as never) ?? null
                : null,
              sourceHandleImageY: n.sourceHandle
                ? Number((n.sourceHandle as { imageY?: number }).imageY ?? 0)
                : null,
              data: (n.data as object) ?? null,
            },
            create: {
              runId,
              nodeKey: String(n.nodeKey),
              label: String(n.label ?? ''),
              url: String(n.url ?? ''),
              status: (n.status as never) ?? 'pending',
              step: Number(n.step ?? 0),
              durationMs: n.durationMs != null ? Number(n.durationMs) : null,
              isMain: Boolean(n.isMain),
              isLarge: Boolean(n.isLarge),
              positionX: Number((n.position as { x?: number })?.x ?? n.positionX ?? 0),
              positionY: Number((n.position as { y?: number })?.y ?? n.positionY ?? 0),
              screenshotUrl: n.screenshotUrl ? String(n.screenshotUrl) : null,
              screenshotPath: n.screenshotPath ? String(n.screenshotPath) : null,
              sourceHandleSide: n.sourceHandle
                ? ((n.sourceHandle as { side?: string }).side as never) ?? null
                : null,
              sourceHandleImageY: n.sourceHandle
                ? Number((n.sourceHandle as { imageY?: number }).imageY ?? 0)
                : null,
              data: (n.data as object) ?? null,
            },
          })

          const event = await appendRunEvent(runId, 'node.upserted', {
            node: {
              id: node.nodeKey,
              position: { x: node.positionX, y: node.positionY },
              data: {
                label: node.label,
                url: node.url,
                status: node.status,
                step: node.step,
                duration: node.durationMs ? `${(node.durationMs / 1000).toFixed(1)}s` : undefined,
                isMain: node.isMain,
                isLarge: node.isLarge,
                imageSrc: node.screenshotUrl || node.screenshotPath,
                sourceHandle: node.sourceHandleSide
                  ? { side: node.sourceHandleSide, imageY: node.sourceHandleImageY }
                  : undefined,
                ...((node.data as Record<string, unknown>) ?? {}),
              },
            },
          })
          lastSeq = event.seq
          accepted += 1
          break
        }

        case 'step.create': {
          const s = evt.step
          const nodeId = await resolveNodeId(String(s.nodeKey))
          if (!nodeId) {
            skipped += 1
            break
          }

          const step = await db.runStep.upsert({
            where: { runId_index: { runId, index: Number(s.index) } },
            update: {
              action: s.action as never,
              target: String(s.target ?? ''),
              description: String(s.description ?? ''),
              reasoning: String(s.reasoning ?? ''),
              durationMs: s.durationMs != null ? Number(s.durationMs) : null,
              status: (s.status as never) ?? 'passed',
            },
            create: {
              runId,
              nodeId,
              index: Number(s.index),
              action: s.action as never,
              target: String(s.target ?? ''),
              description: String(s.description ?? ''),
              reasoning: String(s.reasoning ?? ''),
              durationMs: s.durationMs != null ? Number(s.durationMs) : null,
              status: (s.status as never) ?? 'passed',
            },
            include: { node: { select: { nodeKey: true, label: true, url: true } } },
          })

          const stepCount = await db.runStep.count({ where: { runId } })
          await db.testRun.update({ where: { id: runId }, data: { totalSteps: stepCount } })

          const event = await appendRunEvent(runId, 'step.upserted', {
            step: {
              id: step.id,
              index: step.index,
              action: step.action,
              target: step.target,
              description: step.description,
              reasoning: step.reasoning,
              durationMs: step.durationMs,
              status: step.status,
              nodeKey: step.node.nodeKey,
              nodeLabel: step.node.label,
              nodeUrl: step.node.url,
            },
          })
          lastSeq = event.seq
          accepted += 1
          break
        }

        case 'edge.upsert': {
          const e = evt.edge
          const sourceId = await resolveNodeId(String(e.sourceNodeKey ?? e.source))
          const targetId = await resolveNodeId(String(e.targetNodeKey ?? e.target))
          if (!sourceId || !targetId) {
            skipped += 1
            break
          }

          const edge = await db.flowEdge.upsert({
            where: { runId_edgeKey: { runId, edgeKey: String(e.edgeKey ?? e.id) } },
            update: {
              sourceNodeId: sourceId,
              targetNodeId: targetId,
              type: e.type ? String(e.type) : null,
              label: e.label ? String(e.label) : null,
              zIndex: e.zIndex != null ? Number(e.zIndex) : null,
              style: (e.style as object) ?? null,
            },
            create: {
              runId,
              edgeKey: String(e.edgeKey ?? e.id),
              sourceNodeId: sourceId,
              targetNodeId: targetId,
              type: e.type ? String(e.type) : null,
              label: e.label ? String(e.label) : null,
              zIndex: e.zIndex != null ? Number(e.zIndex) : null,
              style: (e.style as object) ?? null,
            },
          })

          const sourceNode = await db.flowNode.findUnique({ where: { id: edge.sourceNodeId }, select: { nodeKey: true } })
          const targetNode = await db.flowNode.findUnique({ where: { id: edge.targetNodeId }, select: { nodeKey: true } })

          const event = await appendRunEvent(runId, 'edge.upserted', {
            edge: {
              id: edge.edgeKey,
              source: sourceNode?.nodeKey ?? edge.sourceNodeId,
              target: targetNode?.nodeKey ?? edge.targetNodeId,
              type: edge.type,
              label: edge.label,
              zIndex: edge.zIndex,
              style: edge.style,
            },
          })
          lastSeq = event.seq
          accepted += 1
          break
        }

        case 'issue.create': {
          const i = evt.issue

          // Prefer step-based attribution for correctness; fallback to nodeKey.
          let stepId: string | null = null
          let nodeId: string | null = null
          if (i.stepIndex != null) {
            const step = await db.runStep.findUnique({
              where: { runId_index: { runId, index: Number(i.stepIndex) } },
              select: { id: true, nodeId: true },
            })
            stepId = step?.id ?? null
            nodeId = step?.nodeId ?? null
          }
          if (!nodeId && i.nodeKey != null) {
            nodeId = await resolveNodeId(String(i.nodeKey))
          }
          if (!nodeId) {
            skipped += 1
            break
          }

          const title = String(i.title ?? '')
          const element = String(i.element ?? '')

          // Lightweight dedupe for retries/replays.
          const duplicate = await db.issue.findFirst({
            where: {
              runId,
              nodeId,
              stepId,
              title,
              element,
              status: 'open',
            },
            select: { id: true },
          })
          if (duplicate) {
            skipped += 1
            break
          }

          const created = await db.issue.create({
            data: {
              runId,
              nodeId,
              stepId,
              category: (i.category as never) ?? 'other',
              severity: (i.severity as never) ?? 'warning',
              title,
              description: String(i.description ?? ''),
              reasoning: String(i.reasoning ?? ''),
              element,
            },
            include: {
              node: { select: { nodeKey: true, label: true } },
              step: { select: { index: true } },
            },
          })

          const openCounts = await db.issue.groupBy({
            by: ['severity'],
            where: { runId, status: 'open' },
            _count: true,
          })
          await db.testRun.update({
            where: { id: runId },
            data: {
              openErrors: openCounts.find((c) => c.severity === 'error')?._count ?? 0,
              openWarnings: openCounts.find((c) => c.severity === 'warning')?._count ?? 0,
            },
          })

          const event = await appendRunEvent(runId, 'issue.created', {
            issue: {
              id: created.id,
              nodeId: created.node.nodeKey,
              runId: created.runId,
              category: created.category,
              severity: created.severity,
              status: created.status,
              title: created.title,
              description: created.description,
              reasoning: created.reasoning,
              element: created.element,
              stepIndex: created.step?.index ?? null,
            },
          })
          lastSeq = event.seq
          accepted += 1
          break
        }

        case 'artifact.create': {
          const a = evt.artifact
          const nodeId = a.nodeKey ? await resolveNodeId(String(a.nodeKey)) : null
          let stepId: string | null = null
          if (a.stepIndex != null) {
            const step = await db.runStep.findUnique({
              where: { runId_index: { runId, index: Number(a.stepIndex) } },
            })
            stepId = step?.id ?? null
          }

          const artifact = await db.artifact.create({
            data: {
              runId,
              nodeId,
              stepId,
              type: (a.type as never) ?? 'other',
              storage: (a.storage as never) ?? 'supabase',
              bucket: a.bucket ? String(a.bucket) : null,
              path: a.path ? String(a.path) : null,
              url: a.url ? String(a.url) : null,
              mimeType: a.mimeType ? String(a.mimeType) : null,
              sizeBytes: a.sizeBytes != null ? Number(a.sizeBytes) : null,
              width: a.width != null ? Number(a.width) : null,
              height: a.height != null ? Number(a.height) : null,
            },
          })

          const event = await appendRunEvent(runId, 'artifact.created', {
            artifact: {
              id: artifact.id,
              type: artifact.type,
              url: artifact.url,
              path: artifact.path,
              bucket: artifact.bucket,
              mimeType: artifact.mimeType,
              sizeBytes: artifact.sizeBytes,
              width: artifact.width,
              height: artifact.height,
            },
          })
          lastSeq = event.seq
          accepted += 1
          break
        }
      }
    } catch (error) {
      errors.push({
        index,
        type: evt.type,
        message: error instanceof Error ? error.message : 'Unknown event ingest error',
      })
    }
  }

  await db.testRun.update({ where: { id: runId }, data: { updatedAt: new Date() } })

  return { ok: errors.length === 0, accepted, skipped, errors, lastSeq }
}
```


===== apps/web/lib/run-events.ts =====

```
import type { Prisma } from '@prisma/client'
import { db } from '@/lib/db'

type RunEventEnvelope = {
  runId: string
  seq: number
  at: string
  type: string
  payload: Record<string, unknown>
}

type RunEventListener = (event: RunEventEnvelope) => void

const bus = globalThis as typeof globalThis & {
  __testaRunEventBus?: Map<string, Set<RunEventListener>>
}

if (!bus.__testaRunEventBus) bus.__testaRunEventBus = new Map()

function publishRunEvent(event: RunEventEnvelope) {
  const listeners = bus.__testaRunEventBus?.get(event.runId)
  if (!listeners || listeners.size === 0) return
  for (const listener of listeners) listener(event)
}

export function subscribeRunEvents(runId: string, listener: RunEventListener) {
  if (!bus.__testaRunEventBus?.has(runId)) bus.__testaRunEventBus?.set(runId, new Set())
  bus.__testaRunEventBus?.get(runId)?.add(listener)

  return () => {
    bus.__testaRunEventBus?.get(runId)?.delete(listener)
  }
}

export async function appendRunEvent(runId: string, type: string, payload: Record<string, unknown>) {
  const event = await db.$transaction(async (tx) => {
    const run = await tx.testRun.update({
      where: { id: runId },
      data: { eventSeq: { increment: 1 } },
      select: { eventSeq: true },
    })

    const created = await tx.runEvent.create({
      data: {
        runId,
        seq: run.eventSeq,
        type,
        payload: payload as Prisma.InputJsonValue,
      },
    })

    return {
      runId,
      seq: created.seq,
      at: created.createdAt.toISOString(),
      type: created.type,
      payload: created.payload as Record<string, unknown>,
    } satisfies RunEventEnvelope
  })

  publishRunEvent(event)
  return event
}

export async function listRunEvents(runId: string, afterSeq = 0, limit = 200) {
  const events = await db.runEvent.findMany({
    where: { runId, seq: { gt: afterSeq } },
    orderBy: { seq: 'asc' },
    take: Math.min(Math.max(limit, 1), 1000),
  })

  return events.map((e) => ({
    runId: e.runId,
    seq: e.seq,
    at: e.createdAt.toISOString(),
    type: e.type,
    payload: e.payload as Record<string, unknown>,
  }))
}

export type { RunEventEnvelope }
```


===== apps/web/lib/run-finalize.ts =====

```
import { db } from '@/lib/db'
import { appendRunEvent } from '@/lib/run-events'

type FinalizeInput = {
  status: 'passed' | 'failed' | 'warning'
  durationMs?: number
  securitySynopsis?: string | null
}

export async function finalizeRun(runId: string, input: FinalizeInput) {
  const run = await db.testRun.findUnique({ where: { id: runId } })
  if (!run) throw new Error('Run not found')
  // Idempotency/safety: never re-finalize an already terminal run.
  if (run.finishedAt) return run

  const now = new Date()
  const durationMs = input.durationMs != null
    ? Number(input.durationMs)
    : now.getTime() - run.startedAt.getTime()

  const openCounts = await db.issue.groupBy({
    by: ['severity'],
    where: { runId, status: 'open' },
    _count: true,
  })

  const updated = await db.testRun.update({
    where: { id: runId },
    data: {
      status: input.status,
      finishedAt: now,
      durationMs,
      securitySynopsis: input.securitySynopsis ?? run.securitySynopsis ?? null,
      openErrors: openCounts.find((c) => c.severity === 'error')?._count ?? 0,
      openWarnings: openCounts.find((c) => c.severity === 'warning')?._count ?? 0,
    },
  })

  await appendRunEvent(runId, 'run.updated', {
    run: {
      id: updated.id,
      status: updated.status,
      finishedAt: updated.finishedAt?.toISOString() ?? null,
      durationMs: updated.durationMs,
      openIssues: { errors: updated.openErrors, warnings: updated.openWarnings },
      securitySynopsis: updated.securitySynopsis,
    },
  })

  await appendRunEvent(runId, updated.status === 'failed' ? 'run.failed' : 'run.completed', {
    run: {
      id: updated.id,
      status: updated.status,
      finishedAt: updated.finishedAt?.toISOString() ?? null,
      durationMs: updated.durationMs,
    },
  })

  return updated
}
```


===== apps/web/lib/db.ts =====

```
import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const db =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}
```


===== apps/web/store/index.ts =====

```
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/store/auth-slice"
import onboardingReducer from "@/store/onboarding-slice"
import workspaceReducer from "@/store/workspace-slice"
import billingReducer from "@/store/billing-slice"
import runsReducer from "@/store/runs-slice"
import runLiveReducer from "@/store/run-live-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    onboarding: onboardingReducer,
    workspace: workspaceReducer,
    billing: billingReducer,
    runs: runsReducer,
    runLive: runLiveReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```


===== apps/web/store/runs-slice.ts =====

```
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { toast } from "sonner"
import type { RootState } from "@/store"

export type ProjectRef = {
  id: string
  name: string
  slug: string
  targetUrl: string
}

export type ProjectRun = {
  id: string
  label: string | null
  name: string
  category: "security" | "buttons" | "ux"
  url: string
  startedAt: string
  durationMs: number | null
  status: "running" | "passed" | "warning" | "failed"
  openIssues: { errors: number; warnings: number }
  stepsCount: number
}

type RunsState = {
  loading: boolean
  project: ProjectRef | null
  runs: ProjectRun[]
  lastFetchedAt: number | null
}

type RunEventEnvelope = {
  runId: string
  seq: number
  at: string
  type: string
  payload: Record<string, unknown>
}

const initialState: RunsState = {
  loading: false,
  project: null,
  runs: [],
  lastFetchedAt: null,
}

type ApiMeResponse = {
  orgs: Array<{ projects: ProjectRef[] }>
}

type ApiRunsResponse = {
  runs: ProjectRun[]
}

export const fetchProjectRuns = createAsyncThunk<ProjectRun[], { take?: number; force?: boolean } | undefined, { state: RootState }>(
  "runs/fetchProjectRuns",
  async (args, { getState, dispatch }) => {
    const take = args?.take ?? 20
    const force = args?.force ?? false
    const state = getState()
    const token = state.auth.accessToken
    if (!token) return []

    const now = Date.now()
    const lastFetchedAt = state.runs.lastFetchedAt ?? 0
    if (!force && now - lastFetchedAt < 2500 && state.runs.runs.length > 0) {
      return state.runs.runs
    }

    const headers = { Authorization: `Bearer ${token}` }

    let project = state.runs.project
    if (!project) {
      const meRes = await fetch("/api/auth/me", { headers, cache: "no-store" })
      if (!meRes.ok) throw new Error("Failed to load user context")
      const me = (await meRes.json()) as ApiMeResponse
      project = me.orgs?.[0]?.projects?.[0] ?? null
      dispatch(setProject(project))
    }

    if (!project) return []

    const prevById = new Map(state.runs.runs.map((r) => [r.id, r]))

    const runsRes = await fetch(`/api/projects/${project.id}/runs?take=${take}`, {
      headers,
      cache: "no-store",
    })
    if (!runsRes.ok) throw new Error("Failed to load runs")

    const payload = (await runsRes.json()) as ApiRunsResponse

    for (const run of payload.runs) {
      const prev = prevById.get(run.id)
      if (prev && prev.status === "running" && run.status !== "running") {
        const text = run.status === "failed" ? "failed" : run.status === "warning" ? "completed with warnings" : "completed"
        toast(`Run ${run.label ?? run.id.slice(0, 8)} ${text}`)
      }
    }

    return payload.runs
  }
)

const runsSlice = createSlice({
  name: "runs",
  initialState,
  reducers: {
    setProject(state, action: PayloadAction<ProjectRef | null>) {
      state.project = action.payload
    },
    setRuns(state, action: PayloadAction<ProjectRun[]>) {
      state.runs = action.payload
      state.lastFetchedAt = Date.now()
    },
    applyRunEvent(state, action: PayloadAction<RunEventEnvelope>) {
      const evt = action.payload
      const idx = state.runs.findIndex((r) => r.id === evt.runId)
      if (idx < 0) return
      const run = state.runs[idx]
      if (!run) return

      if (evt.type === "run.updated" || evt.type === "run.completed" || evt.type === "run.failed") {
        const runPayload = (evt.payload.run ?? {}) as Partial<ProjectRun>
        if (runPayload.status) run.status = runPayload.status
        if (typeof runPayload.durationMs === "number") run.durationMs = runPayload.durationMs
      }

      if (evt.type === "step.upserted") {
        const step = (evt.payload.step ?? {}) as { index?: number }
        if (typeof step.index === "number") {
          run.stepsCount = Math.max(run.stepsCount, step.index)
        }
      }

      if (evt.type === "issue.created") {
        const issue = (evt.payload.issue ?? {}) as { severity?: "error" | "warning" }
        if (issue.severity === "error") run.openIssues.errors += 1
        if (issue.severity === "warning") run.openIssues.warnings += 1
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectRuns.pending, (state) => {
        // Avoid full-page loading flicker during background refresh polling.
        state.loading = state.runs.length === 0
      })
      .addCase(fetchProjectRuns.fulfilled, (state, action) => {
        state.loading = false
        state.runs = action.payload
        state.lastFetchedAt = Date.now()
      })
      .addCase(fetchProjectRuns.rejected, (state) => {
        state.loading = false
      })
  },
})

export const { setProject, setRuns, applyRunEvent } = runsSlice.actions
export default runsSlice.reducer
```


===== apps/web/store/run-live-slice.ts =====

```
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type RunStreamStatus = "idle" | "live" | "polling" | "reconnecting"

type RunLiveEntry = {
  status: RunStreamStatus
  lastSeq: number
  lastEventAt: string | null
}

type RunLiveState = {
  byRunId: Record<string, RunLiveEntry>
}

const initialState: RunLiveState = {
  byRunId: {},
}

const runLiveSlice = createSlice({
  name: "runLive",
  initialState,
  reducers: {
    setRunStreamStatus(state, action: PayloadAction<{ runId: string; status: RunStreamStatus }>) {
      const current = state.byRunId[action.payload.runId] ?? { status: "idle" as const, lastSeq: 0, lastEventAt: null }
      state.byRunId[action.payload.runId] = { ...current, status: action.payload.status }
    },
    ingestRunEventMeta(state, action: PayloadAction<{ runId: string; seq: number; at: string }>) {
      const current = state.byRunId[action.payload.runId] ?? { status: "idle" as const, lastSeq: 0, lastEventAt: null }
      state.byRunId[action.payload.runId] = {
        ...current,
        lastSeq: Math.max(current.lastSeq, action.payload.seq),
        lastEventAt: action.payload.at,
      }
    },
  },
})

export const { setRunStreamStatus, ingestRunEventMeta } = runLiveSlice.actions
export default runLiveSlice.reducer
```


===== apps/web/store/workspace-slice.ts =====

```
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type WorkspaceState = {
  activeOrgId: string | null
  activeProjectId: string | null
  activeRunId: string | null
}

const initialState: WorkspaceState = {
  activeOrgId: null,
  activeProjectId: null,
  activeRunId: null,
}

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setActiveOrgId(state, action: PayloadAction<string | null>) {
      state.activeOrgId = action.payload
    },
    setActiveProjectId(state, action: PayloadAction<string | null>) {
      state.activeProjectId = action.payload
    },
    setActiveRunId(state, action: PayloadAction<string | null>) {
      state.activeRunId = action.payload
    },
  },
})

export const { setActiveOrgId, setActiveProjectId, setActiveRunId } = workspaceSlice.actions
export default workspaceSlice.reducer
```


===== apps/web/store/app-thunks.ts =====

```
import { createAsyncThunk } from "@reduxjs/toolkit"
import { setOnboardingState } from "@/store/onboarding-slice"
import { setActiveOrgId, setActiveProjectId } from "@/store/workspace-slice"
import { setBilling } from "@/store/billing-slice"
import type { RootState } from "@/store"

type AuthMeResponse = {
  orgs: Array<{
    id: string
    projects: Array<{ id: string }>
    plan: "starter" | "pro"
    billingStatus: "inactive" | "trialing" | "active" | "past_due" | "canceled" | "unpaid"
  }>
}

export const bootstrapAppContext = createAsyncThunk<void, void, { state: RootState }>(
  "app/bootstrap",
  async (_, { getState, dispatch }) => {
    const token = getState().auth.accessToken

    if (!token) {
      dispatch(setOnboardingState({ stage: "sign-in", blockReason: "none" }))
      return
    }

    const headers = { Authorization: `Bearer ${token}` }

    const meRes = await fetch("/api/auth/me", { headers, cache: "no-store" })
    if (!meRes.ok) {
      dispatch(setOnboardingState({ stage: "sync-user" }))
      return
    }

    const me = (await meRes.json()) as AuthMeResponse
    const org = me.orgs[0]

    if (!org) {
      dispatch(setOnboardingState({ stage: "create-org", needsOrg: true, blockReason: "no_org" }))
      return
    }

    dispatch(setActiveOrgId(org.id))

    const project = org.projects[0]
    if (!project) {
      dispatch(setOnboardingState({ stage: "create-project", needsProject: true, blockReason: "no_project" }))
      return
    }

    dispatch(setActiveProjectId(project.id))

    const billingRes = await fetch(`/api/billing?orgId=${org.id}`, { headers, cache: "no-store" })
    if (billingRes.ok) {
      const b = await billingRes.json()
      dispatch(setBilling({ plan: b.billing.plan, status: b.billing.status }))

      const paymentBlocked = b.billing.status === "past_due" || b.billing.status === "unpaid"
      if (paymentBlocked) {
        dispatch(setOnboardingState({ stage: "select-plan", needsPlan: true, blockReason: "plan_required" }))
        return
      }
    }

    dispatch(setOnboardingState({
      stage: "done",
      needsOrg: false,
      needsProject: false,
      needsPlan: false,
      blockReason: "none",
    }))
  }
)
```


===== apps/web/store/hooks.ts =====

```
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux"
import type { AppDispatch, RootState } from "@/store"

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```


===== apps/web/prisma/schema.prisma =====

```
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ─────────────────────────────────────────────────────────────────────────────
// Enums (match existing TS union strings)
// ─────────────────────────────────────────────────────────────────────────────

enum OrgRole {
  owner
  admin
  member
}

enum PlanTier {
  starter
  pro
}

enum BillingStatus {
  inactive
  trialing
  active
  past_due
  canceled
  unpaid
}

enum RunCategory {
  security
  buttons
  ux
}

enum RunStatus {
  passed
  failed
  running
  warning
}

enum RunStepStatus {
  passed
  failed
  warning
}

enum RunStepAction {
  navigate
  scroll
  audit
  click
  wait
  fill
  resize
  screenshot
}

enum NodeStatus {
  passed
  running
  pending
}

enum IssueSeverity {
  error
  warning
}

enum IssueStatus {
  open
  resolved
}

enum IssueCategory {
  security
  other
}

enum HandleSide {
  left
  right
}

enum ArtifactType {
  screenshot
  video
  har
  log
  report
  other
}

enum StorageProvider {
  supabase
  s3
  local
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth / tenancy
// ─────────────────────────────────────────────────────────────────────────────

model User {
  /// Supabase auth.users.id (UUID). You create/ensure this row exists on first login.
  id        String   @id @db.Uuid
  email     String   @unique
  name      String?
  avatarUrl String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  memberships      OrganizationMember[]
  issueResolutions Issue[]              @relation("IssueResolvedBy")
}

model Organization {
  id        String   @id @default(uuid()) @db.Uuid
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members  OrganizationMember[]
  projects Project[]
  billing  BillingAccount?
}

model OrganizationMember {
  id        String   @id @default(uuid()) @db.Uuid
  orgId     String   @db.Uuid
  userId    String   @db.Uuid
  role      OrgRole  @default(member)
  createdAt DateTime @default(now())

  org  Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  user User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([orgId, userId])
  @@index([userId])
}

// ─────────────────────────────────────────────────────────────────────────────
// Project + agent access
// ─────────────────────────────────────────────────────────────────────────────

model Project {
  id        String   @id @default(uuid()) @db.Uuid
  orgId     String   @db.Uuid
  name      String
  slug      String
  targetUrl String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  org  Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  runs TestRun[]
  keys ApiKey[]

  @@unique([orgId, slug])
  @@index([orgId])
}

model ApiKey {
  id        String   @id @default(uuid()) @db.Uuid
  projectId String   @db.Uuid
  name      String

  /// Store only a hash (SHA-256). Never store the raw key.
  keyHash   String   @unique

  /// Helpful for UI display / debugging
  prefix    String
  last4     String

  createdAt  DateTime  @default(now())
  lastUsedAt DateTime?
  revokedAt  DateTime?

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
}

// ─────────────────────────────────────────────────────────────────────────────
// Billing (Stripe)
// ─────────────────────────────────────────────────────────────────────────────

model BillingAccount {
  id                   String        @id @default(uuid()) @db.Uuid
  orgId                String        @unique @db.Uuid
  plan                 PlanTier      @default(starter)
  status               BillingStatus @default(inactive)
  stripeCustomerId     String?       @unique
  stripeSubscriptionId String?       @unique
  stripePriceId        String?
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  cancelAtPeriodEnd    Boolean       @default(false)
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt

  org Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
}

// ─────────────────────────────────────────────────────────────────────────────
// Core testing domain
// ─────────────────────────────────────────────────────────────────────────────

model TestRun {
  id          String      @id @default(uuid()) @db.Uuid
  projectId   String      @db.Uuid

  /// Optional short label like "#a3f7c1"
  label       String?
  name        String
  category    RunCategory
  status      RunStatus   @default(running)

  startedAt   DateTime    @default(now())
  finishedAt  DateTime?
  durationMs  Int?

  /// Denormalized target URL (copied from project at run start for historical accuracy)
  targetUrl   String?

  /// Summary counters to power lists fast (denormalized, maintained on write)
  openErrors   Int @default(0)
  openWarnings Int @default(0)
  totalSteps   Int @default(0)

  /// Monotonic event sequence cursor for live run streaming.
  eventSeq     Int @default(0)

  /// Freeform metadata from agent (version, config, user-agent, viewport, etc.)
  metadata    Json?

  /// For security page (you already have this in mock data)
  securitySynopsis String?

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  project   Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  nodes     FlowNode[]
  edges     FlowEdge[]
  steps     RunStep[]
  issues    Issue[]
  artifacts Artifact[]
  events    RunEvent[]

  @@index([projectId, startedAt])
  @@unique([projectId, label])
}

model FlowNode {
  id          String     @id @default(uuid()) @db.Uuid
  runId       String     @db.Uuid

  /// Stable ID used by React Flow: "landing", "login", "dashboard", etc.
  nodeKey     String
  label       String
  url         String
  status      NodeStatus
  step        Int
  durationMs  Int?
  isMain      Boolean    @default(false)
  isLarge     Boolean    @default(false)

  /// React Flow position
  positionX   Int
  positionY   Int

  /// Optional "primary screenshot" path/url
  screenshotPath String?
  screenshotUrl  String?

  sourceHandleSide   HandleSide?
  sourceHandleImageY Float?

  /// For forward compatibility (store any extra node.data fields)
  data Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  run           TestRun    @relation(fields: [runId], references: [id], onDelete: Cascade)
  steps         RunStep[]
  issues        Issue[]
  artifacts     Artifact[]
  outgoingEdges FlowEdge[] @relation("EdgeSource")
  incomingEdges FlowEdge[] @relation("EdgeTarget")

  @@unique([runId, nodeKey])
  @@index([runId, step])
}

model FlowEdge {
  id           String   @id @default(uuid()) @db.Uuid
  runId        String   @db.Uuid

  /// Stable ID used by React Flow: "e-landing-login" etc.
  edgeKey      String

  sourceNodeId String   @db.Uuid
  targetNodeId String   @db.Uuid

  type         String?
  label        String?
  zIndex       Int?

  /// Store react-flow style/labelStyle/labelBgStyle/labelBgPadding etc.
  style Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  run        TestRun  @relation(fields: [runId], references: [id], onDelete: Cascade)
  sourceNode FlowNode @relation("EdgeSource", fields: [sourceNodeId], references: [id], onDelete: Cascade)
  targetNode FlowNode @relation("EdgeTarget", fields: [targetNodeId], references: [id], onDelete: Cascade)

  @@unique([runId, edgeKey])
  @@index([runId])
}

model RunStep {
  id          String        @id @default(uuid()) @db.Uuid
  runId       String        @db.Uuid
  nodeId      String        @db.Uuid

  /// Chronological index in the run (1..N)
  index       Int
  action      RunStepAction
  target      String
  description String
  reasoning   String
  durationMs  Int?
  status      RunStepStatus

  createdAt DateTime @default(now())

  run       TestRun    @relation(fields: [runId], references: [id], onDelete: Cascade)
  node      FlowNode   @relation(fields: [nodeId], references: [id], onDelete: Cascade)
  issues    Issue[]
  artifacts Artifact[]

  @@unique([runId, index])
  @@index([runId])
  @@index([nodeId])
}

model Issue {
  id             String        @id @default(uuid()) @db.Uuid
  runId          String        @db.Uuid
  nodeId         String        @db.Uuid
  stepId         String?       @db.Uuid

  category       IssueCategory
  title          String
  description    String
  reasoning      String
  element        String
  severity       IssueSeverity
  status         IssueStatus   @default(open)

  detectedAt     DateTime      @default(now())
  resolvedAt     DateTime?
  resolvedById   String?       @db.Uuid
  resolutionNote String?

  run        TestRun   @relation(fields: [runId], references: [id], onDelete: Cascade)
  node       FlowNode  @relation(fields: [nodeId], references: [id], onDelete: Cascade)
  step       RunStep?  @relation(fields: [stepId], references: [id], onDelete: SetNull)
  resolvedBy User?     @relation("IssueResolvedBy", fields: [resolvedById], references: [id], onDelete: SetNull)

  @@index([runId, status])
  @@index([nodeId, status])
  @@index([runId, category])
}

model Artifact {
  id        String          @id @default(uuid()) @db.Uuid
  runId     String          @db.Uuid
  nodeId    String?         @db.Uuid
  stepId    String?         @db.Uuid

  type      ArtifactType
  storage   StorageProvider @default(supabase)

  /// e.g. Supabase bucket + path OR S3 key
  bucket    String?
  path      String?
  url       String?
  mimeType  String?
  sizeBytes Int?
  width     Int?
  height    Int?

  createdAt DateTime @default(now())

  run  TestRun   @relation(fields: [runId], references: [id], onDelete: Cascade)
  node FlowNode? @relation(fields: [nodeId], references: [id], onDelete: SetNull)
  step RunStep?  @relation(fields: [stepId], references: [id], onDelete: SetNull)

  @@index([runId])
  @@index([nodeId])
  @@index([stepId])
}

model RunEvent {
  id        String   @id @default(uuid()) @db.Uuid
  runId     String   @db.Uuid
  seq       Int
  type      String
  payload   Json
  createdAt DateTime @default(now())

  run TestRun @relation(fields: [runId], references: [id], onDelete: Cascade)

  @@unique([runId, seq])
  @@index([runId, createdAt])
}
```


===== apps/web/prisma/migrations/20260222000500_run_events/migration.sql =====

```
-- Add monotonic event cursor to runs
ALTER TABLE "TestRun"
  ADD COLUMN "eventSeq" INTEGER NOT NULL DEFAULT 0;

-- Append-only live event log for run replay/streaming
CREATE TABLE "RunEvent" (
  "id" UUID NOT NULL,
  "runId" UUID NOT NULL,
  "seq" INTEGER NOT NULL,
  "type" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RunEvent_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "RunEvent"
  ADD CONSTRAINT "RunEvent_runId_fkey"
  FOREIGN KEY ("runId") REFERENCES "TestRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "RunEvent_runId_seq_key" ON "RunEvent"("runId", "seq");
CREATE INDEX "RunEvent_runId_createdAt_idx" ON "RunEvent"("runId", "createdAt");
```


===== apps/web/types/domain.ts =====

```
// ────────────────────────────────────────────────────────────────────────────
// Canonical domain types — single source of truth
// ────────────────────────────────────────────────────────────────────────────

// Opaque id helpers
export type RunId = string
export type IssueId = string
export type NodeId = string

// ── Issues ──────────────────────────────────────────────────────────────────

export type IssueSeverity = "error" | "warning"
export type IssueStatus = "open" | "resolved"

export type IssueCategory = "security" | "other"

export type Issue = {
  id: IssueId
  runId: RunId
  nodeId: NodeId
  title: string
  description: string
  reasoning: string
  severity: IssueSeverity
  status: IssueStatus
  element: string
  category: IssueCategory
}

// ── Runs ────────────────────────────────────────────────────────────────────

export type RunStatus = "passed" | "failed" | "running" | "warning"
export type RunStepStatus = "passed" | "failed" | "warning"
export type RunStepAction =
  | "navigate"
  | "scroll"
  | "audit"
  | "click"
  | "wait"
  | "fill"
  | "resize"
  | "screenshot"

export type RunStep = {
  id: string
  index: number
  action: RunStepAction
  target: string
  description: string
  reasoning: string
  duration: string
  status: RunStepStatus
  nodeId: NodeId
}

export type Run = {
  id: RunId
  label: string
  name: string
  category: "security" | "buttons" | "ux"
  url: string
  date: string
  ago: string
  duration: string
  status: RunStatus
  steps: RunStep[]
  securitySynopsis?: string
}

// ── Run summaries (home list / tables) ──────────────────────────────────────

export type RunSummary = {
  id: RunId
  name: string
  url: string
  date: string
  duration: string
  status: RunStatus
  errors: number
  warnings: number
  steps: number
  href: string
}

// ── Flow node status (UI) ───────────────────────────────────────────────────

export type NodeStatus = "passed" | "running" | "pending"
```


===== apps/web/types/flow.ts =====

```
import type { NodeStatus } from "@/types/domain"

export type ScreenshotNodeData = {
  label: string
  url: string
  status: NodeStatus
  step: number
  imageSrc?: string
  duration?: string
  isMain?: boolean
  isLarge?: boolean
  sourceHandle?: { side: "left" | "right"; imageY: number }
}
```
