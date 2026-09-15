"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";

import type { InnovationRecord } from "@/data/innovations";
import { PREDICTIVE_VISUAL_CANARY_SLUG, predictiveVisualCanaryEnabled } from "@/lib/sciloop-feature-flags";
import { evidenceBriefFromInnovation } from "@/src/possibilities";
import { TypewriterRenderer } from "@/src/ai-streaming/components/TypewriterRenderer";
import { validatePredictiveVisualPackage, validateVisualRecipe, type PredictiveVisualPackage, type VisualRecipe } from "@/src/visual-engine/foundation";
import { VisualRecipeRenderer } from "@/src/visual-engine/renderer";
import type {
  PossibilityLens,
  PossibilityPipelineSuccess,
  ScenarioClass,
} from "@/src/possibilities";

type PanelState = "idle" | "loading" | "ready" | "error";
type PredictiveVisualState = "idle" | "loading" | "ready" | "error";

const lensOptions: Array<{ id: PossibilityLens; label: string }> = [
  { id: "scientific", label: "Scientific" },
  { id: "technical", label: "Technical" },
  { id: "economic", label: "Economic" },
  { id: "social", label: "Social" },
  { id: "environmental", label: "Environmental" },
];

const classLabels: Record<ScenarioClass, string> = {
  supported: "Evidence-linked",
  plausible: "Condition-dependent",
  speculative: "Speculative",
};

function statusLabel(state: PanelState) {
  if (state === "loading") return "Building possibility map…";
  if (state === "ready") return "Validated scenario map";
  if (state === "error") return "Needs another attempt";
  return "Ready to explore";
}

