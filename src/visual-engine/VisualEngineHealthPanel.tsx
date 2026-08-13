import { runVisualEngineHealthCheck } from "./visualEngineHealthCheck";

export function VisualEngineHealthPanel() {
  const result = runVisualEngineHealthCheck();
  const tone = result.status === "healthy"
    ? "border-emerald-300/30 bg-emerald-300/[0.06]"
    : result.status === "warning"
      ? "border-amber-300/30 bg-amber-300/[0.06]"
      : "border-rose-300/30 bg-rose-300/[0.06]";

  return (
    <section className={`rounded-xl border p-5 ${tone}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">Visual Engine Health Check</p>
          <h2 className="mt-2 text-xl font-semibold capitalize text-white">{result.status}</h2>
        </div>
        <p className="text-xs text-slate-300">{result.checks.filter((check) => check.ok).length}/{result.checks.length} checks passing</p>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {result.checks.map((check) => (
          <div key={check.id} className="rounded-md border border-white/10 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-white">{check.ok ? "✓" : "!"} {check.label}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{check.detail}</p>
          </div>
        ))}
      </div>
      {result.warnings.length > 0 ? <p className="mt-3 text-xs text-amber-100">{result.warnings.join(" ")}</p> : null}
      {result.errors.length > 0 ? <p className="mt-3 text-xs text-rose-100">{result.errors.join(" ")}</p> : null}
    </section>
  );
}
