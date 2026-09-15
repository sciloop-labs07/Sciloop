"use client";

import { useEffect, useMemo, useState } from "react";

import { VisualMemoryPanel } from "./VisualMemoryPanel";
import { analyzeVisualMemory } from "./visualMemoryAnalyzer";
import { createMemoryEvolutionRecords } from "./visualMemoryEvolution";
import { visualMemoryExamples } from "./visualMemoryExamples";
import { getTopSuccessfulVisuals } from "./visualMemoryRegistry";
import { clearVisualMemory, exportMemory, getAllMemories, saveMemory } from "./visualMemoryStore";
import type { VisualMemory } from "./visualMemory.types";
import { visualMemoryUpdatedEvent } from "./visualMemoryUtils";

export function VisualMemoryExplorer() {
  const [memories, setMemories] = useState<VisualMemory[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const refresh = () => setMemories(getAllMemories());
    const frame = window.requestAnimationFrame(refresh);
    window.addEventListener(visualMemoryUpdatedEvent, refresh);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(visualMemoryUpdatedEvent, refresh);
    };
  }, []);

  const analysis = useMemo(() => analyzeVisualMemory(memories), [memories]);
  const evolution = useMemo(() => createMemoryEvolutionRecords(memories), [memories]);
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return getTopSuccessfulVisuals(20, memories).filter((memory) => !query || `${memory.concept} ${memory.patternId} ${memory.engineId} ${memory.audience}`.toLowerCase().includes(query));
  }, [memories, search]);

  function download() {
    const url = URL.createObjectURL(new Blob([exportMemory()], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sciloop-visual-memory.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const top = [
    ["Top pattern", analysis.successfulPatterns[0]?.label ?? "No memory"],
    ["Top engine", analysis.successfulEngines[0]?.label ?? "No memory"],
    ["Top audience", analysis.successfulAudiences[0]?.label ?? "No memory"],
    ["Top analogy", analysis.successfulAnalogies[0]?.label ?? "No memory"],
  ];

  return (
    <section id="memory-demo" className="scroll-mt-24 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.04] p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-200/80">Visual Memory Explorer</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Remember what humans understood</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Only successful, human-reviewed explanations become reusable memory. Memory guides future choices but never bypasses validation.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={download} className="rounded-md border border-emerald-300/40 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-50">Export memory</button>
          <button type="button" onClick={() => visualMemoryExamples.forEach(saveMemory)} className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-200">Load example memories</button>
          <button type="button" onClick={clearVisualMemory} className="rounded-md border border-rose-300/30 bg-rose-300/[0.08] px-3 py-2 text-sm text-rose-50">Clear local memory</button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {top.map(([label, value]) => <div key={label} className="rounded-md border border-white/10 bg-slate-950/70 p-3"><p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{label}</p><p className="mt-2 text-sm font-semibold text-white">{value}</p></div>)}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-300">Memories <strong className="float-right text-white">{analysis.totalMemories}</strong></div>
        <div className="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-300">Clarity trend <strong className="float-right text-white">{analysis.averageClarity}/5</strong></div>
        <div className="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-300">Usefulness trend <strong className="float-right text-white">{analysis.averageUsefulness}/5</strong></div>
      </div>
      <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search visual memory" placeholder="Search concepts, patterns, engines, audiences..." className="mt-4 w-full rounded-md border border-white/10 bg-slate-950 p-3 text-sm text-white outline-none focus:border-emerald-300/50" />
      {visible.length > 0 ? <div className="mt-4 grid gap-3 lg:grid-cols-2">{visible.map((memory) => <VisualMemoryPanel key={memory.id} memory={memory} />)}</div> : <p className="mt-4 text-sm text-slate-400">No successful visual memories yet. Submit feedback with clarity and usefulness of 4 or higher.</p>}
      {evolution.length > 0 ? <div className="mt-5 rounded-lg border border-white/10 bg-slate-950/60 p-4"><h3 className="text-lg font-semibold text-white">Knowledge evolution notes</h3><div className="mt-3 grid gap-2">{evolution.map((record) => <p key={record.id} className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-slate-200">{record.statement}</p>)}</div></div> : null}
    </section>
  );
}
