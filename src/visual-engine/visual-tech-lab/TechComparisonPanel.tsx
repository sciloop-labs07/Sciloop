import type { VisualTechDemo } from "./techLab.types";

interface TechComparisonPanelProps {
  demo: VisualTechDemo;
}

const fields = [
  ["clarity", "Clarity"],
  ["performance", "Performance"],
  ["interaction", "Interaction"],
  ["complexity", "Complexity"],
  ["dependencyCost", "Dependency cost"],
] as const;

export function TechComparisonPanel({ demo }: TechComparisonPanelProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Comparison</p>
      <h2 className="mt-2 text-xl font-semibold text-white">{demo.name} fit</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-5">
        {fields.map(([key, label]) => {
          const value = demo.comparison[key];
          return (
            <div key={key} className="rounded-md border border-white/10 bg-slate-950/60 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-cyan-300" style={{ width: `${value * 10}%` }} />
              </div>
              <p className="mt-2 text-sm font-semibold text-white">{value}/10</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-white/10 bg-slate-950/60 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Best visual pattern</p>
          <p className="mt-2 text-sm text-white">{demo.comparison.bestVisualPattern}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-slate-950/60 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Best SciLoop use case</p>
          <p className="mt-2 text-sm text-white">{demo.comparison.bestSciLoopUseCase}</p>
        </div>
      </div>
    </section>
  );
}
