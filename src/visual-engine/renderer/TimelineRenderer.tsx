import type { TimelineRendererProps } from "./renderer.types";

export function TimelineRenderer({ recipe }: TimelineRendererProps) {
  if (recipe.timeline.stages.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <h3 className="text-sm font-semibold text-white">Timeline</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {recipe.timeline.stages.map((stage, index) => (
          <article key={stage.id} className="relative rounded-md border border-white/10 bg-slate-950/60 p-3">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-cyan-300 text-xs font-semibold text-slate-950">{index + 1}</span>
              <h4 className="text-sm font-semibold text-white">{stage.label}</h4>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-300">{stage.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
