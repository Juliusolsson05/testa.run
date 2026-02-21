"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertTriangle,
  ChevronDown,
  CirclePlay,
  Clock,
  Home,
  LogOut,
  Settings,
  User,
} from "lucide-react"
import { TestaRunLogo } from "@/components/ui/TestaRunLogo"
import { cn } from "@/lib/utils"

const NAV = [
  { label: "Home",     href: "/",                  icon: Home          },
  { label: "Issues",   href: "/workspace/issues",  icon: AlertTriangle },
  { label: "Runs",     href: "/workspace/runs",    icon: CirclePlay    },
  { label: "Settings", href: "/settings",          icon: Settings      },
]

const RECENT_RUNS = [
  { id: "a3f7c1", label: "Security Audit",            ago: "2m ago", status: "running" },
  { id: "f7b3d1", label: "Button & Interaction Test", ago: "1h ago", status: "warning" },
  { id: "c9a2e3", label: "UX & Accessibility Review", ago: "1d ago", status: "warning" },
]

const runStatusDot: Record<string, string> = {
  running: "bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.6)]",
  passed:  "bg-emerald-500",
  failed:  "bg-red-500",
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-white/8 bg-[#111318] text-white">

      {/* Logo */}
      <div className="px-5 py-5">
        <TestaRunLogo />
      </div>

      {/* Project selector */}
      <div className="mx-3 mb-4">
        <button className="flex w-full items-center justify-between rounded border border-white/10 bg-white/5 px-3 py-2.5 text-left transition hover:bg-white/10">
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-[0.6px] text-white/40">Project</div>
            <div className="truncate text-[13px] font-semibold text-[#e8edf5]">TimeEdit</div>
            <div className="truncate font-mono text-[10px] text-white/40">timeedit.com</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/40" />
        </button>
      </div>

      <div className="mx-3 mb-4 border-t border-white/8" />

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 px-3">
        <div className="mb-1 px-2 text-[10px] font-bold uppercase tracking-[0.6px] text-white/30">
          Navigate
        </div>
        {NAV.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-[#1d6ef5]/15 text-[#7eb3f5]"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-[#1d6ef5]" : "text-white/40")} />
              {label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#1d6ef5]" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mx-3 my-4 border-t border-white/8" />

      {/* Active run */}
      <div className="px-3">
        <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.6px] text-white/30">
          Active Run
        </div>
        <div className="rounded border border-white/10 bg-white/5 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[12px] font-semibold text-[#7eb3f5]">#a3f7c1</span>
            <span className="flex items-center gap-1 text-[10px] text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.6)]" />
              Running
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-white/40">
            <Clock className="h-3 w-3" />
            Started 2m 14s ago
          </div>
        </div>
      </div>

      <div className="mx-3 my-4 border-t border-white/8" />

      {/* Recent runs */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.6px] text-white/30">
          Recent Runs
        </div>
        <div className="flex flex-col gap-0.5">
          {RECENT_RUNS.map((run) => (
            <button
              key={run.id}
              className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left transition hover:bg-white/8"
            >
              <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", runStatusDot[run.status])} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] font-medium text-white/70">{run.label}</div>
                <div className="font-mono text-[10px] text-white/30">#{run.id}</div>
              </div>
              <span className="shrink-0 text-[10px] text-white/30">{run.ago}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom: user profile */}
      <div className="mx-3 mt-3 border-t border-white/8 py-3">
        <div className="flex items-center gap-2.5 rounded px-2 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1d6ef5]/30 text-[11px] font-bold text-[#7eb3f5]">
            JO
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-semibold text-[#e8edf5]">Julius O.</div>
            <div className="truncate font-mono text-[10px] text-white/40">julius@testa.run</div>
          </div>
          <button className="text-white/30 transition hover:text-white/60">
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>

        <Link
          href="/settings"
          className="mt-1 flex items-center gap-2 rounded px-2 py-1.5 text-[11px] text-white/40 transition hover:bg-white/8 hover:text-white/70"
        >
          <User className="h-3 w-3" />
          Account & billing
        </Link>
      </div>
    </aside>
  )
}
