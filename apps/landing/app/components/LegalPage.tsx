import { PageShell } from './SiteNav'

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <PageShell>
      <section className="pt-24 pb-8 text-center bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl tracking-tight leading-[1.1] mb-3">{title}</h1>
          <p className="text-[14px] text-gray-500">Last updated: {updated}</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 md:px-8 pb-20">
        <article className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm space-y-6 text-[14px] text-gray-700 leading-relaxed">
          {children}
        </article>
      </main>
    </PageShell>
  )
}
