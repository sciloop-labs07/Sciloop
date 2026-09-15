"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ForloopApiStatusPanel,
  bestVisualConstraints,
  translateWithForloopApiClient,
  type VisualApiMode,
  type VisualApiOutput,
} from "@/src/visual-engine/api";
import { VisualRecipeRenderer } from "@/src/visual-engine/renderer";
import { getEngineDisplayName, routeEngineForRecipe } from "@/src/visual-engine/engines";
import { getPatternById } from "@/src/visual-engine/patterns";
import { FeedbackPanel, type VisualFeedback } from "@/src/visual-engine/feedback";
import {
  getAllMemories,
  rememberSuccessfulFeedback,
  visualMemoryUpdatedEvent,
  type VisualMemory,
} from "@/src/visual-engine/memory";

import type { AITranslatorAudience, AIVisualTranslatorInput } from "./aiVisualTranslator.types";
import { aiTranslatorExampleInputs } from "./aiTranslatorExamples";
import { translateWithMockAIUsingMemory } from "./aiVisualTranslator";

const audiences: AITranslatorAudience[] = ["general", "student", "builder", "researcher", "kid"];
const difficulties: AIVisualTranslatorInput["difficulty"][] = ["beginner", "intermediate", "advanced"];

interface AIVisualTranslatorDemoProps {
  onFeedbackSubmitted?: (feedback: VisualFeedback) => void;
}

