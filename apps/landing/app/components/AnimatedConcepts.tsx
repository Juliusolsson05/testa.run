'use client'

/* ─────────────────────────────────────────────────────────────
   BROWSER INSPECTOR
   A wireframe browser. Elements inside highlight one by one
   with a blue outline, simulating the agent inspecting the UI.
───────────────────────────────────────────────────────────── */
export function BrowserInspector() {
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="280" height="195" viewBox="0 0 280 195" fill="none">
        <style>{`
          @keyframes highlight {
            0%, 100% { stroke: #e5e7eb; stroke-width: 1; }
            50%       { stroke: #1d6ef5; stroke-width: 1.5; }
          }
          @keyframes highlightFill {
            0%, 100% { fill: transparent; }
            50%       { fill: rgba(29,110,245,0.05); }
          }
          .elem-1 { animation: highlight 4s ease 0.0s infinite; }
          .elem-1-fill { animation: highlightFill 4s ease 0.0s infinite; }
          .elem-2 { animation: highlight 4s ease 1.0s infinite; }
          .elem-2-fill { animation: highlightFill 4s ease 1.0s infinite; }
          .elem-3 { animation: highlight 4s ease 2.0s infinite; }
          .elem-3-fill { animation: highlightFill 4s ease 2.0s infinite; }
          .elem-4 { animation: highlight 4s ease 3.0s infinite; }
          .elem-4-fill { animation: highlightFill 4s ease 3.0s infinite; }
          @keyframes cursorMove {
            0%   { transform: translate(52px, 80px);  opacity: 1; }
            20%  { transform: translate(80px, 105px); opacity: 1; }
            40%  { transform: translate(170px, 75px); opacity: 1; }
            60%  { transform: translate(175px, 140px); opacity: 1; }
            80%  { transform: translate(52px, 80px);  opacity: 0; }
            100% { transform: translate(52px, 80px);  opacity: 1; }
          }
          .cursor { animation: cursorMove 4s ease-in-out infinite; }
        `}</style>

        {/* Browser frame */}
        <rect x="1" y="1" width="278" height="193" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1.5"/>

        {/* Top bar */}
        <rect x="1" y="1" width="278" height="28" rx="8" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1.5"/>
        <rect x="1" y="22" width="278" height="8" fill="#f9fafb"/>

        {/* Traffic lights */}
        <circle cx="18" cy="15" r="4" fill="#fca5a5"/>
        <circle cx="30" cy="15" r="4" fill="#fcd34d"/>
        <circle cx="42" cy="15" r="4" fill="#86efac"/>

        {/* URL bar */}
        <rect x="60" y="9" width="160" height="12" rx="3" fill="#f3f4f6"/>
        <text x="140" y="19" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="monospace">app.example.com/checkout</text>

        {/* Page wireframe elements */}
        {/* Nav bar inside page */}
        <rect className="elem-1-fill" x="12" y="36" width="256" height="18" rx="2"/>
        <rect className="elem-1" x="12" y="36" width="256" height="18" rx="2" strokeWidth="1"/>

        {/* Hero text block */}
        <rect className="elem-2-fill" x="12" y="62" width="150" height="8" rx="2"/>
        <rect className="elem-2" x="12" y="62" width="150" height="8" rx="2"/>
        <rect x="12" y="74" width="110" height="6" rx="2" fill="#f3f4f6"/>
        <rect x="12" y="84" width="130" height="6" rx="2" fill="#f3f4f6"/>

        {/* CTA button */}
        <rect className="elem-3-fill" x="12" y="96" width="68" height="18" rx="4"/>
        <rect className="elem-3" x="12" y="96" width="68" height="18" rx="4"/>

        {/* Right card */}
        <rect className="elem-4-fill" x="170" y="58" width="98" height="80" rx="4"/>
        <rect className="elem-4" x="170" y="58" width="98" height="80" rx="4"/>
        <rect x="178" y="66" width="60" height="5" rx="2" fill="#e5e7eb"/>
        <rect x="178" y="75" width="82" height="4" rx="2" fill="#f3f4f6"/>
        <rect x="178" y="83" width="70" height="4" rx="2" fill="#f3f4f6"/>
        <rect x="178" y="91" width="76" height="4" rx="2" fill="#f3f4f6"/>
        <rect x="178" y="108" width="50" height="14" rx="3" fill="#dbeafe"/>

        {/* Footer bar */}
        <rect x="12" y="150" width="256" height="8" rx="2" fill="#f9fafb" stroke="#f3f4f6" strokeWidth="1"/>

        {/* Cursor */}
        <g className="cursor">
          <path d="M0 0 L0 12 L3.5 9 L6 14 L8 13 L5.5 8 L10 8 Z" fill="#1d6ef5" opacity="0.8"/>
        </g>
      </svg>
      <p className="text-[12px] text-gray-400 tracking-wide">UI inspection</p>
    </div>
  )
}
