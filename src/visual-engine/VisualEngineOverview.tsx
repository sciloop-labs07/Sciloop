const pipeline = [
  ["Concept", "A question, topic, or news idea"],
  ["Visual Recipe", "Controlled structure, not generated drawing code"],
  ["Pattern", "A reusable explanation form"],
  ["Engine Router", "Chooses the smallest useful rendering tool"],
  ["Renderer", "Displays semantic layers, flows, and relationships"],
  ["Feedback", "Measures whether a human understood"],
  ["Evolution", "Creates reviewed improvement notes"],
] as const;

export function VisualEngineOverview() {
  return (
    <section id="overview" className="scroll-mt-24 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.04] p-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Visual Engine Overview</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">A Visual Understanding Operating System</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
        SciLoop is not an AI image generator. It turns ideas into controlled, reusable explanations and measures whether they helped.
      </p>
      <ol className="mt-5 grid gap-2 md:grid-cols-4 xl:grid-cols-7" aria-label="SciLoop Visual Engine pipeline">
        {pipeline.map(([title, description], index) => (
          <li key={title} className="relative rounded-md border border-white/10 bg-slate-950/70 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-200/70">Step {index + 1}</p>
            <h3 className="mt-2 text-sm font-semibold text-white">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
            {index < pipeline.length - 1 ? <span aria-hidden="true" className="absolute -right-2 top-1/2 z-10 hidden text-cyan-300 xl:block">→</span> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
