"use client"

import { Component, type ReactNode } from "react"

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error("Workspace render error", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#eff6ff]">
          <div className="rounded-none border border-[#c0d4ec] bg-white px-4 py-3 text-sm text-[#1d4ed8]">
            Something went wrong while rendering this workspace.
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
