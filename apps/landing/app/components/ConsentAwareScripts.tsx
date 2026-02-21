'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { CONSENT_COOKIE_NAME, parseConsent, type CookieConsent } from '@/lib/cookie-consent'

function getConsent(): CookieConsent | null {
  const raw = document.cookie
    .split('; ')
    .find((p) => p.startsWith(`${CONSENT_COOKIE_NAME}=`))
    ?.split('=')
    .slice(1)
    .join('=')
  return parseConsent(raw ?? null)
}

export function ConsentAwareScripts() {
  const [consent, setConsent] = useState<CookieConsent | null>(null)

  useEffect(() => {
    setConsent(getConsent())
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CookieConsent>).detail
      setConsent(detail ?? getConsent())
    }
    window.addEventListener('tr:consent-changed', handler)
    return () => window.removeEventListener('tr:consent-changed', handler)
  }, [])

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <>
      {consent?.analytics && gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}
    </>
  )
}
