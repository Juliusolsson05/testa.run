'use client'

/*
  BrowserInspector — split browser window
  ─────────────────────────────────────────
  Left  : a real login page (logo, heading, email+pw fields, button)
  Right : Chrome-style Elements panel (tabs, HTML tree, assertions, breadcrumb)

  Three 3-second phases cycle every 9 s:
    Phase 1  <nav>   selected   → nav gets blue overlay, inspector shows nav HTML
    Phase 2  <input> selected   → email input gets overlay, shows input HTML + one fail
    Phase 3  <button> selected  → button gets overlay, shows button HTML + all pass
*/
export function BrowserInspector() {
  return (
    <div className="w-full max-w-[680px] rounded-xl overflow-hidden border border-gray-200 shadow-xl shadow-gray-200/60">
      <svg
        viewBox="0 0 680 400"
        width="680"
        height="400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: 'auto' }}
      >
        <style>{`
          /* ─── Phase fade keyframes ───────────────────────── */
          .ph1 { animation: ph1 9s ease-in-out infinite; }
          .ph2 { animation: ph2 9s ease-in-out infinite; }
          .ph3 { animation: ph3 9s ease-in-out infinite; }

          @keyframes ph1 {
            0%,4%    { opacity:0 }
            9%,28%   { opacity:1 }
            33%,100% { opacity:0 }
          }
          @keyframes ph2 {
            0%,33%   { opacity:0 }
            38%,61%  { opacity:1 }
            66%,100% { opacity:0 }
          }
          @keyframes ph3 {
            0%,66%   { opacity:0 }
            71%,95%  { opacity:1 }
            100%     { opacity:0 }
          }

          /* ─── Cursor ─────────────────────────────────────── */
          @keyframes cur {
            0%,3%    { transform: translate(50px, 260px) }
            8%,29%   { transform: translate(185px, 58px)  }
            33%,37%  { transform: translate(185px, 58px)  }
            41%,61%  { transform: translate(185px, 178px) }
            65%,70%  { transform: translate(185px, 178px) }
            74%,95%  { transform: translate(185px, 284px) }
            98%,100% { transform: translate(50px, 260px) }
          }
          .cur { animation: cur 9s ease-in-out infinite; }
        `}</style>

        {/* ── Base white background ─────────────────────────── */}
        <rect width="680" height="400" fill="white" />

        {/* ══════════════════════════════════════════════════════
            BROWSER CHROME
        ══════════════════════════════════════════════════════ */}
        <rect width="680" height="38" fill="#f4f4f5" />
        <line x1="0" y1="38" x2="680" y2="38" stroke="#e4e4e7" />

        {/* Navigation buttons (circles, no traffic-light vibe — just nav arrows) */}
        <path d="M18 19 L24 14 L24 24 Z" fill="#d4d4d8" />
        <path d="M34 19 L28 14 L28 24 Z" fill="#d4d4d8" />
        <circle cx="46" cy="19" r="5" stroke="#d4d4d8" strokeWidth="1.5"
          fill="none" />
        <line x1="44" y1="17" x2="48" y2="21" stroke="#d4d4d8" strokeWidth="1.25" />
        <line x1="44" y1="21" x2="48" y2="17" stroke="#d4d4d8" strokeWidth="1.25" />

        {/* URL bar */}
        <rect x="60" y="9" width="560" height="20" rx="5" fill="white" stroke="#e4e4e7" strokeWidth="1" />
        {/* Lock icon */}
        <rect x="69" y="14" width="6" height="5" rx="1" fill="none" stroke="#a1a1aa" strokeWidth="1" />
        <path d="M70.5 14 Q72 11 73.5 14" fill="none" stroke="#a1a1aa" strokeWidth="1" />
        <text x="346" y="23" textAnchor="middle" fontSize="9.5" fill="#71717a"
          fontFamily="ui-monospace, monospace">
          checkout.example.com/login
        </text>

        {/* ── Divider between page and devtools ─────────────── */}
        <line x1="370" y1="38" x2="370" y2="400" stroke="#e4e4e7" />

        {/* ══════════════════════════════════════════════════════
            LEFT PANEL — the page being inspected
        ══════════════════════════════════════════════════════ */}
        <rect x="0" y="38" width="370" height="362" fill="white" />

        {/* ── Nav ── */}
        <rect x="0" y="38" width="370" height="42" fill="#fafafa" />
        <line x1="0" y1="80" x2="370" y2="80" stroke="#f0f0f0" />
        {/* Logo */}
        <text x="22" y="64" fontSize="12" fontWeight="700" fill="#18181b"
          fontFamily="ui-sans-serif, system-ui, sans-serif">acme</text>
        {/* Nav links */}
        <text x="185" y="64" textAnchor="middle" fontSize="9" fill="#a1a1aa"
          fontFamily="ui-sans-serif, system-ui, sans-serif">Products</text>
        <text x="238" y="64" textAnchor="middle" fontSize="9" fill="#a1a1aa"
          fontFamily="ui-sans-serif, system-ui, sans-serif">Pricing</text>
        <text x="285" y="64" textAnchor="middle" fontSize="9" fill="#a1a1aa"
          fontFamily="ui-sans-serif, system-ui, sans-serif">Docs</text>
        {/* Sign in link */}
        <text x="343" y="64" textAnchor="middle" fontSize="9" fill="#18181b"
          fontFamily="ui-sans-serif, system-ui, sans-serif">Sign in</text>

        {/* Nav phase-1 highlight overlay */}
        <rect className="ph1" x="0" y="38" width="370" height="42"
          fill="#1d6ef509" />
        <rect className="ph1" x="0.75" y="38.75" width="368.5" height="40.5"
          fill="none" stroke="#1d6ef5" strokeWidth="1.5" />

        {/* ── Page heading ── */}
        <text x="185" y="115" textAnchor="middle" fontSize="15" fontWeight="700"
          fill="#18181b" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Sign in
        </text>
        <text x="185" y="131" textAnchor="middle" fontSize="9.5" fill="#a1a1aa"
          fontFamily="ui-sans-serif, system-ui, sans-serif">
          Welcome back — enter your credentials
        </text>

        {/* ── Email field ── */}
        <text x="24" y="157" fontSize="9.5" fontWeight="600" fill="#52525b"
          fontFamily="ui-sans-serif, system-ui, sans-serif">Email</text>
        <rect x="24" y="163" width="322" height="32" rx="6" fill="white"
          stroke="#d4d4d8" strokeWidth="1" />
        <text x="36" y="183" fontSize="9" fill="#d4d4d8"
          fontFamily="ui-monospace, monospace">user@example.com</text>

        {/* Email input phase-2 highlight */}
        <rect className="ph2" x="24" y="163" width="322" height="32" rx="6"
          fill="#1d6ef508" />
        <rect className="ph2" x="23" y="162" width="324" height="34" rx="7"
          fill="none" stroke="#1d6ef5" strokeWidth="1.5" />

        {/* ── Password field ── */}
        <text x="24" y="215" fontSize="9.5" fontWeight="600" fill="#52525b"
          fontFamily="ui-sans-serif, system-ui, sans-serif">Password</text>
        <rect x="24" y="221" width="322" height="32" rx="6" fill="white"
          stroke="#d4d4d8" strokeWidth="1" />
        <text x="36" y="241" fontSize="9" fill="#d4d4d8"
          fontFamily="ui-monospace, monospace">••••••••••••</text>
        {/* "Forgot?" link */}
        <text x="340" y="215" textAnchor="end" fontSize="8.5" fill="#1d6ef5"
          fontFamily="ui-sans-serif, system-ui, sans-serif">Forgot?</text>

        {/* ── Submit button ── */}
        <rect x="24" y="271" width="322" height="38" rx="7" fill="#18181b" />
        <text x="185" y="294.5" textAnchor="middle" fontSize="11" fontWeight="600"
          fill="white" fontFamily="ui-sans-serif, system-ui, sans-serif">
          Continue
        </text>

        {/* Button phase-3 highlight */}
        <rect className="ph3" x="24" y="271" width="322" height="38" rx="7"
          fill="#1d6ef50c" />
        <rect className="ph3" x="23" y="270" width="324" height="40" rx="8"
          fill="none" stroke="#1d6ef5" strokeWidth="1.5" />

        {/* ── Footer link ── */}
        <line x1="24" y1="328" x2="346" y2="328" stroke="#f4f4f5" />
        <text x="185" y="346" textAnchor="middle" fontSize="9" fill="#a1a1aa"
          fontFamily="ui-sans-serif, system-ui, sans-serif">
          No account?{' '}
          <tspan fill="#1d6ef5">Create one →</tspan>
        </text>

        {/* ── Cursor ── */}
        <g className="cur" style={{ pointerEvents: 'none' }}>
          <path d="M0 0 L0 14 L4 10 L6.5 16 L9 15 L6.5 9 L11 9 Z"
            fill="#1d6ef5" stroke="white" strokeWidth="0.8" strokeLinejoin="round" />
        </g>

        {/* ══════════════════════════════════════════════════════
            RIGHT PANEL — Chrome DevTools Elements panel
        ══════════════════════════════════════════════════════ */}
        <rect x="371" y="38" width="309" height="362" fill="#fafafa" />

        {/* ── Tab bar ── */}
        <rect x="371" y="38" width="309" height="28" fill="#f0f0f0" />
        <line x1="371" y1="66" x2="680" y2="66" stroke="#e4e4e7" />
        {/* Active "Elements" tab */}
        <rect x="371" y="38" width="72" height="28" fill="#fafafa" />
        <line x1="443" y1="38" x2="443" y2="66" stroke="#e4e4e7" />
        <line x1="371" y1="66" x2="443" y2="66" stroke="#fafafa" />
        <text x="407" y="56" textAnchor="middle" fontSize="9.5" fill="#18181b"
          fontFamily="ui-sans-serif, system-ui, sans-serif">Elements</text>
        {/* Inactive tabs */}
        <text x="480" y="56" textAnchor="middle" fontSize="9.5" fill="#9ca3af"
          fontFamily="ui-sans-serif, system-ui, sans-serif">Styles</text>
        <text x="534" y="56" textAnchor="middle" fontSize="9.5" fill="#9ca3af"
          fontFamily="ui-sans-serif, system-ui, sans-serif">Console</text>
        {/* DevTools icon (three dots) */}
        <circle cx="636" cy="52" r="2" fill="#9ca3af" />
        <circle cx="644" cy="52" r="2" fill="#9ca3af" />
        <circle cx="652" cy="52" r="2" fill="#9ca3af" />

        {/* ── "Assertions" section divider ── */}
        <line x1="371" y1="215" x2="680" y2="215" stroke="#e4e4e7" />
        <rect x="371" y="215" width="309" height="22" fill="#f0f0f0" />
        <line x1="371" y1="237" x2="680" y2="237" stroke="#e4e4e7" />
        <text x="382" y="229" fontSize="8" fontWeight="600"
          letterSpacing="0.06em" fill="#9ca3af"
          fontFamily="ui-sans-serif, system-ui, sans-serif">ASSERTIONS</text>

        {/* ── DOM breadcrumb (bottom bar) ── */}
        <rect x="371" y="370" width="309" height="30" fill="#f0f0f0" />
        <line x1="371" y1="370" x2="680" y2="370" stroke="#e4e4e7" />

        {/* ══ Phase 1: <nav> selected ══ */}
        <g className="ph1">
          {/* HTML tree */}
          <text x="382" y="86" fontSize="8.5" fill="#6b7280"
            fontFamily="ui-monospace, monospace">▼</text>
          <text x="393" y="86" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{'<'}</text>
          <text x="399" y="86" fontSize="8.5" fill="#0550ae"
            fontFamily="ui-monospace, monospace">nav</text>
          <text x="418" y="86" fontSize="8.5" fill="#116329"
            fontFamily="ui-monospace, monospace"> role</text>
          <text x="443" y="86" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{"="}</text>
          <text x="448" y="86" fontSize="8.5" fill="#953800"
            fontFamily="ui-monospace, monospace">"navigation"</text>
          <text x="525" y="86" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{'>'}</text>

          <text x="393" y="102" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{'  <'}</text>
          <text x="410" y="102" fontSize="8.5" fill="#0550ae"
            fontFamily="ui-monospace, monospace">a</text>
          <text x="417" y="102" fontSize="8.5" fill="#116329"
            fontFamily="ui-monospace, monospace"> href</text>
          <text x="442" y="102" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{"="}</text>
          <text x="447" y="102" fontSize="8.5" fill="#953800"
            fontFamily="ui-monospace, monospace">"/"</text>
          <text x="460" y="102" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{'>'}</text>
          <text x="466" y="102" fontSize="8.5" fill="#374151"
            fontFamily="ui-monospace, monospace">Home</text>
          <text x="491" y="102" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{'</a>'}</text>

          <text x="393" y="117" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{'  <'}</text>
          <text x="410" y="117" fontSize="8.5" fill="#0550ae"
            fontFamily="ui-monospace, monospace">a</text>
          <text x="417" y="117" fontSize="8.5" fill="#116329"
            fontFamily="ui-monospace, monospace"> href</text>
          <text x="442" y="117" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{"="}</text>
          <text x="447" y="117" fontSize="8.5" fill="#953800"
            fontFamily="ui-monospace, monospace">"/pricing"</text>
          <text x="499" y="117" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{'>'}</text>
          <text x="505" y="117" fontSize="8.5" fill="#374151"
            fontFamily="ui-monospace, monospace">Pricing</text>

          <text x="393" y="132" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{'</nav>'}</text>

          {/* Computed box */}
          <text x="382" y="167" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">offsetWidth</text>
          <text x="458" y="167" fontSize="8.5" fill="#374151"
            fontFamily="ui-monospace, monospace">370</text>
          <text x="382" y="182" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">offsetHeight</text>
          <text x="458" y="182" fontSize="8.5" fill="#374151"
            fontFamily="ui-monospace, monospace">42</text>
          <text x="382" y="197" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">position</text>
          <text x="430" y="197" fontSize="8.5" fill="#953800"
            fontFamily="ui-monospace, monospace">"sticky"</text>

          {/* Assertions */}
          <text x="382" y="253" fontSize="9" fill="#16a34a"
            fontFamily="ui-monospace, monospace">✓</text>
          <text x="394" y="253" fontSize="9" fill="#374151"
            fontFamily="ui-monospace, monospace">role="navigation"</text>
          <text x="382" y="270" fontSize="9" fill="#16a34a"
            fontFamily="ui-monospace, monospace">✓</text>
          <text x="394" y="270" fontSize="9" fill="#374151"
            fontFamily="ui-monospace, monospace">visible: true</text>
          <text x="382" y="287" fontSize="9" fill="#16a34a"
            fontFamily="ui-monospace, monospace">✓</text>
          <text x="394" y="287" fontSize="9" fill="#374151"
            fontFamily="ui-monospace, monospace">links: 4 found</text>

          {/* Breadcrumb */}
          <text x="380" y="388" fontSize="8" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">html › body › header ›</text>
          <text x="490" y="388" fontSize="8" fill="#0550ae" fontWeight="600"
            fontFamily="ui-monospace, monospace"> nav</text>
        </g>

        {/* ══ Phase 2: <input type="email"> selected ══ */}
        <g className="ph2">
          {/* HTML tree */}
          <text x="382" y="86" fontSize="8.5" fill="#6b7280"
            fontFamily="ui-monospace, monospace">▸</text>
          <text x="393" y="86" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{'<'}</text>
          <text x="399" y="86" fontSize="8.5" fill="#0550ae"
            fontFamily="ui-monospace, monospace">input</text>

          <text x="393" y="102" fontSize="8.5" fill="#116329"
            fontFamily="ui-monospace, monospace">  type</text>
          <text x="419" y="102" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{"="}</text>
          <text x="424" y="102" fontSize="8.5" fill="#953800"
            fontFamily="ui-monospace, monospace">"email"</text>

          <text x="393" y="117" fontSize="8.5" fill="#116329"
            fontFamily="ui-monospace, monospace">  name</text>
          <text x="420" y="117" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{"="}</text>
          <text x="425" y="117" fontSize="8.5" fill="#953800"
            fontFamily="ui-monospace, monospace">"email"</text>

          <text x="393" y="132" fontSize="8.5" fill="#116329"
            fontFamily="ui-monospace, monospace">  autocomplete</text>
          <text x="475" y="132" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{"="}</text>
          <text x="480" y="132" fontSize="8.5" fill="#953800"
            fontFamily="ui-monospace, monospace">"email"</text>

          <text x="393" y="147" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{'/>'}</text>

          {/* Computed */}
          <text x="382" y="182" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">offsetWidth</text>
          <text x="458" y="182" fontSize="8.5" fill="#374151"
            fontFamily="ui-monospace, monospace">322</text>
          <text x="382" y="197" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">offsetHeight</text>
          <text x="458" y="197" fontSize="8.5" fill="#374151"
            fontFamily="ui-monospace, monospace">32</text>

          {/* Assertions */}
          <text x="382" y="253" fontSize="9" fill="#16a34a"
            fontFamily="ui-monospace, monospace">✓</text>
          <text x="394" y="253" fontSize="9" fill="#374151"
            fontFamily="ui-monospace, monospace">type="email"</text>
          <text x="382" y="270" fontSize="9" fill="#16a34a"
            fontFamily="ui-monospace, monospace">✓</text>
          <text x="394" y="270" fontSize="9" fill="#374151"
            fontFamily="ui-monospace, monospace">autocomplete present</text>
          <text x="382" y="287" fontSize="9" fill="#dc2626"
            fontFamily="ui-monospace, monospace">✗</text>
          <text x="394" y="287" fontSize="9" fill="#374151"
            fontFamily="ui-monospace, monospace">aria-label missing</text>

          {/* Breadcrumb */}
          <text x="380" y="388" fontSize="8" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">html › body › form › div ›</text>
          <text x="494" y="388" fontSize="8" fill="#0550ae" fontWeight="600"
            fontFamily="ui-monospace, monospace"> input</text>
        </g>

        {/* ══ Phase 3: <button> selected ══ */}
        <g className="ph3">
          {/* HTML tree */}
          <text x="382" y="86" fontSize="8.5" fill="#6b7280"
            fontFamily="ui-monospace, monospace">▸</text>
          <text x="393" y="86" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{'<'}</text>
          <text x="399" y="86" fontSize="8.5" fill="#0550ae"
            fontFamily="ui-monospace, monospace">button</text>

          <text x="393" y="102" fontSize="8.5" fill="#116329"
            fontFamily="ui-monospace, monospace">  type</text>
          <text x="419" y="102" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{"="}</text>
          <text x="424" y="102" fontSize="8.5" fill="#953800"
            fontFamily="ui-monospace, monospace">"submit"</text>

          <text x="393" y="117" fontSize="8.5" fill="#116329"
            fontFamily="ui-monospace, monospace">  class</text>
          <text x="421" y="117" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{"="}</text>
          <text x="426" y="117" fontSize="8.5" fill="#953800"
            fontFamily="ui-monospace, monospace">"btn-primary"</text>

          <text x="393" y="132" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{'>'}</text>
          <text x="401" y="132" fontSize="8.5" fill="#374151"
            fontFamily="ui-monospace, monospace">Continue</text>

          <text x="393" y="147" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">{'</button>'}</text>

          {/* Computed */}
          <text x="382" y="182" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">offsetWidth</text>
          <text x="458" y="182" fontSize="8.5" fill="#374151"
            fontFamily="ui-monospace, monospace">322</text>
          <text x="382" y="197" fontSize="8.5" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">offsetHeight</text>
          <text x="458" y="197" fontSize="8.5" fill="#374151"
            fontFamily="ui-monospace, monospace">38</text>

          {/* Assertions */}
          <text x="382" y="253" fontSize="9" fill="#16a34a"
            fontFamily="ui-monospace, monospace">✓</text>
          <text x="394" y="253" fontSize="9" fill="#374151"
            fontFamily="ui-monospace, monospace">visible: true</text>
          <text x="382" y="270" fontSize="9" fill="#16a34a"
            fontFamily="ui-monospace, monospace">✓</text>
          <text x="394" y="270" fontSize="9" fill="#374151"
            fontFamily="ui-monospace, monospace">enabled: true</text>
          <text x="382" y="287" fontSize="9" fill="#16a34a"
            fontFamily="ui-monospace, monospace">✓</text>
          <text x="394" y="287" fontSize="9" fill="#374151"
            fontFamily="ui-monospace, monospace">type="submit"</text>

          {/* Breadcrumb */}
          <text x="380" y="388" fontSize="8" fill="#9ca3af"
            fontFamily="ui-monospace, monospace">html › body › form ›</text>
          <text x="462" y="388" fontSize="8" fill="#0550ae" fontWeight="600"
            fontFamily="ui-monospace, monospace"> button</text>
        </g>

      </svg>
    </div>
  )
}
