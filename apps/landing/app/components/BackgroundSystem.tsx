'use client'

import { useState, useEffect } from 'react'

export type BgEffect = 'none' | 'grain' | 'dots' | 'mesh' | 'topo' | 'lines'

const EFFECTS: { id: BgEffect; label: string; preview: string }[] = [
  { id: 'none',  label: 'None',        preview: 'bg-white border border-gray-200' },
  { id: 'grain', label: 'Grain',       preview: 'bg-gray-100' },
  { id: 'dots',  label: 'Dot grid',    preview: 'bg-white' },
  { id: 'mesh',  label: 'Mesh',        preview: 'bg-blue-50' },
  { id: 'topo',  label: 'Topo lines',  preview: 'bg-white' },
  { id: 'lines', label: 'Line grid',   preview: 'bg-white' },
]

/* ── Grain overlay ────────────────────────────────────────── */
function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[999] opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '300px 300px',
      }}
    />
  )
}

/* ── Dot grid overlay ─────────────────────────────────────── */
function DotsOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[999]"
      style={{
        backgroundImage: 'radial-gradient(circle, #c7ccd6 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.45,
      }}
    />
  )
}

/* ── Mesh blob overlay ────────────────────────────────────── */
function MeshOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[998] overflow-hidden">
      <div
        className="absolute rounded-full"
        style={{
          width: 700, height: 700,
          top: -200, left: -200,
          background: 'radial-gradient(circle, rgba(29,110,245,0.055) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          bottom: -150, right: -150,
          background: 'radial-gradient(circle, rgba(99,102,241,0.045) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400,
          top: '40%', left: '55%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
    </div>
  )
}

/* ── Topographic lines overlay ────────────────────────────── */
function TopoOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[998] overflow-hidden opacity-[0.07]">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          @keyframes topoShift {
            0%,100% { transform: translateY(0px); }
            50%     { transform: translateY(-12px); }
          }
          .topo-group { animation: topoShift 18s ease-in-out infinite; }
          .topo-group-2 { animation: topoShift 22s ease-in-out 4s infinite; }
          .topo-group-3 { animation: topoShift 26s ease-in-out 8s infinite; }
        `}</style>
        <g className="topo-group" fill="none" stroke="#1d4ed8" strokeWidth="1">
          <path d="M-100,200 C200,120 400,280 700,200 S1100,120 1540,200"/>
          <path d="M-100,260 C200,180 400,340 700,260 S1100,180 1540,260"/>
          <path d="M-100,320 C200,240 400,400 700,320 S1100,240 1540,320"/>
          <path d="M-100,380 C200,300 400,460 700,380 S1100,300 1540,380"/>
          <path d="M-100,440 C200,360 400,520 700,440 S1100,360 1540,440"/>
        </g>
        <g className="topo-group-2" fill="none" stroke="#1d4ed8" strokeWidth="1">
          <path d="M-100,500 C300,420 500,580 800,500 S1200,420 1540,500"/>
          <path d="M-100,560 C300,480 500,640 800,560 S1200,480 1540,560"/>
          <path d="M-100,620 C300,540 500,700 800,620 S1200,540 1540,620"/>
          <path d="M-100,680 C300,600 500,760 800,680 S1200,600 1540,680"/>
        </g>
        <g className="topo-group-3" fill="none" stroke="#1d4ed8" strokeWidth="1">
          <path d="M-100,100 C400,40  600,160 900,100 S1300,40  1540,100"/>
          <path d="M-100,140 C400,80  600,200 900,140 S1300,80  1540,140"/>
          <path d="M-100,740 C400,680 600,800 900,740 S1300,680 1540,740"/>
          <path d="M-100,780 C400,720 600,840 900,780 S1300,720 1540,780"/>
          <path d="M-100,820 C400,760 600,880 900,820 S1300,760 1540,820"/>
        </g>
      </svg>
    </div>
  )
}

/* ── Fine line grid overlay ───────────────────────────────── */
function LinesOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[998]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(99,102,241,0.055) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.055) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    />
  )
}

/* ── Picker ───────────────────────────────────────────────── */
export function BackgroundPicker() {
  const [active, setActive] = useState<BgEffect>('none')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('bg-effect') as BgEffect | null
    if (saved) setActive(saved)
  }, [])

  const select = (id: BgEffect) => {
    setActive(id)
    localStorage.setItem('bg-effect', id)
  }

  return (
    <>
      {/* Overlays */}
      {active === 'grain' && <GrainOverlay />}
      {active === 'dots'  && <DotsOverlay  />}
      {active === 'mesh'  && <MeshOverlay  />}
      {active === 'topo'  && <TopoOverlay  />}
      {active === 'lines' && <LinesOverlay />}

      {/* Picker UI */}
      <div className="fixed bottom-5 right-5 z-[1000] flex flex-col items-end gap-2">

        {/* Options panel */}
        {open && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 flex flex-col gap-1.5 min-w-[140px]">
            {EFFECTS.map(e => (
              <button
                key={e.id}
                onClick={() => select(e.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  active === e.id
                    ? 'bg-brand text-white'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-sm flex-shrink-0 border ${active === e.id ? 'border-white/40 bg-white/20' : 'border-gray-200 ' + e.preview}`} />
                <span className="text-[12px] font-medium">{e.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setOpen(o => !o)}
          className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:border-gray-300 transition-colors"
          title="Background effects"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3" fill="#6b7280"/>
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"
              stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

      </div>
    </>
  )
}
