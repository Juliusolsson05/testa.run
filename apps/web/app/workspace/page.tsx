import Link from "next/link"

export default function WorkspaceRoute() {
  return (
    <main className="flex h-dvh items-center justify-center bg-app-bg p-6">
      <div className="max-w-md rounded border border-ui-border bg-white p-5 text-sm text-ui-muted">
        No run selected. Go back to <Link href="/" className="font-medium text-[#1d6ef5]">runs</Link> and open one.
      </div>
    </main>
  )
}
