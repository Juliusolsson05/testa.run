"use client"

import Link from "next/link"

export function FloatingNav() {
  return (
    <nav className="pointer-events-none absolute inset-x-0 top-4 z-50 flex justify-center">
      <div className="pointer-events-auto flex w-[640px] items-center gap-1 rounded-lg border border-[#1559d4] bg-[#1248b8] px-5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-md">
        {/* Logo */}
        <a href="/" className="mr-4 flex items-center gap-2 text-[15px] font-bold tracking-tight">
          <span className="text-white/80">◈</span>
          <span className="text-white">
            testa<span className="text-[#93c5fd]">.run</span>
          </span>
        </a>

        <div className="mx-3 h-4 w-px bg-white/20" />

        <div className="flex flex-1 items-center">
          <a
            href="/"
            className="flex-1 px-4 py-1.5 text-center text-[13px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Home
          </a>
          <a
            href="/"
            className="flex-1 px-4 py-1.5 text-center text-[13px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Issues
          </a>
          <a
            href="/"
            className="flex-1 px-4 py-1.5 text-center text-[13px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Runs
          </a>
        </div>
      </div>
    </nav>
  )
}
