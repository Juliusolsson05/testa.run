'use client'

/*
  HeroBrowser
  ──────────────────────────────────────────────────────────
  A full-height Mac browser window showing a realistic e-commerce
  product page. The agent's blue highlight cycles through three
  elements every 9s: nav → product image → CTA button.
  No login form. No agent feed.
*/
export function HeroBrowser() {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes hl1 {
          0%,5%    { opacity:0 }
          9%,28%   { opacity:1 }
          33%,100% { opacity:0 }
        }
        @keyframes hl2 {
          0%,33%   { opacity:0 }
          38%,61%  { opacity:1 }
          66%,100% { opacity:0 }
        }
        @keyframes hl3 {
          0%,66%   { opacity:0 }
          71%,94%  { opacity:1 }
          100%     { opacity:0 }
        }
        .hero-hl1 { animation: hl1 9s ease-in-out infinite; }
        .hero-hl2 { animation: hl2 9s ease-in-out infinite; }
        .hero-hl3 { animation: hl3 9s ease-in-out infinite; }
      `}</style>

      {/* ── Mac browser chrome ──────────────────────────────── */}
      <div
        style={{
          background: '#e4e4e4',
          borderBottom: '1px solid rgba(0,0,0,0.14)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
          {[['#ff5f57', '#e0443e'], ['#febc2e', '#d6a01d'], ['#28c840', '#1aab29']].map(
            ([fill, shadow], i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: fill,
                  boxShadow: `inset 0 0 0 0.5px rgba(0,0,0,0.2)`,
                }}
              />
            )
          )}
        </div>

        {/* Nav arrows */}
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <span style={{ fontSize: 15, color: '#aaa', lineHeight: 1, userSelect: 'none' }}>‹</span>
          <span style={{ fontSize: 15, color: '#ccc', lineHeight: 1, userSelect: 'none' }}>›</span>
        </div>

        {/* URL bar */}
        <div
          style={{
            flex: 1,
            background: 'white',
            borderRadius: 6,
            padding: '4px 12px',
            fontSize: 11,
            color: '#6b7280',
            fontFamily: 'ui-monospace, monospace',
            textAlign: 'center',
            boxShadow: 'inset 0 0 0 0.75px rgba(0,0,0,0.12)',
            userSelect: 'none',
          }}
        >
          🔒 soma-studio.co/audio/arc-pro
        </div>
      </div>

      {/* ── Website ─────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
        }}
      >
        {/* Site nav */}
        <nav
          style={{
            position: 'relative',
            borderBottom: '1px solid #f0f0f0',
            padding: '15px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          {/* Highlight overlay */}
          <div
            className="hero-hl1"
            style={{
              position: 'absolute',
              inset: 0,
              border: '1.5px solid #1d6ef5',
              background: 'rgba(29,110,245,0.04)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
          <span
            style={{
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: '-0.5px',
              color: '#0a0a0a',
            }}
          >
            SOMA
          </span>
          <div style={{ display: 'flex', gap: 22, fontSize: 12, color: '#6b7280' }}>
            <span>Audio</span>
            <span>Accessories</span>
            <span style={{ color: '#0a0a0a', fontWeight: 500 }}>New Arrivals</span>
            <span>Sale</span>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#374151' }}>
            <span>Search</span>
            <span style={{ fontWeight: 500 }}>Cart (0)</span>
          </div>
        </nav>

        {/* Breadcrumb */}
        <div
          style={{
            padding: '7px 30px',
            fontSize: 10.5,
            color: '#c4c4c4',
            flexShrink: 0,
          }}
        >
          Home &rsaquo; Audio &rsaquo; Headphones &rsaquo;{' '}
          <span style={{ color: '#374151' }}>Arc Pro</span>
        </div>

        {/* Product section */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            gap: 32,
            padding: '20px 30px 24px',
          }}
        >
          {/* Product image */}
          <div style={{ position: 'relative', width: '44%', flexShrink: 0 }}>
            {/* Highlight overlay */}
            <div
              className="hero-hl2"
              style={{
                position: 'absolute',
                inset: -3,
                border: '1.5px solid #1d6ef5',
                background: 'rgba(29,110,245,0.03)',
                borderRadius: 11,
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
            {/* Main image */}
            <div
              style={{
                background:
                  'linear-gradient(145deg, #111827 0%, #1e3a5f 45%, #1e40af 100%)',
                borderRadius: 8,
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <svg viewBox="0 0 120 120" style={{ width: '62%', opacity: 0.95 }}>
                <path
                  d="M60 16 C35 16 14 37 14 62 L14 78 C14 85 20 91 27 91 L32 91 C39 91 45 85 45 78 L45 70 C45 63 39 57 32 57 L26 57 C27 42 42 30 60 30 C78 30 93 42 94 57 L88 57 C81 57 75 63 75 70 L75 78 C75 85 81 91 88 91 L93 91 C100 91 106 85 106 78 L106 62 C106 37 85 16 60 16 Z"
                  fill="#3b82f6"
                />
                <ellipse cx="29" cy="74" rx="10" ry="14" fill="#60a5fa" />
                <ellipse cx="91" cy="74" rx="10" ry="14" fill="#60a5fa" />
                <ellipse cx="29" cy="74" rx="5" ry="7" fill="#bfdbfe" opacity="0.6" />
                <ellipse cx="91" cy="74" rx="5" ry="7" fill="#bfdbfe" opacity="0.6" />
              </svg>
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: 7, marginTop: 10 }}>
              {[
                { bg: '#111827', active: true },
                { bg: '#e5e7eb', active: false },
                { bg: '#c8a97b', active: false },
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 5,
                    background: t.bg,
                    border: t.active ? '2px solid #1d6ef5' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Product details */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 11,
              minWidth: 0,
            }}
          >
            {/* Title */}
            <div>
              <div
                style={{
                  fontSize: 9.5,
                  color: '#9ca3af',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 3,
                }}
              >
                SOMA Audio
              </div>
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#0a0a0a',
                  lineHeight: 1.1,
                  margin: 0,
                  letterSpacing: '-0.6px',
                }}
              >
                Arc Pro
              </h1>
              <p
                style={{
                  fontSize: 12,
                  color: '#6b7280',
                  marginTop: 3,
                  marginBottom: 0,
                }}
              >
                Wireless Noise-Cancelling Headphones
              </p>
            </div>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#f59e0b', fontSize: 11, letterSpacing: 1 }}>
                ★★★★★
              </span>
              <span style={{ fontSize: 11, color: '#6b7280' }}>
                4.9 ·{' '}
                <span style={{ color: '#1d6ef5', cursor: 'pointer' }}>284 reviews</span>
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 23, fontWeight: 700, color: '#0a0a0a' }}>
                $349
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: '#d1d5db',
                  textDecoration: 'line-through',
                }}
              >
                $419
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  background: '#dcfce7',
                  color: '#16a34a',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: 4,
                }}
              >
                Save $70
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#f3f4f6' }} />

            {/* Color */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: '#374151',
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Color —{' '}
                <span style={{ fontWeight: 400, color: '#6b7280' }}>Midnight</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#111827',
                    outline: '2px solid #1d6ef5',
                    outlineOffset: 2,
                  }}
                />
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#e5e7eb',
                    border: '1.5px solid #d1d5db',
                  }}
                />
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: '#c8a97b',
                    border: '1.5px solid #d1d5db',
                  }}
                />
              </div>
            </div>

            {/* CTA button */}
            <div style={{ position: 'relative' }}>
              <div
                className="hero-hl3"
                style={{
                  position: 'absolute',
                  inset: -3,
                  border: '1.5px solid #1d6ef5',
                  background: 'rgba(29,110,245,0.04)',
                  borderRadius: 10,
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              />
              <button
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  background: '#0a0a0a',
                  color: 'white',
                  border: 'none',
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '-0.2px',
                }}
              >
                Add to bag — $349
              </button>
            </div>

            <div style={{ fontSize: 11, color: '#9ca3af', display: 'flex', gap: 16 }}>
              <span>✓ Free shipping over $50</span>
              <span>✓ 30-day free returns</span>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#f3f4f6' }} />

            {/* Specs */}
            <div
              style={{
                fontSize: 11.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 7,
              }}
            >
              {[
                ['Battery life', '30 hours ANC'],
                ['Connectivity', 'Bluetooth 5.3'],
                ['Noise cancelling', 'Adaptive ANC'],
                ['Weight', '250g'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#374151',
                  }}
                >
                  <span style={{ color: '#9ca3af' }}>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
