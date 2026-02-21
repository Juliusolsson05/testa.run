import Image from "next/image"
import { nodesById, nodeMediaById } from "@/data/flow"
import type { RunStep } from "@/types/domain"
import { actionIcons, stepStatusConfig } from "@/constants/status"
import { cn } from "@/lib/utils"

const stepStatusCircleClass = {
  passed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/25",
  warning: "bg-amber-400/10 text-amber-600 border-amber-400/25",
  failed: "bg-red-500/10 text-red-600 border-red-500/25",
} as const

const stepStatusBadgeClass = {
  passed: "bg-emerald-500/10 text-emerald-600",
  warning: "bg-amber-400/10 text-amber-600",
  failed: "bg-red-500/10 text-red-600",
} as const

export function RunStepCard({ step }: { step: RunStep }) {
  const s = stepStatusConfig[step.status]
  const node = nodesById[step.nodeId]
  const media = nodeMediaById[step.nodeId]
  const nodeStep = node?.data.step ?? 0
  const nodeLabel = node?.data.label ?? "Unknown"
  const icon = actionIcons[step.action] ?? "·"

  return (
    <div className="relative flex gap-4">
      {/* Circle */}
      <div
        className={cn(
          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-bold shadow-[0_1px_4px_rgba(0,0,0,0.1)]",
          stepStatusCircleClass[step.status]
        )}
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
                <span>Step {nodeStep} · {nodeLabel}</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className={cn("rounded px-2 py-0.5 text-[10px] font-bold uppercase", stepStatusBadgeClass[step.status])}>
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

        {media?.imageSrc && (
          <div className="flex max-w-[160px] shrink-0 items-center justify-center border-l border-[#eff6ff] p-3">
            <Image src={media.imageSrc} alt={media.label} width={320} height={200} className="h-auto w-full" />
          </div>
        )}
      </div>
    </div>
  )
}
