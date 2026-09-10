import { physicsDiscoveries } from "@/data/discoveries";
import type { Discovery, SimulationState } from "@/lib/types";

export type PhysicsVisualKind = "induction" | "relativity" | "higgs";

export interface PhysicsVisualRecipe {
  slug: string;
  title: string;
  shortTitle: string;
  year: string;
  kind: PhysicsVisualKind;
  accent: string;
  summary: string;
  mechanism: string;
  before: SimulationState;
  after: SimulationState;
  visualLabels: [string, string, string];
  metrics: [string, string, string];
}

const kindBySlug: Record<string, PhysicsVisualKind> = {
  "electromagnetic-induction": "induction",
  "general-relativity": "relativity",
  "higgs-field": "higgs",
};

const accentByKind: Record<PhysicsVisualKind, string> = {
  induction: "#67e8f9",
  relativity: "#c4b5fd",
  higgs: "#fcd34d",
};

const labelsByKind: Record<PhysicsVisualKind, [string, string, string]> = {
  induction: ["Changing flux", "Charge motion", "Usable current"],
  relativity: ["Mass", "Curved space", "Bending paths"],
  higgs: ["Field interaction", "Resistance", "Massive matter"],
};

const metricsByKind: Record<PhysicsVisualKind, [string, string, string]> = {
  induction: ["field intensity", "orbit speed", "energy output"],
  relativity: ["curvature", "lensing", "orbit compression"],
  higgs: ["field coupling", "motion", "density"],
};

function toRecipe(discovery: Discovery): PhysicsVisualRecipe {
  const kind = kindBySlug[discovery.slug] ?? "induction";

  return {
    slug: discovery.slug,
    title: discovery.title,
    shortTitle: discovery.shortTitle,
    year: discovery.year,
    kind,
    accent: accentByKind[kind],
    summary: discovery.summary,
    mechanism: discovery.mechanismView,
    before: discovery.simulation.before.state,
    after: discovery.simulation.after.state,
    visualLabels: labelsByKind[kind],
    metrics: metricsByKind[kind],
  };
}

export const physicsVisualRecipes = physicsDiscoveries.map(toRecipe);

export function getPhysicsVisualRecipe(slug?: string) {
  return physicsVisualRecipes.find((recipe) => recipe.slug === slug) ?? physicsVisualRecipes[0];
}

export function getPhysicsDiscovery(slug?: string) {
  return physicsDiscoveries.find((discovery) => discovery.slug === slug) ?? physicsDiscoveries[0];
}
