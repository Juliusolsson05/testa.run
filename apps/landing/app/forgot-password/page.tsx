import { redirect } from 'next/navigation'
import { appHref } from '@/lib/urls'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const next = Array.isArray(params.next) ? params.next[0] : params.next
  const target = next
    ? `${appHref('/sign-in')}?next=${encodeURIComponent(next)}`
    : appHref('/sign-in')

  redirect(target)
}
