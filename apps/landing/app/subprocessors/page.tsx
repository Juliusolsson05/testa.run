import { LegalPage } from '@/app/components/LegalPage'

const rows = [
  ['Cloud hosting / compute', 'Application hosting, storage, delivery'],
  ['Email provider', 'Transactional emails and support routing'],
  ['Monitoring / logging', 'Reliability monitoring and diagnostics'],
  ['Payment processor', 'Subscription billing metadata'],
]

export default function SubprocessorsPage() {
  return (
    <LegalPage title="Subprocessors" updated="2026-02-21">
      <section><h2 className="text-lg text-gray-900 mb-2">Current subprocessor categories</h2><p>We use trusted subprocessors to operate testa.run. Each vendor is assessed for security and privacy controls.</p></section>
      <section>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Category</th><th className="px-4 py-3 text-left">Purpose</th></tr></thead>
            <tbody>
              {rows.map(([cat,purpose]) => (
                <tr key={cat} className="border-t border-gray-100">
                  <td className="px-4 py-3">{cat}</td>
                  <td className="px-4 py-3">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section><p>For subprocessor updates and questions, email testarun@gmail.com.</p></section>
    </LegalPage>
  )
}
