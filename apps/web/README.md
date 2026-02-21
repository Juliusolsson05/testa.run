# testa.run — Web App

Next.js 16 web frontend for testa.run, an AI-powered website testing platform.

## Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Styling:** Tailwind CSS v4, shadcn/ui (New York style)
- **Flow canvas:** @xyflow/react + react-spring for animated edges
- **Icons:** lucide-react
- **Monorepo:** Turborepo + pnpm workspaces

## Getting Started

```bash
# From repo root
pnpm install
pnpm -C apps/web dev
```

Open [http://localhost:3001](http://localhost:3001).

## Pages

| Route | Description |
|---|---|
| `/` | Runs list — overview of all test runs |
| `/workspace` | Flow canvas + sidebar — visual test flow with issue inspector |
| `/workspace/issues` | Flat list of all detected issues with agent reasoning |
| `/workspace/runs` | Step-by-step timeline of agent actions |

## Data Flow

All demo data lives in `data/`:

- `runSummaries.ts` — run list entries shown on home page
- `flow.ts` — React Flow nodes, edges, and derived lookups (`nodesById`, `nodeMediaById`)
- `issues.ts` — detected issues with severity, status, and agent reasoning
- `runs.ts` — individual agent action steps

`context/issue-context.tsx` manages selection state (active issue/node) shared between the sidebar and flow canvas.

## Prisma + Supabase setup

```bash
# From repo root
pnpm install

# Generate prisma client
pnpm -C apps/web prisma:generate

# Create first migration (after DATABASE_URL is set in apps/web/.env.local)
pnpm -C apps/web prisma:migrate:dev --name init
```

- Prisma schema: `apps/web/prisma/schema.prisma`
- Initial migration: `apps/web/prisma/migrations/20260221220000_init/migration.sql`
- Prisma client singleton: `apps/web/lib/db.ts`
- Supabase clients: `apps/web/lib/supabase.ts`
- Supabase auth helper (Bearer token): `apps/web/lib/supabase-auth.ts`
- DB health endpoint: `GET /api/health/db`

## Conventions

- **No `nodeStepMap`** — derive step/label from `nodesById[id].data`
- **Shared lookups** — use `nodesById` / `nodeMediaById` from `data/flow.ts`
- **Selection** — driven by `IssueContext.activeNodeId`, not React Flow's built-in selection
- **Styling** — Tailwind utility classes; theme tokens in `globals.css`
