const ready = ["React/Tailwind/SVG renderer", "Visual Recipe schema", "Pattern Library", "Engine Router", "Mock AI translator", "Local feedback", "Local Visual Memory", "Tech Lab placeholders"];
const future = ["Database feedback", "Secure server-side AI", "D3 knowledge graphs", "Canvas simulation upgrades", "Three.js/R3F for true 3D", "MapLibre for geography", "WebGPU with fallback"];

export function VisualEngineV1ReadinessPanel() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.04] p-6">
        <h2 className="text-xl font-semibold text-white">Ready now</h2>
        <ul className="mt-4 grid gap-2">{ready.map((item) => <li key={item} className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-emerald-50">✓ {item}</li>)}</ul>
      </div>
      <div className="rounded-2xl border border-violet-300/20 bg-violet-300/[0.04] p-6">
        <h2 className="text-xl font-semibold text-white">Future upgrades</h2>
        <ul className="mt-4 grid gap-2">{future.map((item) => <li key={item} className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-violet-50">→ {item}</li>)}</ul>
      </div>
    </section>
  );
}
