import Link from "next/link"
import { AppSidebar } from "@/components/workspace/AppSidebar"

const projects = [
  {
    id: "1",
    name: "TimeEdit",
    description: "Full UX, security & button audit",
    url: "timeedit.com",
    date: "2026-02-21",
    duration: "2m 14s",
    status: "running" as const,
    errors: 5,
    warnings: 6,
    runs: 3,
    href: "/workspace",
  },
  {
    id: "2",
    name: "Stripe Checkout",
    description: "Payment flow & form validation",
    url: "stripe.com",
    date: "2026-02-20",
    duration: "4m 02s",
    status: "failed" as const,
    errors: 8,
    warnings: 3,
    runs: 2,
    href: "/workspace",
  },
  {
    id: "3",
    name: "Linear",
    description: "Issue tracker navigation & shortcuts",
    url: "linear.app",
    date: "2026-02-19",
    duration: "1m 48s",
    status: "passed" as const,
    errors: 0,
    warnings: 2,
    runs: 1,
    href: "/workspace",
  },
]

const statusConfig = {
  passed:  { label: "Passed",  color: "#22c55e", bg: "rgba(34,197,94,0.1)"  },
  running: { label: "Running", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  failed:  { label: "Failed",  color: "#ef4444", bg: "rgba(239,68,68,0.1)"  },
}

export default function HomePage() {
  return (
    <div className="flex h-dvh bg-[#eff6ff] font-sans">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="px-8 py-8">
          <h1 className="mb-1 text-[22px] font-bold tracking-tight text-[#1a2a33]">Projects</h1>
          <p className="mb-8 text-[13px] text-[#4a7ab5]">Your monitored sites and apps</p>

          <div className="flex flex-col gap-3">
            {projects.map((project) => {
              const s = statusConfig[project.status]
              return (
                <Link
                  key={project.id}
                  href={project.href}
                  className="group flex items-center gap-5 border border-[#c7d9f0] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(29,110,245,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(29,110,245,0.12)]"
                >
                  {/* Status dot */}
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}
                  />

                  {/* Name + meta */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[14px] font-semibold text-[#1a2a33] transition-colors group-hover:text-[#1d6ef5]">
                        {project.name}
                      </span>
                      <span className="text-[12px] text-[#4a7ab5]">{project.description}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 font-mono text-[11px] text-[#4a7ab5]">
                      <span>{project.url}</span>
                      <span className="text-[#c7d9f0]">·</span>
                      <span>{project.date}</span>
                      <span className="text-[#c7d9f0]">·</span>
                      <span>{project.duration} last run</span>
                      <span className="text-[#c7d9f0]">·</span>
                      <span>{project.runs} run{project.runs > 1 ? "s" : ""}</span>
                    </div>
                  </div>

                  {/* Issue counts */}
                  <div className="flex shrink-0 items-center gap-2 text-[11px] font-medium">
                    {project.errors > 0 && (
                      <span className="rounded bg-red-500/10 px-2 py-0.5 text-red-600">
                        {project.errors} error{project.errors > 1 ? "s" : ""}
                      </span>
                    )}
                    {project.warnings > 0 && (
                      <span className="rounded bg-amber-400/10 px-2 py-0.5 text-amber-600">
                        {project.warnings} warning{project.warnings > 1 ? "s" : ""}
                      </span>
                    )}
                    {project.errors === 0 && project.warnings === 0 && (
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-600">
                        Clean
                      </span>
                    )}
                  </div>

                  {/* Status badge */}
                  <span
                    className="shrink-0 rounded px-2.5 py-1 text-[11px] font-semibold"
                    style={{ color: s.color, background: s.bg }}
                  >
                    {s.label}
                  </span>

                  <span className="text-[#4a7ab5] opacity-0 transition-opacity group-hover:opacity-100">→</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
