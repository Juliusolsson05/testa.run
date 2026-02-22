import { cn } from "@/lib/utils"

export function StatSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn("px-8 py-4", className)}>
      <div className="h-2.5 w-16 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-8 w-12 animate-pulse rounded bg-slate-300" />
    </div>
  )
}
