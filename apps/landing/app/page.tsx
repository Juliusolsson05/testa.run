import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import {
  Search,
  Shield,
  Camera,
  Zap,
  Globe,
  BarChart3,
  ArrowRight,
  Check,
} from 'lucide-react'

const stats = [
  { value: '50k+', label: 'Test runs completed' },
  { value: '12k+', label: 'Bugs detected' },
  { value: '3.2k', label: 'Security issues found' },
  { value: '89%', label: 'Faster than manual QA' },
]

const steps = [
  { num: '01', title: 'Point at your app', desc: 'Give us a URL and describe the user journey you want tested — sign up, checkout, onboarding, anything.' },
  { num: '02', title: 'Agent runs your journey', desc: 'Our AI agent navigates your app like a real user, executing every step while probing for security weaknesses.' },
  { num: '03', title: 'Get structured findings', desc: 'Receive a severity-ranked report with screenshots, network traces, and reproduction steps for every issue found.' },
]

const features = [
  { icon: Search, title: 'End-to-end journey testing', desc: 'The agent executes real user flows — login, search, checkout — and validates every step automatically.' },
  { icon: Shield, title: 'Security vulnerability scanning', desc: 'Detects auth bypass, rate limit gaps, exposed endpoints, and data leaks in the same test run.' },
  { icon: Camera, title: 'Screenshot evidence', desc: 'Every action is captured with full-page screenshots so you can see exactly what the agent saw.' },
  { icon: Zap, title: 'Lightning fast execution', desc: 'Complete test suites run in minutes, not hours. Get results before your deploy finishes.' },
  { icon: Globe, title: 'API & network monitoring', desc: 'Catches 4xx/5xx errors, slow responses, and failed requests across every endpoint your app touches.' },
  { icon: BarChart3, title: 'Severity-ranked reports', desc: 'Findings are categorized from Critical to Low with full traces, so you fix what matters first.' },
]

const findings = [
  { sev: 'Critical', variant: 'destructive' as const, title: 'Login form returns 500 on submit', desc: 'POST /api/auth/login → 500 Internal Server Error', tag: 'step 4' },
  { sev: 'High', variant: 'default' as const, title: 'Account enumeration via distinct error codes', desc: '404 USER_NOT_FOUND vs 403 ACCOUNT_NOT_ACTIVE', tag: 'security' },
  { sev: 'High', variant: 'default' as const, title: 'No rate limit on authentication endpoint', desc: '5 req/s accepted — no throttling or lockout triggered', tag: 'security' },
  { sev: 'Medium', variant: 'secondary' as const, title: 'Premium content accessible without valid session', desc: 'GET /api/listings returns 50 items with no auth token', tag: 'step 6' },
]

const pricing = [
  { name: 'Starter', price: '$0', period: '/mo', desc: 'For solo developers and side projects.', features: ['5 test runs / month', '1 user journey', 'Basic findings report', 'Community support'], cta: 'Start free', highlighted: false },
  { name: 'Pro', price: '$49', period: '/mo', desc: 'For teams shipping fast and breaking nothing.', features: ['Unlimited test runs', '10 user journeys', 'Security scanning included', 'Screenshot evidence', 'API monitoring', 'Priority support'], cta: 'Start free trial', highlighted: true },
  { name: 'Enterprise', price: 'Custom', period: '', desc: 'For organizations with compliance needs.', features: ['Everything in Pro', 'Unlimited journeys', 'SSO & audit logs', 'Custom integrations', 'Dedicated support', 'SLA guarantee'], cta: 'Contact us', highlighted: false },
]

function CloudShape({ className, id }: { className?: string; id: string }) {
  return (
    <svg viewBox="0 0 420 220" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#bfdbfe" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.35" />
        </linearGradient>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* soft glow layer for depth */}
      <path
        d="M58 162c-23 0-41-18-41-40s18-40 41-40c8 0 15 2 21 6 7-26 31-45 59-45 21 0 40 11 50 28 7-5 16-8 25-8 25 0 45 20 45 45v2h5c23 0 42 19 42 42s-19 42-42 42H96c-21 0-38-17-38-38 0-2 0-4 0-6z"
        fill="#93c5fd"
        fillOpacity="0.28"
        filter={`url(#${id}-soft)`}
      />

      {/* main cloud */}
      <path
        d="M58 162c-23 0-41-18-41-40s18-40 41-40c8 0 15 2 21 6 7-26 31-45 59-45 21 0 40 11 50 28 7-5 16-8 25-8 25 0 45 20 45 45v2h5c23 0 42 19 42 42s-19 42-42 42H96c-21 0-38-17-38-38 0-2 0-4 0-6z"
        fill={`url(#${id}-fill)`}
      />
    </svg>
  )
}

