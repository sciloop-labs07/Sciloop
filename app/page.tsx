import Link from "next/link";

import { ButtonLink } from "@/components/ui/button-link";
import { FadeIn } from "@/components/ui/fade-in";
import { Panel } from "@/components/ui/panel";

const featureCards = [
  {
    title: "Visible World Changes",
    copy:
      "SciLoop turns a discovery into a world transition instead of a static article card.",
  },
  {
    title: "Hybrid Simulation Lab",
    copy:
      "Browser mode runs today with a reliable local simulation path.",
  },
  {
    title: "Reality Sandbox Controls",
    copy:
      "Gravity, energy, resilience, travel, intelligence, and stability now bend the same world-model.",
  },
];

const portalCards = [
  {
    title: "SciLoop Live",
    copy:
      "The full launch surface with News Portal, SciLoop AI, Visualize handoff, and mobile-share proxy routes under one public link.",
    href: "/sciloop-live",
    cta: "Open SciLoop Live",
  },
  {
    title: "Physics Reality Sandbox",
    copy:
      "The existing world route turns discoveries into visible simulation changes with a browser-native runtime path.",
    href: "/worlds/physics",
    cta: "Open Simulation Lab",
  },
  {
    title: "Visual Language Lab",
    copy:
      "A new semantic simulation engine that turns concepts into causal graphs, visual primitives, sliders, and lightweight interactive explanations.",
    href: "/visual-language-lab",
    cta: "Open Visual Language Lab",
  },
  {
    title: "SciLoop Streaming AI",
    copy:
      "Production-grade token streaming with thinking phases, markdown, progressive code blocks, cancel, retry, and smooth ChatGPT-style rendering.",
    href: "/sciloop-ai-stream",
    cta: "Open Streaming AI",
  },
  {
    title: "Survival Meaning Engine",
    copy:
      "The new urgency portal flips forced studying into meaning using subject cards, concept maps, timelines, builders, and visual meaning layers.",
    href: "/worlds/meaning-engine",
    cta: "Open Meaning Engine",
  },
];

export default function HomePage() {
  return (
    <div className="page-shell space-y-12 pb-12 pt-4 md:space-y-16">
      <FadeIn>
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <Panel className="rounded-[38px] px-6 py-10 md:px-10 md:py-14" glow>
            <div className="space-y-8">
              <div className="eyebrow">Scientific world-models</div>
              <div className="space-y-5">
                <h1 className="font-display text-5xl font-semibold tracking-tight text-white md:text-7xl">
                  SciLoop
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                  Discoveries appear here as visible world changes, not just as
                  text. The goal is a premium scientific interface where the web shell teaches,
                  the simulation reacts, and the world itself becomes the explanation surface.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/worlds/physics">Open Simulation Lab</ButtonLink>
                <ButtonLink href="/sciloop-live" variant="secondary">
                  Open SciLoop Live
                </ButtonLink>
                <ButtonLink href="/worlds/meaning-engine" variant="secondary">
                  Open Meaning Engine
                </ButtonLink>
                <ButtonLink href="/discoveries" variant="secondary">
                  View Discoveries
                </ButtonLink>
              </div>
            </div>
          </Panel>

          <FadeIn className="h-full" delay={0.08}>
            <Panel className="grid-fade flex h-full flex-col justify-between rounded-[38px] px-6 py-8 md:px-8 md:py-10">
              <div className="space-y-4">
                <div className="eyebrow">Current direction</div>
                <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
                  A Working Hybrid Simulation Surface
                </h2>
                <p className="text-sm leading-7 text-slate-300 md:text-base">
                  The active Physics route now combines discovery transitions, Reality Sandbox
                  controls, and explicit browser-native graphics controls.
                </p>
              </div>

              <div className="grid gap-3">
                {featureCards.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="font-display text-xl font-semibold text-white">
                      {feature.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {feature.copy}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
          </FadeIn>
        </section>
      </FadeIn>

      <FadeIn delay={0.12}>
        <Panel className="rounded-[36px] px-6 py-8 md:px-10 md:py-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              <div className="eyebrow">What comes next</div>
              <h2 className="font-display text-3xl font-semibold text-white md:text-5xl">
                The homepage now opens a real Simulation Lab inside this same project.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                This is not a disconnected mock. The button above opens the working
                `/worlds/physics` lab where SciLoop already renders browser-native world changes
                with a local browser-native simulation path.
              </p>
            </div>
            <Link
              href="/system-status"
              className="inline-flex min-h-11 items-center rounded-full border border-cyan-200/24 px-5 py-2.5 text-sm text-white transition-colors duration-200 hover:border-cyan-200/40"
            >
              Check System Status
            </Link>
          </div>
        </Panel>
      </FadeIn>

      <FadeIn delay={0.18}>
        <section className="space-y-6">
          <div className="space-y-3">
            <div className="eyebrow">Portal surfaces</div>
            <h2 className="font-display text-3xl font-semibold text-white md:text-5xl">
              Launch-ready portals now live inside this same SciLoop project.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {portalCards.map((portal) => (
              <Panel key={portal.title} className="rounded-[32px] px-6 py-6 md:px-7 md:py-7">
                <div className="space-y-5">
                  <div className="eyebrow">Portal route</div>
                  <div>
                    <h3 className="font-display text-3xl font-semibold text-white">
                      {portal.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                      {portal.copy}
                    </p>
                  </div>
                  <ButtonLink href={portal.href}>{portal.cta}</ButtonLink>
                </div>
              </Panel>
            ))}
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
