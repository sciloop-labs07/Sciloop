import { VISUAL_ENGINE_V1_PIPELINE } from "./visualEngineV1.constants";

export function VisualEngineV1PipelineView() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-2xl font-semibold text-white">V1 Pipeline</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-4 xl:grid-cols-8">
        {VISUAL_ENGINE_V1_PIPELINE.map((step, index) => (
          <article key={step.id} className="relative rounded-lg border border-white/10 bg-slate-950/70 p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-200/70">Step {index + 1}</p>
            <h3 className="mt-2 text-sm font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">{step.description}</p>
            {index < VISUAL_ENGINE_V1_PIPELINE.length - 1 ? <span aria-hidden="true" className="absolute -right-2 top-1/2 z-10 hidden text-cyan-300 xl:block">→</span> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