export function AIVisualTranslatorDemo({ onFeedbackSubmitted }: AIVisualTranslatorDemoProps) {
  const [rawText, setRawText] = useState("Explain Fourier Transform visually");
  const [targetAudience, setTargetAudience] = useState<AITranslatorAudience>("student");
  const [difficulty, setDifficulty] = useState<AIVisualTranslatorInput["difficulty"]>("beginner");
  const [useVisualMemory, setUseVisualMemory] = useState(true);
  const [memories, setMemories] = useState<VisualMemory[]>([]);
  const [translatorMode, setTranslatorMode] = useState<VisualApiMode>("forloop-api");
  const [bestVisualMode, setBestVisualMode] = useState(true);
  const [apiResult, setApiResult] = useState<VisualApiOutput>();
  const [isTranslating, setIsTranslating] = useState(false);
  const [submittedInput, setSubmittedInput] = useState<AIVisualTranslatorInput>({
    rawText,
    targetAudience,
    difficulty,
    preferredMode: "mock",
    useVisualMemory: true,
  });

  useEffect(() => {
    const refresh = () => setMemories(getAllMemories());
    const frame = window.requestAnimationFrame(refresh);
    window.addEventListener(visualMemoryUpdatedEvent, refresh);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(visualMemoryUpdatedEvent, refresh);
    };
  }, []);

  const mockResult = useMemo(() => translateWithMockAIUsingMemory(submittedInput, memories), [memories, submittedInput]);
  const recipe = apiResult?.recipe ?? mockResult.recipe;
  const selectedPattern = getPatternById(apiResult?.selectedPattern ?? mockResult.selectedPattern.id) ?? mockResult.selectedPattern;
  const selectedEngine = apiResult?.recipe ? routeEngineForRecipe(apiResult.recipe) : mockResult.selectedEngine;
  const validationErrors = apiResult?.validationErrors ?? mockResult.validationErrors;
  const reasoningSummary = apiResult?.reasoningSummary ?? mockResult.reasoningSummary;

  async function runTranslation() {
    const nextInput: AIVisualTranslatorInput = { rawText, targetAudience, difficulty, preferredMode: translatorMode, useVisualMemory };
    setSubmittedInput(nextInput);
    if (translatorMode === "mock") {
      setApiResult(undefined);
      return;
    }
    setIsTranslating(true);
    try {
      setApiResult(await translateWithForloopApiClient({
        rawText,
        targetAudience: targetAudience === "student"
          ? "beginner"
          : targetAudience === "builder"
            ? "intermediate"
            : targetAudience === "researcher"
              ? "advanced"
              : targetAudience === "general"
                ? "beginner"
                : targetAudience,
        difficulty,
        needsRealLifeExample: bestVisualMode,
        needsMathLayer: bestVisualMode,
        constraints: bestVisualMode ? bestVisualConstraints : ["Use controlled SciLoop V1 rendering only."],
      }));
    } finally {
      setIsTranslating(false);
    }
  }

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">AI Visual Translator Demo</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Idea to Controlled Visual Recipe</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">
            Mock mode and the server-side ForLoop router both produce recipes that remain controlled by SciLoop Pattern Library, Engine Router, validation, and Renderer.
          </p>
        </div>
        <div className="rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-right">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Mode</p>
          <p className="mt-1 text-sm font-semibold text-white">{apiResult?.fallbackUsed ? "Fallback active" : translatorMode}</p>
        </div>
      </div>
      <p className="mt-3 rounded-md border border-cyan-300/20 bg-cyan-300/[0.05] px-3 py-2 text-xs leading-5 text-cyan-50/80">
        ForLoop mode calls only the SciLoop server route. API keys never enter this component or browser bundle.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          <textarea
            value={rawText}
            onChange={(event) => setRawText(event.target.value)}
            className="min-h-32 w-full rounded-md border border-white/10 bg-slate-950/80 p-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
            placeholder="Type a concept, topic, or news explanation request..."
          />

          <div className="grid gap-3 md:grid-cols-3">
            <label className="text-sm text-slate-300">
              <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Translator mode</span>
              <select aria-label="Translator mode" value={translatorMode} onChange={(event) => setTranslatorMode(event.target.value as VisualApiMode)} className="w-full rounded-md border border-white/10 bg-slate-950 p-2 text-white">
                <option value="mock">Mock Translator</option>
                <option value="forloop-api">ForLoop API</option>
              </select>
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Audience</span>
              <select
                value={targetAudience}
                onChange={(event) => setTargetAudience(event.target.value as AITranslatorAudience)}
                className="w-full rounded-md border border-white/10 bg-slate-950 p-2 text-white"
              >
                {audiences.map((audience) => <option key={audience} value={audience}>{audience}</option>)}
              </select>
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-400">Difficulty</span>
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value as AIVisualTranslatorInput["difficulty"])}
                className="w-full rounded-md border border-white/10 bg-slate-950 p-2 text-white"
              >
                {difficulties.map((level) => <option key={level} value={level}>{level}</option>)}
              </select>
            </label>
          </div>

          <label className="flex items-center gap-3 rounded-md border border-violet-300/20 bg-violet-300/[0.05] p-3 text-sm text-violet-50">
            <input type="checkbox" checked={bestVisualMode} onChange={(event) => setBestVisualMode(event.target.checked)} className="size-4 accent-violet-300" />
            Generate Best Visual: clarity first, low text, strong layers, safe fallback
          </label>

          <label className="flex items-center gap-3 rounded-md border border-emerald-300/20 bg-emerald-300/[0.05] p-3 text-sm text-emerald-50">
            <input type="checkbox" checked={useVisualMemory} onChange={(event) => setUseVisualMemory(event.target.checked)} className="size-4 accent-emerald-300" />
            Check successful Visual Memory before creating a new explanation
          </label>

          <div className="flex flex-wrap gap-2">
            {aiTranslatorExampleInputs.map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => {
                  setRawText(example.input.rawText);
                  setTargetAudience(example.input.targetAudience ?? "general");
                  setDifficulty(example.input.difficulty ?? "beginner");
                }}
                className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.07]"
              >
                {example.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-black/40 p-3">
            <button
              type="button"
              onClick={runTranslation}
              disabled={isTranslating}
              className="flex min-h-20 w-full items-center justify-center gap-3 rounded-xl border border-red-400/40 bg-red-600 px-6 py-5 text-base font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_55px_rgba(220,38,38,0.28)] transition hover:bg-red-500 hover:shadow-[0_22px_70px_rgba(239,68,68,0.38)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400 disabled:cursor-wait disabled:opacity-60 sm:text-lg"
            >
              <span className="size-3 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.9)]" aria-hidden="true" />
              {isTranslating ? "Creating Controlled Visual…" : "Create Visual Through ForLoop API"}
            </button>
            <p className="mt-3 text-center text-xs leading-5 text-slate-400">
              Meaning comes from the API. Visual structure and rendering remain controlled by SciLoop.
            </p>
          </div>
          <ForloopApiStatusPanel mode={translatorMode} fallbackActive={Boolean(apiResult?.fallbackUsed)} />
        </div>

        <aside className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/80">Translator result</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{recipe.title}</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-md border border-white/10 bg-black/20 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/70">Selected pattern</p>
              <p className="mt-1 text-white">{selectedPattern.name}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/20 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/70">Visual memory</p>
              <p className="mt-1 text-white">{mockResult.memoryUsed ? `Reused ${mockResult.memoryUsed.concept}` : "No matching successful memory"}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/20 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/70">Selected engine</p>
              <p className="mt-1 text-white">{getEngineDisplayName(selectedEngine.primaryEngine)}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/20 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/70">Validation</p>
              <p className="mt-1 text-white">{validationErrors.length === 0 ? "Valid recipe" : `${validationErrors.length} issue(s)`}</p>
            </div>
            <p className="text-xs leading-5 text-cyan-50/75">{reasoningSummary}</p>
          </div>
          {(apiResult?.warnings ?? mockResult.warnings).length > 0 ? (
            <div className="mt-4 rounded-md border border-amber-300/30 bg-amber-300/[0.08] p-3">
              {(apiResult?.warnings ?? mockResult.warnings).map((warning) => (
                <p key={warning} className="text-xs leading-5 text-amber-50">{warning}</p>
              ))}
            </div>
          ) : null}
        </aside>
      </div>

      <div className="mt-5">
        <VisualRecipeRenderer recipe={recipe} mode="compact" />
      </div>
      <div className="mt-4">
        <FeedbackPanel
          recipeId={recipe.id}
          patternId={selectedPattern.id}
          engineId={selectedEngine.primaryEngine}
          concept={recipe.concept}
          visualType={recipe.visualType}
          audienceLevel={recipe.targetAudience}
          source="ai-translator-demo"
          onSubmitted={(feedback) => {
            rememberSuccessfulFeedback(feedback, recipe);
            onFeedbackSubmitted?.(feedback);
          }}
        />
      </div>
    </section>
  );
}
