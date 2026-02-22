import { db } from "@/lib/db"

export const PLAN_LIMITS = {
  starter: { monthlyRuns: 1 },
  pro: { monthlyRuns: null as number | null },
} as const

export type PlanName = keyof typeof PLAN_LIMITS

function normalizePlan(plan: string | null | undefined): PlanName {
  return plan === "pro" ? "pro" : "starter"
}

function startOfCurrentMonth() {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0))
}

export async function getOrgPlan(orgId: string): Promise<PlanName> {
  const billing = await db.billingAccount.findUnique({ where: { orgId }, select: { plan: true } })
  return normalizePlan(billing?.plan)
}

export async function enforceMonthlyRunLimit(orgId: string) {
  const plan = await getOrgPlan(orgId)
  const limit = PLAN_LIMITS[plan].monthlyRuns
  if (limit == null) {
    return { ok: true as const, plan, limit: null, used: 0 }
  }

  const used = await db.testRun.count({
    where: {
      startedAt: { gte: startOfCurrentMonth() },
      project: { orgId },
    },
  })

  if (used >= limit) {
    return { ok: false as const, plan, limit, used }
  }

  return { ok: true as const, plan, limit, used }
}
