import Link from 'next/link'
import { Check } from 'lucide-react'
import { PageShell } from '@/app/components/SiteNav'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    desc: 'For solo devs validating core flows.',
    features: ['5 runs / month', '1 journey', 'Basic report', 'Email support'],
    cta: 'Start free',
    href: '/signup',
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mo',
    desc: 'For teams shipping weekly.',
    features: ['Unlimited runs', '10 journeys', 'Security scanning', 'Evidence reports', 'Priority support'],
    cta: 'Start free trial',
    href: '/signup',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For larger teams needing controls.',
    features: ['Everything in Pro', 'Unlimited journeys', 'SSO & audit logs', 'Dedicated support', 'SLA'],
    cta: 'Talk to us',
    href: '/contact',
  },
]

const faqs = [
  ['What counts as a run?', 'One full execution of a journey with all associated checks.'],
  ['Can I cancel anytime?', 'Yes. Monthly plans cancel instantly and stay active through the billing period.'],
  ['Do you offer annual pricing?', 'Yes — contact us for annual discounts.'],
  ['Is there a free trial for Pro?', 'Yes, 14 days with full access. No credit card to start.'],
]

export default function PricingPage() {
  return (
    <PageShell>
      <section className="pt-24 pb-8 text-center bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl tracking-tight leading-[1.1] mb-3">Simple pricing</h1>
          <p className="text-[15px] text-gray-500">Start free. Scale when you need more.</p>
        </div>
      </section>

      {/* Plans */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card key={p.name} className={`relative ${p.featured ? 'border-brand shadow-lg shadow-brand/10' : 'border-gray-200'}`}>
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-brand text-white border-0">Most popular</Badge>
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="text-lg tracking-tight">{p.name}</h3>
                <p className="text-sm text-gray-500 mt-1 mb-3">{p.desc}</p>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-4xl">{p.price}</span>
                  {p.period ? <span className="text-sm text-gray-400 mb-1">{p.period}</span> : null}
                </div>
                <ul className="space-y-2 mb-5">
                  {p.features.map((f) => (
                    <li key={f} className="text-sm text-gray-700 flex items-start gap-2">
                      <Check className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" variant={p.featured ? 'default' : 'outline'}>
                  <Link href={p.href}>{p.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-2xl tracking-tight mb-6 text-center">Questions</h2>
        <div className="space-y-3">
          {faqs.map(([q, a]) => (
            <div key={q} className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm text-gray-900">{q}</h3>
              <p className="text-sm text-gray-600 mt-1">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
