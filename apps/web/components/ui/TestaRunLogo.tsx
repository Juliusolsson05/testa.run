/**
 * TestaRunLogo — dark sidebar variant.
 * Just the "testa.run" wordmark, no initials. Public Sans, normal weight.
 */
export function TestaRunLogo() {
  const font = "var(--font-public-sans), 'Public Sans', ui-sans-serif, system-ui, sans-serif"
  return (
    <svg
      width="90"
      height="24"
      viewBox="0 0 90 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="20"
        fontFamily={font}
        fontSize="20"
        fontWeight="400"
        letterSpacing="-0.5"
      >
        <tspan fill="#ffffff">testa</tspan>
        <tspan fill="#1d6ef5">.run</tspan>
      </text>
    </svg>
  )
}
