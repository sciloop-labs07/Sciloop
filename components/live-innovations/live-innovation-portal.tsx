"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import { InnovationExplorer } from "@/components/innovations/innovation-explorer";
import { innovations, type InnovationRecord } from "@/data/innovations";

export function LiveInnovationPortal({ selectedInnovation }: { selectedInnovation?: InnovationRecord }) {
  const [query, setQuery] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const fields = useMemo(() => ["All fields", ...innovations.map((innovation) => innovation.field)], []);
  const filtered = useMemo(() => innovations.filter((innovation) => {
    const haystack = [innovation.title, innovation.summary, innovation.field, innovation.decision.affectedCapability, ...innovation.organizations].join(" ").toLowerCase();
    return (!selectedFields.length || selectedFields.includes(innovation.field)) && haystack.includes(query.toLowerCase().trim());
  }), [selectedFields, query]);

  function toggleField(nextField: string) {
    if (nextField === "All fields") {
      setSelectedFields([]);
      return;
    }
    setSelectedFields((current) => current.includes(nextField)
      ? current.filter((item) => item !== nextField)
      : [...current, nextField]);
  }

  if (selectedInnovation) return <InnovationExplorer innovation={selectedInnovation} />;

  return <main className="page-shell pb-20 pt-5 md:pt-12">
    <section className="feed-hero relative overflow-hidden rounded-[40px] border border-white/10 px-6 py-12 md:px-12 md:py-16">
      <div className="hero-grid" aria-hidden="true" />
      <div className="relative z-10 max-w-4xl">
        <div className="eyebrow">SciLoop · decision signals</div>
        <h1 className="mt-5 font-display text-5xl font-semibold tracking-[-0.04em] text-white md:text-7xl">What should your team understand next?</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Each reviewed signal is a bounded research brief: source evidence, the causal mechanism, conditions that change the outcome, and the next question worth investigating.</p>
      </div>
      <div className="relative z-10 mt-9 max-w-3xl">
        <label htmlFor="innovation-search" className="sr-only">Search reviewed decision signals</label>
        <div className="search-shell"><span aria-hidden="true">⌕</span><input ref={searchRef} id="innovation-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a signal, capability, or field…" /><kbd>Reviewed only</kbd></div>
      </div>
    </section>

    <section className="mt-10" aria-labelledby="reviewed-signals">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow">Reviewed signal set</div><h2 id="reviewed-signals" className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">Start with a decision, not a feed.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Only signals with a named source and a declared confidence are shown here. Choose multiple subjects to compare a cross-domain set, then ask SciLoop AI to explain any signal.</p></div><div className="flex max-w-full flex-wrap justify-end gap-2 pb-1" aria-label="Filter by multiple subjects">{fields.map((item) => { const active = item === "All fields" ? selectedFields.length === 0 : selectedFields.includes(item); return <button key={item} type="button" onClick={() => toggleField(item)} aria-pressed={active} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs transition-colors ${active ? "border-cyan-200/35 bg-cyan-200/10 text-white" : "border-white/10 text-slate-400 hover:text-white"}`}>{item}</button>; })}</div></div>
      {filtered.length ? <div className="mt-8 grid gap-4 lg:grid-cols-3">{filtered.map((innovation) => <article key={innovation.slug} className="innovation-feed-card panel-surface group flex min-h-96 flex-col rounded-[28px] border border-white/10 bg-white/[0.03] p-6"><div className="flex items-center justify-between gap-3"><span className="chip rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em]"><span className="chip-dot" />{innovation.field}</span><span className="text-[10px] uppercase tracking-[0.14em] text-emerald-200">{innovation.decision.confidence}</span></div><Link href={`/live-innovations?signal=${innovation.slug}`} onClick={() => track("decision_signal_opened", { signal: innovation.slug })} className="mt-7"><h3 className="font-display text-2xl font-semibold leading-tight text-white group-hover:text-cyan-100">{innovation.title}</h3></Link><p className="mt-4 text-sm leading-7 text-slate-400">{innovation.decision.whyItMatters}</p><div className="mt-auto space-y-4 border-t border-white/10 pt-5 text-xs"><div className="flex justify-between gap-3 text-slate-500"><span>Affected capability</span><span className="text-right text-slate-300">{innovation.decision.affectedCapability}</span></div><div className="flex flex-wrap gap-2"><Link href={`/live-innovations?signal=${innovation.slug}`} className="rounded-full border border-white/15 px-3 py-2 text-slate-200 hover:border-cyan-200/40 hover:text-white">Open brief</Link><Link href={`/sciloop-ai-stream?prompt=${encodeURIComponent(`Explain this live innovation for a curious learner: ${innovation.title}. Include the evidence, causal mechanism, practical significance, uncertainties, and one useful follow-up question.`)}`} onClick={() => track("sciloop_ai_explanation_requested", { signal: innovation.slug, source: "live-innovations-card" })} className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-3 py-2 font-semibold text-cyan-50 hover:bg-cyan-200/20">Explain with SciLoop AI</Link></div></div></article>)}</div> : <div className="panel-surface mt-8 rounded-[28px] p-10 text-center"><h2 className="font-display text-2xl text-white">No reviewed signal matches that search.</h2><p className="mt-2 text-sm text-slate-400">Try another search or clear one of the subject filters.</p></div>}
    </section>

    <section id="method" className="detail-section rounded-[30px] border border-white/10 bg-white/[0.025] p-6 md:p-8"><div className="eyebrow">Method and limits</div><h2 className="detail-heading">A model is a decision aid, not a prediction.</h2><div className="mt-6 grid gap-4 md:grid-cols-3"><div className="detail-card"><strong className="text-white">Evidence first</strong><p className="mt-2 text-sm leading-6 text-slate-400">Each signal identifies its source and keeps verified facts distinct from later interpretation.</p></div><div className="detail-card"><strong className="text-white">Conditional reasoning</strong><p className="mt-2 text-sm leading-6 text-slate-400">Scenarios depend on stated conditions and can be weakened or falsified by new evidence.</p></div><div className="detail-card"><strong className="text-white">Human approval</strong><p className="mt-2 text-sm leading-6 text-slate-400">SciLoop does not guarantee outcomes. Teams must evaluate evidence before acting.</p></div></div><p className="mt-6 text-sm text-slate-500">Have a correction or source to add? Contact the SciLoop team with the signal title and supporting reference.</p></section>
  </main>;
}
