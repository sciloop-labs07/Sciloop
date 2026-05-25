"use client";

import type { GraphValidationResult, SemanticGraph } from "@/src/semantic/SemanticTypes";
import { graphSummary } from "@/src/semantic/SemanticGraph";

interface InspectorPanelProps {
  graph: SemanticGraph;
  validation: GraphValidationResult;
  selectedId?: string;
  hoveredId?: string;
}

export function InspectorPanel({ graph, validation, selectedId, hoveredId }: InspectorPanelProps) {
  const selected = graph.entities.find((entity) => entity.id === (selectedId ?? hoveredId));
  const summary = graphSummary(graph);

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <div className="eyebrow">What is happening?</div>
        <p className="mt-3 text-sm leading-6 text-slate-300">{graph.explanation}</p>
        {graph.warning ? <p className="mt-3 text-xs leading-5 text-amber-200">{graph.warning}</p> : null}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <div className="eyebrow">Current causal chain</div>
        <ol className="mt-3 space-y-2 text-sm text-slate-300">
          {(graph.meta?.causalChain ?? ["Cause", "Mechanism", "Effect"]).map((step, index) => (
            <li key={`${step}-${index}`} className="rounded-2xl bg-slate-950/40 px-3 py-2">
              <span className="mr-2 text-cyan-200">{index + 1}.</span>{step}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <div className="eyebrow">Inspector</div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
          {Object.entries(summary).map(([key, value]) => (
            <div key={key} className="rounded-2xl bg-slate-950/40 p-2">
              <div className="uppercase tracking-[0.18em] text-slate-500">{key}</div>
              <div className="mt-1 text-cyan-100">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl bg-slate-950/40 p-3 text-xs leading-5 text-slate-300">
          {selected ? (
            <>
              <div className="text-cyan-100">{selected.label}</div>
              <div>Type: {selected.type}</div>
              <div>Position: {selected.position.x.toFixed(2)}, {selected.position.y.toFixed(2)}</div>
            </>
          ) : (
            "Hover or click a node to inspect its semantic role."
          )}
        </div>
        {validation.warnings.length || validation.errors.length ? (
          <div className="mt-3 rounded-2xl border border-amber-200/20 bg-amber-200/5 p-3 text-xs leading-5 text-amber-100">
            {[...validation.errors, ...validation.warnings].join(" ")}
          </div>
        ) : null}
      </section>
    </div>
  );
}
