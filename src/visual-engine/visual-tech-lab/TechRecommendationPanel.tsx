import { getEngineDisplayName } from "@/src/visual-engine/engines";

import type { VisualTechDemo } from "./techLab.types";
import { getRouterResultForTech } from "./techLab.utils";

interface TechRecommendationPanelProps {
  demo: VisualTechDemo;
}

export function TechRecommendationPanel({ demo }: TechRecommendationPanelProps) {
  const result = getRouterResultForTech(demo);

  return (
    <section className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] p-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-100/80">Engine Router Connection</p>
      <h2 className="mt-2 text-xl font-semibold text-white">{getEngineDisplayName(result.primaryEngine)}</h2>
      <p className="mt-2 text-sm leading-6 text-cyan-50/80">{result.reason}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-white/10 bg-black/20 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/70">Matching engine id</p>
          <p className="mt-2 text-sm font-semibold text-white">{demo.engineId}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-black/20 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/70">Installed</p>
          <p className="mt-2 text-sm font-semibold text-white">{result.installed ? "Yes" : "No"}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-black/20 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/70">Confidence</p>
          <p className="mt-2 text-sm font-semibold text-white">{Math.round(result.confidence * 100)}%</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/70">Fallback engines</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {result.fallbackEngines.length > 0 ? result.fallbackEngines.map((engineId) => (
            <span key={engineId} className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-cyan-50">
              {getEngineDisplayName(engineId)}
            </span>
          )) : <span className="text-sm text-cyan-50/70">No fallback needed.</span>}
        </div>
      </div>
      {result.warnings.length > 0 ? (
        <div className="mt-4 rounded-md border border-amber-300/30 bg-amber-300/[0.08] p-3">
          {result.warnings.map((warning) => (
            <p key={warning} className="text-sm text-amber-50">{warning}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
