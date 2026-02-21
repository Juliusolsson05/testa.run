export function HeroBrowser() {
  return (
    <div className="h-full w-full bg-white border-l border-gray-100">
      <div className="h-11 bg-zinc-100 border-b border-zinc-200 flex items-center px-4 gap-3">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/10" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/10" />
          <span className="w-3 h-3 rounded-full bg-[#28c840] border border-black/10" />
        </div>
        <div className="flex-1 h-6 rounded-md bg-white border border-zinc-200 flex items-center justify-center text-[11px] text-zinc-500 font-mono">
          https://demo-shop.co/products/arc-pro
        </div>
      </div>

      <div className="h-[calc(100%-44px)] grid grid-cols-[1fr_270px]">
        <div className="bg-white border-r border-zinc-200 overflow-hidden">
          <div className="h-10 border-b border-zinc-100 px-5 flex items-center justify-between text-[12px]">
            <span className="font-semibold tracking-tight">demo-shop</span>
            <div className="flex gap-4 text-zinc-500">
              <span>Products</span>
              <span>Collections</span>
              <span>Cart</span>
            </div>
          </div>

          <div className="px-5 py-4 text-[11px] text-zinc-400">Home › Headphones › Arc Pro</div>

          <div className="px-5 pb-5 grid grid-cols-[220px_1fr] gap-5">
            <div className="space-y-3">
              <div className="rounded-lg border border-zinc-200 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 h-[220px] flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-24 opacity-95">
                  <path d="M60 18 C38 18 20 36 20 58 L20 74 C20 80 24 84 30 84 L33 84 C39 84 43 80 43 74 L43 67 C43 61 39 57 33 57 L29 57 C31 45 44 35 60 35 C76 35 89 45 91 57 L87 57 C81 57 77 61 77 67 L77 74 C77 80 81 84 87 84 L90 84 C96 84 100 80 100 74 L100 58 C100 36 82 18 60 18 Z" fill="#3b82f6"/>
                  <ellipse cx="31" cy="71" rx="8" ry="11" fill="#60a5fa"/>
                  <ellipse cx="89" cy="71" rx="8" ry="11" fill="#60a5fa"/>
                </svg>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded border-2 border-brand bg-slate-900" />
                <div className="w-8 h-8 rounded border border-zinc-200 bg-zinc-200" />
                <div className="w-8 h-8 rounded border border-zinc-200 bg-amber-200" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">SOMA Audio</div>
              <h3 className="text-4xl font-extrabold tracking-tight">Arc Pro</h3>
              <p className="text-sm text-zinc-500">Wireless Noise-Cancelling Headphones</p>
              <div className="text-3xl font-bold">$349 <span className="text-base text-zinc-300 line-through ml-2">$419</span></div>
              <button className="w-full bg-black text-white rounded-md py-3 text-sm font-semibold">Add to bag — $349</button>
              <div className="text-xs text-zinc-500 pt-2 space-y-1">
                <div>✓ Free shipping over $50</div>
                <div>✓ 30-day returns</div>
              </div>
              <div className="h-px bg-zinc-100" />
              <div className="text-[12px] space-y-1.5 text-zinc-600">
                <div className="flex justify-between"><span>Battery life</span><span>30 hours ANC</span></div>
                <div className="flex justify-between"><span>Connectivity</span><span>Bluetooth 5.3</span></div>
                <div className="flex justify-between"><span>Noise cancelling</span><span>Adaptive ANC</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-50 border-l border-zinc-200">
          <div className="h-10 border-b border-zinc-200 px-4 flex items-center">
            <span className="text-[11px] font-semibold tracking-[0.12em] text-zinc-500">TEST RUN SUMMARY</span>
          </div>
          <div className="p-4 space-y-3 text-[12px]">
            <div className="rounded-md border border-zinc-200 bg-white p-3">
              <div className="text-zinc-500 font-mono">Step 1</div>
              <div className="font-medium">Inspect top navigation</div>
              <div className="text-zinc-500 mt-1">4 interactive links discovered</div>
            </div>
            <div className="rounded-md border border-zinc-200 bg-white p-3">
              <div className="text-zinc-500 font-mono">Step 2</div>
              <div className="font-medium">Validate product media and variants</div>
              <div className="text-zinc-500 mt-1">Image and swatches are visible</div>
            </div>
            <div className="rounded-md border border-zinc-200 bg-white p-3">
              <div className="text-zinc-500 font-mono">Step 3</div>
              <div className="font-medium">Test primary CTA</div>
              <div className="text-zinc-500 mt-1">“Add to bag” button clickable</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
