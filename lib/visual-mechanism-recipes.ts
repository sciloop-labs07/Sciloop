export type VisualMechanismKind = "quantum" | "biology" | "energy";

export type VisualMechanismRecipe = {
  slug: string;
  kind: VisualMechanismKind;
  label: string;
  summary: string;
  steps: [string, string, string];
  accessibleDescription: string;
  accent: string;
};

export const visualMechanismRecipes: Record<string, VisualMechanismRecipe> = {
  "google-quantum-chip": {
    slug: "google-quantum-chip",
    kind: "quantum",
    label: "Quantum error correction",
    summary: "Noise is detected, corrected, and turned into a more reliable logical qubit.",
    steps: ["Noisy qubits", "Error correction", "Logical qubit"],
    accessibleDescription: "Three-step quantum mechanism: noisy physical qubits flow into error correction and become a more reliable logical qubit.",
    accent: "#167b78",
  },
  "crispr-gene-editing": {
    slug: "crispr-gene-editing",
    kind: "biology",
    label: "Programmable gene editing",
    summary: "A guide sequence finds target DNA, then a molecular tool makes the edit.",
    steps: ["Guide RNA", "Target DNA", "Precise edit"],
    accessibleDescription: "Three-step CRISPR mechanism: a guide RNA finds target DNA and a molecular tool creates a precise edit.",
    accent: "#8b5e34",
  },
  "solid-state-battery": {
    slug: "solid-state-battery",
    kind: "energy",
    label: "Solid-state energy storage",
    summary: "Ions travel through a solid electrolyte while the cell stores usable energy.",
    steps: ["Lithium ions", "Solid electrolyte", "Stored energy"],
    accessibleDescription: "Three-step battery mechanism: lithium ions move through a solid electrolyte between electrodes to store energy.",
    accent: "#276749",
  },
};

export function getVisualMechanismRecipe(slug: string) {
  return visualMechanismRecipes[slug];
}
