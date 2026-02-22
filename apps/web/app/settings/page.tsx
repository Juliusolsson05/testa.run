"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { RequireAuth } from "@/components/auth/RequireAuth"
import { useAuth } from "@/components/auth/AuthProvider"
import { AppSidebar } from "@/components/workspace/AppSidebar"
import { useAppSelector } from "@/store/hooks"

type BillingUsage = {
  plan: "starter" | "pro"
  monthlyLimit: number | null
  used: number
  remaining: number | null
  resetAt: string
}

type BillingState = {
  plan: "starter" | "pro"
  status: "inactive" | "trialing" | "active" | "past_due" | "canceled" | "unpaid"
  stripeCustomerId?: string | null
  currentPeriodEnd?: string | null
  cancelAtPeriodEnd?: boolean
}

function SettingsContent() {
  const { user, accessToken } = useAuth()
  const activeOrgId = useAppSelector((s) => s.workspace.activeOrgId)

  const [orgName, setOrgName] = useState("")
  const [orgSlug, setOrgSlug] = useState("")
  const [billing, setBilling] = useState<BillingState | null>(null)
  const [usage, setUsage] = useState<BillingUsage | null>(null)
  const [loading, setLoading] = useState(false)

  const usageLabel = useMemo(() => {
    if (!usage) return ""
    if (usage.monthlyLimit == null) return "Unlimited runs"
    return `${usage.used}/${usage.monthlyLimit} runs used`
  }, [usage])

  useEffect(() => {
    async function load() {
      if (!activeOrgId || !accessToken) return

      const headers = { Authorization: `Bearer ${accessToken}` }

      const [orgRes, billingRes, usageRes] = await Promise.all([
        fetch(`/api/orgs/${activeOrgId}`, { headers, cache: "no-store" }),
        fetch(`/api/billing?orgId=${activeOrgId}`, { headers, cache: "no-store" }),
        fetch(`/api/billing/usage?orgId=${activeOrgId}`, { headers, cache: "no-store" }),
      ])

      if (orgRes.ok) {
        const data = await orgRes.json()
        setOrgName(data?.org?.name ?? "")
        setOrgSlug(data?.org?.slug ?? "")
      }

      if (billingRes.ok) {
        const data = await billingRes.json()
        setBilling(data?.billing ?? null)
      }

      if (usageRes.ok) {
        const data = await usageRes.json()
        setUsage(data?.usage ?? null)
      }
    }

    void load()
  }, [activeOrgId, accessToken])

  async function saveOrg() {
    if (!activeOrgId || !accessToken) return
    setLoading(true)
    try {
      const res = await fetch(`/api/orgs/${activeOrgId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: orgName }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        toast.error(data?.error || "Could not save organization")
        return
      }

      toast.success("Organization updated")
    } finally {
      setLoading(false)
    }
  }

  async function handlePortal() {
    if (!activeOrgId || !accessToken) return
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ orgId: activeOrgId }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        toast.error(data?.error || "Could not open billing portal")
        return
      }
      window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }

  async function handleUpgrade() {
    if (!activeOrgId || !accessToken) return
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ orgId: activeOrgId }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        toast.error(data?.error || "Could not start checkout")
        return
      }
      window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }

  async function handleCancelAtPeriodEnd() {
    if (!activeOrgId || !accessToken) return
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/subscription/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ orgId: activeOrgId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || "Could not schedule cancellation")
        return
      }
      setBilling((prev) => (prev ? { ...prev, cancelAtPeriodEnd: true } : prev))
      toast.success("Subscription will cancel at period end")
    } finally {
      setLoading(false)
    }
  }

  async function handleResumeSubscription() {
    if (!activeOrgId || !accessToken) return
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/subscription/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ orgId: activeOrgId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || "Could not resume subscription")
        return
      }
      setBilling((prev) => (prev ? { ...prev, cancelAtPeriodEnd: false } : prev))
      toast.success("Cancellation removed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-dvh bg-app-bg font-sans">
      <AppSidebar />
      <main className="flex flex-1 items-start justify-center overflow-y-auto p-8">
        <div className="w-full max-w-3xl space-y-5">
          <div className="rounded-lg border border-ui-border bg-white p-6">
            <h1 className="text-2xl font-semibold text-[#1a2a33]">Settings</h1>
            <p className="mt-1 text-sm text-ui-muted">Plan, billing and organization controls.</p>
          </div>

          <section className="rounded-lg border border-ui-border bg-white p-6">
            <h2 className="text-lg font-semibold text-[#1a2a33]">Plan & usage</h2>
            <div className="mt-3 text-sm text-ui-muted">
              <div><span className="font-medium text-[#1a2a33]">Plan:</span> {(billing?.plan ?? usage?.plan ?? "starter").toUpperCase()}</div>
              <div className="mt-1"><span className="font-medium text-[#1a2a33]">Usage:</span> {usageLabel || "—"}</div>
              {usage?.resetAt && <div className="mt-1"><span className="font-medium text-[#1a2a33]">Resets:</span> {new Date(usage.resetAt).toLocaleDateString()}</div>}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="rounded bg-[#1d6ef5] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                Upgrade to Pro ($29/mo)
              </button>
              <button
                onClick={handlePortal}
                disabled={loading}
                className="rounded border border-ui-border px-4 py-2 text-sm font-semibold text-[#1a2a33] disabled:opacity-60"
              >
                Open Stripe portal
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-ui-border bg-white p-6">
            <h2 className="text-lg font-semibold text-[#1a2a33]">Subscription controls</h2>
            <div className="mt-3 text-sm text-ui-muted">
              <div><span className="font-medium text-[#1a2a33]">Status:</span> {(billing?.status ?? "inactive").toUpperCase()}</div>
              <div className="mt-1"><span className="font-medium text-[#1a2a33]">Cancel at period end:</span> {billing?.cancelAtPeriodEnd ? "Yes" : "No"}</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleCancelAtPeriodEnd}
                disabled={loading || !billing || billing.plan !== "pro" || !!billing.cancelAtPeriodEnd}
                className="rounded border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"
              >
                Cancel at period end
              </button>
              <button
                onClick={handleResumeSubscription}
                disabled={loading || !billing || !billing.cancelAtPeriodEnd}
                className="rounded border border-ui-border px-4 py-2 text-sm font-semibold text-[#1a2a33] disabled:opacity-50"
              >
                Resume subscription
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-ui-border bg-white p-6">
            <h2 className="text-lg font-semibold text-[#1a2a33]">Company info</h2>
            <p className="mt-1 text-sm text-ui-muted">Manage the workspace identity used for billing and admin context.</p>

            <label className="mt-5 block text-sm font-medium text-[#1a2a33]">Organization name</label>
            <input
              className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />

            <label className="mt-4 block text-sm font-medium text-[#1a2a33]">Workspace slug</label>
            <input
              className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm text-ui-muted"
              value={orgSlug}
              readOnly
            />

            <label className="mt-4 block text-sm font-medium text-[#1a2a33]">Billing contact</label>
            <input
              className="mt-1 w-full rounded border border-ui-border px-3 py-2 text-sm text-ui-muted"
              value={user?.email ?? ""}
              readOnly
            />

            <button
              onClick={saveOrg}
              disabled={loading}
              className="mt-5 rounded bg-[#1d6ef5] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Save organization
            </button>
          </section>
        </div>
      </main>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <RequireAuth>
      <SettingsContent />
    </RequireAuth>
  )
}
