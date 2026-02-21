'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  CONSENT_COOKIE_NAME,
  cookieStringForConsent,
  makeConsent,
  parseConsent,
  type CookieConsent,
} from '@/lib/cookie-consent'

function getConsent(): CookieConsent | null {
  const raw = document.cookie
    .split('; ')
    .find((p) => p.startsWith(`${CONSENT_COOKIE_NAME}=`))
    ?.split('=')
    .slice(1)
    .join('=')
  return parseConsent(raw ?? null)
}

export function CookieConsentBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(!getConsent())
  }, [])

  const save = (consent: CookieConsent) => {
    document.cookie = cookieStringForConsent(consent)
    window.dispatchEvent(new CustomEvent('tr:consent-changed', { detail: consent }))
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-3 md:p-5">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-[13px] text-gray-600 leading-relaxed max-w-xl">
            We use essential cookies for security and functionality. Optional analytics cookies are only set with your consent.
            <a href="/cookies" className="text-brand ml-1">Cookie Policy</a>
          </p>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" onClick={() => save(makeConsent({ analytics: false, marketing: false }))}>
              Reject
            </Button>
            <Button size="sm" onClick={() => save(makeConsent({ analytics: true, marketing: true }))}>
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
