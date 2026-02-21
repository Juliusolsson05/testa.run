/**
 * TestaRunLogo
 * SVG badge mark ("t" black + "r" blue) with "testa.run" wordmark below.
 * Designed for use on dark backgrounds (e.g. AppSidebar).
 */
export function TestaRunLogo() {
  return (
    <div className="flex flex-col items-start gap-2">
      {/* Badge mark */}
      <svg
        width="48"
        height="36"
        viewBox="0 0 48 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* White card background */}
        <rect width="48" height="36" rx="8" fill="#ffffff" />
        {/* Subtle blue tint border */}
        <rect width="48" height="36" rx="8" stroke="#1d6ef5" strokeOpacity="0.18" strokeWidth="1" />

        {/* "tr" — both letters in one text so kerning is natural */}
        <text
          x="5"
          y="27"
          fontFamily="var(--font-geist-sans), Geist, ui-sans-serif, system-ui, sans-serif"
          fontSize="24"
          fontWeight="700"
          letterSpacing="-0.5"
        >
          <tspan fill="#0f172a">t</tspan>
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
