import Link from "next/link"

export default function BillingCancelledPage() {
  return (
    <main className="flex h-dvh items-center justify-center bg-app-bg px-4">
      <div className="rounded border border-ui-border bg-white p-6 text-center">
        <h1 className="text-xl font-semibold text-[#1a2a33]">Checkout cancelled</h1>
        <p className="mt-2 text-sm text-ui-muted">No worries — you can continue on Starter.</p>
        <Link href="/" className="mt-4 inline-block rounded bg-[#1d6ef5] px-4 py-2 text-sm font-semibold text-white">Back to app</Link>
      </div>
    </main>
  )
}
