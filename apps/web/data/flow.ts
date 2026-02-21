import type { Edge, Node } from "@xyflow/react"

import type { ScreenshotNodeData } from "@/types/flow"

export const initialNodes: Node<ScreenshotNodeData>[] = [
  {
    id: "landing",
    type: "screenshot",
    position: { x: 100, y: 200 },
    data: {
      label: "Landing Page",
      url: "https://testa.run",
      status: "passed",
      step: 1,
      duration: "1.2s",
      isMain: true,
      imageSrc: "/screenshots/landing.png",
      sourceHandle: { side: "right", imageY: 0.06 },
    },
  },
  {
    id: "login",
    type: "screenshot",
    position: { x: 760, y: 60 },
    data: {
      label: "Login Flow",
      url: "https://testa.run/login",
      status: "passed",
      step: 2,
      duration: "0.8s",
      imageSrc: "/screenshots/login.png",
      sourceHandle: { side: "right", imageY: 0.94 },
    },
  },
  {
    id: "dashboard",
    type: "screenshot",
    position: { x: 1460, y: 220 },
    data: {
      label: "User Dashboard",
      url: "https://testa.run/dashboard",
      status: "running",
      step: 3,
      isLarge: true,
      imageSrc: "/screenshots/dashboard.png",
    },
  },
]

/** Derived lookup: node data by id */
export const nodesById = Object.fromEntries(
  initialNodes.map((n) => [n.id, n])
) as Record<string, (typeof initialNodes)[number]>

/** Derived lookup: image + label by node id (for thumbnails in lists) */
export const nodeMediaById = Object.fromEntries(
  initialNodes.map((n) => [n.id, { imageSrc: n.data.imageSrc, label: n.data.label }])
) as Record<string, { imageSrc?: string; label: string }>

export const initialEdges: Edge[] = [
  {
    id: "e-landing-login",
    source: "landing",
    target: "login",
    type: "spring",
    zIndex: 10,
    style: { stroke: "rgba(29,110,245,0.45)", strokeWidth: 2 },
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
    id: "e-login-dashboard",
    source: "login",
    target: "dashboard",
    type: "spring",
    zIndex: 10,
    style: { stroke: "rgba(29,110,245,0.45)", strokeWidth: 2 },
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
