/**
 * TestaRunLogo — single SVG, dark sidebar variant.
 * "tr" initials (t white, r blue) on top; "testa.run" wordmark below.
 * Public Sans, normal weight.
 */
export function TestaRunLogo() {
  const font = "var(--font-public-sans), 'Public Sans', ui-sans-serif, system-ui, sans-serif"
  return (
    <svg
      width="68"
      height="50"
      viewBox="0 0 68 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Initials — large, on top */}
      <text
        x="0"
        y="26"
        fontFamily={font}
        fontSize="26"
        fontWeight="400"
        letterSpacing="-0.5"
      >
        <tspan fill="#ffffff">t</tspan>
        <tspan fill="#1d6ef5">r</tspan>
      </text>
      {/* Wordmark — below */}
      <text
        x="0"
        y="44"
        fontFamily={font}
        fontSize="13"
        fontWeight="400"
        letterSpacing="-0.3"
      >
        <tspan fill="#e8edf5">testa</tspan>
        <tspan fill="#1d6ef5">.run</tspan>
      </text>
    </svg>
  )
}
