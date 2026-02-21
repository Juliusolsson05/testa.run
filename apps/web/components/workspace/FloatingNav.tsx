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
