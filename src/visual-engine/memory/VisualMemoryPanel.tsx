import type { VisualMemory } from "./visualMemory.types";

export function VisualMemoryPanel({ memory }: { memory: VisualMemory }) {
  return (
    <article className="rounded-lg border border-emerald-300/20 bg-emerald-300/[0.05] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-200/70">{memory.audience} memory</p>
          <h4 className="mt-2 text-base font-semibold text-white">{memory.snapshot.title}</h4>
          <p className="mt-1 text-xs text-slate-400">{memory.patternId} / {memory.engineId}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-emerald-100">{memory.score.successRate}% success</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{memory.snapshot.explanation}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md border border-white/10 bg-black/20 p-2 text-slate-300">Clarity <strong className="float-right text-white">{memory.clarityScore}/5</strong></div>
        <div className="rounded-md border border-white/10 bg-black/20 p-2 text-slate-300">Useful <strong className="float-right text-white">{memory.usefulnessScore}/5</strong></div>
      </div>
      {memory.successfulAnalogies.length > 0 ? <p className="mt-3 text-xs leading-5 text-emerald-100">Analogy: {memory.successfulAnalogies[0]}</p> : null}
    </article>
  );
}
