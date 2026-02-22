import { redirect } from 'next/navigation'
import { appSignUpWithTarget } from '@/lib/urls'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const next = Array.isArray(params.next) ? params.next[0] : params.next
  const targetUrl = Array.isArray(params.targetUrl) ? params.targetUrl[0] : params.targetUrl

  if (targetUrl) {
    redirect(appSignUpWithTarget(targetUrl))
  }

  const target = next
    ? `${appSignUpWithTarget()}?next=${encodeURIComponent(next)}`
    : appSignUpWithTarget()

  redirect(target)
}
