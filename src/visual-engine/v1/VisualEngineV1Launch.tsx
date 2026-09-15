"use client";

import { useMemo, useState } from "react";

import {
  SCILOOP_VISUAL_ENGINE_V1_NAME,
  SCILOOP_VISUAL_ENGINE_V1_TAGLINE,
  VISUAL_ENGINE_V1_DEMO_CONCEPTS,
} from "./visualEngineV1.constants";
import { VisualEngineV1DemoHub } from "./VisualEngineV1DemoHub";
import { runVisualEngineV1HealthCheck } from "./visualEngineV1Health";
import { VisualEngineV1Overview } from "./VisualEngineV1Overview";
import { VisualEngineV1PipelineView } from "./VisualEngineV1PipelineView";
import { VisualEngineV1ReadinessPanel } from "./VisualEngineV1ReadinessPanel";
import { VisualEngineV1StatusPanel } from "./VisualEngineV1StatusPanel";

export function VisualEngineV1Launch() {
  const [selectedConceptId, setSelectedConceptId] = useState(VISUAL_ENGINE_V1_DEMO_CONCEPTS[0]?.id ?? "");
  const selectedConcept = useMemo(
    () => VISUAL_ENGINE_V1_DEMO_CONCEPTS.find((concept) => concept.id === selectedConceptId) ?? VISUAL_ENGINE_V1_DEMO_CONCEPTS[0],
    [selectedConceptId],
  );
  const health = useMemo(() => runVisualEngineV1HealthCheck(), []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">SciLoop Visual OS · V1 Launch</p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">{SCILOOP_VISUAL_ENGINE_V1_NAME}</h1>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">{SCILOOP_VISUAL_ENGINE_V1_TAGLINE}</p>
          <nav className="mt-5 flex flex-wrap gap-2" aria-label="V1 related routes">
            <a href="/visual-frontier/visual-engine-demo" className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-200">Detailed Engine Demo</a>
            <a href="/visual-frontier/tech-lab" className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-200">Tech Frontier Lab</a>
          </nav>
        </header>

        <VisualEngineV1Overview />
        <VisualEngineV1PipelineView />

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Launch Demo Concepts</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {VISUAL_ENGINE_V1_DEMO_CONCEPTS.map((concept) => (
              <button key={concept.id} type="button" onClick={() => setSelectedConceptId(concept.id)} className={`rounded-full border px-4 py-2 text-sm ${selectedConceptId === concept.id ? "border-cyan-300/60 bg-cyan-300/15 text-white" : "border-white/10 bg-white/[0.03] text-slate-300"}`}>
                {concept.title}
              </button>
            ))}
          </div>
          {selectedConcept ? (
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-slate-950/70 p-4"><p className="text-xs text-slate-400">Goal</p><p className="mt-2 text-sm text-white">{selectedConcept.explanationGoal}</p></div>
              <div className="rounded-lg border border-white/10 bg-slate-950/70 p-4"><p className="text-xs text-slate-400">Expected pattern</p><p className="mt-2 text-sm text-white">{selectedConcept.expectedPattern}</p></div>
              <div className="rounded-lg border border-white/10 bg-slate-950/70 p-4"><p className="text-xs text-slate-400">Expected engine</p><p className="mt-2 text-sm text-white">{selectedConcept.expectedEngine}</p></div>
            </div>
          ) : null}
        </section>

        {selectedConcept ? <VisualEngineV1DemoHub key={selectedConcept.id} concept={selectedConcept} /> : null}

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">V1 Health Check</h2>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm uppercase text-cyan-100">{health.status}</span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {health.checks.map((check) => (
              <div key={check.id} className="rounded-lg border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm font-semibold text-white">{check.passed ? "✓" : "!"} {check.label}</p>
                {check.warning ? <p className="mt-2 text-xs text-amber-100">{check.warning}</p> : null}
                {check.error ? <p className="mt-2 text-xs text-rose-100">{check.error}</p> : null}
              </div>
            ))}
          </div>
        </section>

        <VisualEngineV1StatusPanel />
        <VisualEngineV1ReadinessPanel />
      </div>
    </main>
  );
}
