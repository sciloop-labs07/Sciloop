"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AIVisualTranslatorDemo,
  EvolutionNotesPanel,
  FeedbackPanel,
  FeedbackStorageStatusPanel,
  FeedbackSummaryPanel,
  VisualEngineHealthPanel,
  VisualEngineOverview,
  VisualMemoryExplorer,
  VisualRecipeRenderer,
  allVisualPatterns,
  clearVisualFeedback,
  createRecipeFromPattern,
  engineRoutingExamples,
  exportVisualFeedbackJson,
  getAllVisualFeedback,
  getEngineDisplayName,
  routeEngineForRecipe,
  rememberSuccessfulFeedback,
  visualFeedbackImprovementLabels,
  visualFeedbackIssueLabels,
  visualFeedbackUpdatedEvent,
  visualLanguageAtoms,
  visualRecipeExamples,
  type VisualFeedback,
  type VisualPatternId,
} from "@/src/visual-engine";

const patternCategories = [...new Set(allVisualPatterns.map((pattern) => pattern.category))];
const patternVisualTypes = [...new Set(allVisualPatterns.map((pattern) => pattern.visualType))];
const demoSections = [
  ["overview", "Overview"],
  ["recipe-demo", "Renderer"],
  ["pattern-demo", "Patterns"],
  ["router-demo", "Router"],
  ["tech-lab", "Tech Lab"],
  ["translator-demo", "AI Translator"],
  ["feedback-demo", "Feedback"],
  ["memory-demo", "Memory"],
] as const;

