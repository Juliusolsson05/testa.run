import Link from 'next/link'
import { LegalPage } from '@/app/components/LegalPage'

export default function CookiePreferencesPage() {
  return (
    <LegalPage title="Cookie Preferences" updated="2026-02-21">
      <section><h2 className="text-lg text-gray-900 mb-2">Manage cookie consent</h2><p>Necessary cookies are always active for security and core functionality. Optional categories can be managed from the consent banner.</p></section>
      <section><p>If the banner is not visible, clear site cookies in your browser and reload, or revisit this page after deployment of the persistent settings panel.</p></section>
      <section><p>See full policy: <Link href="/cookies" className="text-brand">Cookie Policy</Link>.</p></section>
    </LegalPage>
  )
}
