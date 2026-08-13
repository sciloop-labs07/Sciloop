import { VISUAL_ENGINE_V1_MODULES } from "./visualEngineV1.constants";

export function VisualEngineV1StatusPanel() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-2xl font-semibold text-white">Module Status</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {VISUAL_ENGINE_V1_MODULES.map((module) => (
          <article key={module.id} className="rounded-lg border border-white/10 bg-slate-950/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">{module.name}</h3>
              <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase text-cyan-100">{module.status}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{module.description}</p>
            {module.nextUpgrade ? <p className="mt-2 text-xs text-violet-200">Next: {module.nextUpgrade}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
