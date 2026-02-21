import { LegalPage } from '@/app/components/LegalPage'

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="2026-02-21">
      <section>
        <h2 className="text-lg text-gray-900 mb-2">1. Agreement and scope</h2>
        <p>These Terms of Service ("Terms") form a binding agreement between you ("Customer", "you") and testa.run ("we", "us"). They govern your access to and use of the testa.run platform, including the website, APIs, agent execution environment, reports, and all related services (collectively, the "Service").</p>
        <p className="mt-2">By creating an account, accessing the Service, or clicking "I agree", you accept these Terms. If you use the Service on behalf of an organization, you represent that you have authority to bind that organization to these Terms.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">2. Service description</h2>
        <p>testa.run provides automated QA and security testing for web applications. The Service works by:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Accepting a target URL and user journey description from you</li>
          <li>Executing that journey in a real, sandboxed browser environment</li>
          <li>Probing for functional regressions, authentication weaknesses, access control gaps, rate-limit issues, and data exposure</li>
          <li>Generating a severity-ranked report with screenshots, network traces, and reproduction steps</li>
        </ul>
        <p className="mt-2">The Service is a testing tool, not a guarantee of security. Reports reflect issues found during execution and do not constitute a comprehensive security audit or certification.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">3. Authorized testing only</h2>
        <p>You may only use the Service to test websites, applications, and systems that you own or have explicit written authorization to test. You are solely responsible for:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Verifying that you have legal permission to test each target</li>
          <li>Ensuring your testing activities comply with all applicable laws, regulations, and contractual obligations</li>
          <li>Any consequences resulting from tests you initiate, including impacts on third-party systems</li>
        </ul>
        <p className="mt-2">We do not verify your authorization to test any target. Unauthorized testing may violate computer fraud and abuse laws in your jurisdiction.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">4. Account registration and security</h2>
        <p>To use the Service, you must create an account with accurate information. You are responsible for:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activity that occurs under your account, whether authorized by you or not</li>
          <li>Notifying us immediately at testarun@gmail.com if you suspect unauthorized access</li>
        </ul>
        <p className="mt-2">We reserve the right to suspend accounts that show signs of compromise or unauthorized use.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">5. Plans, billing, and payment</h2>
        <p>The Service is available under free and paid plans as described on our pricing page. For paid plans:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Subscriptions are billed in advance on a monthly or annual cycle</li>
          <li>Plans renew automatically unless cancelled before the renewal date</li>
          <li>Fees are non-refundable except where required by applicable law</li>
          <li>We may change pricing with 30 days' notice; continued use after the change constitutes acceptance</li>
          <li>Unpaid invoices may result in service suspension after a reasonable grace period</li>
        </ul>
        <p className="mt-2">Free tier usage is subject to the limits described on the pricing page and may be adjusted at our discretion.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">6. Acceptable use</h2>
        <p>You agree not to use the Service to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Test systems you are not authorized to assess</li>
          <li>Conduct denial-of-service attacks or intentionally disrupt third-party services</li>
          <li>Attempt to exploit, extract, or exfiltrate data from systems beyond what is necessary for legitimate testing</li>
          <li>Distribute malware, phishing content, or other malicious payloads</li>
          <li>Circumvent Service rate limits, access controls, or security mechanisms</li>
          <li>Resell, sublicense, or provide the Service to third parties without our written consent</li>
          <li>Use the Service for any purpose that violates applicable law</li>
        </ul>
        <p className="mt-2">Violation of this section may result in immediate suspension or termination without notice.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">7. Your data</h2>
        <p>You retain ownership of all data you submit to the Service ("Customer Data"), including target URLs, journey definitions, credentials, and any content processed during test execution.</p>
        <p className="mt-2">You grant us a limited license to process Customer Data solely to operate and improve the Service. We handle Customer Data in accordance with our <a href="/privacy" className="text-brand">Privacy Policy</a>.</p>
        <p className="mt-2">You are responsible for ensuring that any personal data included in test targets or journeys is processed lawfully and that you have the necessary legal basis for its processing.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">8. Intellectual property</h2>
        <p>The Service, including its software, design, branding, documentation, and underlying technology, is owned by us or our licensors and is protected by intellectual property laws. These Terms do not transfer any ownership rights to you.</p>
        <p className="mt-2">You may use reports generated by the Service for your internal business purposes. You may not reverse-engineer, decompile, or create derivative works from the Service.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">9. Service availability and changes</h2>
        <p>We work to maintain reliable service but do not guarantee uninterrupted or error-free operation. We may:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Perform maintenance that temporarily affects availability</li>
          <li>Modify, update, or discontinue features with reasonable notice when practical</li>
          <li>Introduce new features that may be subject to additional terms</li>
        </ul>
        <p className="mt-2">For material changes that reduce core functionality of paid plans, we will provide at least 30 days' notice.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">10. Disclaimer of warranties</h2>
        <p>The Service is provided "as is" and "as available" without warranties of any kind, whether express, implied, or statutory. We specifically disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
        <p className="mt-2">We do not warrant that test results are complete, accurate, or sufficient to meet any regulatory, compliance, or security standard. The Service is a tool to assist your testing process, not a replacement for professional security assessment.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">11. Limitation of liability</h2>
        <p>To the maximum extent permitted by applicable law:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>We are not liable for indirect, incidental, special, consequential, or punitive damages</li>
          <li>We are not liable for loss of profits, data, business, or goodwill</li>
          <li>Our total cumulative liability under these Terms shall not exceed the amount you paid us in the 12 months preceding the claim</li>
        </ul>
        <p className="mt-2">These limitations apply regardless of the legal theory (contract, tort, strict liability, or otherwise) and even if we were advised of the possibility of such damages.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">12. Indemnification</h2>
        <p>You agree to indemnify and hold us harmless from claims, damages, losses, and expenses (including reasonable legal fees) arising from:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Your use of the Service, including any tests you initiate</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any applicable law or third-party rights</li>
          <li>Unauthorized testing conducted through your account</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">13. Termination</h2>
        <p>You may stop using the Service and close your account at any time. We may suspend or terminate your access if:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>You materially breach these Terms</li>
          <li>Your use creates security, legal, or operational risk</li>
          <li>Required by law or regulation</li>
        </ul>
        <p className="mt-2">Upon termination, your right to access the Service ends immediately. We may retain certain data as required for legal compliance, dispute resolution, or enforcement of these Terms.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">14. Governing law and disputes</h2>
        <p>These Terms are governed by the laws of Sweden. Any disputes arising from or relating to these Terms or the Service shall be resolved in the courts of Gothenburg, Sweden, unless otherwise required by mandatory consumer protection law in your jurisdiction.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">15. Changes to these Terms</h2>
        <p>We may update these Terms from time to time. For material changes, we will notify you via email or through the Service at least 30 days before the changes take effect. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.</p>
      </section>

      <section>
        <h2 className="text-lg text-gray-900 mb-2">16. Contact</h2>
        <p>For questions about these Terms, contact us at testarun@gmail.com.</p>
      </section>
    </LegalPage>
  )
}
