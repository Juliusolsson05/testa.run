import { Breadcrumbs } from "@/components/workspace/Breadcrumbs"
import { IssueCard } from "@/components/workspace/IssueCard"
import { issues } from "@/data/issues"

export default function IssuesPage() {
  const open = issues.filter((i) => i.status === "open")
  const resolved = issues.filter((i) => i.status === "resolved")

  return (
    <>
      <Breadcrumbs items={[
        { label: "Runs", href: "/" },
        { label: "TimeEdit test #1", href: "/workspace" },
        { label: "Issues" },
      ]} />
      <h1 className="mb-8 text-[22px] font-bold tracking-tight text-[#1a2a33]">Issues</h1>

      {/* Open */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#4a7ab5]">Open</span>
          <span className="rounded bg-[#1d6ef5] px-1.5 py-0.5 text-[10px] font-bold text-white">{open.length}</span>
        </div>
        <div className="flex flex-col gap-3">
          {open.map((issue) => (
            <IssueCard key={issue.id} issue={issue} variant="open" />
          ))}
        </div>
      </div>

      {/* Resolved */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#4a7ab5]">Resolved</span>
          <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{resolved.length}</span>
        </div>
        <div className="flex flex-col gap-3">
          {resolved.map((issue) => (
            <IssueCard key={issue.id} issue={issue} variant="resolved" />
          ))}
        </div>
      </div>
    </>
  )
}
