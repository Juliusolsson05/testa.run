'use client'

/* ─────────────────────────────────────────────────────────────
   1. JOURNEY FLOW
   Nodes connected by a tracing dashed line. Each node pops green
   in sequence. The last node shows a red failure state.
───────────────────────────────────────────────────────────── */
export function JourneyFlow() {
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="360" height="72" viewBox="0 0 360 72" fill="none">
        <style>{`
          @keyframes traceLine {
            from { stroke-dashoffset: 80; opacity: 0.2; }
            to   { stroke-dashoffset: 0;  opacity: 1; }
          }
          @keyframes nodeIn {
            0%   { r: 0; opacity: 0; }
            60%  { r: 14; opacity: 1; }
            80%  { r: 11; }
            100% { r: 12; opacity: 1; }
          }
          @keyframes checkIn {
            from { stroke-dashoffset: 20; opacity: 0; }
            to   { stroke-dashoffset: 0;  opacity: 1; }
          }
          .line-1 { animation: traceLine 0.5s ease 0.2s both; stroke-dasharray: 80; }
          .line-2 { animation: traceLine 0.5s ease 0.8s both; stroke-dasharray: 80; }
          .line-3 { animation: traceLine 0.5s ease 1.4s both; stroke-dasharray: 80; }
          .node-1 { animation: nodeIn 0.4s ease 0.0s both; }
          .node-2 { animation: nodeIn 0.4s ease 0.6s both; }
          .node-3 { animation: nodeIn 0.4s ease 1.2s both; }
          .node-4 { animation: nodeIn 0.4s ease 1.8s both; }
          .check-1 { animation: checkIn 0.3s ease 0.5s both; stroke-dasharray: 20; }
          .check-2 { animation: checkIn 0.3s ease 1.1s both; stroke-dasharray: 20; }
          .check-3 { animation: checkIn 0.3s ease 1.7s both; stroke-dasharray: 20; }
          .cross-4 { animation: checkIn 0.3s ease 2.1s both; stroke-dasharray: 20; }
        `}</style>

        {/* Lines */}
        <line className="line-1" x1="56"  y1="36" x2="136" y2="36" stroke="#d1d5db" strokeWidth="1.5"/>
        <line className="line-2" x1="136" y1="36" x2="216" y2="36" stroke="#d1d5db" strokeWidth="1.5"/>
        <line className="line-3" x1="216" y1="36" x2="296" y2="36" stroke="#d1d5db" strokeWidth="1.5"/>

        {/* Node 1 — pass */}
        <circle className="node-1" cx="44"  cy="36" r="12" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5"/>
        <polyline className="check-1" points="39,36 43,40 50,31" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

        {/* Node 2 — pass */}
        <circle className="node-2" cx="124" cy="36" r="12" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5"/>
        <polyline className="check-2" points="119,36 123,40 130,31" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

        {/* Node 3 — pass */}
        <circle className="node-3" cx="204" cy="36" r="12" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5"/>
        <polyline className="check-3" points="199,36 203,40 210,31" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

        {/* Node 4 — fail */}
        <circle className="node-4" cx="308" cy="36" r="12" fill="#fff1f2" stroke="#ef4444" strokeWidth="1.5"/>
        <line className="cross-4" x1="303" y1="31" x2="313" y2="41" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
        <line className="cross-4" x1="313" y1="31" x2="303" y2="41" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>

        {/* Step labels */}
        <text x="44"  y="60" textAnchor="middle" fontSize="9" fill="#9ca3af" fontFamily="system-ui">Login</text>
        <text x="124" y="60" textAnchor="middle" fontSize="9" fill="#9ca3af" fontFamily="system-ui">Search</text>
        <text x="204" y="60" textAnchor="middle" fontSize="9" fill="#9ca3af" fontFamily="system-ui">Add item</text>
        <text x="308" y="60" textAnchor="middle" fontSize="9" fill="#ef4444" fontFamily="system-ui">Checkout</text>
      </svg>
      <p className="text-[12px] text-gray-400 tracking-wide">Journey execution</p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   2. RADAR SCAN
   Rotating sweep over a grid of dots. Dots light up blue as the
   sweep passes over them — simulates vulnerability scanning.
───────────────────────────────────────────────────────────── */
export function RadarScan() {
  const dots = [
    { cx: 100, cy: 55 }, { cx: 130, cy: 40 }, { cx: 160, cy: 55 },
    { cx: 75,  cy: 90 }, { cx: 100, cy: 100 }, { cx: 125, cy: 85 },
    { cx: 155, cy: 100 }, { cx: 180, cy: 80 },
    { cx: 85,  cy: 125 }, { cx: 120, cy: 130 }, { cx: 150, cy: 120 },
    { cx: 175, cy: 135 }, { cx: 95,  cy: 155 }, { cx: 135, cy: 155 },
  ]

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
        <style>{`
          @keyframes sweep {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes dotPulse {
            0%, 100% { opacity: 0.2; r: 3; }
            50%       { opacity: 1;   r: 4.5; }
          }
          .radar-sweep {
            transform-origin: 110px 110px;
            animation: sweep 3s linear infinite;
          }
          .dot-pulse { animation: dotPulse 3s ease-in-out infinite; }
          .dot-pulse:nth-child(2n)   { animation-delay: 0.4s; }
          .dot-pulse:nth-child(3n)   { animation-delay: 0.9s; }
          .dot-pulse:nth-child(4n)   { animation-delay: 1.4s; }
          .dot-pulse:nth-child(5n)   { animation-delay: 1.9s; }
        `}</style>

        {/* Rings */}
        <circle cx="110" cy="110" r="90"  stroke="#f3f4f6" strokeWidth="1"/>
        <circle cx="110" cy="110" r="60"  stroke="#f3f4f6" strokeWidth="1"/>
        <circle cx="110" cy="110" r="30"  stroke="#f3f4f6" strokeWidth="1"/>

        {/* Crosshairs */}
        <line x1="110" y1="20"  x2="110" y2="200" stroke="#f3f4f6" strokeWidth="1"/>
        <line x1="20"  y1="110" x2="200" y2="110" stroke="#f3f4f6" strokeWidth="1"/>

        {/* Sweep */}
        <g className="radar-sweep">
          <path d="M110 110 L200 110 A90 90 0 0 0 110 20 Z" fill="url(#sweepGrad)" opacity="0.5"/>
        </g>

        {/* Dots */}
        {dots.map((d, i) => (
          <circle key={i} className="dot-pulse" cx={d.cx} cy={d.cy} r="3" fill="#1d6ef5"/>
        ))}

        {/* One red "found" dot */}
        <circle cx="155" cy="100" r="5" fill="#ef4444" opacity="0.9"/>
        <circle cx="155" cy="100" r="9" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.4"/>

        <defs>
          <radialGradient id="sweepGrad" cx="0%" cy="100%" r="100%">
            <stop offset="0%"   stopColor="#1d6ef5" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#1d6ef5" stopOpacity="0"/>
          </radialGradient>
        </defs>
      </svg>
      <p className="text-[12px] text-gray-400 tracking-wide">Security scan</p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   3. BROWSER INSPECTOR
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

/* ─────────────────────────────────────────────────────────────
   4. NETWORK MAP
   Central API node. Requests pulse outward to endpoints.
   Some return green (200), one returns red (500).
───────────────────────────────────────────────────────────── */
export function NetworkMap() {
  const endpoints = [
    { x: 110, y: 20,  label: '/auth',    status: 'ok',   delay: '0s'   },
    { x: 200, y: 55,  label: '/users',   status: 'ok',   delay: '0.3s' },
    { x: 215, y: 150, label: '/orders',  status: 'err',  delay: '0.6s' },
    { x: 130, y: 195, label: '/pay',     status: 'ok',   delay: '0.9s' },
    { x: 30,  y: 175, label: '/items',   status: 'ok',   delay: '1.2s' },
    { x: 10,  y: 80,  label: '/search',  status: 'ok',   delay: '1.5s' },
  ]
  const cx = 110, cy = 110

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="230" height="220" viewBox="0 0 230 220" fill="none">
        <style>{`
          @keyframes pulse {
            0%   { stroke-dashoffset: 60; opacity: 0; }
            30%  { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes endpointIn {
            from { opacity: 0; transform: scale(0.5); }
            to   { opacity: 1; transform: scale(1); }
          }
          @keyframes statusPing {
            0%   { r: 6;  opacity: 1; }
            100% { r: 14; opacity: 0; }
          }
          .ep-line { stroke-dasharray: 60; animation: pulse 1s ease both; }
          .ep-node { animation: endpointIn 0.3s ease both; }
          .ep-ping { animation: statusPing 2s ease-out 1.5s infinite; }
        `}</style>

        {endpoints.map((ep, i) => {
          const color = ep.status === 'ok' ? '#22c55e' : '#ef4444'
          const bgColor = ep.status === 'ok' ? '#f0fdf4' : '#fff1f2'
          const borderColor = ep.status === 'ok' ? '#22c55e' : '#ef4444'
          const dx = ep.x - cx, dy = ep.y - cy
          const len = Math.sqrt(dx*dx + dy*dy)
          const x1 = cx + (dx/len)*18, y1 = cy + (dy/len)*18
          const x2 = ep.x - (dx/len)*16, y2 = ep.y - (dy/len)*16

          return (
            <g key={ep.label} style={{ animationDelay: ep.delay }}>
              <line
                className="ep-line"
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#e5e7eb" strokeWidth="1.5"
                style={{ animationDelay: ep.delay }}
              />
              <circle
                className="ep-ping"
                cx={ep.x} cy={ep.y} r="6"
                fill="none" stroke={color}
                style={{ animationDelay: ep.delay }}
              />
              <circle
                className="ep-node"
                cx={ep.x} cy={ep.y} r="14"
                fill={bgColor} stroke={borderColor} strokeWidth="1.5"
                style={{ animationDelay: ep.delay }}
              />
              <text x={ep.x} y={ep.y + 4} textAnchor="middle" fontSize="7" fill={color} fontFamily="monospace"
                style={{ animationDelay: ep.delay }}>
                {ep.label}
              </text>
            </g>
          )
        })}

        {/* Center node */}
        <circle cx={cx} cy={cy} r="18" fill="white" stroke="#1d6ef5" strokeWidth="1.5"/>
        <circle cx={cx} cy={cy} r="24" fill="none" stroke="#dbeafe" strokeWidth="1"/>
        <text x={cx} y={cy - 3}  textAnchor="middle" fontSize="7.5" fill="#1d6ef5" fontFamily="monospace" fontWeight="600">API</text>
        <text x={cx} y={cy + 7} textAnchor="middle" fontSize="6.5" fill="#93c5fd" fontFamily="monospace">agent</text>
      </svg>
      <p className="text-[12px] text-gray-400 tracking-wide">API surface mapping</p>
    </div>
  )
}
