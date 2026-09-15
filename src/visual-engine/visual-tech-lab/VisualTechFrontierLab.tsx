"use client";

import { useMemo, useState } from "react";

import { TechCapabilityMatrix } from "./TechCapabilityMatrix";
import { TechComparisonPanel } from "./TechComparisonPanel";
import { TechDemoCard } from "./TechDemoCard";
import { TechDemoSelector } from "./TechDemoSelector";
import { TechRecommendationPanel } from "./TechRecommendationPanel";
import { sharedTechLabConcept, visualTechDemos } from "./techLab.constants";
import type { VisualTechId } from "./techLab.types";
import { sortTechDemosForLab } from "./techLab.utils";

/**
 * The Visual Tech Frontier Lab compares rendering technologies against the
 * same concept. Heavy engines should only be added after the foundation proves
 * they improve human understanding.
 */
export function VisualTechFrontierLab() {
  const demos = useMemo(() => sortTechDemosForLab(visualTechDemos), []);
  const [selectedTechId, setSelectedTechId] = useState<VisualTechId>("react-tailwind");
  const selectedDemo = demos.find((demo) => demo.id === selectedTechId) ?? demos[0];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
        <header className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">SciLoop Visual Frontier</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Visual Tech Frontier Lab</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
            Compare current visual technologies safely and decide which rendering tool best supports human understanding.
          </p>
          <div className="mt-5 rounded-md border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/75">Shared concept</p>
            <p className="mt-2 text-lg font-semibold text-white">{sharedTechLabConcept}</p>
          </div>
        </header>

        <TechDemoSelector demos={demos} selectedTechId={selectedDemo.id} onSelect={setSelectedTechId} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-6">
            <TechDemoCard demo={selectedDemo} />
            <TechComparisonPanel demo={selectedDemo} />
          </div>
          <TechRecommendationPanel demo={selectedDemo} />
        </div>

        <TechCapabilityMatrix demos={demos} />
      </div>
    </main>
  );
}
