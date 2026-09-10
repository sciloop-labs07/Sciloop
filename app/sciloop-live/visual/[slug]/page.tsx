import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SandboxGlyph } from "@/components/simulation-lab/sandbox-glyph";
import { SignalRing } from "@/components/simulation-lab/signal-ring";
import { SignalMechanismVisual } from "@/components/visual-language/signal-mechanism-visual";
import { ButtonLink } from "@/components/ui/button-link";
import { Panel } from "@/components/ui/panel";
import { getInnovation } from "@/data/innovations";
import { getVisualMechanismRecipe } from "@/lib/visual-mechanism-recipes";

type VisualPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: VisualPageProps): Promise<Metadata> {
  const { slug } = await params;
  const innovation = getInnovation(slug);
  const recipe = getVisualMechanismRecipe(slug);
  return { title: recipe && innovation ? `${recipe.label} · ${innovation.title} | SciLoop` : "Visual mechanism | SciLoop" };
}

export default async function SignalVisualPage({ params }: VisualPageProps) {
  const { slug } = await params;
  const innovation = getInnovation(slug);
  const recipe = getVisualMechanismRecipe(slug);
  if (!innovation || !recipe) notFound();
  const glyph = recipe.kind === "quantum" ? "field" : recipe.kind === "biology" ? "biologicalResilience" : "energyAbundance";

  return (
    <main className="page-shell space-y-8 pb-16 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ButtonLink href={`/sciloop-live?signal=${innovation.slug}`} variant="secondary">← Back to signals</ButtonLink>
        <span className="eyebrow">Public visual mechanism</span>
      </div>
      <Panel className="rounded-[36px] p-6 md:p-10" glow>
        <div className="max-w-4xl">
          <div className="eyebrow">{innovation.field} · {recipe.label}</div>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">{innovation.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{recipe.summary}</p>
          <div className="mt-7 flex items-center gap-4 text-sm text-slate-400">
            <SignalRing value={0.78} tone={recipe.kind === "biology" ? "gold" : recipe.kind === "energy" ? "emerald" : "cyan"} size={64} strokeWidth={5}>
              <SandboxGlyph kind={glyph} className="h-5 w-5" />
            </SignalRing>
            <span>Shared SciLoop visual grammar · evidence, mechanism, outcome</span>
          </div>
        </div>
        <div className="mt-10 rounded-[28px] border border-cyan-200/15 bg-slate-950/35 p-4 md:p-8">
          <SignalMechanismVisual recipe={recipe} />
        </div>
      </Panel>
      <section className="grid gap-5 md:grid-cols-3" aria-label="Mechanism steps">
        {recipe.steps.map((step, index) => (
          <Panel key={step} className="rounded-[26px] p-6">
            <div className="font-mono text-xs text-cyan-200/60">0{index + 1}</div>
            <h2 className="mt-8 font-display text-2xl font-semibold text-white">{step}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">{index === 0 ? innovation.facts[0] : index === 1 ? innovation.mechanism : innovation.decision.researchQuestion}</p>
          </Panel>
        ))}
      </section>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={`/sciloop/live/${innovation.slug}`}>Read the full signal</ButtonLink>
        <ButtonLink href="/visual-language" variant="secondary">Open Visual Language Portal</ButtonLink>
      </div>
    </main>
  );
}
