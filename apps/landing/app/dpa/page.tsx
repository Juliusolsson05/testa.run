import { LegalPage } from '@/app/components/LegalPage'

export default function DpaPage() {
  return (
    <LegalPage title="Data Processing Addendum (DPA)" updated="2026-02-21">
      <section><h2 className="text-lg text-gray-900 mb-2">1. Parties and roles</h2><p>When customers use testa.run to process personal data in test workflows, the customer acts as Controller and testa.run acts as Processor.</p></section>
      <section><h2 className="text-lg text-gray-900 mb-2">2. Processing details</h2><p>Processing includes receipt, storage, analysis, and reporting of data submitted through customer-configured test runs.</p></section>
      <section><h2 className="text-lg text-gray-900 mb-2">3. Security measures</h2><p>We apply technical and organizational controls including access limitation, encryption in transit, environment separation, and audit logging.</p></section>
      <section><h2 className="text-lg text-gray-900 mb-2">4. Subprocessors</h2><p>Customers authorize use of subprocessors listed on the Subprocessors page. We require contractual safeguards from each subprocessor.</p></section>
      <section><h2 className="text-lg text-gray-900 mb-2">5. Assistance and incidents</h2><p>We assist with data subject rights requests and notify customers of confirmed security incidents affecting customer data without undue delay.</p></section>
      <section><h2 className="text-lg text-gray-900 mb-2">6. Deletion and return</h2><p>On termination, customer data is deleted or returned according to retention settings and legal obligations.</p></section>
      <section><h2 className="text-lg text-gray-900 mb-2">7. Contact</h2><p>To request a signed DPA, email testarun@gmail.com.</p></section>
    </LegalPage>
  )
}
