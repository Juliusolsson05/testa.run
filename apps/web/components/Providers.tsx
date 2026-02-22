"use client"

import { AuthProvider } from "@/components/auth/AuthProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
