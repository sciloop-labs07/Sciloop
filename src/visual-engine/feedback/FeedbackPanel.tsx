"use client";

import { useState } from "react";

import {
  visualFeedbackImprovementLabels,
  visualFeedbackImprovementOptions,
  visualFeedbackIssueCategories,
  visualFeedbackIssueLabels,
  visualFeedbackRatingLabels,
  visualFeedbackRatings,
} from "./feedback.constants";
import { submitVisualFeedback } from "./feedbackCollector";
import type {
  VisualFeedback,
  VisualFeedbackCategory,
  VisualFeedbackImprovement,
  VisualFeedbackRating,
  VisualFeedbackSource,
  VisualFeedbackTarget,
} from "./feedback.types";

interface FeedbackPanelProps extends VisualFeedbackTarget {
  source?: VisualFeedbackSource;
  onSubmitted?: (feedback: VisualFeedback) => void;
}

function ScoreField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="rounded-md border border-white/10 bg-black/20 p-3">
      <span className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-400">
        {label}
        <strong className="text-sm text-cyan-100">{value}/5</strong>
      </span>
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full accent-cyan-300"
      />
    </label>
  );
}

function toggleValue<T extends string>(list: T[], value: T) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function FeedbackPanel({
  recipeId,
  patternId,
  engineId,
  concept,
  visualType,
  audienceLevel,
  source = "renderer-demo",
  onSubmitted,
}: FeedbackPanelProps) {
  const [rating, setRating] = useState<VisualFeedbackRating>("okay");
  const [clarityScore, setClarityScore] = useState(3);
  const [complexityScore, setComplexityScore] = useState(3);
  const [motionScore, setMotionScore] = useState(3);
  const [usefulnessScore, setUsefulnessScore] = useState(3);
  const [selectedIssues, setSelectedIssues] = useState<VisualFeedbackCategory[]>([]);
  const [selectedImprovements, setSelectedImprovements] = useState<VisualFeedbackImprovement[]>([]);
  const [freeText, setFreeText] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit() {
    try {
      const feedback = submitVisualFeedback({
        recipeId,
        patternId,
        engineId,
        concept,
        visualType,
        audienceLevel,
        source,
        rating,
        clarityScore,
        complexityScore,
        motionScore,
        usefulnessScore,
        selectedIssues,
        selectedImprovements,
        freeText,
      });
      setStatus("Feedback saved locally. SciLoop learning notes are now updated.");
      onSubmitted?.(feedback);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Feedback could not be saved.");
    }
  }

  return (
    <section className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.04] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200/80">Human clarity signal</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Was this visual clear?</h3>
          <p className="mt-1 text-sm text-slate-300">Your response stays in this browser and creates suggestion-only learning notes.</p>
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">Local only</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {visualFeedbackRatings.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={rating === option}
            onClick={() => setRating(option)}
            className={`rounded-md border px-3 py-2 text-sm transition ${
              rating === option
                ? "border-cyan-300/50 bg-cyan-300/15 text-white"
                : "border-white/10 bg-black/20 text-slate-300 hover:border-white/20"
            }`}
          >
            {visualFeedbackRatingLabels[option]}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreField label="Clarity" value={clarityScore} onChange={setClarityScore} />
        <ScoreField label="Complexity" value={complexityScore} onChange={setComplexityScore} />
        <ScoreField label="Motion" value={motionScore} onChange={setMotionScore} />
        <ScoreField label="Usefulness" value={usefulnessScore} onChange={setUsefulnessScore} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <fieldset>
          <legend className="text-xs uppercase tracking-[0.16em] text-slate-400">What was wrong?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {visualFeedbackIssueCategories.map((issue) => (
              <button
                key={issue}
                type="button"
                aria-pressed={selectedIssues.includes(issue)}
                onClick={() => setSelectedIssues((current) => toggleValue(current, issue))}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  selectedIssues.includes(issue)
                    ? "border-amber-300/50 bg-amber-300/15 text-amber-50"
                    : "border-white/10 bg-black/20 text-slate-300 hover:border-white/20"
                }`}
              >
                {visualFeedbackIssueLabels[issue]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-xs uppercase tracking-[0.16em] text-slate-400">What should improve?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {visualFeedbackImprovementOptions.map((improvement) => (
              <button
                key={improvement}
                type="button"
                aria-pressed={selectedImprovements.includes(improvement)}
                onClick={() => setSelectedImprovements((current) => toggleValue(current, improvement))}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  selectedImprovements.includes(improvement)
                    ? "border-emerald-300/50 bg-emerald-300/15 text-emerald-50"
                    : "border-white/10 bg-black/20 text-slate-300 hover:border-white/20"
                }`}
              >
                {visualFeedbackImprovementLabels[improvement]}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <label className="mt-5 block">
        <span className="text-xs uppercase tracking-[0.16em] text-slate-400">Optional note</span>
        <textarea
          value={freeText}
          onChange={(event) => setFreeText(event.target.value)}
          maxLength={2000}
          className="mt-2 min-h-24 w-full rounded-md border border-white/10 bg-slate-950/80 p-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
          placeholder="What would help you understand faster?"
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-md border border-cyan-300/40 bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-300/20"
        >
          Submit feedback
        </button>
        {status ? <p role="status" className="text-sm text-cyan-100">{status}</p> : null}
      </div>
    </section>
  );
}
