import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button-link";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Visual Language Portal | SciLoop",
  description:
    "SciLoop visual language for physics, biology, layered reality, and causal simulation.",
};

const sections = [
  {
    title: "Physics Visual Language",
    copy: "Turn forces, fields, waves, energy, spacetime, and quantum behavior into clear visual explanations.",
  },
  {
    title: "Biology Visual Language",
    copy: "Represent molecules, cells, signals, feedback loops, evolution, and ecosystems as readable processes.",
  },
  {
    title: "General Visual Grammar",
    copy: "Translate entities, relationships, causes, transformations, scales, and outcomes into reusable visual primitives.",
  },
  {
    title: "Layered Reality Representation",
    copy: "Separate structure, mechanism, evidence, scale, and explanation so complex reality remains understandable.",
  },
  {
    title: "Simulation Examples",
    copy: "Use lightweight causal simulations to show what changes when a variable, law, or system state changes.",
  },
  {
    title: "Student Learning",
    copy: "Connect concepts to meaning, history, builders, timelines, and visual exam-to-reality explanations.",
  },
  {
    title: "Cosmic Simulation",
    copy: "Explore gravity, relativity, dark matter, black holes, and expansion through visual comparisons.",
  },
  {
    title: "Unity AI Sandbox",
    copy: "Carry SciLoop simulation commands into Unity WebGL while retaining a reliable browser fallback.",
  },
];

export default function VisualLanguagePortalPage() {
  return (
    <div className="page-shell space-y-8 pb-12 pt-4">
      <Panel className="rounded-[38px] px-6 py-10 md:px-10 md:py-14" glow>
        <div className="eyebrow">Canonical portal</div>
        <h1 className="mt-5 font-display text-5xl font-semibold tracking-tight text-white md:text-7xl">
          Visual Language Portal
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          One visual system for physics, biology, general grammar, layered
          reality, and simulation-based understanding.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/visual-language-lab">Open Visual Grammar Lab</ButtonLink>
          <ButtonLink href="/mini-experiment-lab" variant="secondary">
            Open Simulation Examples
          </ButtonLink>
        </div>
      </Panel>

      <section className="grid gap-5 md:grid-cols-2">
        {sections.map((section) => (
          <Panel key={section.title} className="rounded-[30px] p-6">
            <h2 className="font-display text-2xl font-semibold text-white">
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {section.copy}
            </p>
          </Panel>
        ))}
      </section>
    </div>
  );
}
