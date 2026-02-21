import Image from "next/image"
import { nodesById, nodeMediaById } from "@/data/flow"
import type { Issue } from "@/data/issues"
import { cn } from "@/lib/utils"

export function IssueCard({ issue, variant = "open" }: { issue: Issue; variant?: "open" | "resolved" }) {
  const node = nodesById[issue.nodeId]
  const media = nodeMediaById[issue.nodeId]
  const step = node?.data.step ?? 0
  const label = node?.data.label ?? "Unknown"
  const isResolved = variant === "resolved"

  return (
    <div
      className={cn(
        "flex gap-0 border border-[#c7d9f0] bg-white shadow-[0_1px_4px_rgba(29,110,245,0.06)]",
        isResolved && "bg-white/60 opacity-70",
        !isResolved && issue.severity === "error" && "border-l-4 border-l-red-500",
        !isResolved && issue.severity === "warning" && "border-l-4 border-l-amber-400",
      )}
    >
      <div className="flex-1 px-5 py-4">
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <div className={cn("text-[14px] font-semibold text-[#1a2a33]", isResolved && "line-through")}>
              {issue.title}
            </div>
            <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-[#4a7ab5]">
              <span>Step {step} · {label}</span>
              <span className="text-[#c7d9f0]">·</span>
              <span>{issue.element}</span>
            </div>
          </div>
          {isResolved ? (
            <span className="shrink-0 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600">
              resolved
            </span>
          ) : (
            <span className={cn(
              "shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase",
              issue.severity === "error" ? "bg-red-500/10 text-red-600" : "bg-amber-400/10 text-amber-600"
            )}>
              {issue.severity}
            </span>
          )}
        </div>
        <p className="mb-3 text-[13px] leading-relaxed text-[#2d5282]">{issue.description}</p>
        <div className="border-t border-[#eff6ff] pt-3">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#4a7ab5]">Agent reasoning</div>
          <p className="text-[12px] leading-relaxed text-[#4a7ab5]">{issue.reasoning}</p>
        </div>
      </div>

      {media?.imageSrc && (
        <div className="flex shrink-0 items-center justify-center border-l border-[#eff6ff] p-3" style={{ maxWidth: 160 }}>
          <Image src={media.imageSrc} alt={media.label} width={320} height={200} className={cn("h-auto w-full", isResolved && "grayscale")} />
        </div>
      )}
    </div>
  )
}
