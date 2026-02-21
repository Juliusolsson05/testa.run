import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function SiteNav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between px-6 md:px-8 bg-white/85 backdrop-blur-md border-b border-gray-100">
      <Link href="/" className="text-sm tracking-tight text-gray-900">
        testa<span className="text-brand">.run</span>
      </Link>
      <ul className="hidden md:flex items-center gap-8 list-none">
        <li><Link href="/features" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Features</Link></li>
        <li><Link href="/pricing" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link></li>
        <li><Link href="/about" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">About</Link></li>
        <li><Link href="/contact" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Contact</Link></li>
      </ul>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" asChild><Link href="/login">Log in</Link></Button>
        <Button size="sm" asChild><Link href="/signup">Get started</Link></Button>
      </div>
    </nav>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Link href="/" className="text-sm tracking-tight text-gray-900">
            testa<span className="text-brand">.run</span>
          </Link>
          <p className="text-[13px] text-gray-400 mt-1">Autonomous QA & security testing.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-gray-500">
          <Link href="/features" className="hover:text-gray-900 transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
          <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
          <Link href="/cookies" className="hover:text-gray-900 transition-colors">Cookies</Link>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-8 py-4 border-t border-gray-100">
        <span className="text-[12px] text-gray-400">© 2026 testa.run</span>
      </div>
    </footer>
  )
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative text-gray-900 font-sans antialiased min-h-screen overflow-x-hidden [&_*]:font-normal">
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.14]" style={{ backgroundImage: 'radial-gradient(circle, #64748b 0.9px, transparent 0.9px)', backgroundSize: '20px 20px' }} />
      <div className="relative z-[2]">
        <SiteNav />
        <div className="h-14" />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </div>
  )
}
