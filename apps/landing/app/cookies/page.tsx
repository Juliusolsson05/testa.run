import Link from 'next/link'
import { LegalPage } from '@/app/components/LegalPage'

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updated="2026-02-21">
      <section>
        <h2 className="text-lg text-gray-900 mb-2">1. What are cookies</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, keep you logged in, and understand how the site is used. Some cookies are set by us (first-party), while others are set by services we integrate with (third-party).</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">2. How testa.run uses cookies</h2>
        <p>testa.run is an automated QA and security testing platform. When you use the service, cookies support authentication, protect your session from cross-site attacks, remember your consent preferences, and (with your permission) help us understand how the product is used so we can improve it.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">3. Cookie categories</h2>

        <h3 className="text-[15px] text-gray-900 mt-4 mb-1">Strictly necessary</h3>
        <p className="mb-2">These cookies are required for core platform functionality. They cannot be disabled.</p>
        <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left">Cookie</th><th className="px-4 py-2 text-left">Purpose</th><th className="px-4 py-2 text-left">Duration</th><th className="px-4 py-2 text-left">Type</th></tr></thead>
            <tbody>
              <tr className="border-t border-gray-100"><td className="px-4 py-2">session_token</td><td className="px-4 py-2">Authenticates your logged-in session</td><td className="px-4 py-2">Session / 30 days</td><td className="px-4 py-2">First-party</td></tr>
              <tr className="border-t border-gray-100"><td className="px-4 py-2">csrf_token</td><td className="px-4 py-2">Prevents cross-site request forgery attacks</td><td className="px-4 py-2">Session</td><td className="px-4 py-2">First-party</td></tr>
              <tr className="border-t border-gray-100"><td className="px-4 py-2">tr_cookie_consent</td><td className="px-4 py-2">Stores your cookie consent preferences</td><td className="px-4 py-2">180 days</td><td className="px-4 py-2">First-party</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-[15px] text-gray-900 mt-4 mb-1">Analytics (optional)</h3>
        <p className="mb-2">These cookies help us measure product usage, identify performance bottlenecks, and improve the user experience. They are only set after you give consent.</p>
        <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left">Cookie</th><th className="px-4 py-2 text-left">Purpose</th><th className="px-4 py-2 text-left">Duration</th><th className="px-4 py-2 text-left">Provider</th></tr></thead>
            <tbody>
              <tr className="border-t border-gray-100"><td className="px-4 py-2">_ga</td><td className="px-4 py-2">Distinguishes unique visitors</td><td className="px-4 py-2">2 years</td><td className="px-4 py-2">Google Analytics</td></tr>
              <tr className="border-t border-gray-100"><td className="px-4 py-2">_ga_*</td><td className="px-4 py-2">Maintains session state</td><td className="px-4 py-2">2 years</td><td className="px-4 py-2">Google Analytics</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-[15px] text-gray-900 mt-4 mb-1">Marketing (optional)</h3>
        <p className="mb-2">These cookies measure advertising campaign effectiveness and attribution. Only set with consent.</p>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left">Cookie</th><th className="px-4 py-2 text-left">Purpose</th><th className="px-4 py-2 text-left">Duration</th><th className="px-4 py-2 text-left">Provider</th></tr></thead>
            <tbody>
              <tr className="border-t border-gray-100"><td className="px-4 py-2">_fbp</td><td className="px-4 py-2">Tracks visits across websites for ad targeting</td><td className="px-4 py-2">90 days</td><td className="px-4 py-2">Meta</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">4. Legal basis</h2>
        <p>Strictly necessary cookies are set based on our legitimate interest in providing a secure, functional service. Analytics and marketing cookies are set only after you provide affirmative consent through the cookie banner. We do not use cookie walls — declining optional cookies does not restrict access to the platform.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">5. Third-party cookies</h2>
        <p>When analytics or marketing cookies are enabled, third-party providers (Google, Meta) may set cookies on your device. These providers process data under their own privacy policies. We configure these services to anonymize IP addresses where supported and limit data sharing.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">6. Managing and withdrawing consent</h2>
        <p>You can change or withdraw your consent at any time:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Use our <Link href="/cookie-preferences" className="text-brand">Cookie Preferences</Link> page to update your choices</li>
          <li>Clear cookies through your browser settings (this will also remove your consent record, causing the banner to reappear)</li>
          <li>Use browser extensions that block third-party cookies or tracking scripts</li>
        </ul>
        <p className="mt-2">Withdrawing consent for optional cookies does not affect the lawfulness of processing that occurred before withdrawal.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">7. Consent versioning</h2>
        <p>If we materially change our cookie practices, we increment the consent version. This automatically re-prompts all visitors to review and accept the updated policy before optional cookies are set again.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">8. Data retention</h2>
        <p>Cookies persist for the durations listed in the tables above. Analytics data aggregated from cookies is retained for up to 26 months in Google Analytics before automatic deletion. We do not store raw cookie values on our servers beyond what is needed for session management.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">9. Updates to this policy</h2>
        <p>We update this Cookie Policy when our cookie usage changes. The "Last updated" date at the top reflects the most recent revision. Material changes trigger a new consent prompt.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">10. Contact</h2>
        <p>If you have questions about cookies on testa.run, contact us at testarun@gmail.com.</p>
      </section>
    </LegalPage>
  )
}
