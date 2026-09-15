import { SCILOOP_VISUAL_ENGINE_V1_MEANING } from "./visualEngineV1.constants";

const principles = [
  ["Visual Recipes", "Recipes keep AI output structured, validated, and renderer-safe."],
  ["Reusable Patterns", "Patterns preserve explanation forms that humans already understand."],
  ["Correct Engines", "The router chooses tools; the engine itself is not the invention."],
  ["Human Feedback", "Clarity and usefulness—not visual spectacle—measure success."],
  ["Visual Memory", "Successful explanations can guide future controlled translations."],
] as const;

export function VisualEngineV1Overview() {
  return (
    <section className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.04] p-6">
      <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">What V1 means</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{SCILOOP_VISUAL_ENGINE_V1_MEANING}</h2>
      <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
        It converts concepts into controlled visual recipes, renders them through reusable patterns and correct engines, learns from human feedback, and stores successful explanations as visual memory.
      </p>
      <p className="mt-4 rounded-lg border border-white/10 bg-slate-950/60 p-4 text-sm text-cyan-50">
        This is not an AI image generator. This is a Visual Understanding Operating System.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {principles.map(([title, description]) => (
          <article key={title} className="rounded-lg border border-white/10 bg-slate-950/70 p-4">
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
