"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";

import { PossibilityEnginePanel } from "@/components/innovations/possibility-engine-panel";
import type { InnovationRecord } from "@/data/innovations";

export function InnovationExplorer({ innovation }: { innovation: InnovationRecord }) {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [possibilityMode, setPossibilityMode] = useState(false);

  function save() {
    localStorage.setItem(`sciloop-saved-${innovation.slug}`, "true");
    setSaved(true);
    track("decision_signal_saved", { signal: innovation.slug });
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      track("decision_signal_shared", { signal: innovation.slug });
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      setShared(false);
    }
  }

  return <main className={`page-shell pb-20 pt-5 md:pt-12 ${possibilityMode ? "possibility-focus" : ""}`}>
    <section className="innovation-detail-hero rounded-[40px] border border-white/10 px-6 py-10 md:px-12 md:py-14">
      <div className="flex flex-wrap items-center gap-3 text-xs"><span className="chip rounded-full px-3 py-1.5">{innovation.field}</span><span className="rounded-full border border-emerald-200/20 px-3 py-1.5 text-emerald-100">{innovation.decision.confidence}</span><span className="text-slate-500">Reviewed source set</span></div>
      <h1 className="mt-5 max-w-5xl font-display text-4xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-6xl">{innovation.title}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{innovation.summary}</p>
      <div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={save} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950">{saved ? "Saved ✓" : "Save brief"}</button><button type="button" onClick={share} className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white">{shared ? "Link copied ✓" : "Share brief"}</button><span className="rounded-full border border-cyan-200/15 px-5 py-2.5 text-sm text-cyan-100">Recommended: {innovation.decision.nextAction}</span></div>
    </section>

    <section className="detail-section grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-[30px] border border-cyan-200/15 bg-cyan-950/10 p-6 md:p-8"><div className="eyebrow">Decision summary</div><h2 className="mt-3 font-display text-3xl font-semibold text-white">Why this matters now.</h2><p className="mt-4 text-base leading-8 text-slate-300">{innovation.decision.whyItMatters}</p><div className="mt-6 border-t border-white/10 pt-5"><div className="text-xs uppercase tracking-[0.15em] text-slate-500">Affected capability</div><p className="mt-2 font-medium text-cyan-100">{innovation.decision.affectedCapability}</p></div></div>
      <div className="detail-card"><div className="eyebrow">Recommended next research question</div><p className="mt-4 font-display text-xl leading-8 text-white">{innovation.decision.researchQuestion}</p><p className="mt-6 text-sm leading-6 text-slate-400">This is a research prompt, not a claim that the outcome will occur.</p></div>
    </section>

    <section className="detail-section" aria-labelledby="evidence-heading"><div className="eyebrow">01 · Evidence brief</div><h2 id="evidence-heading" className="detail-heading">What is supported by the source.</h2><div className="mt-7 grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6"><div className="text-xs uppercase tracking-[0.16em] text-cyan-100">Verified facts</div><div className="mt-4 space-y-1">{innovation.facts.map((fact) => <div key={fact} className="fact-row"><span className="text-cyan-200">✓</span><span>{fact}</span></div>)}</div></div><div className="detail-card"><div className="text-xs uppercase tracking-[0.16em] text-slate-500">Original source</div>{innovation.evidence.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" onClick={() => track("evidence_source_viewed", { signal: innovation.slug, publisher: source.publisher })} className="mt-4 block rounded-2xl border border-cyan-200/15 bg-cyan-950/10 p-4 transition hover:border-cyan-200/40"><div className="font-medium text-cyan-50">{source.label} ↗</div><div className="mt-2 text-sm leading-6 text-slate-400">{source.publisher} · {source.publishedAt}</div></a>)}<p className="mt-4 text-xs leading-6 text-slate-500">Read the source before relying on this brief for a material decision.</p></div></div></section>

    <section className="detail-section grid gap-6 lg:grid-cols-[1.05fr_.95fr]"><div><div className="eyebrow">02 · Causal model</div><h2 className="detail-heading">What changed underneath?</h2><p className="detail-copy">{innovation.mechanism}</p></div><div className="visual-explanation rounded-[30px] border border-cyan-200/15 p-5"><div className="eyebrow">Mechanism map</div><svg className="mt-5 w-full" viewBox="0 0 520 270" role="img" aria-label={`Causal diagram for ${innovation.title}`}><defs><linearGradient id="flow" x1="0" x2="1"><stop stopColor="#67e8f9" /><stop offset="1" stopColor="#a78bfa" /></linearGradient></defs><path d="M52 135 C150 40 220 230 310 135 S430 40 480 135" fill="none" stroke="url(#flow)" strokeDasharray="5 8" strokeWidth="3" /><circle cx="82" cy="135" r="28" fill="#0e7490" opacity=".7" /><circle cx="260" cy="135" r="40" fill="#312e81" opacity=".8" /><circle cx="445" cy="135" r="28" fill="#92400e" opacity=".7" /><text x="82" y="140" fill="white" fontSize="13" textAnchor="middle">Constraint</text><text x="260" y="140" fill="white" fontSize="13" textAnchor="middle">Mechanism</text><text x="445" y="140" fill="white" fontSize="13" textAnchor="middle">Capability</text></svg></div></section>

    <PossibilityEnginePanel innovation={innovation} onOpenChange={setPossibilityMode} />

    <section className="detail-section grid gap-6 lg:grid-cols-2"><div><div className="eyebrow">03 · System context</div><h2 className="detail-heading">Technology and dependencies.</h2><div className="mt-6 space-y-3">{innovation.technology.map((item, index) => <div key={item.label} className="technology-row"><span className="font-mono text-xs text-cyan-200/60">0{index + 1}</span><div><div className="font-medium text-white">{item.label}</div><p className="mt-1 text-sm leading-6 text-slate-400">{item.detail}</p></div></div>)}</div></div><div><div className="eyebrow">Limits and unknowns</div><h2 className="detail-heading">What the source does not settle.</h2><div className="mt-6 grid gap-3">{innovation.futures.filter((future) => future.tone !== "positive").map((future) => <div key={future.label} className={`future-card future-${future.tone}`}><div className="font-display text-xl font-semibold text-white">{future.label}</div><p className="mt-3 text-sm leading-7 text-slate-300">{future.detail}</p></div>)}</div></div></section>

    <section className="detail-section rounded-[30px] border border-white/10 bg-white/[0.025] p-6 md:p-8"><div className="eyebrow">Audit and correction</div><h2 className="mt-3 font-display text-2xl font-semibold text-white">Keep the model accountable.</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">SciLoop separates verified evidence from inference and conditional scenarios. If a source, classification, or interpretation is wrong, report the signal title and supporting source to the SciLoop team. No scenario is a guaranteed prediction.</p></section>
  </main>;
}
