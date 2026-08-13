import type { Metadata } from "next";

import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Local Problem Solver | SciLoop",
  description:
    "Local issues, global impact challenges, community solutions, and contribution tracking.",
};

const sections = [
  ["Local Problems", "Capture location, severity, affected population, and the scientific context of real regional problems."],
  ["Global Impact Challenges", "Apply the Impact Hub workflow to mission-scale science, climate, engineering, and AI challenges."],
  ["Community Solutions", "Compare proposed solutions using feasibility, cost, time, sustainability, and community support."],
  ["Contribution Tracking", "Connect strong problem-solving work to profiles, leaderboards, and visible impact."],
  ["Timeless Problems", "Frame intelligence, consciousness, climate, longevity, and other civilization-scale challenges for long-term collaboration."],
];

export default function LocalProblemSolverPage() {
  return (
    <div className="page-shell space-y-8 pb-12 pt-4">
      <Panel className="rounded-[38px] px-6 py-10 md:px-10 md:py-14" glow>
        <div className="eyebrow">Local action + global impact</div>
        <h1 className="mt-5 font-display text-5xl font-semibold text-white md:text-7xl">
          Local Problem Solver
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          One place for local problem mapping, global challenges, community
          solutions, and measurable contribution.
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
