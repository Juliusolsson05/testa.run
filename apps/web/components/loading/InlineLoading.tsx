"use client"

import { BlueCube } from "@/components/loading/BlueCube"

export function InlineLoading({
  label = "Loading…",
  cubeSize = 44,
  className = "",
}: {
  label?: string
  cubeSize?: number
  className?: string
}) {
  return (
    <div className={`flex w-full flex-col items-center justify-center gap-4 text-ui-muted ${className}`}>
      <BlueCube size={cubeSize} />
      <p className="text-sm">{label}</p>
    </div>
  )
}
