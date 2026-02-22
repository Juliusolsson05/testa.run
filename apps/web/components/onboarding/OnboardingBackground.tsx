export function OnboardingBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_380px_at_50%_0%,rgba(191,219,254,0.45),transparent_72%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: "radial-gradient(circle, #64748b 0.8px, transparent 0.8px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="pointer-events-none absolute -top-14 left-[-120px] h-52 w-80 rounded-full bg-[#bfdbfe]/45 blur-2xl animate-[cloud-drift-1_22s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -top-10 right-[-120px] h-48 w-72 rounded-full bg-[#dbeafe]/50 blur-2xl animate-[cloud-drift-2_26s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute bottom-[-70px] left-[18%] h-44 w-64 rounded-full bg-[#dbeafe]/40 blur-2xl animate-[cloud-drift-3_28s_ease-in-out_infinite]" />
    </>
  )
}