export function PossibilityEnginePanel({ innovation, onOpenChange, underConstruction = false }: { innovation: InnovationRecord; onOpenChange?: (open: boolean) => void; underConstruction?: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<PanelState>("idle");
  const [lens, setLens] = useState<PossibilityLens>("scientific");
  const [result, setResult] = useState<PossibilityPipelineSuccess | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [predictiveVisualState, setPredictiveVisualState] = useState<PredictiveVisualState>("idle");
  const [predictiveRecipe, setPredictiveRecipe] = useState<VisualRecipe | null>(null);
  const visualCanaryAvailable = predictiveVisualCanaryEnabled && innovation.slug === PREDICTIVE_VISUAL_CANARY_SLUG;

  useEffect(() => {
    document.documentElement.classList.toggle("possibility-focus-active", open);
    return () => document.documentElement.classList.remove("possibility-focus-active");
  }, [open]);

  async function explore(nextLens = lens) {
    track("scenario_map_requested", { signal: innovation.slug, lens: nextLens });
    setOpen(true);
    onOpenChange?.(true);
    if (underConstruction) return;
    setState("loading");
    setResult(null);
    setPredictiveVisualState("idle");
    setPredictiveRecipe(null);
    try {
      const response = await fetch("/api/possibilities", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          brief: evidenceBriefFromInnovation(innovation),
          lens: nextLens,
          includeVisual: true,
          // Keep the existing experience available when an optional AI
          // preparation provider is unavailable; the route validates its
          // deterministic evidence and scenario fallback before returning it.
          requireAiPreparation: false,
        }),
      });
      const data = await response.json() as PossibilityPipelineSuccess | { ok: false; error?: string };
      if (!response.ok || !data.ok) throw new Error("Possibility pipeline did not return a validated result.");
      setResult(data);
      setSelectedScenarioId(data.scenarios.scenarios[0]?.id ?? null);
      setState("ready");
      track("scenario_map_ready", { signal: innovation.slug, lens: nextLens });
    } catch {
      setState("error");
    }
  }

  function closeCleanView() {
    setOpen(false);
    setState("idle");
    setResult(null);
    setSelectedScenarioId(null);
    setPredictiveVisualState("idle");
    setPredictiveRecipe(null);
    onOpenChange?.(false);
  }

  function changeLens(nextLens: PossibilityLens) {
    setLens(nextLens);
    if (open) void explore(nextLens);
  }

  async function visualizePredictiveModel() {
    if (!visualCanaryAvailable) return;
    setPredictiveVisualState("loading");
    setPredictiveRecipe(null);
    try {
      const response = await fetch("/api/predictive-visual", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: innovation.slug }),
      });
      const data = await response.json() as { ok?: boolean; package?: PredictiveVisualPackage; recipe?: VisualRecipe };
      if (!response.ok || !data.ok || !data.package || !data.recipe || !validatePredictiveVisualPackage(data.package).ok || !validateVisualRecipe(data.recipe).ok) {
        throw new Error("The visual model did not pass SciLoop validation.");
      }
      setPredictiveRecipe(data.recipe);
      setPredictiveVisualState("ready");
      track("predictive_model_visualized", { signal: innovation.slug });
    } catch {
      setPredictiveVisualState("error");
    }
  }

  const selectedScenario = result?.scenarios.scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? result?.scenarios.scenarios[0];
  const selectedVisual = result?.visuals.find((visual) => visual.scenarioId === selectedScenario?.id);
  const runtimeWarnings = result?.warnings.filter((warning) => warning !== result.scenarios.disclaimer) ?? [];
  const liveSynthesis = result
    ? `SciLoop AI has traced ${result.analysis.discovery.title} from the earlier limitation to the discovery, then into three conditional futures. The strongest path is ${result.scenarios.scenarios[0]?.title ?? "the evidence-linked scenario"}. Every possibility remains tied to evidence, conditions, risks, and unknowns.`
    : "";

  return <section className="detail-section possibility-panel rounded-[32px] border border-cyan-200/15 p-6 md:p-8" aria-labelledby="possibility-engine-title">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="eyebrow">Scenario comparison</div>
        <h2 id="possibility-engine-title" className="detail-heading">Compare conditional futures.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">SciLoop separates evidence, conditions, risks, and speculation before drawing a possible future. These are scenarios—not promises.</p>
      </div>
      <div className="flex flex-wrap gap-2"><button type="button" onClick={() => void explore()} className="possibility-launch-button min-h-12 rounded-2xl border border-cyan-100/30 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:border-cyan-100/60 hover:bg-cyan-100/10">{open ? "Refresh possibilities" : "Explore possibilities →"}</button>{open && <button type="button" onClick={closeCleanView} className="min-h-12 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-400 transition hover:border-white/25 hover:text-white">Exit clean view</button>}</div>
    </div>

    {open && <div className="mt-7 border-t border-white/10 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" aria-label="Possibility lens">
          {lensOptions.map((option) => <button key={option.id} type="button" onClick={() => changeLens(option.id)} className={`rounded-full border px-3 py-2 text-xs transition ${lens === option.id ? "border-cyan-100/45 bg-cyan-100/10 text-cyan-50" : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"}`}>{option.label}</button>)}
        </div>
        <div className={`possibility-status possibility-status-${state}`} role="status"><span className="possibility-status-dot" />{statusLabel(state)}</div>
      </div>

      {state === "loading" && <div className="mt-6 grid gap-3 md:grid-cols-3" aria-label="Loading possibility stages"><div className="possibility-skeleton" /><div className="possibility-skeleton" /><div className="possibility-skeleton" /></div>}
      {state === "error" && <div className="mt-6 rounded-2xl border border-rose-200/20 bg-rose-950/20 p-4 text-sm leading-6 text-rose-100">The validated pipeline did not return a result. Your innovation page is unchanged; try the map again when the AI layer is ready.</div>}

      {state === "ready" && result && selectedScenario && <div className="mt-6 space-y-6">
        <div className="rounded-2xl border border-cyan-200/20 bg-cyan-950/10 p-5 shadow-[0_0_32px_rgba(34,211,238,0.08)]" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
            <div className="eyebrow">Decision synthesis</div>
              <h3 className="mt-2 font-display text-xl font-semibold text-white">The possibility map is taking shape.</h3>
            </div>
            <span className="rounded-full border border-emerald-200/20 px-3 py-1.5 text-xs text-emerald-100">Evidence-linked</span>
          </div>
          <TypewriterRenderer key={`${result.brief.id}-${lens}`} text={liveSynthesis} animateOnce revealMode="words" intervalMs={38} className="mt-4 text-sm leading-7 text-slate-300" />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
          <div className="rounded-2xl border border-cyan-200/15 bg-cyan-950/10 p-5">
            <div className="eyebrow">Causal reasoning model · {result.analysis.discovery.domain}</div>
            <h3 className="mt-3 font-display text-2xl font-semibold text-white">{result.analysis.discovery.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{result.analysis.discovery.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium text-cyan-100"><span className="rounded-full border border-cyan-200/20 px-3 py-1.5">BEFORE</span><span aria-hidden="true">→</span><span className="rounded-full border border-cyan-200/20 px-3 py-1.5">DISCOVERY</span><span aria-hidden="true">→</span><span className="rounded-full border border-cyan-200/20 px-3 py-1.5">AFTER</span><span aria-hidden="true">→</span><span className="rounded-full border border-cyan-200/20 px-3 py-1.5">POSSIBILITY</span></div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
            <div className="eyebrow">Model boundary</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{result.analysis.disclaimer}</p>
            <div className="mt-4 text-xs text-slate-500">{result.stages.filter((stage) => stage.status === "completed").length} reasoning and validation stages complete</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/15 p-5"><div className="eyebrow">Before · the old state</div><h3 className="mt-3 font-display text-xl font-semibold text-white">What was known and possible?</h3><p className="mt-3 text-sm leading-7 text-slate-300">{result.analysis.before.knowledgeState}</p><div className="mt-4 space-y-3 text-sm leading-6 text-slate-400"><p><strong className="text-slate-200">Technology:</strong> {result.analysis.before.technologyState}</p><p><strong className="text-slate-200">Measurement:</strong> {result.analysis.before.measurementCapability}</p><p><strong className="text-slate-200">Working model:</strong> {result.analysis.before.dominantModel}</p></div><ul className="mt-4 space-y-2 text-sm text-amber-100/80">{result.analysis.before.majorLimitations.map((item) => <li key={item}>△ {item}</li>)}</ul></div>
          <div className="rounded-2xl border border-cyan-200/15 bg-cyan-950/10 p-5"><div className="eyebrow">The discovery · the mechanism</div><h3 className="mt-3 font-display text-xl font-semibold text-white">What changed underneath?</h3><p className="mt-3 text-sm leading-7 text-slate-300">{result.analysis.discoveryMechanism.whatWasDiscovered}</p><p className="mt-4 text-sm leading-7 text-slate-300">{result.analysis.discoveryMechanism.mechanism}</p><div className="mt-4 space-y-3 text-sm leading-6 text-slate-400"><p><strong className="text-slate-200">Assumption changed:</strong> {result.analysis.discoveryMechanism.previousAssumptionChanged}</p><p><strong className="text-slate-200">New capability:</strong> {result.analysis.discoveryMechanism.newCapability}</p></div></div>
        </div>

        <div className="rounded-2xl border border-violet-200/15 bg-violet-950/10 p-5"><div className="eyebrow">The breakthrough · causal transition</div><h3 className="mt-3 font-display text-xl font-semibold text-white">How did the limitation become a testable path?</h3><div className="mt-5 grid gap-3 md:grid-cols-2">{result.analysis.transition.causalChain.map((step, index) => <div key={step} className="flex gap-3 rounded-xl border border-white/10 bg-black/10 p-4"><span className="font-mono text-xs text-violet-200/70">0{index + 1}</span><span className="text-sm leading-6 text-slate-300">{step}</span></div>)}</div><div className="mt-5 grid gap-5 md:grid-cols-2"><div><div className="text-xs uppercase tracking-[0.16em] text-rose-200/70">Limitations reduced</div><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{result.analysis.transition.removedLimitations.map((item) => <li key={item}>→ {item}</li>)}</ul></div><div><div className="text-xs uppercase tracking-[0.16em] text-emerald-200/70">Capabilities opened</div><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{result.analysis.transition.newCapabilities.map((item) => <li key={item}>→ {item}</li>)}</ul></div></div></div>

        <div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-black/15 p-5"><div className="eyebrow">After · science</div><p className="mt-3 text-sm leading-7 text-slate-300">{result.analysis.after.scientificState}</p></div><div className="rounded-2xl border border-white/10 bg-black/15 p-5"><div className="eyebrow">After · technology</div><p className="mt-3 text-sm leading-7 text-slate-300">{result.analysis.after.technologyState}</p></div><div className="rounded-2xl border border-white/10 bg-black/15 p-5"><div className="eyebrow">After · human capability</div><p className="mt-3 text-sm leading-7 text-slate-300">{result.analysis.after.humanCapability}</p></div></div>

        <div className="rounded-2xl border border-amber-200/15 bg-amber-950/10 p-5"><div className="eyebrow">Counterfactual · without the discovery</div><h3 className="mt-3 font-display text-xl font-semibold text-white">The contrast that makes the change legible.</h3><p className="mt-3 text-sm leading-7 text-slate-300">{result.analysis.counterfactual.comparison}</p><div className="mt-5 grid gap-5 md:grid-cols-2"><div><div className="text-xs uppercase tracking-[0.16em] text-amber-200/70">What stays limited</div><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{result.analysis.counterfactual.withoutDiscovery.limitationsRemain.map((item) => <li key={item}>△ {item}</li>)}</ul></div><div><div className="text-xs uppercase tracking-[0.16em] text-slate-400">Likely alternatives</div><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{result.analysis.counterfactual.withoutDiscovery.alternatives.map((item) => <li key={item}>→ {item}</li>)}</ul></div></div></div>

        <div className="rounded-2xl border border-white/10 bg-black/15 p-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><div className="eyebrow">SciLoop Impact Model</div><h3 className="mt-2 font-display text-xl font-semibold text-white">Relative degree of change</h3></div><span className="text-xs text-slate-500">Not objective measurements</span></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(result.analysis.impactModel).map(([label, value]) => <div key={label}><div className="flex justify-between gap-3 text-xs text-slate-400"><span>{label.replace(/([A-Z])/g, " $1")}</span><span className="font-mono text-cyan-100">{value}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300" style={{ width: `${value}%` }} /></div></div>)}</div></div>

        <div className="rounded-2xl border border-cyan-200/10 bg-cyan-950/10 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="eyebrow">Text-only visual compiler</div><h3 className="mt-2 font-display text-xl font-semibold text-white">Ready for the future visual engine</h3></div><span className="rounded-full border border-cyan-200/20 px-3 py-1.5 text-xs text-cyan-100">No image generation in V1</span></div><div className="mt-5 grid gap-3 md:grid-cols-2"><p className="rounded-xl border border-white/10 p-4 text-sm leading-6 text-slate-300"><strong className="block text-cyan-100">Before scene</strong>{result.analysis.visualScene.beforeScene}</p><p className="rounded-xl border border-white/10 p-4 text-sm leading-6 text-slate-300"><strong className="block text-cyan-100">Discovery scene</strong>{result.analysis.visualScene.discoveryScene}</p><p className="rounded-xl border border-white/10 p-4 text-sm leading-6 text-slate-300"><strong className="block text-cyan-100">After scene</strong>{result.analysis.visualScene.afterScene}</p><p className="rounded-xl border border-white/10 p-4 text-sm leading-6 text-slate-300"><strong className="block text-cyan-100">Future scene</strong>{result.analysis.visualScene.futureScene}</p></div><p className="mt-4 text-xs leading-6 text-slate-500"><strong className="text-slate-300">Transition:</strong> {result.analysis.visualScene.transitionAnimation}</p></div>

        <div className="grid gap-3 md:grid-cols-3">
          {result.scenarios.scenarios.map((scenario) => <button key={scenario.id} type="button" onClick={() => { setSelectedScenarioId(scenario.id); track("scenario_compared", { signal: innovation.slug, scenario: scenario.id }); }} className={`possibility-scenario-card text-left ${selectedScenario.id === scenario.id ? "possibility-scenario-card-active" : ""}`}>
            <div className="flex items-center justify-between gap-3"><span className="possibility-horizon">{scenario.horizon}</span><span className={`possibility-class possibility-class-${scenario.classification}`}>{classLabels[scenario.classification]}</span></div>
            <h3 className="mt-4 font-display text-xl font-semibold text-white">{scenario.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{scenario.summary}</p>
          </button>)}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
            <div className="eyebrow">Causal path · {selectedScenario.lens}</div>
            <h3 className="mt-3 font-display text-2xl font-semibold text-white">{selectedScenario.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{selectedScenario.summary}</p>
            <div className="possibility-causal-path mt-6">
              {selectedScenario.causalChain.map((step, index) => <div key={step.id} className="possibility-causal-step"><span className="possibility-causal-index">0{index + 1}</span><div><div className="font-medium text-white">{step.label}</div><p className="mt-1 text-xs leading-5 text-slate-500">{step.explanation}</p></div></div>)}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
            <div className="eyebrow">Conditions and limits</div>
            <div className="mt-4 space-y-4"><div><div className="text-xs uppercase tracking-[0.16em] text-cyan-200/70">Must happen</div><ul className="mt-2 space-y-2 text-sm leading-6 text-slate-300">{selectedScenario.requiredConditions.map((item) => <li key={item}>→ {item}</li>)}</ul></div><div><div className="text-xs uppercase tracking-[0.16em] text-amber-200/70">Risk</div><ul className="mt-2 space-y-2 text-sm leading-6 text-slate-300">{selectedScenario.risks.map((item) => <li key={item}>△ {item}</li>)}</ul></div><div><div className="text-xs uppercase tracking-[0.16em] text-violet-200/70">Could falsify it</div><ul className="mt-2 space-y-2 text-sm leading-6 text-slate-300">{selectedScenario.falsifiers.map((item) => <li key={item}>? {item}</li>)}</ul></div></div>
          </div>
        </div>

        {selectedVisual && <div className="rounded-2xl border border-cyan-200/10 bg-cyan-950/10 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="eyebrow">Visual compiler</div><h3 className="mt-2 font-display text-xl font-semibold text-white">{selectedVisual.title}</h3></div><span className="rounded-full border border-cyan-200/20 px-3 py-1.5 text-xs text-cyan-100">{selectedVisual.nodes.length} nodes · {selectedVisual.edges.length} links</span></div><div className="mt-5 grid gap-3 md:grid-cols-4">{selectedVisual.nodes.map((node, index) => <div key={node.id} className={`possibility-visual-node possibility-visual-node-${node.kind}`}><span>0{index + 1}</span><strong>{node.label}</strong></div>)}</div><div className="mt-4 flex flex-wrap gap-2">{selectedVisual.edges.map((edge) => <span key={edge.id} className="possibility-edge-pill">{edge.label}</span>)}</div></div>}

        {visualCanaryAvailable && <section className="rounded-2xl border border-cyan-200/20 bg-cyan-950/10 p-5" aria-label="SciLoop predictive visual model">
          <div className="flex flex-wrap items-center justify-between gap-4"><div><div className="eyebrow">SciLoop predictive visual canary</div><h3 className="mt-2 font-display text-xl font-semibold text-white">See the evidence-linked model.</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">SciLoop compiles this model from validated evidence, causal relationships, conditional scenarios, and explicit unknowns.</p></div><button type="button" onClick={() => void visualizePredictiveModel()} disabled={predictiveVisualState === "loading"} className="min-h-11 rounded-xl border border-cyan-100/35 px-4 py-2.5 text-sm font-semibold text-cyan-50 transition hover:border-cyan-100/60 hover:bg-cyan-100/10 disabled:cursor-wait disabled:opacity-60">{predictiveVisualState === "loading" ? "Compiling model…" : predictiveRecipe ? "Refresh visual model" : "Visualize model"}</button></div>
          {predictiveVisualState === "error" && <p className="mt-4 rounded-xl border border-amber-200/20 bg-amber-950/15 p-4 text-sm leading-6 text-amber-100">The visual model could not be compiled. Your validated possibility map is still available above.</p>}
          {predictiveVisualState === "ready" && predictiveRecipe && <div className="mt-5"><VisualRecipeRenderer recipe={predictiveRecipe} /></div>}
        </section>}

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500"><span>{result.scenarios.disclaimer}</span><span>{result.stages.filter((stage) => stage.status === "completed").length} validation stages complete</span></div>
        {runtimeWarnings.map((warning) => <div key={warning} className="possibility-runtime-note" role="status">{warning}</div>)}
      </div>}
    </div>}
  </section>;
}
