import Image from "next/image"
import Link from "next/link"
import { FloatingNav } from "@/components/workspace/FloatingNav"
import { runSteps } from "@/data/runs"
import { initialNodes, nodeStepMap } from "@/data/flow"
import { cn } from "@/lib/utils"

const nodeImageMap = Object.fromEntries(
  initialNodes.map((n) => [n.id, { imageSrc: n.data.imageSrc, label: n.data.label }])
)

const actionIcon: Record<string, string> = {
  navigate: "→",
  scroll: "↕",
  audit: "◎",
  click: "↵",
  wait: "⏱",
  fill: "✎",
  resize: "⤢",
  screenshot: "▣",
}

const statusConfig = {
  passed: { label: "Passed", color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
  warning: { label: "Warning", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  failed: { label: "Failed", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
}

export default function RunsPage() {
  return (
    <div className="min-h-dvh bg-[#eff6ff] font-sans">
      <FloatingNav />

      <div className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <div className="mb-1 flex items-center gap-2 font-mono text-[11px] text-[#4a7ab5]">
          <Link href="/" className="hover:text-[#1d6ef5]">Runs</Link>
          <span>›</span>
          <Link href="/workspace" className="hover:text-[#1d6ef5]">TimeEdit test #1</Link>
          <span>›</span>
          <span>Steps</span>
        </div>
        <h1 className="mb-1 text-[22px] font-bold tracking-tight text-[#1a2a33]">Run steps</h1>
        <p className="mb-8 text-[13px] text-[#4a7ab5]">
          {runSteps.length} agent actions · {runSteps.filter((s) => s.status === "failed").length} failed · {runSteps.filter((s) => s.status === "warning").length} warnings
        </p>

        <div className="relative flex flex-col gap-0">
          <div className="absolute left-[19px] top-4 bottom-4 w-px bg-[#c7d9f0]" />

          {runSteps.map((step, i) => {
            const s = statusConfig[step.status]
            const meta = nodeStepMap[step.nodeId] ?? { step: 0, label: "Unknown" }
            const node = nodeImageMap[step.nodeId]
            const icon = actionIcon[step.action] ?? "·"
            const isLast = i === runSteps.length - 1

            return (
              <div key={step.id} className={cn("relative flex gap-4", !isLast && "pb-4")}>
                {/* Circle */}
                <div
                  className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white text-[13px] font-bold shadow-[0_1px_4px_rgba(0,0,0,0.1)]"
                  style={{ background: s.bg, color: s.color, borderColor: s.color + "40" }}
                >
                  {icon}
                </div>

                {/* Card */}
                <div className="flex flex-1 overflow-hidden border border-[#c7d9f0] bg-white shadow-[0_1px_4px_rgba(29,110,245,0.06)]">
                  <div className="flex-1 px-5 py-4">
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#4a7ab5]">#{step.index}</span>
                          <span className="text-[13px] font-semibold text-[#1a2a33]">{step.description}</span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-[#4a7ab5]">
                          <span className="rounded bg-[#eff6ff] px-1.5 py-0.5 text-[10px]">{step.action}</span>
                          <span className="max-w-[200px] truncate">{step.target}</span>
                          <span className="text-[#c7d9f0]">·</span>
                          <span>Step {meta.step} · {meta.label}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase" style={{ color: s.color, background: s.bg }}>
                          {s.label}
                        </span>
                        <span className="font-mono text-[10px] text-[#4a7ab5]">{step.duration}</span>
                      </div>
                    </div>
                    <div className="border-t border-[#eff6ff] pt-3">
                      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#4a7ab5]">Agent reasoning</div>
                      <p className="text-[12px] leading-relaxed text-[#4a7ab5]">{step.reasoning}</p>
                    </div>
                  </div>

                  {node?.imageSrc && (
                    <div className="flex shrink-0 items-center justify-center border-l border-[#eff6ff] p-3" style={{ maxWidth: 160 }}>
                      <Image src={node.imageSrc} alt={node.label} width={320} height={200} className="h-auto w-full" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
