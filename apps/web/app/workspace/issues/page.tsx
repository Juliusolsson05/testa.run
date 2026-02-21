import Image from "next/image"
import Link from "next/link"
import { FloatingNav } from "@/components/workspace/FloatingNav"
import { issues } from "@/data/issues"
import { initialNodes, nodeStepMap } from "@/data/flow"
import { cn } from "@/lib/utils"

const nodeImageMap = Object.fromEntries(
  initialNodes.map((n) => [n.id, { imageSrc: n.data.imageSrc, label: n.data.label }])
)

export default function IssuesPage() {
  const open = issues.filter((i) => i.status === "open")
  const resolved = issues.filter((i) => i.status === "resolved")

  return (
    <div className="min-h-dvh bg-[#eff6ff] font-sans">
      <FloatingNav />

      <div className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <div className="mb-1 flex items-center gap-2 font-mono text-[11px] text-[#4a7ab5]">
          <Link href="/" className="hover:text-[#1d6ef5]">Runs</Link>
          <span>›</span>
          <Link href="/workspace" className="hover:text-[#1d6ef5]">TimeEdit test #1</Link>
          <span>›</span>
          <span>Issues</span>
        </div>
        <h1 className="mb-8 text-[22px] font-bold tracking-tight text-[#1a2a33]">Issues</h1>

        {/* Open */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#4a7ab5]">Open</span>
            <span className="rounded bg-[#1d6ef5] px-1.5 py-0.5 text-[10px] font-bold text-white">{open.length}</span>
          </div>
          <div className="flex flex-col gap-3">
            {open.map((issue) => {
              const meta = nodeStepMap[issue.nodeId] ?? { step: 0, label: "Unknown" }
              const node = nodeImageMap[issue.nodeId]
              return (
                <div
                  key={issue.id}
                  className={cn(
                    "flex gap-0 border border-[#c7d9f0] bg-white shadow-[0_1px_4px_rgba(29,110,245,0.06)]",
                    issue.severity === "error" ? "border-l-4 border-l-red-500" : "border-l-4 border-l-amber-400"
                  )}
                >
                  <div className="flex-1 px-5 py-4">
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[14px] font-semibold text-[#1a2a33]">{issue.title}</div>
                        <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-[#4a7ab5]">
                          <span>Step {meta.step} · {meta.label}</span>
                          <span className="text-[#c7d9f0]">·</span>
                          <span>{issue.element}</span>
                        </div>
                      </div>
                      <span className={cn(
                        "shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                        issue.severity === "error" ? "bg-red-500/10 text-red-600" : "bg-amber-400/10 text-amber-600"
                      )}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="mb-3 text-[13px] leading-relaxed text-[#2d5282]">{issue.description}</p>
                    <div className="border-t border-[#eff6ff] pt-3">
                      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#4a7ab5]">Agent reasoning</div>
                      <p className="text-[12px] leading-relaxed text-[#4a7ab5]">{issue.reasoning}</p>
                    </div>
                  </div>

                  {node?.imageSrc && (
                    <div className="flex shrink-0 items-center justify-center border-l border-[#eff6ff] p-3" style={{ maxWidth: 160 }}>
                      <Image src={node.imageSrc} alt={node.label} width={320} height={200} className="h-auto w-full" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Resolved */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#4a7ab5]">Resolved</span>
            <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{resolved.length}</span>
          </div>
          <div className="flex flex-col gap-3">
            {resolved.map((issue) => {
              const meta = nodeStepMap[issue.nodeId] ?? { step: 0, label: "Unknown" }
              const node = nodeImageMap[issue.nodeId]
              return (
                <div key={issue.id} className="flex gap-0 border border-[#c7d9f0] bg-white/60 opacity-70">
                  <div className="flex-1 px-5 py-4">
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[14px] font-semibold text-[#1a2a33] line-through">{issue.title}</div>
                        <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-[#4a7ab5]">
                          <span>Step {meta.step} · {meta.label}</span>
                          <span className="text-[#c7d9f0]">·</span>
                          <span>{issue.element}</span>
                        </div>
                      </div>
                      <span className="shrink-0 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600">
                        resolved
                      </span>
                    </div>
                    <p className="mb-3 text-[13px] leading-relaxed text-[#2d5282]">{issue.description}</p>
                    <div className="border-t border-[#eff6ff] pt-3">
                      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#4a7ab5]">Agent reasoning</div>
                      <p className="text-[12px] leading-relaxed text-[#4a7ab5]">{issue.reasoning}</p>
                    </div>
                  </div>

                  {node?.imageSrc && (
                    <div className="flex shrink-0 items-center justify-center border-l border-[#eff6ff] p-3" style={{ maxWidth: 160 }}>
                      <Image src={node.imageSrc} alt={node.label} width={320} height={200} className="h-auto w-full grayscale" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
