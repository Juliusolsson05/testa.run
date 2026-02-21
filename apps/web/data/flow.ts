import type { Edge, Node } from "@xyflow/react"

import type { ScreenshotNodeData, NodeStepMeta } from "@/types/flow"

export const nodeStepMap: Record<string, NodeStepMeta> = {
  "1": { step: 1, label: "Landing" },
  "2": { step: 2, label: "Login" },
  "3": { step: 3, label: "Dashboard" },
}

export const initialNodes: Node<ScreenshotNodeData>[] = [
  {
    id: "1",
    type: "screenshot",
    position: { x: 100, y: 200 },
    data: {
      label: "Landing Page",
      url: "https://testa.run",
      status: "passed",
      step: 1,
      duration: "1.2s",
      isMain: true,
      imageSrc: "/screenshots/landing.svg",
    },
  },
  {
    id: "2",
    type: "screenshot",
    position: { x: 760, y: 60 },
    data: {
      label: "Login Flow",
      url: "https://testa.run/login",
      status: "passed",
      step: 2,
      duration: "0.8s",
      imageSrc: "/screenshots/login.svg",
    },
  },
  {
    id: "3",
    type: "screenshot",
    position: { x: 1460, y: 220 },
    data: {
      label: "User Dashboard",
      url: "https://testa.run/dashboard",
      status: "running",
      step: 3,
      isLarge: true,
      imageSrc: "/screenshots/dashboard.svg",
    },
  },
]

export const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "spring",
    zIndex: 10,
    style: { stroke: "rgba(37,99,235,0.45)", strokeWidth: 2 },
    label: 'Click "Get Started"',
    labelStyle: {
      fill: "#1D4ED8",
      fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
      fontSize: 11,
    },
    labelBgStyle: { fill: "rgba(255,255,255,0.88)" },
    labelBgPadding: [6, 8],
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "spring",
    zIndex: 10,
    style: { stroke: "rgba(37,99,235,0.45)", strokeWidth: 2 },
    label: "Submit credentials",
    labelStyle: {
      fill: "#1D4ED8",
      fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
      fontSize: 11,
    },
    labelBgStyle: { fill: "rgba(255,255,255,0.88)" },
    labelBgPadding: [6, 8],
  },
]
