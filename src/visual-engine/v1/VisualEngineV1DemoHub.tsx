"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ForloopApiStatusPanel,
  bestVisualConstraints,
  translateWithForloopApiClient,
  type VisualApiMode,
  type VisualApiOutput,
} from "@/src/visual-engine/api";
import { routeEngineForRecipe } from "@/src/visual-engine/engines";
import {
  EvolutionNotesPanel,
  FeedbackPanel,
  FeedbackSummaryPanel,
  getAllVisualFeedback,
  visualFeedbackUpdatedEvent,
  type VisualFeedback,
} from "@/src/visual-engine/feedback";
import {
  VisualMemoryExplorer,
  getAllMemories,
  rememberSuccessfulFeedback,
  visualMemoryUpdatedEvent,
  type VisualMemory,
} from "@/src/visual-engine/memory";
import { VisualRecipeRenderer } from "@/src/visual-engine/renderer";
import { getPatternById } from "@/src/visual-engine/patterns";

import { runVisualEngineV1DemoPipeline } from "./visualEngineV1Pipeline";
import type { VisualEngineV1DemoConcept } from "./visualEngineV1.types";

export function VisualEngineV1DemoHub({ concept }: { concept: VisualEngineV1DemoConcept }) {
  const [rawText, setRawText] = useState(concept.userPrompt);
  const [submittedText, setSubmittedText] = useState(concept.userPrompt);
  const [feedback, setFeedback] = useState<VisualFeedback[]>([]);
  const [memories, setMemories] = useState<VisualMemory[]>([]);
  const [translatorMode, setTranslatorMode] = useState<VisualApiMode>("forloop-api");
  const [bestVisualMode, setBestVisualMode] = useState(true);
  const [apiResult, setApiResult] = useState<VisualApiOutput>();
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const refreshFeedback = () => setFeedback(getAllVisualFeedback());
    const refreshMemory = () => setMemories(getAllMemories());
    const frame = window.requestAnimationFrame(() => {
      refreshFeedback();
      refreshMemory();
    });
    window.addEventListener(visualFeedbackUpdatedEvent, refreshFeedback);
    window.addEventListener(visualMemoryUpdatedEvent, refreshMemory);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(visualFeedbackUpdatedEvent, refreshFeedback);
      window.removeEventListener(visualMemoryUpdatedEvent, refreshMemory);
    };
  }, []);

  const mockResult = useMemo(() => runVisualEngineV1DemoPipeline({
    rawText: submittedText,
    targetAudience: concept.audience,
    difficulty: concept.audience,
    memories,
  }), [concept.audience, memories, submittedText]);
  const recipe = apiResult?.recipe ?? mockResult.recipe;
  const selectedPattern = getPatternById(apiResult?.selectedPattern ?? mockResult.selectedPattern.id) ?? mockResult.selectedPattern;
  const selectedEngine = apiResult?.recipe ? routeEngineForRecipe(apiResult.recipe) : mockResult.selectedEngine;
  const validationErrors = apiResult?.validationErrors ?? mockResult.validationErrors;
  const fallbackActive = apiResult?.fallbackUsed ?? false;
  const reasoningSummary = apiResult?.reasoningSummary ?? mockResult.translation.reasoningSummary;

  async function translateAndRender() {
    setSubmittedText(rawText);
    if (translatorMode === "mock") {
      setApiResult(undefined);
      return;
    }
    setIsTranslating(true);
    try {
      setApiResult(await translateWithForloopApiClient({
        rawText,
        sourceType: "concept",
        targetAudience: concept.audience,
        difficulty: concept.audience,
        needsRealLifeExample: bestVisualMode,
        needsMathLayer: bestVisualMode && concept.domain === "math",
        constraints: bestVisualMode ? bestVisualConstraints : ["Use controlled SciLoop V1 rendering only."],
      }));
    } finally {
      setIsTranslating(false);
    }
  }

  return (
    <section className="space-y-5">
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">AI Visual Translator</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Run the connected V1 pipeline</h2>
            <p className="mt-2 text-sm text-slate-300">Choose deterministic mock mode or the server-side ForLoop provider router. Both paths remain under SciLoop validation and rendering control.</p>
          </div>
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">{fallbackActive ? "fallback-active" : translatorMode}</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-sm text-slate-300">
            <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Translator mode</span>
            <select aria-label="Translator mode" value={translatorMode} onChange={(event) => setTranslatorMode(event.target.value as VisualApiMode)} className="w-full rounded-md border border-white/10 bg-slate-950 p-2 text-white">
              <option value="mock">Mock Translator</option>
              <option value="forloop-api">ForLoop API</option>
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-md border border-violet-300/20 bg-violet-300/[0.05] p-3 text-sm text-violet-50">
            <input type="checkbox" checked={bestVisualMode} onChange={(event) => setBestVisualMode(event.target.checked)} className="size-4 accent-violet-300" />
            Generate Best Visual — clarity first
          </label>
        </div>
        <textarea value={rawText} onChange={(event) => setRawText(event.target.value)} aria-label="V1 translator input" className="mt-4 min-h-28 w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none transition focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10" />
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-black/40 p-3">
          <button
            type="button"
            disabled={isTranslating}
            onClick={translateAndRender}
            className="flex min-h-20 w-full items-center justify-center gap-3 rounded-xl border border-red-400/40 bg-red-600 px-6 py-5 text-base font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_55px_rgba(220,38,38,0.28)] transition hover:bg-red-500 hover:shadow-[0_22px_70px_rgba(239,68,68,0.38)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400 disabled:cursor-wait disabled:opacity-60 sm:text-lg"
          >
            <span className="size-3 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.9)]" aria-hidden="true" />
            {isTranslating ? "Creating Controlled Visual…" : "Create Visual Through ForLoop API"}
          </button>
          <p className="mt-3 text-center text-xs leading-5 text-slate-400">
            API creates structured recipe JSON. SciLoop controls the pattern, engine, renderer, feedback, and memory.
          </p>
        </div>
        <div className="mt-4">
          <ForloopApiStatusPanel mode={translatorMode} fallbackActive={fallbackActive} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Pattern", selectedPattern.name],
            ["Engine", selectedEngine.primaryEngine],
            ["Validation", validationErrors.length === 0 ? "Valid recipe" : `${validationErrors.length} errors`],
            ["Visual Memory", mockResult.memoryMetadata.matched ? `Reused ${mockResult.memoryMetadata.matched.concept}` : "No match reused"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-white/10 bg-slate-950/70 p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{label}</p>
              <p className="mt-2 text-sm font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-400">{reasoningSummary}</p>
      </section>

      <VisualRecipeRenderer recipe={recipe} />

      <FeedbackPanel
        recipeId={recipe.id}
        patternId={selectedPattern.id}
        engineId={selectedEngine.primaryEngine}
        concept={recipe.concept}
        visualType={recipe.visualType}
        audienceLevel={recipe.targetAudience}
        source="ai-translator-demo"
        onSubmitted={(item) => rememberSuccessfulFeedback(item, recipe)}
      />

      <FeedbackSummaryPanel feedbackList={feedback} />
      <EvolutionNotesPanel
        feedbackList={feedback}
        recipeId={recipe.id}
        patternId={selectedPattern.id}
        engineId={selectedEngine.primaryEngine}
      />
      <VisualMemoryExplorer />

      <section className="rounded-2xl border border-violet-300/20 bg-violet-300/[0.04] p-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-violet-200/80">Visual Tech Frontier Lab</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Rendering engines are tools, not the invention</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">Compare safe live renderers and explicitly labeled future placeholders without making heavy engines mandatory.</p>
        <a href="/visual-frontier/tech-lab" className="mt-4 inline-flex rounded-md border border-violet-300/40 bg-violet-300/10 px-4 py-2 text-sm text-violet-50">Open Tech Frontier Lab</a>
      </section>
    </section>
  );
}