function CloudBackground({ position }: { position: 'top' | 'bottom' }) {
  const isTop = position === 'top'
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* subtle ambient wash behind shapes */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_380px_at_50%_0%,rgba(191,219,254,0.45),transparent_72%)]" />

      {isTop ? (
        <>
          <CloudShape id="c1-top" className="absolute w-[640px] left-[-150px] top-[-88px] opacity-58 blur-[1.5px]" />
          <CloudShape id="c2-top" className="absolute w-[560px] right-[-120px] top-[-56px] opacity-52 blur-[2px]" />
          <CloudShape id="c3-top" className="absolute w-[470px] left-[34%] top-[2px] opacity-46 blur-[2.5px]" />
          <CloudShape id="c4-top" className="absolute w-[300px] left-[8%] top-[30px] opacity-36 blur-[3px]" />
          <CloudShape id="c5-top" className="absolute w-[320px] right-[8%] top-[28px] opacity-34 blur-[3px]" />
        </>
      ) : (
        <>
          <CloudShape id="c1-bot" className="absolute w-[640px] right-[-150px] bottom-[-88px] opacity-58 blur-[1.5px]" />
          <CloudShape id="c2-bot" className="absolute w-[560px] left-[-120px] bottom-[-56px] opacity-52 blur-[2px]" />
          <CloudShape id="c3-bot" className="absolute w-[470px] left-[34%] bottom-[2px] opacity-46 blur-[2.5px]" />
          <CloudShape id="c4-bot" className="absolute w-[300px] left-[8%] bottom-[28px] opacity-34 blur-[3px]" />
          <CloudShape id="c5-bot" className="absolute w-[320px] right-[8%] bottom-[30px] opacity-36 blur-[3px]" />
        </>
      )}

      <div
        className="absolute left-0 right-0 h-44"
        style={{
          [isTop ? 'bottom' : 'top']: 0,
          background: isTop
            ? 'linear-gradient(to bottom, transparent, white 82%)'
            : 'linear-gradient(to top, transparent, white 82%)',
        }}
      />
    </div>
  )
}