export default function VisualEngineDemoPage() {
  const [selectedRecipeId, setSelectedRecipeId] = useState(visualRecipeExamples[0].id);
  const [selectedPatternId, setSelectedPatternId] = useState<VisualPatternId>(allVisualPatterns[0].id);
  const [selectedEngineExampleIndex, setSelectedEngineExampleIndex] = useState(0);
  const [feedbackList, setFeedbackList] = useState<VisualFeedback[]>([]);
  const [patternSearch, setPatternSearch] = useState("");
  const [patternCategory, setPatternCategory] = useState("all");
  const [patternVisualType, setPatternVisualType] = useState("all");
  const [patternAtom, setPatternAtom] = useState("all");
  const selectedRecipe = useMemo(
    () => visualRecipeExamples.find((recipe) => recipe.id === selectedRecipeId) ?? visualRecipeExamples[0],
    [selectedRecipeId],
  );
  const selectedPattern = allVisualPatterns.find((pattern) => pattern.id === selectedPatternId) ?? allVisualPatterns[0];
  const filteredPatterns = useMemo(() => {
    const query = patternSearch.trim().toLowerCase();
    return allVisualPatterns.filter((pattern) => {
      const searchable = `${pattern.name} ${pattern.shortDescription} ${pattern.exampleConcepts.join(" ")} ${pattern.tags.join(" ")}`.toLowerCase();
      return (!query || searchable.includes(query))
        && (patternCategory === "all" || pattern.category === patternCategory)
        && (patternVisualType === "all" || pattern.visualType === patternVisualType)
        && (patternAtom === "all" || pattern.atomsUsed.includes(patternAtom as (typeof pattern.atomsUsed)[number]));
    });
  }, [patternAtom, patternCategory, patternSearch, patternVisualType]);
  const patternPreviewRecipe = useMemo(
    () => createRecipeFromPattern(selectedPatternId, selectedPattern.name),
    [selectedPatternId, selectedPattern.name],
  );
  const selectedRecipeEngineResult = useMemo(() => routeEngineForRecipe(selectedRecipe), [selectedRecipe]);
  const selectedEngineExample = engineRoutingExamples[selectedEngineExampleIndex] ?? engineRoutingExamples[0];
  const patternPreviewEngineResult = useMemo(() => routeEngineForRecipe(patternPreviewRecipe), [patternPreviewRecipe]);

  const refreshFeedback = useCallback(() => {
    setFeedbackList(getAllVisualFeedback());
  }, []);

  useEffect(() => {
    window.addEventListener(visualFeedbackUpdatedEvent, refreshFeedback);
    const frame = window.requestAnimationFrame(refreshFeedback);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(visualFeedbackUpdatedEvent, refreshFeedback);
    };
  }, [refreshFeedback]);

  function downloadFeedback() {
    const blob = new Blob([exportVisualFeedbackJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sciloop-visual-feedback.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">SciLoop Visual Frontier</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">SciLoop Visual Engine</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              One connected system for controlled visual explanation, rendering, feedback, and evolution.
            </p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-right">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Examples</p>
            <p className="mt-1 text-sm font-semibold text-white">{visualRecipeExamples.length}</p>
          </div>
        </header>

        <nav className="sticky top-2 z-20 flex flex-wrap gap-2 rounded-xl border border-white/10 bg-slate-950/90 p-3 backdrop-blur" aria-label="Visual Engine sections">
          {demoSections.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-300/40 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300">
              {label}
            </a>
          ))}
          <a href="/visual-frontier/tech-lab" className="rounded-md border border-violet-300/30 bg-violet-300/[0.08] px-3 py-2 text-xs text-violet-100">
            Open full Tech Lab
          </a>
          <a href="/visual-frontier/v1" className="rounded-md border border-emerald-300/30 bg-emerald-300/[0.08] px-3 py-2 text-xs text-emerald-100">
            Open V1 Launch
          </a>
        </nav>

        <VisualEngineOverview />
        <VisualEngineHealthPanel />

        <section id="recipe-demo" className="scroll-mt-24 space-y-4" aria-labelledby="recipe-demo-title">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Visual Recipe Renderer Demo</p>
            <h2 id="recipe-demo-title" className="mt-2 text-2xl font-semibold text-white">Render controlled recipes safely</h2>
            <p className="mt-2 text-sm text-slate-300">Choose an example to inspect its layers, relationships, flows, explanation, and routed engine.</p>
          </div>
        <nav className="flex flex-wrap gap-2" aria-label="Visual recipe examples">
          {visualRecipeExamples.map((recipe) => {
            const active = recipe.id === selectedRecipeId;
            return (
              <button
                key={recipe.id}
                type="button"
                onClick={() => setSelectedRecipeId(recipe.id)}
                className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                  active
                    ? "border-cyan-300/50 bg-cyan-300/15 text-white"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.07]"
                }`}
              >
                {recipe.title}
              </button>
            );
          })}
        </nav>

        <VisualRecipeRenderer recipe={selectedRecipe} />
        <FeedbackPanel
          recipeId={selectedRecipe.id}
          patternId={selectedRecipe.pattern}
          engineId={selectedRecipeEngineResult.primaryEngine}
          concept={selectedRecipe.concept}
          visualType={selectedRecipe.visualType}
          audienceLevel={selectedRecipe.targetAudience}
          onSubmitted={(feedback) => {
            rememberSuccessfulFeedback(feedback, selectedRecipe);
            refreshFeedback();
          }}
        />
        </section>

        <section id="pattern-demo" className="scroll-mt-24 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Visual Pattern Library Demo</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Reusable Visual Patterns</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                Pattern memory lets SciLoop reuse controlled explanation forms before creating starter recipes.
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-right">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Patterns</p>
              <p className="mt-1 text-sm font-semibold text-white">{filteredPatterns.length}/{allVisualPatterns.length}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="text-xs text-slate-400">
              Search
              <input value={patternSearch} onChange={(event) => setPatternSearch(event.target.value)} placeholder="Concept or keyword" className="mt-2 w-full rounded-md border border-white/10 bg-slate-950 p-2 text-sm text-white outline-none focus:border-cyan-300/50" />
            </label>
            <label className="text-xs text-slate-400">
              Category
              <select value={patternCategory} onChange={(event) => setPatternCategory(event.target.value)} className="mt-2 w-full rounded-md border border-white/10 bg-slate-950 p-2 text-sm text-white">
                <option value="all">All categories</option>
                {patternCategories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label className="text-xs text-slate-400">
              Visual type
              <select value={patternVisualType} onChange={(event) => setPatternVisualType(event.target.value)} className="mt-2 w-full rounded-md border border-white/10 bg-slate-950 p-2 text-sm text-white">
                <option value="all">All visual types</option>
                {patternVisualTypes.map((visualType) => <option key={visualType} value={visualType}>{visualType}</option>)}
              </select>
            </label>
            <label className="text-xs text-slate-400">
              Atom
              <select value={patternAtom} onChange={(event) => setPatternAtom(event.target.value)} className="mt-2 w-full rounded-md border border-white/10 bg-slate-950 p-2 text-sm text-white">
                <option value="all">All atoms</option>
                {visualLanguageAtoms.map((atom) => <option key={atom.id} value={atom.id}>{atom.name}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {filteredPatterns.map((pattern) => {
              const active = pattern.id === selectedPatternId;
              return (
                <button
                  key={pattern.id}
                  type="button"
                  onClick={() => setSelectedPatternId(pattern.id)}
                  className={`rounded-md border p-3 text-left transition ${
                    active
                      ? "border-cyan-300/50 bg-cyan-300/15 text-white"
                      : "border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/20 hover:bg-white/[0.07]"
                  }`}
                >
                  <span className="block text-sm font-semibold">{pattern.name}</span>
                  <span className="mt-2 block text-xs leading-5 text-slate-300">{pattern.shortDescription}</span>
                  <span className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-cyan-100">
                      {pattern.visualType}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-300">
                      {pattern.preferredEngines[0]?.primary ?? "react-tailwind"}
                    </span>
                  </span>
                  <span className="mt-3 block text-[11px] leading-5 text-slate-300">
                    Use when: {pattern.whenToUse[0]?.label ?? "a reusable explanation structure is needed"}
                  </span>
                  <span className="mt-3 block text-[11px] leading-5 text-slate-400">
                    {pattern.exampleConcepts.slice(0, 2).join(" / ")}
                  </span>
                  <span className="mt-2 block text-[10px] uppercase tracking-[0.12em] text-slate-500">
                    {pattern.atomsUsed.slice(0, 4).join(" · ")}
                  </span>
                </button>
              );
            })}
          </div>
          {filteredPatterns.length === 0 ? <p className="mt-5 text-sm text-slate-400">No pattern matches these filters.</p> : null}
        </section>

        <VisualRecipeRenderer recipe={patternPreviewRecipe} mode="compact" />
        <FeedbackPanel
          recipeId={patternPreviewRecipe.id}
          patternId={selectedPattern.id}
          engineId={patternPreviewEngineResult.primaryEngine}
          concept={patternPreviewRecipe.concept}
          visualType={patternPreviewRecipe.visualType}
          audienceLevel={patternPreviewRecipe.targetAudience}
          onSubmitted={(feedback) => {
            rememberSuccessfulFeedback(feedback, patternPreviewRecipe);
            refreshFeedback();
          }}
        />

        <section id="router-demo" className="scroll-mt-24 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Engine Router Demo</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Correct Rendering Path</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                The router chooses the smallest useful visual technology, then exposes fallbacks before any heavy engine is used.
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-right">
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Current Recipe</p>
              <p className="mt-1 text-sm font-semibold text-white">{selectedRecipe.title}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <article className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/80">Selected recipe route</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{getEngineDisplayName(selectedRecipeEngineResult.primaryEngine)}</h3>
              <p className="mt-2 text-sm leading-6 text-cyan-50/80">{selectedRecipeEngineResult.reason}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-md border border-white/10 bg-black/20 p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-100/70">Confidence</p>
                  <p className="mt-1 text-sm font-semibold text-white">{Math.round(selectedRecipeEngineResult.confidence * 100)}%</p>
                </div>
                <div className="rounded-md border border-white/10 bg-black/20 p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-100/70">Installed</p>
                  <p className="mt-1 text-sm font-semibold text-white">{selectedRecipeEngineResult.installed ? "Yes" : "No"}</p>
                </div>
                <div className="rounded-md border border-white/10 bg-black/20 p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-100/70">Supported</p>
                  <p className="mt-1 text-sm font-semibold text-white">{selectedRecipeEngineResult.supportedByCurrentProject ? "Yes" : "No"}</p>
                </div>
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-cyan-100/70">Fallback engines</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedRecipeEngineResult.fallbackEngines.length > 0 ? selectedRecipeEngineResult.fallbackEngines.map((engineId) => (
                  <span key={engineId} className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-cyan-50">
                    {getEngineDisplayName(engineId)}
                  </span>
                )) : <span className="text-sm text-cyan-50/70">No fallback needed.</span>}
              </div>
              {selectedRecipeEngineResult.warnings.length > 0 ? (
                <div className="mt-4 rounded-md border border-amber-300/30 bg-amber-300/[0.08] p-3">
                  {selectedRecipeEngineResult.warnings.map((warning) => (
                    <p key={warning} className="text-sm text-amber-50">{warning}</p>
                  ))}
                </div>
              ) : null}
            </article>

            <aside className="rounded-lg border border-white/10 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Routing examples</p>
              <div className="mt-3 grid gap-2">
                {engineRoutingExamples.map((example, index) => {
                  const active = index === selectedEngineExampleIndex;
                  return (
                    <button
                      key={example.label}
                      type="button"
                      onClick={() => setSelectedEngineExampleIndex(index)}
                      className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                        active
                          ? "border-cyan-300/50 bg-cyan-300/15 text-white"
                          : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.07]"
                      }`}
                    >
                      {example.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 rounded-md border border-white/10 bg-white/[0.04] p-3">
                <p className="text-sm font-semibold text-white">{selectedEngineExample.label}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">Expected: {selectedEngineExample.expected}</p>
                <p className="mt-3 text-sm text-cyan-100">
                  Routed: {getEngineDisplayName(selectedEngineExample.result.primaryEngine)}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-300">{selectedEngineExample.result.reason}</p>
                {selectedEngineExample.result.warnings.length > 0 ? (
                  <p className="mt-2 text-xs leading-5 text-amber-100">{selectedEngineExample.result.warnings.join(" ")}</p>
                ) : null}
              </div>
            </aside>
          </div>
        </section>

        <section id="tech-lab" className="scroll-mt-24 rounded-xl border border-violet-300/20 bg-violet-300/[0.04] p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-violet-200/80">Visual Tech Frontier Lab</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Compare rendering tools against one concept</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Live lightweight demos and honest placeholders show what is installed, what falls back safely, and what belongs in a future upgrade.
          </p>
          <a href="/visual-frontier/tech-lab" className="mt-4 inline-flex rounded-md border border-violet-300/40 bg-violet-300/10 px-4 py-2 text-sm font-semibold text-violet-50 focus-visible:outline-2 focus-visible:outline-violet-300">
            Open Visual Tech Frontier Lab
          </a>
        </section>

        <div id="translator-demo" className="scroll-mt-24">
          <AIVisualTranslatorDemo onFeedbackSubmitted={refreshFeedback} />
        </div>

        <section id="feedback-demo" className="scroll-mt-24 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Feedback and Evolution System</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Visual understanding becomes learning notes</h2>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">
                Rendered recipes collect local human clarity signals. Rule-based analysis then suggests pattern, recipe, engine, and visual-language improvements.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={downloadFeedback}
                className="rounded-md border border-cyan-300/40 bg-cyan-300/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/20"
              >
                Export JSON
              </button>
              <button
                type="button"
                onClick={() => clearVisualFeedback()}
                className="rounded-md border border-rose-300/30 bg-rose-300/[0.08] px-3 py-2 text-sm text-rose-50 transition hover:bg-rose-300/[0.14]"
              >
                Clear local feedback
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <FeedbackStorageStatusPanel feedbackCount={feedbackList.length} onImported={refreshFeedback} />
            <FeedbackSummaryPanel feedbackList={feedbackList} />
            <EvolutionNotesPanel
              feedbackList={feedbackList}
              recipeId={selectedRecipe.id}
              patternId={selectedRecipe.pattern}
              engineId={selectedRecipeEngineResult.primaryEngine}
            />

            <section className="rounded-xl border border-white/10 bg-slate-950/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-white">Recent feedback</h3>
                <span className="text-xs text-slate-400">{feedbackList.length} local response(s)</span>
              </div>
              {feedbackList.length > 0 ? (
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {feedbackList.slice(0, 6).map((feedback) => (
                    <article key={feedback.id} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-white">{feedback.concept}</p>
                          <p className="mt-1 text-xs text-slate-400">{feedback.patternId} / {feedback.engineId}</p>
                        </div>
                        <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-cyan-100">
                          Clarity {feedback.clarityScore}/5
                        </span>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-slate-300">
                        Issues: {feedback.selectedIssues.map((issue) => visualFeedbackIssueLabels[issue]).join(", ") || "None selected"}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-300">
                        Requests: {feedback.selectedImprovements.map((improvement) => visualFeedbackImprovementLabels[improvement]).join(", ") || "None selected"}
                      </p>
                      {feedback.freeText ? <p className="mt-3 text-sm leading-6 text-slate-200">{feedback.freeText}</p> : null}
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-400">No local feedback yet. Submit a clarity signal below any rendered recipe.</p>
              )}
            </section>
          </div>
        </section>

        <VisualMemoryExplorer />
      </div>
    </main>
  );
}
