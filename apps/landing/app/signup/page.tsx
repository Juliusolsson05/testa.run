import Link from 'next/link'
import { PageShell } from '@/app/components/SiteNav'
import { Button } from '@/components/ui/button'

export default function SignupPage() {
  return (
    <PageShell>
      <section className="pt-24 pb-8 text-center bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl tracking-tight leading-[1.1] mb-3">Create your account</h1>
          <p className="text-[15px] text-gray-500">Start running tests in minutes.</p>
        </div>
      </section>

      <div className="max-w-md mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          <form className="space-y-4">
            <input placeholder="Full name" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
            <input type="email" placeholder="Email" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
            <input type="password" placeholder="Password" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
            <Button className="w-full">Create account</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account? <Link href="/login" className="text-brand">Log in</Link>
          </p>
        </div>
      </div>
    </PageShell>
  )
}
