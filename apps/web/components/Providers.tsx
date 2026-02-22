"use client"

import { AuthProvider } from "@/components/auth/AuthProvider"
import { GlobalLoadingState } from "@/components/GlobalLoadingState"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GlobalLoadingState />
      {children}
    </AuthProvider>
  )
}
