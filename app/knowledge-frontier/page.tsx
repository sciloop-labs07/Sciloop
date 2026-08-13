import type { Metadata } from "next";

import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Knowledge Frontier | SciLoop",
  description:
    "Frontier ideas, scientist legacy, invention history, and lessons from major breakthroughs.",
};

const sections = [
  ["Latest Frontier Ideas", "Track the ideas currently changing humanity’s understanding and technical reach."],
  ["Scientist Legacy", "Study the people, methods, and historical breakthroughs that moved civilization forward."],
  ["Invention Timeline", "Follow discoveries as they become instruments, systems, industries, and new scientific questions."],
  ["Lessons from Great Scientists", "Extract durable habits: careful observation, model building, falsification, collaboration, and intellectual courage."],
  ["Potential Explorer", "Compare human, AI, compute, energy, and robotics systems from current capability to hard theoretical limits."],
];

export default function KnowledgeFrontierPage() {
  return (
    <div className="page-shell space-y-8 pb-12 pt-4">
      <Panel className="rounded-[38px] px-6 py-10 md:px-10 md:py-14" glow>
        <div className="eyebrow">Frontier + legacy</div>
        <h1 className="mt-5 font-display text-5xl font-semibold text-white md:text-7xl">
          Knowledge Frontier
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Current frontier knowledge and the historical breakthroughs that made
          it possible, gathered into one continuous timeline.
        </p>
      </Panel>

      <section className="grid gap-5 md:grid-cols-2">
        {sections.map(([title, copy]) => (
          <Panel key={title} className="rounded-[30px] p-6">
            <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{copy}</p>
          </Panel>
        ))}
      </section>
    </div>
  );
}
