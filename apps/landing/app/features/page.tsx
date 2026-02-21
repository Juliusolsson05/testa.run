import { Check, Shield, Eye, Zap, RefreshCw, Users } from 'lucide-react'
import { PageShell } from '@/app/components/SiteNav'

const features = [
  { icon: Zap, title: 'Real browser execution', desc: 'The agent opens a real browser, follows your journey step-by-step, and interacts like a user — no scripts needed.' },
  { icon: Shield, title: 'Security probing built in', desc: 'Auth bypass, access control gaps, rate limit abuse, and data exposure checks run alongside every QA pass.' },
  { icon: Eye, title: 'Evidence on every finding', desc: 'Screenshots, network traces, severity ratings, and reproduction steps so your team can fix issues immediately.' },
  { icon: RefreshCw, title: 'Regression detection', desc: 'Compare results across runs to catch newly introduced bugs before your users report them.' },
  { icon: Users, title: 'Team-ready output', desc: 'Share reports, assign findings, and route alerts to the right people through integrations.' },
  { icon: Check, title: 'No maintenance overhead', desc: 'Describe journeys in plain language. No brittle selectors, no test framework lock-in, no script rot.' },
]

export default function FeaturesPage() {
  return (
    <PageShell>
      <section className="pt-24 pb-8 text-center bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl tracking-tight leading-[1.1] mb-3">QA + security in one pass</h1>
          <p className="text-[15px] text-gray-500 max-w-xl mx-auto">Describe what users do. The agent executes it, finds what's broken, and flags vulnerabilities — automatically.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 md:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f) => (
            <article key={f.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-[17px] tracking-tight mb-2">{f.title}</h3>
              <p className="text-[14px] text-gray-600 leading-relaxed">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
