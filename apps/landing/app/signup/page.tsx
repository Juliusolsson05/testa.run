import { redirect } from 'next/navigation'
import { appHref } from '@/lib/urls'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const next = Array.isArray(params.next) ? params.next[0] : params.next
  const target = next
    ? `${appHref('/sign-up')}?next=${encodeURIComponent(next)}`
    : appHref('/sign-up')

  redirect(target)
}
