/**
 * TestaRunLogo
 * "tr" initials (t white, r blue) floating on dark background — no fill.
 * "testa.run" wordmark below.
 */
export function TestaRunLogo() {
  return (
    <div className="flex flex-col items-start gap-2">
      {/* Badge mark — no background, letters only */}
      <svg
        width="48"
        height="36"
        viewBox="0 0 48 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="24"
          y="28"
          textAnchor="middle"
          fontFamily="var(--font-geist-sans), Geist, ui-sans-serif, system-ui, sans-serif"
          fontSize="26"
          fontWeight="700"
          letterSpacing="-0.5"
        >
          <tspan fill="#ffffff">t</tspan>
          <tspan fill="#1d6ef5">r</tspan>
        </text>
      </svg>

      {/* Wordmark */}
      <span
        className="text-[13px] font-bold leading-none tracking-tight text-[#e8edf5]"
        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      >
        testa<span className="text-[#1d6ef5]">.run</span>
      </span>
    </div>
  )
}
