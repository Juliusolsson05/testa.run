import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
} from 'lucide-react'

const steps = [
  { num: '01', title: 'Enter your URL', desc: 'Paste any web app URL and describe what a user would do — sign up, buy something, reset a password.' },
  { num: '02', title: 'The agent takes over', desc: 'It opens a real browser, clicks through your flow step by step, and probes for security gaps along the way.' },
  { num: '03', title: 'You get the report', desc: 'Every broken flow and vulnerability, ranked by severity. Screenshots, network traces, reproduction steps included.' },
]

const pricing = [
  { name: 'Starter', price: '$0', period: '/mo', desc: 'For side projects and personal apps.', features: ['5 test runs / month', '1 user journey', 'Basic findings report', 'Community support'], cta: 'Start free', highlighted: false },
  { name: 'Pro', price: '$49', period: '/mo', desc: 'For teams that ship weekly.', features: ['Unlimited test runs', '10 user journeys', 'Security scanning', 'Screenshot evidence', 'API monitoring', 'Priority support'], cta: 'Start free trial', highlighted: true },
  { name: 'Enterprise', price: 'Custom', period: '', desc: 'For regulated industries and large orgs.', features: ['Everything in Pro', 'Unlimited journeys', 'SSO & audit logs', 'Custom integrations', 'Dedicated support', 'SLA guarantee'], cta: 'Contact us', highlighted: false },
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
      <path
        d="M58 162c-23 0-41-18-41-40s18-40 41-40c8 0 15 2 21 6 7-26 31-45 59-45 21 0 40 11 50 28 7-5 16-8 25-8 25 0 45 20 45 45v2h5c23 0 42 19 42 42s-19 42-42 42H96c-21 0-38-17-38-38 0-2 0-4 0-6z"
        fill="#93c5fd"
        fillOpacity="0.28"
        filter={`url(#${id}-soft)`}
      />
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
      <div className="absolute inset-0 bg-[radial-gradient(1200px_380px_at_50%_0%,rgba(191,219,254,0.45),transparent_72%)]" />
      {isTop ? (
        <>
          <CloudShape id="c1-top" className="absolute w-[460px] left-[-110px] top-[-8px] opacity-34 blur-[2px] cloud-1" />
          <CloudShape id="c2-top" className="absolute w-[420px] right-[-92px] top-[-2px] opacity-30 blur-[2.5px] cloud-2" />
          <CloudShape id="c3-top" className="absolute w-[350px] left-[35%] top-[-28px] opacity-32 blur-[2px] cloud-3" />
          <CloudShape id="c4-top" className="absolute w-[220px] left-[8%] top-[26px] opacity-22 blur-[3px]" />
          <CloudShape id="c5-top" className="absolute w-[230px] right-[8%] top-[24px] opacity-20 blur-[3px]" />
          <CloudShape id="c6-top" className="absolute w-[180px] left-[24%] top-[38px] opacity-16 blur-[3.5px]" />
          <CloudShape id="c7-top" className="absolute w-[170px] right-[24%] top-[36px] opacity-16 blur-[3.5px]" />
        </>
      ) : (
        <>
          <CloudShape id="c1-bot" className="absolute w-[460px] right-[-110px] bottom-[-8px] opacity-34 blur-[2px] cloud-2" />
          <CloudShape id="c2-bot" className="absolute w-[420px] left-[-92px] bottom-[-2px] opacity-30 blur-[2.5px] cloud-1" />
          <CloudShape id="c3-bot" className="absolute w-[350px] left-[35%] bottom-[16px] opacity-32 blur-[2px] cloud-4" />
          <CloudShape id="c4-bot" className="absolute w-[220px] left-[8%] bottom-[20px] opacity-20 blur-[3px] cloud-5" />
          <CloudShape id="c5-bot" className="absolute w-[230px] right-[8%] bottom-[22px] opacity-22 blur-[3px]" />
          <CloudShape id="c6-bot" className="absolute w-[180px] left-[24%] bottom-[34px] opacity-16 blur-[3.5px]" />
          <CloudShape id="c7-bot" className="absolute w-[170px] right-[24%] bottom-[32px] opacity-16 blur-[3.5px]" />
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
    <div className="relative text-gray-900 font-sans antialiased overflow-x-hidden [&_*]:font-normal">
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.14]" style={{ backgroundImage: 'radial-gradient(circle, #64748b 0.9px, transparent 0.9px)', backgroundSize: '20px 20px' }} />
      <div className="relative z-[2]">

      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <Link href="/" className="text-sm tracking-tight text-gray-900">
          testa<span className="text-brand">.run</span>
        </Link>
        <ul className="hidden md:flex items-center gap-8 list-none">
          <li><a href="#how-it-works" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">How it works</a></li>
          <li><a href="#pricing" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Pricing</a></li>
        </ul>
        <Button size="sm" asChild>
          <a href="#pricing">Get started</a>
        </Button>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-44 pb-28 text-center">
        <CloudBackground position="top" />
        <div className="max-w-3xl mx-auto px-6">
          <Badge variant="outline" className="mb-5 text-brand border-brand/20 bg-brand/5">
            Now in early access
          </Badge>
          <h1 className="text-5xl md:text-6xl tracking-tight leading-[1.1] mb-5">
            AI based{' '}
            <span className="text-brand">QA & Security</span>{' '}
            testing that works
          </h1>
          <p className="text-[16px] text-gray-500 leading-relaxed max-w-md mx-auto mb-8">
            Paste your URL. An agent clicks through your app like a real user,
            finds what’s broken, and flags security holes. You get the report.
          </p>

          {/* URL input CTA */}
          <div className="max-w-2xl mx-auto rounded-2xl bg-gray-900 px-6 py-5 flex items-center gap-3">
            <input
              type="url"
              aria-label="Website URL"
              placeholder="https://your-app.com"
              className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/50 focus:outline-none"
            />
            <div className="flex items-center">
              <Button size="icon" className="h-9 w-9 rounded-full bg-brand hover:bg-brand/90 text-white">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-[12px] text-gray-400 mt-4">Free to start. No credit card required.</p>
        </div>
      </section>

      {/* ── Logo band ── */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="text-center mb-6 px-6">
          <p className="text-[20px] text-gray-700 tracking-tight">Will be used by:</p>
          <p className="text-[14px] text-gray-400 mt-2 max-w-lg mx-auto leading-relaxed">
            Disclaimer: these companies are not using us at the moment, but our product is so good that they will soon be customers.
          </p>
        </div>
        <div className="logo-marquee w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className="logo-marquee-track py-3">
            {Array.from({ length: 4 }).map((_, setIdx) =>
              [
                { name: 'Lovable', logo: '/logos/lovable.svg' },
                { name: 'Vercel', logo: '/logos/vercel.svg' },
                { name: 'Stripe', logo: '/logos/stripe.svg' },
                { name: 'Notion', logo: '/logos/notion.svg' },
                { name: 'Linear', logo: '/logos/linear.svg' },
                { name: 'Supabase', logo: '/logos/supabase.svg' },
              ].map((company, i) => (
                <div key={`${setIdx}-${i}`} className="flex items-center gap-2.5 shrink-0 opacity-70 mx-7">
                  <Image src={company.logo} alt={company.name} width={24} height={24} className="w-6 h-6 object-contain" />
                  <span className="text-[15px] text-gray-800 tracking-tight">{company.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── What it does ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl tracking-tight leading-tight mb-4">
              You describe the journey.<br />The agent does everything else.
            </h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              Tell it “sign up, add an item to cart, and check out” — it opens a browser, runs every step,
              and probes for auth bypass, missing rate limits, and exposed data along the way.
              When it’s done, you get a ranked list of everything that’s wrong.
            </p>
            <ul className="space-y-3">
              {['No scripts to write or maintain', 'QA and security in one pass', 'Screenshots and traces on every finding'].map(item => (
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
          </div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl tracking-tight">
              Three steps. That’s it.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(step => (
              <div key={step.num} className="relative p-7 rounded-xl border border-gray-200 bg-gray-50/50">
                <span className="text-[42px] text-gray-100 absolute top-4 right-5">{step.num}</span>
                <h3 className="text-[15px] mb-2 relative z-10">{step.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl tracking-tight">
              Pick a plan
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
                  <h3 className="text-[15px] mb-1">{plan.name}</h3>
                  <p className="text-[12px] text-gray-500 mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-4xl">{plan.price}</span>
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

      {/* ── Final CTA ── */}
      <section className="relative py-28 text-center">
        <CloudBackground position="bottom" />
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl tracking-tight leading-tight mb-4">
            Your app has bugs you<br />don’t know about yet
          </h2>
          <p className="text-[15px] text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
            Paste a URL and find out in minutes. No setup, no scripts, no waiting.
          </p>
          <div className="max-w-2xl mx-auto rounded-2xl bg-gray-900 px-6 py-5 flex items-center gap-3">
            <input
              type="url"
              aria-label="Website URL"
              placeholder="https://your-app.com"
              className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/50 focus:outline-none"
            />
            <div className="flex items-center">
              <Button size="icon" className="h-9 w-9 rounded-full bg-brand hover:bg-brand/90 text-white">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link href="/" className="text-sm tracking-tight text-gray-900">
              testa<span className="text-brand">.run</span>
            </Link>
            <p className="text-[13px] text-gray-400 mt-1">QA and security testing that runs itself.</p>
          </div>
          <div className="flex gap-8 text-[13px] text-gray-500">
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Docs</a>
            <a href="#" className="hover:text-gray-900 transition-colors">GitHub</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Twitter</a>
            <a href="mailto:hello@testa.run" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-8 py-4 border-t border-gray-100">
          <span className="text-[12px] text-gray-400">&copy; 2026 testa.run</span>
        </div>
      </footer>

      </div>
    </div>
  )
}
