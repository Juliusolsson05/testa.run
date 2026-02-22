"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  AlertTriangle,
  ChevronDown,
  CirclePlay,
  Clock,
  LogOut,
  Settings,
  ShieldAlert,
  User,
} from "lucide-react"
import { Wordmark } from "@/components/ui/TestaRunLogo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/AuthProvider"
import { useProjectRuns } from "@/components/workspace/useProjectRuns"

const runStatusDot = {
  running: "bg-[#1d6ef5] shadow-[0_0_5px_rgba(29,110,245,0.6)]",
  warning: "bg-amber-400",
  passed: "bg-emerald-500",
  failed: "bg-red-500",
} as const

function fromNow(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.max(0, Math.floor(diff / 60000))
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function AppSidebar() {
  const pathname = usePathname()
  const params = useSearchParams()
  const router = useRouter()
  const { user, signOut } = useAuth()

  const selectedRunId = params.get("runId") ?? (pathname.startsWith("/workspace/") ? pathname.split("/")[2] : undefined)
  const isHome = pathname === "/"
  const { project, runs, activeRun, selectedRun, runningRun } = useProjectRuns(
    selectedRunId,
    isHome ? 30 : 5,
    { poll: !isHome }
  )

  const initials = (user?.email?.slice(0, 2) || "TR").toUpperCase()
  const contextRun = selectedRun ?? runningRun
  const runQuery = contextRun ? `?runId=${contextRun.id}` : ""

  const nav = [
    { label: "Runs", href: "/", icon: CirclePlay },
    { label: "Issues", href: `/workspace/issues${runQuery}`, icon: AlertTriangle },
    { label: "Security", href: `/workspace/security${runQuery}`, icon: ShieldAlert },
    { label: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-white/8 bg-[#1c2030] text-white">
      <div className="px-5 py-5">
        <Wordmark variant="dark" className="text-[15px]" />
      </div>

      <div className="mx-3 mb-4">
        <Button type="button" variant="ghost" className="h-auto w-full justify-between rounded border border-white/10 bg-white/5 px-3 py-2.5 text-left hover:bg-white/10">
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-[0.6px] text-white/40">Project</div>
            <div className="truncate text-[13px] font-semibold text-[#e8edf5]">{project?.name || "No project"}</div>
            <div className="truncate font-mono text-[10px] text-white/40">{project?.targetUrl || "—"}</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/40" />
        </Button>
      </div>

      <div className="mx-3 mb-4 border-t border-white/8" />

      <nav className="flex flex-col gap-0.5 px-3">
        <div className="mb-1 px-2 text-[10px] font-bold uppercase tracking-[0.6px] text-white/30">Navigate</div>
        {nav.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href.startsWith("/workspace/") && pathname.startsWith(href.split("?")[0] ?? ""))
          return (
            <Link key={href} href={href} className={cn("flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] font-medium transition-colors", isActive ? "bg-[#1d6ef5]/15 text-[#7eb3f5]" : "text-white/60 hover:bg-white/8 hover:text-white")}>
              <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-[#1d6ef5]" : "text-white/40")} />
              {label}
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#1d6ef5]" />}
            </Link>
          )
        })}
      </nav>

      <div className="mx-3 my-4 border-t border-white/8" />

      <div className="px-3">
        <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.6px] text-white/30">
          {runningRun ? "Active Run" : selectedRun ? "Selected Run" : "Run Context"}
        </div>
        <div className="rounded border border-white/10 bg-white/5 px-3 py-2.5">
          {activeRun ? (
            <>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] font-semibold text-[#7eb3f5]">{activeRun.label ?? activeRun.id.slice(0, 8)}</span>
                <span className="flex items-center gap-1 text-[10px] text-white/50">
                  <span className={cn("h-1.5 w-1.5 rounded-full", runStatusDot[activeRun.status])} />
                  {activeRun.status}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-white/40">
                <Clock className="h-3 w-3" />
                Started {fromNow(activeRun.startedAt)}
              </div>
            </>
          ) : (
            <div className="text-[10px] text-white/40">No run currently running</div>
          )}
        </div>
      </div>

      <div className="mx-3 my-4 border-t border-white/8" />

      <div className="flex-1 overflow-y-auto px-3">
        <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.6px] text-white/30">Recent Runs</div>
        <div className="flex flex-col gap-0.5">
          {runs.slice(0, 3).map((run) => (
            <Link key={run.id} href={`/workspace/${run.id}`} className="flex h-auto w-full items-center justify-start gap-2.5 rounded px-2.5 py-2 text-left hover:bg-white/8">
              <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", runStatusDot[run.status])} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] font-medium text-white/70">{run.name}</div>
                <div className="font-mono text-[10px] text-white/30">{run.label ?? run.id.slice(0, 8)}</div>
              </div>
              <span className="shrink-0 text-[10px] text-white/30">{fromNow(run.startedAt)}</span>
            </Link>
          ))}
          {runs.length === 0 && <div className="px-2 text-[10px] text-white/40">No runs yet</div>}
        </div>
      </div>

      <div className="mx-3 mt-3 border-t border-white/8 py-3">
        <div className="flex items-center gap-2.5 rounded px-2 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1d6ef5]/30 text-[11px] font-bold text-[#7eb3f5]">{initials}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-semibold text-[#e8edf5]">{user?.user_metadata?.full_name || "testa.run user"}</div>
            <div className="truncate font-mono text-[10px] text-white/40">{user?.email || ""}</div>
          </div>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            className="text-white/30 hover:text-white/60"
            aria-label="Log out"
            onClick={async () => {
              await signOut()
              router.replace("/sign-in")
            }}
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>

        <Link href="/settings" className="mt-1 flex items-center gap-2 rounded px-2 py-1.5 text-[11px] text-white/40 transition hover:bg-white/8 hover:text-white/70">
          <User className="h-3 w-3" />
          Account & billing
        </Link>
      </div>
    </aside>
  )
}
