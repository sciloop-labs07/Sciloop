import Link from "next/link";

import { ButtonLink } from "@/components/ui/button-link";
import { FadeIn } from "@/components/ui/fade-in";
import { Panel } from "@/components/ui/panel";

const loop = [
  { number: "01", label: "Discover", copy: "Find the signal behind the headline." },
  { number: "02", label: "Understand", copy: "Let AI explain the mechanism at your level." },
  { number: "03", label: "Simulate", copy: "Change the variables and see what follows." },
  { number: "04", label: "Invent", copy: "Turn a better question into a new possibility." },
];

const discoveries = [
  { field: "Climate systems", title: "The atmosphere is becoming a live experiment", meta: "03 min · systems thinking", accent: "cyan" },
  { field: "Quantum materials", title: "When matter learns a new set of rules", meta: "07 min · frontier physics", accent: "violet" },
  { field: "Synthetic biology", title: "Designing cells that can sense their world", meta: "05 min · living systems", accent: "amber" },
];

export default function HomePage() {
  return (
    <div className="page-shell pb-20 pt-5 md:pt-12">
      <FadeIn>
        <section className="relative overflow-hidden rounded-[42px] border border-white/10 bg-[#07101d]/72 px-6 py-12 shadow-[0_30px_120px_rgba(0,0,0,.38)] md:px-12 md:py-20 lg:px-20">
          <div className="hero-grid" aria-hidden="true" /><div className="hero-orbit hero-orbit-one" aria-hidden="true" /><div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <div className="relative z-10 max-w-4xl">
            <div className="eyebrow">The scientific discovery engine</div>
            <h1 className="mt-7 max-w-4xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white md:text-7xl lg:text-[6.6rem]">Turn curiosity into <span className="text-gradient">discovery.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">SciLoop is where humanity explores, understands, simulates, and creates with science. Start with a question. Leave with a world you can change.</p>
            <div className="humanity-stats mt-8 grid max-w-2xl grid-cols-3 gap-3 border-y border-white/10 py-5"><div><div className="font-display text-3xl font-semibold text-white md:text-4xl">47</div><div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">important innovations</div></div><div><div className="font-display text-3xl font-semibold text-white md:text-4xl">12</div><div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">major breakthroughs</div></div><div><div className="font-display text-3xl font-semibold text-white md:text-4xl">86</div><div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">research signals</div></div></div>
            <form action="/live-innovations" className="search-shell mt-8 max-w-2xl"><span aria-hidden="true">⌕</span><label htmlFor="home-search" className="sr-only">Search live innovations</label><input id="home-search" name="q" placeholder="Search innovations, scientists, technologies…" /><button type="submit" className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-950">Explore</button></form>
            <div className="mt-9 flex flex-wrap gap-3"><ButtonLink href="/live-innovations" className="px-6">Explore live innovations <span aria-hidden="true" className="ml-2">→</span></ButtonLink><ButtonLink href="/live-innovations" variant="secondary" className="px-6">Start exploring</ButtonLink></div>
            <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs uppercase tracking-[0.18em] text-slate-500"><span><i className="status-dot" />AI-assisted</span><span>Interactive by design</span><span>Built for the next question</span></div>
          </div>
          <div className="hero-signal-card" aria-label="Live scientific signal"><div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-cyan-100/70"><span>Live signal</span><span className="signal-pulse">● processing</span></div><div className="mt-5 font-display text-2xl font-semibold text-white">What changes if the ocean warms by 2°C?</div><div className="mt-6 signal-wave" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div><div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-[11px] text-slate-400"><span>cause<br /><b className="text-slate-200">energy shift</b></span><span>model<br /><b className="text-slate-200">climate loop</b></span><span>next<br /><b className="text-cyan-100">simulate →</b></span></div></div>
        </section>
      </FadeIn>

      <FadeIn delay={0.1}><section className="py-24 md:py-32"><div className="max-w-3xl"><div className="eyebrow">One continuous experience</div><h2 className="mt-5 font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">Every answer should open a better question.</h2><p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">Science is not a library you finish. SciLoop turns each discovery into a living path from context to consequence to possibility.</p></div><div className="mt-12 grid gap-px overflow-hidden rounded-[30px] border border-white/10 bg-white/10 md:grid-cols-4">{loop.map((item, index) => <div key={item.number} className="loop-step bg-[#091321]/90 p-6 md:p-7"><div className="font-mono text-xs text-cyan-200/60">{item.number} / 04</div><div className="mt-12 font-display text-2xl font-semibold text-white">{item.label}</div><p className="mt-3 text-sm leading-6 text-slate-400">{item.copy}</p>{index < loop.length - 1 && <div className="loop-arrow" aria-hidden="true">↗</div>}</div>)}</div></section></FadeIn>

      <FadeIn delay={0.16}><section><div className="flex flex-wrap items-end justify-between gap-5"><div><div className="eyebrow">Humanity · today</div><h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold text-white md:text-5xl">Today, humanity produced 47 important innovations.</h2></div><Link href="/live-innovations" className="text-sm text-cyan-100 transition-colors hover:text-white">Explore them <span aria-hidden="true">→</span></Link></div><div className="mt-8 grid gap-4 lg:grid-cols-3">{discoveries.map((item) => <Panel key={item.title} className={`discovery-card discovery-${item.accent} min-h-64 rounded-[28px] p-6`}><div className="flex items-center justify-between"><span className="chip rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em]">{item.field}</span><span className="text-xs text-slate-500">{item.meta}</span></div><h3 className="mt-16 max-w-xs font-display text-2xl font-semibold leading-tight text-white">{item.title}</h3><div className="mt-5 text-sm text-cyan-100">Understand <span aria-hidden="true">→</span> Explore <span aria-hidden="true">→</span> Imagine</div></Panel>)}</div></section></FadeIn>

      <FadeIn delay={0.22}><Panel className="mt-24 rounded-[34px] border-cyan-200/20 bg-cyan-100/[0.045] px-6 py-10 md:px-10 md:py-12"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="eyebrow">Begin anywhere</div><h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold text-white md:text-5xl">Your next discovery is one question away.</h2><p className="mt-4 max-w-xl leading-7 text-slate-400">Open the live innovation feed to follow a real signal through explanation, history, and future possibilities.</p></div><ButtonLink href="/live-innovations" className="w-fit">Enter SciLoop <span aria-hidden="true" className="ml-2">↗</span></ButtonLink></div></Panel></FadeIn>
    </div>
  );
}
