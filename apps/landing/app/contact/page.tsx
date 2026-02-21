'use client'

import { useState } from 'react'
import { SiteShell, PageHero, ContentCard } from '@/app/components/SiteShell'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setDone(null)
    setError(null)
    try {
      const payload = Object.fromEntries(formData.entries())
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Something went wrong.')
      setDone('Thanks — we received your message and will reply shortly.')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to send message.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SiteShell>
      <PageHero
        title="Contact testa.run"
        subtitle="Talk to sales, support, or security. We usually reply within one business day."
      />
      <ContentCard>
        <div className="grid md:grid-cols-2 gap-8">
          <form
            className="space-y-4"
            action={onSubmit}
          >
            <input name="name" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="Your name" />
            <input name="email" type="email" required className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="you@company.com" />
            <input name="company" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="Company (optional)" />
            <select name="topic" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white">
              <option value="sales">Sales</option>
              <option value="support">Support</option>
              <option value="security">Security report</option>
              <option value="partnership">Partnership</option>
            </select>
            <textarea name="message" required rows={6} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" placeholder="How can we help?" />
            <Button disabled={loading} className="w-full">{loading ? 'Sending…' : 'Send message'}</Button>
            {done ? <p className="text-sm text-green-700">{done}</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </form>

          <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-6">
            <h3 className="text-lg tracking-tight mb-3">Other ways to reach us</h3>
            <ul className="space-y-3 text-[14px] text-gray-600">
              <li><span className="text-gray-900">General:</span> hello@testa.run</li>
              <li><span className="text-gray-900">Security:</span> security@testa.run</li>
              <li><span className="text-gray-900">Support:</span> support@testa.run</li>
            </ul>
            <p className="text-[13px] text-gray-500 mt-5">
              For responsible vulnerability disclosure, include clear reproduction steps, impact, and screenshots/logs if possible.
            </p>
          </div>
        </div>
      </ContentCard>
    </SiteShell>
  )
}
