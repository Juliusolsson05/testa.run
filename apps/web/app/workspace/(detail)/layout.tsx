import type { ReactNode } from "react"
import { FloatingNav } from "@/components/workspace/FloatingNav"

export default function DetailLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#eff6ff] font-sans">
      <FloatingNav />
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        {children}
      </div>
    </div>
  )
}
