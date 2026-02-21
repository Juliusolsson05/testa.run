import { LegalPage } from '@/app/components/LegalPage'

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="2026-02-21">
      <section><h2 className="text-lg text-gray-900 mb-2">1. Controller</h2><p>For personal data processed through testa.run, the service operator is reachable at testarun@gmail.com.</p></section>
      <section><h2 className="text-lg text-gray-900 mb-2">2. Data we collect</h2><ul className="list-disc pl-5 space-y-1"><li>Account data (name, email, workspace details)</li><li>Service usage data (runs, logs, diagnostics, report metadata)</li><li>Support/contact data sent through forms or email</li><li>Billing metadata from payment processors</li></ul></section>
      <section><h2 className="text-lg text-gray-900 mb-2">3. Why we process data</h2><ul className="list-disc pl-5 space-y-1"><li>Provide the core QA and security testing service</li><li>Secure the platform and prevent abuse</li><li>Respond to support and legal requests</li><li>Maintain, improve, and troubleshoot reliability</li></ul></section>
      <section><h2 className="text-lg text-gray-900 mb-2">4. Legal bases</h2><p>We process personal data based on contract performance, legitimate interests (security/operations), legal obligations, and consent where required.</p></section>
      <section><h2 className="text-lg text-gray-900 mb-2">5. Data retention</h2><p>We retain data only as long as needed for service delivery, security, legal compliance, and legitimate business records.</p></section>
      <section><h2 className="text-lg text-gray-900 mb-2">6. Sharing and subprocessors</h2><p>We use vetted subprocessors for infrastructure, communications, and analytics. See the Subprocessors page for current categories and purposes.</p></section>
      <section><h2 className="text-lg text-gray-900 mb-2">7. International transfers</h2><p>Where data is transferred across borders, we use appropriate safeguards such as contractual protections and vendor security controls.</p></section>
      <section><h2 className="text-lg text-gray-900 mb-2">8. Your rights</h2><p>Depending on your jurisdiction, you may request access, correction, deletion, restriction, objection, and portability. Email testarun@gmail.com to submit requests.</p></section>
      <section><h2 className="text-lg text-gray-900 mb-2">9. Contact</h2><p>Privacy inquiries: testarun@gmail.com</p></section>
    </LegalPage>
  )
}