export default function Home() {
  return (
    <div className="text-gray-900 font-sans antialiased overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <a href="/" className="text-sm font-bold tracking-tight text-gray-900">
          testa<span className="text-brand">.run</span>
        </a>
        <ul className="hidden md:flex items-center gap-8 list-none">
          <li><a href="#features" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Features</a></li>
          <li><a href="#how-it-works" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">How it works</a></li>
          <li><a href="#pricing" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Pricing</a></li>
          <li><a href="#findings" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Output</a></li>
        </ul>
        <Button size="sm" asChild>
          <a href="#pricing">Get started</a>
        </Button>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 text-center">
        <CloudBackground position="top" />
        <div className="max-w-3xl mx-auto px-6">
          <Badge variant="outline" className="mb-5 text-brand border-brand/20 bg-brand/5">
            Now in early access
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Your ultimate solution for{' '}
            <span className="text-brand">QA & Security</span>{' '}
            testing
          </h1>
          <p className="text-[16px] text-gray-500 leading-relaxed max-w-lg mx-auto mb-8">
            An AI agent runs your user journeys on every deploy, detects broken flows,
            and surfaces security vulnerabilities — with full evidence on every finding.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button size="lg" asChild>
              <a href="#pricing">Get started free</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="max-w-3xl mx-auto mt-16 grid grid-cols-4 gap-6 px-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-[12px] text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Trust logos */}
        <div className="max-w-2xl mx-auto mt-14 flex items-center justify-center gap-10 opacity-40">
          {['Vercel', 'Stripe', 'Notion', 'Linear', 'Supabase'].map(name => (
            <span key={name} className="text-[13px] font-semibold text-gray-400 tracking-wide">{name}</span>
          ))}
        </div>
      </section>

      {/* ── Platform section ─────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[12px] font-semibold text-brand uppercase tracking-[0.15em] mb-3">The platform</p>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight mb-4">
              AI-powered testing<br />designed for modern teams
            </h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              Stop writing flaky test scripts. Our agent understands your product, navigates it
              like a real user, and catches both functional bugs and security holes — all in one run.
            </p>
            <ul className="space-y-3">
              {['No test scripts to write or maintain', 'Runs on every deploy automatically', 'Security + QA in a single pass'].map(item => (
                <li key={item} className="flex items-center gap-3 text-[14px] text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg shadow-gray-200/50">
              <Image
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=85"
                alt="Developer working"
                width={800}
                height={500}
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white rounded-xl border border-gray-200 shadow-lg px-5 py-3">
              <div className="text-[11px] text-gray-400 mb-1">Issues found this week</div>
              <div className="text-2xl font-bold text-gray-900">142</div>
              <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <ArrowRight className="w-3 h-3 -rotate-45" /> 23% from last week
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ── How it works ─────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-[12px] font-semibold text-brand uppercase tracking-[0.15em] mb-3">How it works</p>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Test your app in 3 steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(step => (
              <div key={step.num} className="relative p-7 rounded-xl border border-gray-200 bg-gray-50/50">
                <span className="text-[42px] font-extrabold text-gray-100 absolute top-4 right-5">{step.num}</span>
                <h3 className="text-[15px] font-bold mb-2 relative z-10">{step.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-[12px] font-semibold text-brand uppercase tracking-[0.15em] mb-3">Features</p>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Features that set us apart
            </h2>
            <p className="text-[15px] text-gray-500 mt-3 max-w-md mx-auto">
              Everything you need to ship confidently — functional QA and security testing in one platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(f => (
              <Card key={f.title} className="border-gray-200 shadow-none hover:shadow-md hover:border-gray-300 transition-all">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-brand" />
                  </div>
                  <h3 className="text-[14px] font-bold mb-2">{f.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ── Findings ─────────────────────────────────────── */}
      <section id="findings" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-10">
            <p className="text-[12px] font-semibold text-brand uppercase tracking-[0.15em] mb-3">Sample output</p>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Structured findings, with full evidence
            </h2>
            <p className="text-[15px] text-gray-500 mt-3 max-w-md mx-auto">
              Every result includes severity, the step that triggered it, and the exact trace.
            </p>
          </div>
          <Card className="max-w-3xl mx-auto">
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

      {/* ── Pricing ──────────────────────────────────────── */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-[12px] font-semibold text-brand uppercase tracking-[0.15em] mb-3">Pricing</p>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Flexible plans for every team
            </h2>
            <p className="text-[15px] text-gray-500 mt-3">
              Start free. Upgrade when you need more.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricing.map(plan => (
              <Card
                key={plan.name}
                className={`relative ${plan.highlighted ? 'border-brand shadow-lg shadow-brand/10' : 'border-gray-200 shadow-none'}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-brand text-white border-0">Most popular</Badge>
                  </div>
                )}
                <CardContent className="p-7">
                  <h3 className="text-[15px] font-bold mb-1">{plan.name}</h3>
                  <p className="text-[12px] text-gray-500 mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    {plan.period && <span className="text-[13px] text-gray-400">{plan.period}</span>}
                  </div>
                  <Button
                    className="w-full mb-5"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    asChild
                  >
                    <a href={plan.name === 'Enterprise' ? 'mailto:hello@testa.run' : '#'}>{plan.cta}</a>
                  </Button>
                  <ul className="space-y-2.5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-[13px] text-gray-600">
                        <Check className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="relative py-28 text-center">
        <CloudBackground position="bottom" />
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Ship with confidence —<br />try testa.run now
          </h2>
          <p className="text-[15px] text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
            Find bugs and security issues before your users do.
            Start testing in minutes with zero configuration.
          </p>
          <Button size="lg" asChild>
            <a href="#pricing">Get started free</a>
          </Button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <a href="/" className="text-sm font-bold tracking-tight text-gray-900">
              testa<span className="text-brand">.run</span>
            </a>
            <p className="text-[12px] text-gray-400 mt-2 leading-relaxed">
              Autonomous QA & security testing for modern teams.
            </p>
          </div>
          <div>
            <h4 className="text-[12px] font-semibold text-gray-900 uppercase tracking-[0.1em] mb-3">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Changelog', 'Docs'].map(item => (
                <li key={item}><a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-semibold text-gray-900 uppercase tracking-[0.1em] mb-3">Company</h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                <li key={item}><a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-semibold text-gray-900 uppercase tracking-[0.1em] mb-3">Legal</h4>
            <ul className="space-y-2">
              {['Privacy', 'Terms', 'Security'].map(item => (
                <li key={item}><a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-8 py-5 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[12px] text-gray-400">&copy; 2026 testa.run. All rights reserved.</span>
          <div className="flex gap-4">
            {['Twitter', 'GitHub', 'Discord'].map(s => (
              <a key={s} href="#" className="text-[12px] text-gray-400 hover:text-gray-900 transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
