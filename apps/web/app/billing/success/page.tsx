"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/store/hooks"
import { bootstrapAppContext } from "@/store/app-thunks"

export default function BillingSuccessPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const t = setTimeout(async () => {
      await dispatch(bootstrapAppContext())
      router.replace("/")
    }, 1200)

    return () => clearTimeout(t)
  }, [dispatch, router])

  return <main className="flex h-dvh items-center justify-center bg-app-bg text-ui-muted">Payment successful. Finalizing account…</main>
}
