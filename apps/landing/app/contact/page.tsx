'use client'

import { useState } from 'react'
import { PageShell } from '@/app/components/SiteNav'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ ok?: boolean; error?: string } | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Something went wrong.')
      setResult({ ok: true })
    } catch (err: any) {
      setResult({ error: err?.message || 'Failed to send.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <section className="pt-24 pb-8 text-center bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl tracking-tight leading-[1.1] mb-3">Get in touch</h1>
          <p className="text-[15px] text-gray-500">We usually reply within one business day.</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          {result?.ok ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-900">Thanks for reaching out.</p>
              <p className="text-sm text-gray-500 mt-2">We'll get back to you shortly at the email you provided.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <input name="name" required placeholder="Your name" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
              <input name="email" type="email" required placeholder="you@company.com" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
              {/* Honeypot */}
              <input name="website" tabIndex={-1} autoComplete="off" className="absolute opacity-0 h-0 w-0" />
              <textarea name="message" required rows={5} placeholder="How can we help?" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
              <Button disabled={loading} className="w-full">{loading ? 'Sending…' : 'Send message'}</Button>
              {result?.error ? <p className="text-sm text-red-600 text-center">{result.error}</p> : null}
            </form>
          )}
        </div>
      </div>
    </PageShell>
  )
}
