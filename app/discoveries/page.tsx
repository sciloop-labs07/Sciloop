import Link from "next/link";

import { FadeIn } from "@/components/ui/fade-in";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { physicsDiscoveries } from "@/data/discoveries";

export default function DiscoveriesPage() {
  return (
    <div className="page-shell space-y-10 pb-12 pt-6">
      <SectionHeading
        eyebrow="Discoveries"
        title="A small, typed Physics dataset for the first world."
        description="Each discovery carries a reusable before/after simulation transition, concept nodes, and concise narrative framing so the world can change visibly without losing scientific structure."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {physicsDiscoveries.map((discovery, index) => (
          <FadeIn key={discovery.id} delay={0.05 * index}>
            <Panel className="h-full rounded-[30px]">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="chip rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.2em]">
                    <span className="chip-dot" />
                    Physics
                  </div>
                  <div className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                    {discovery.year}
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-3xl font-semibold text-white">
                    {discovery.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {discovery.summary}
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    World change
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {discovery.worldChange}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {discovery.conceptNodes.map((node) => (
                    <span key={node.id} className="chip rounded-full px-3 py-1.5 text-xs">
                      <span className="chip-dot" />
                      {node.label}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/mini-experiment-lab?discovery=${discovery.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-cyan-200/24 px-5 py-2.5 text-sm text-white transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Open Simulation Example
                </Link>
              </div>
            </Panel>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
