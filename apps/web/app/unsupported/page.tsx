import Link from "next/link"
import { Monitor, ArrowRight } from "lucide-react"
import { OnboardingBackground } from "@/components/onboarding/OnboardingBackground"

export default function UnsupportedPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-white px-4 py-10">
      <OnboardingBackground />

      <section className="relative w-full max-w-lg rounded-2xl border border-ui-border bg-white p-7 shadow-[0_18px_50px_rgba(29,110,245,0.13)]">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#1d6ef5]">
          <Monitor className="h-3.5 w-3.5" />
          Desktop only
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-[#1a2a33]">Best viewed on a bigger screen</h1>
        <p className="mt-2 text-sm text-ui-muted">
          testa.run workspace is optimized for desktop/laptop right now. Please reopen this on a larger screen.
        </p>

        <div className="mt-6 rounded-xl border border-[#bfdbfe] bg-[#f8fbff] p-4 text-sm text-[#1a2a33]">
          Tip: use your laptop/desktop browser for the full flow canvas and run controls.
        </div>

        <Link
          href="https://testa.run"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded bg-[#1d6ef5] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1559d4]"
        >
          Go to landing page
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  )
}
