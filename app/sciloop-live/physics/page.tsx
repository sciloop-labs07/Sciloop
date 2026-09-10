import type { Metadata } from "next";

import { PhysicsMechanismVisual } from "@/components/visual-language/physics-mechanism-visual";
import { ButtonLink } from "@/components/ui/button-link";
import { Panel } from "@/components/ui/panel";
import { getPhysicsDiscovery, getPhysicsVisualRecipe, physicsVisualRecipes } from "@/lib/physics-visual-language";

export const metadata: Metadata = {
  title: "Physics Visual Language · SciLoop",
  description: "See fields, curvature, and mass become visible through SciLoop's physics visual language.",
};

interface PhysicsVisualLanguagePageProps {
  searchParams: Promise<{ discovery?: string }>;
}

export default async function PhysicsVisualLanguagePage({ searchParams }: PhysicsVisualLanguagePageProps) {
  const params = await searchParams;
  const selectedRecipe = getPhysicsVisualRecipe(params.discovery);
  const selectedDiscovery = getPhysicsDiscovery(selectedRecipe.slug);

  return (
    <main className="page-shell mx-auto w-full max-w-7xl space-y-8 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ButtonLink href="/sciloop-live" variant="secondary">← Back to SciLoop</ButtonLink>
        <span className="eyebrow">Public physics visual language</span>
      </div>

      <Panel className="overflow-hidden rounded-[36px] px-5 py-6 md:px-8 md:py-9" glow>
        <div className="max-w-3xl">
          <div className="eyebrow">Physics · reviewed visual system</div>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Make the mechanism visible.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            SciLoop translates a physics discovery into a visible change: fields drive motion, mass curves space, and interaction gives matter weight.
          </p>
        </div>

        <div className="mt-8 rounded-[28px] border border-cyan-200/15 bg-slate-950/35 p-3 md:p-6" id="physics-visual">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-200/60">Active visual</div>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">{selectedDiscovery.title}</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">{selectedDiscovery.year}</span>
          </div>
          <PhysicsMechanismVisual recipe={selectedRecipe} />
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">{selectedRecipe.mechanism}</p>
        </div>
      </Panel>

      <section aria-labelledby="physics-discoveries-heading">
        <div className="mb-5">
          <div className="eyebrow">Choose a world</div>
          <h2 id="physics-discoveries-heading" className="mt-2 font-display text-3xl font-semibold text-white">Three ways reality changes.</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {physicsVisualRecipes.map((recipe) => {
            const active = recipe.slug === selectedRecipe.slug;
            return (
              <Panel key={recipe.slug} className={`rounded-[30px] p-4 ${active ? "border-cyan-200/30 bg-cyan-200/[0.06]" : ""}`}>
                <div className="flex items-center justify-between gap-3 px-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{recipe.year}</span>
                  <span className="text-xs text-cyan-100/70">{recipe.shortTitle}</span>
                </div>
                <div className="mt-4 rounded-[22px] border border-white/10 bg-slate-950/35 p-2">
                  <PhysicsMechanismVisual recipe={recipe} />
                </div>
                <h3 className="mt-5 px-2 font-display text-2xl font-semibold text-white">{recipe.title}</h3>
                <p className="mt-3 px-2 text-sm leading-7 text-slate-400">{recipe.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2 px-2">
                  <ButtonLink href={`/sciloop-live/physics?discovery=${recipe.slug}#physics-visual`} variant={active ? "primary" : "secondary"}>
                    {active ? "Viewing visual" : "See visual"}
                  </ButtonLink>
                  <ButtonLink href={`/mini-experiment-lab?discovery=${recipe.slug}`} variant="secondary">
                    Run full lab
                  </ButtonLink>
                </div>
              </Panel>
            );
          })}
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-slate-400 md:p-7">
        <strong className="text-slate-200">Public boundary:</strong> this page is the reviewed physics slice. The full interactive sandbox remains available through the protected workbench and is not loaded until a visitor explicitly chooses “Run full lab”.
      </section>
    </main>
  );
}
