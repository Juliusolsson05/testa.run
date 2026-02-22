"use client"

import { useState } from "react"
import { toast } from "sonner"
import { RequireAuth } from "@/components/auth/RequireAuth"
import { useAuth } from "@/components/auth/AuthProvider"
import { AppSidebar } from "@/components/workspace/AppSidebar"
import { useAppSelector } from "@/store/hooks"

function SettingsContent() {
  const { user, accessToken } = useAuth()
  const activeOrgId = useAppSelector((s) => s.workspace.activeOrgId)
  const billingPlan = useAppSelector((s) => s.billing.plan)
  const billingStatus = useAppSelector((s) => s.billing.status)

  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    if (!activeOrgId || !accessToken) return
    setIsLoading(true)
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
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || "Could not create checkout session")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to create checkout session")
    } finally {
      setIsLoading(false)
    }
  }

  const handleManage = async () => {
    if (!activeOrgId || !accessToken) return
    setIsLoading(true)
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
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || "Could not open billing portal")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to redirect to billing portal")
    } finally {
      setIsLoading(false)
    }
  }

  // Users with pro/past_due should be able to access billing portal to manage payment state.

  return (
    <div className="flex h-dvh bg-app-bg font-sans">
      <AppSidebar />
      <main className="flex flex-1 items-start justify-center p-8">
        <div className="w-full max-w-2xl rounded-lg border border-ui-border bg-white p-6">
          <h1 className="text-2xl font-semibold text-[#1a2a33]">Settings</h1>
          <p className="mt-1 text-sm text-ui-muted">Account and billing context for your current session.</p>

          <div className="mt-6 space-y-3 text-sm">
            <div>
              <span className="font-medium text-[#1a2a33]">Email:</span> {user?.email}
            </div>
            <div>
              <span className="font-medium text-[#1a2a33]">User ID:</span> {user?.id}
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-[#1a2a33]">Billing</h2>
            <div className="mt-4 space-y-3 text-sm text-ui-muted">
              <div>
                <span className="font-medium text-[#1a2a33]">Current Plan:</span> <span className="uppercase">{billingPlan}</span>
              </div>
              <div>
                <span className="font-medium text-[#1a2a33]">Current Status:</span> <span className="uppercase">{billingStatus}</span>
              </div>

              <div className="mt-6 pt-4">
                {billingPlan === "pro" || billingStatus === "past_due" ? (
                  <button
                    onClick={handleManage}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-md bg-[#1a2a33] px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-50"
                  >
                    {isLoading ? "Loading..." : "Manage billing"}
                  </button>
                ) : (
                  <button
                    onClick={handleUpgrade}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-md bg-[#1a2a33] px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-50"
                  >
                    {isLoading ? "Loading..." : "Upgrade to Pro (£49/mo)"}
                  </button>
                )}
              </div>
            </div>
          </div>
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
