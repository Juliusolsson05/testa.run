import type { NodeStatus } from "@/types/domain"

export type ScreenshotNodeData = {
  label: string
  url: string
  status: NodeStatus
  step: number
  imageSrc?: string
  duration?: string
  isMain?: boolean
  isLarge?: boolean
  sourceHandle?: { side: "left" | "right"; imageY: number }
}
