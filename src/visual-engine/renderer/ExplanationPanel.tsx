import type { ExplanationPanelProps } from "./renderer.types";

export function ExplanationPanel({ recipe }: ExplanationPanelProps) {
  return (
    <aside className="rounded-lg border border-white/10 bg-slate-950/80 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/80">Explanation</p>
      <h3 className="mt-2 text-base font-semibold text-white">{recipe.explanation.simple}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{recipe.explanation.detailed}</p>

      <div className="mt-5">
        <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Key takeaways</h4>
        <ul className="mt-2 space-y-2">
          {recipe.explanation.keyTakeaways.map((takeaway) => (
            <li key={takeaway} className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200">
              {takeaway}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Reading order</h4>
        <p className="mt-2 text-sm leading-6 text-slate-300">{recipe.explanation.visualReadingOrder.join(" -> ")}</p>
      </div>

      <div className="mt-5 rounded-md border border-cyan-300/20 bg-cyan-300/[0.06] p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">Recommended engine</p>
        <p className="mt-1 text-sm text-white">{recipe.engineRecommendation.primary}</p>
        <p className="mt-2 text-xs leading-5 text-cyan-50/75">{recipe.engineRecommendation.reason}</p>
      </div>
    </aside>
  );
}
