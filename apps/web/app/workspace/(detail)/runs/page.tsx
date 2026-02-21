import { Breadcrumbs } from "@/components/workspace/Breadcrumbs"
import { RunStepCard } from "@/components/workspace/RunStepCard"
import { runSteps } from "@/data/runs"
import { cn } from "@/lib/utils"

export default function RunsPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: "Runs", href: "/" },
        { label: "TimeEdit test #1", href: "/workspace" },
        { label: "Steps" },
      ]} />
      <h1 className="mb-1 text-[22px] font-bold tracking-tight text-[#1a2a33]">Run steps</h1>
      <p className="mb-8 text-[13px] text-[#4a7ab5]">
        {runSteps.length} agent actions · {runSteps.filter((s) => s.status === "failed").length} failed · {runSteps.filter((s) => s.status === "warning").length} warnings
      </p>

      <div className="relative flex flex-col gap-0">
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-[#c7d9f0]" />
        {runSteps.map((step, i) => (
          <div key={step.id} className={cn(i < runSteps.length - 1 && "pb-4")}>
            <RunStepCard step={step} />
          </div>
        ))}
      </div>
    </>
  )
}
