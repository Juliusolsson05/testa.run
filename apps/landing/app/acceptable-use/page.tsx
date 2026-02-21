import { LegalPage } from '@/app/components/LegalPage'

export default function AcceptableUsePage() {
  return (
    <LegalPage title="Acceptable Use Policy" updated="2026-02-21">
      <section><h2 className="text-lg text-gray-900 mb-2">Permitted use</h2><p>Use testa.run only for lawful QA and security testing of systems you own or are explicitly authorized to assess.</p></section>
      <section><h2 className="text-lg text-gray-900 mb-2">Prohibited activities</h2><ul className="list-disc pl-5 space-y-1"><li>Unauthorized scanning, exploitation, or data extraction.</li><li>Service disruption, denial-of-service, or abuse attempts.</li><li>Malware delivery or malicious automation.</li><li>Attempts to bypass platform safeguards or rate limits.</li></ul></section>
      <section><h2 className="text-lg text-gray-900 mb-2">Enforcement</h2><p>We may suspend or terminate access for violations and cooperate with lawful requests from competent authorities.</p></section>
      <section><p>Report abuse: testarun@gmail.com</p></section>
    </LegalPage>
  )
}
