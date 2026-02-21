import type { Metadata } from 'next'
import { Public_Sans } from 'next/font/google'
import './globals.css'
import { CookieConsentBanner } from './components/CookieConsentBanner'
import { ConsentAwareScripts } from './components/ConsentAwareScripts'

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'testa.run — Autonomous QA & Security Testing',
  description:
    'Point testa.run at your product. An AI agent navigates it, finds bugs, and reports security vulnerabilities — automatically, on every deploy.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={publicSans.variable}>
      <body>
        {children}
        <CookieConsentBanner />
        <ConsentAwareScripts />
      </body>
    </html>
  )
}
