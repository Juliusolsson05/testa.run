export type ScreenshotNodeData = {
  label: string
  url: string
  status: "passed" | "running" | "pending"
  step: number
  imageSrc?: string
  duration?: string
  isMain?: boolean
  isLarge?: boolean
  // Where the outgoing edge handle sits on this node.
  // side: which edge of the node. imageY: 0–1 relative to the screenshot image height.
  sourceHandle?: { side: "left" | "right"; imageY: number }
}

export type NodeStepMeta = {
  step: number
  label: string
}
