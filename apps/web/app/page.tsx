import Link from "next/link"

const runs = [
  {
    id: "1",
    name: "TimeEdit test #1",
    url: "timeedit.com",
    date: "2026-02-21",
    duration: "2m 14s",
    status: "passed" as const,
    errors: 2,
    warnings: 2,
    steps: 3,
    href: "/workspace",
  },
]

const statusConfig = {
  passed: { label: "Passed", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  running: { label: "Running", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  failed: { label: "Failed", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
}

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#eff6ff] font-sans">
      {/* Logo-only floating nav */}
      <nav className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-2 rounded-lg border border-[#1d6ef5]/20 bg-white/80 px-5 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-md">
          <span className="text-[#1d6ef5]">◈</span>
          <span className="text-[15px] font-bold tracking-tight text-[#1a2a33]">
            testa<span className="text-[#1d6ef5]">.run</span>
          </span>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <h1 className="mb-1 text-[22px] font-bold tracking-tight text-[#1a2a33]">
          Runs
        </h1>
        <p className="mb-8 text-[13px] text-[#4a7ab5]">
          Your recent test runs
        </p>

        <div className="flex flex-col gap-3">
          {runs.map((run) => {
            const s = statusConfig[run.status]
            return (
              <Link
                key={run.id}
                href={run.href}
                className="group flex items-center gap-5 border border-[#c7d9f0] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(29,110,245,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(29,110,245,0.12)]"
              >
                {/* Status dot */}
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}
                />

                {/* Name + meta */}
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-[#1a2a33] group-hover:text-[#1d6ef5] transition-colors">
                    {run.name}
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 font-mono text-[11px] text-[#4a7ab5]">
                    <span>{run.url}</span>
                    <span className="text-[#c7d9f0]">·</span>
                    <span>{run.date}</span>
                    <span className="text-[#c7d9f0]">·</span>
                    <span>{run.duration}</span>
                    <span className="text-[#c7d9f0]">·</span>
                    <span>{run.steps} steps</span>
                  </div>
                </div>

                {/* Issue counts */}
                <div className="flex items-center gap-2 text-[11px] font-medium">
                  {run.errors > 0 && (
                    <span className="rounded bg-red-500/10 px-2 py-0.5 text-red-600">
                      {run.errors} error{run.errors > 1 ? "s" : ""}
                    </span>
                  )}
                  {run.warnings > 0 && (
                    <span className="rounded bg-amber-400/10 px-2 py-0.5 text-amber-600">
                      {run.warnings} warning{run.warnings > 1 ? "s" : ""}
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
  )
}
