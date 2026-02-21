import { cn } from "@/lib/utils"

/**
 * Wordmark — "testa.run" text in two variants:
 *   variant="dark"  → white text, blue ".run" (for dark backgrounds)
 *   variant="light" → gray-900 text, brand blue ".run" (for light backgrounds)
 */
export function Wordmark({
  variant = "dark",
  className,
}: {
  variant?: "dark" | "light"
  className?: string
}) {
  return (
    <span
      className={cn(
        "text-sm font-bold tracking-tight",
        variant === "dark" ? "text-[#e8edf5]" : "text-gray-900",
        className
      )}
    >
      testa
      <span className={variant === "dark" ? "text-[#1d6ef5]" : "text-brand"}>
        .run
      </span>
    </span>
  )
}

/**
 * @deprecated Use <Wordmark /> instead.
 */
export function TestaRunLogo() {
  return <Wordmark variant="dark" className="text-[15px]" />
}
