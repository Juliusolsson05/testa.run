import Link from 'next/link'
import { PageShell } from '@/app/components/SiteNav'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <PageShell>
      <section className="pt-32 pb-20 text-center bg-white">
        <div className="max-w-md mx-auto px-6">
          <p className="text-6xl mb-4">404</p>
          <h1 className="text-2xl tracking-tight mb-2">Page not found</h1>
          <p className="text-sm text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  )
}
