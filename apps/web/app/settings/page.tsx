"use client"

import { RequireAuth } from "@/components/auth/RequireAuth"
import { useAuth } from "@/components/auth/AuthProvider"
import { AppSidebar } from "@/components/workspace/AppSidebar"

function SettingsContent() {
  const { user } = useAuth()

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
