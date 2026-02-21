export type ScreenshotNodeData = {
  label: string
  url: string
  status: "passed" | "running" | "pending"
  step: number
  imageSrc?: string
  duration?: string
  isMain?: boolean
  isLarge?: boolean
  sourceHandleOffset?: { top: number; left?: number }
}

export type NodeStepMeta = {
  step: number
  label: string
}
