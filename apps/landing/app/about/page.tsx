import { PageShell } from '@/app/components/SiteNav'

export default function AboutPage() {
  return (
    <PageShell>
      <section className="pt-24 pb-8 text-center bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl tracking-tight leading-[1.1] mb-3">About testa.run</h1>
          <p className="text-[15px] text-gray-500">We help teams catch bugs and security issues before customers do.</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-5 text-[15px] text-gray-600 leading-relaxed">
          <p>
            Traditional QA is manual, slow, and disconnected from security. Teams ship fast but have no confidence in what they're releasing.
          </p>
          <p>
            testa.run closes that gap. You describe how users interact with your product, and an autonomous agent executes those flows in a real browser — while simultaneously probing for security weaknesses.
          </p>
          <p>
            The result is a ranked, evidence-backed report of everything that's broken or exposed. No scripts to maintain, no test frameworks to learn, no context-switching between QA and security tools.
          </p>
          <p>
            We optimize for clarity over noise: fewer false positives, stronger evidence, and faster remediation loops. Built for teams that ship weekly and want to stop choosing between speed and confidence.
          </p>
        </div>
      </div>
    </PageShell>
  )
}
