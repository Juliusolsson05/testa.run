import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { BrowserInspector } from './components/AnimatedConcepts'

const findings = [
  { sev: 'Critical', variant: 'destructive' as const,  title: 'Login form returns 500 on submit',               desc: 'POST /api/auth/login → 500 Internal Server Error',         tag: 'step 4'   },
  { sev: 'High',     variant: 'default'    as const,   title: 'Account enumeration via distinct error codes',    desc: '404 USER_NOT_FOUND vs 403 ACCOUNT_NOT_ACTIVE',             tag: 'security' },
  { sev: 'High',     variant: 'default'    as const,   title: 'No rate limit on authentication endpoint',        desc: '5 req/s accepted — no throttling or lockout triggered',    tag: 'security' },
  { sev: 'Medium',   variant: 'secondary'  as const,   title: 'Premium content accessible without valid session', desc: 'GET /api/listings returns 50 items with no auth token',    tag: 'step 6'   },
]

const qaItems = [
  'End-to-end journey execution',
  'Assertion validation per step',
  'Screenshot evidence on every action',
  'Network error detection (4xx / 5xx)',
  'Console and JS exception monitoring',
  'Performance smoke testing',
  'Severity-ranked findings report',
]

const secItems = [
  'Auth bypass and error-based enumeration',
  'Missing rate limits on sensitive endpoints',
  'Unauthenticated access to gated data',
  'Hardcoded secrets in frontend JS',
  'Infrastructure misconfigurations',
  'Sensitive data in client-side errors',
  'Paywall and authorization bypasses',
]

export default function Home() {
  return (
    <div className="text-gray-900 font-sans antialiased">

      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-13 flex items-center justify-between px-10 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <a href="/" className="text-sm font-bold tracking-tight text-gray-900">
          testa<span className="text-brand">.run</span>
        </a>
        <ul className="hidden md:flex items-center gap-6 list-none">
          <li><a href="#capabilities" className="text-[13.5px] text-gray-500 hover:text-gray-900 transition-colors">What we test</a></li>
          <li><a href="#findings"     className="text-[13.5px] text-gray-500 hover:text-gray-900 transition-colors">Output</a></li>
          <li><a href="#access"       className="text-[13.5px] text-gray-500 hover:text-gray-900 transition-colors">Pricing</a></li>
        </ul>
        <Button size="sm" asChild>
          <a href="#access">Request access</a>
        </Button>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="flex h-screen">
        <div className="w-1/2 flex items-center px-16 pt-13 bg-white">
          <div className="max-w-sm">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-4">
              Find bugs and security issues before your users do
            </h1>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
              An AI agent runs your user journeys on every deploy, detects broken flows,
              and surfaces security vulnerabilities — with full evidence on every finding.
            </p>
            <div className="flex items-center gap-3">
              <Button asChild>
                <a href="#access">Request access</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#capabilities">See what we test</a>
              </Button>
            </div>
          </div>
        </div>
        <div className="w-1/2 relative overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=85"
            alt="Developer workspace"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ── Animated SVG concept ─────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-10 flex justify-center">
          <BrowserInspector />
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ── Capabilities ─────────────────────────────────── */}
      <section id="capabilities" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-10">
          <div className="grid grid-cols-[190px_1fr_1fr] overflow-hidden rounded-xl border border-gray-200">

            {/* Intro */}
            <div className="p-8 bg-gray-50 border-r border-gray-200 flex flex-col gap-3">
              <h2 className="text-[17px] font-bold leading-snug">
                Two layers of testing, one run
              </h2>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                The agent navigates your product like a real user while simultaneously
                probing for security weaknesses.
              </p>
            </div>

            {/* QA col */}
            <Card className="rounded-none border-0 shadow-none">
              <CardContent className="p-8">
                <p className="text-[13px] font-semibold text-gray-900 mb-2">Functional QA</p>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-5 pb-5 border-b border-gray-100">
                  Executes your user journeys against the live site and validates every step.
                </p>
                <ul className="divide-y divide-gray-100">
                  {qaItems.map(item => (
                    <li key={item} className="text-[13px] text-gray-500 py-2.5">{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Security col */}
            <Card className="rounded-none border-0 border-l border-gray-200 shadow-none">
              <CardContent className="p-8">
                <p className="text-[13px] font-semibold text-gray-900 mb-2">Security Testing</p>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-5 pb-5 border-b border-gray-100">
                  Probes for vulnerabilities in the same pass — no separate scan needed.
                </p>
                <ul className="divide-y divide-gray-100">
                  {secItems.map(item => (
                    <li key={item} className="text-[13px] text-gray-500 py-2.5">{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ── Findings ─────────────────────────────────────── */}
      <section id="findings" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-10">
          <h2 className="text-2xl font-bold mb-2">Structured findings, with full evidence</h2>
          <p className="text-[14px] text-gray-500 mb-7">
            Every result includes severity, the step that triggered it, and the exact trace.
          </p>

          <Card>
            {findings.map((f, i) => (
              <div key={f.title}>
                <div className="grid grid-cols-[100px_1fr_auto] gap-4 items-start px-5 py-4 hover:bg-gray-50 transition-colors">
                  <Badge
                    variant={f.variant}
                    className={
                      f.sev === 'High'   ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50' :
                      f.sev === 'Medium' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50'     : ''
                    }
                  >
                    {f.sev}
                  </Badge>
                  <div>
                    <p className="text-[13.5px] font-medium text-gray-900 mb-0.5">{f.title}</p>
                    <p className="text-[11.5px] text-gray-400 font-mono">{f.desc}</p>
                  </div>
                  <span className="text-[11px] text-gray-300 font-mono pt-1">{f.tag}</span>
                </div>
                {i < findings.length - 1 && <Separator />}
              </div>
            ))}
          </Card>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ── CTA ──────────────────────────────────────────── */}
      <section id="access" className="py-24 text-center px-10 bg-white">
        <h2 className="text-3xl font-extrabold tracking-tight mb-3">Ready to run your first test?</h2>
        <p className="text-[15px] text-gray-500 max-w-sm mx-auto mb-7 leading-relaxed">
          testa.run is in early access. Request an invite and we will be in touch.
        </p>
        <Button size="lg" asChild>
          <a href="mailto:hello@testa.run">Request access</a>
        </Button>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 w-full">
        <div className="max-w-5xl mx-auto px-10 py-6 flex items-center justify-between">
        <a href="/" className="text-[13.5px] font-bold text-gray-900">
          testa<span className="text-brand">.run</span>
        </a>
        <span className="text-xs text-gray-400">© 2026 testa.run</span>
        </div>
      </footer>

    </div>
  )
}
