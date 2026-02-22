"use client"

export function BlueCube({ size = 40 }: { size?: number }) {
  const half = size / 2

  return (
    <div
      style={{ width: size * 2, height: size * 2, display: "flex", alignItems: "center", justifyContent: "center" }}
      aria-hidden
    >
      <style>{`
        .bc-scene {
          perspective: 400px;
          position: relative;
        }
        .bc-body {
          width: ${size}px;
          height: ${size}px;
          position: relative;
          transform-style: preserve-3d;
          animation: bc-spin 1.6s cubic-bezier(.4,0,.2,1) infinite;
        }
        @keyframes bc-spin {
          0%   { transform: translateY(0) rotateX(-30deg) rotateY(0deg); }
          15%  { transform: translateY(-20px) rotateX(-30deg) rotateY(90deg); }
          30%  { transform: translateY(0) rotateX(-30deg) rotateY(180deg); }
          50%  { transform: translateY(0) rotateX(-30deg) rotateY(180deg); }
          65%  { transform: translateY(-20px) rotateX(-30deg) rotateY(270deg); }
          80%  { transform: translateY(0) rotateX(-30deg) rotateY(360deg); }
          100% { transform: translateY(0) rotateX(-30deg) rotateY(360deg); }
        }
        .bc-face {
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 3px;
        }
        .bc-front  { background: #1d6ef5; transform: translateZ(${half}px); }
        .bc-back   { background: #144fb3; transform: rotateY(180deg) translateZ(${half}px); }
        .bc-right  { background: #185fd3; transform: rotateY(90deg) translateZ(${half}px); }
        .bc-left   { background: #3b82f6; transform: rotateY(-90deg) translateZ(${half}px); }
        .bc-top    { background: #60a5fa; transform: rotateX(90deg) translateZ(${half}px); }
        .bc-bottom { background: #0b3b8f; transform: rotateX(-90deg) translateZ(${half}px); }
        .bc-shadow {
          width: ${size}px;
          height: 6px;
          background: radial-gradient(ellipse, rgba(29,110,245,0.35), transparent 70%);
          border-radius: 50%;
          position: absolute;
          bottom: -14px;
          left: 0;
          animation: bc-shadow 1.6s cubic-bezier(.4,0,.2,1) infinite;
        }
        @keyframes bc-shadow {
          0%, 30%, 50%, 80%, 100% { transform: scaleX(1); opacity: 0.5; }
          15%, 65% { transform: scaleX(0.6); opacity: 0.2; }
        }
      `}</style>
      <div className="bc-scene">
        <div className="bc-body">
          <div className="bc-face bc-front" />
          <div className="bc-face bc-back" />
          <div className="bc-face bc-right" />
          <div className="bc-face bc-left" />
          <div className="bc-face bc-top" />
          <div className="bc-face bc-bottom" />
        </div>
        <div className="bc-shadow" />
      </div>
    </div>
  )
}
