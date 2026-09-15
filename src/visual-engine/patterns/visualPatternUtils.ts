import type {
  VisualAtomType,
  VisualRecipeEngine,
  VisualRecipeVisualType,
} from "@/src/visual-engine/foundation";

import type { VisualPattern } from "./visualPattern.types";

export function normalizePatternInput(input: string | string[] | undefined) {
  if (!input) return [];
  const joined = Array.isArray(input) ? input.join(" ") : input;
  return joined
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function patternUsesAtom(pattern: VisualPattern, atom: VisualAtomType) {
  return pattern.atomsUsed.includes(atom);
}

export function patternSupportsVisualType(pattern: VisualPattern, visualType: VisualRecipeVisualType) {
  return pattern.visualType === visualType;
}

export function getPatternPrimaryEngine(pattern: VisualPattern): VisualRecipeEngine {
  return pattern.preferredEngines[0]?.primary ?? "react-tailwind";
}

export function getPatternFallbackEngine(pattern: VisualPattern): VisualRecipeEngine {
  return pattern.fallbackEngines[0] ?? getPatternPrimaryEngine(pattern);
}

export function getPatternUnderstandingGoal(pattern: VisualPattern) {
  return pattern.understandingGoal;
}

/**
 * One pattern can explain many topics. This merge keeps compatible pattern
 * memory together without inventing a new uncontrolled visual language.
 */
export function mergeCompatiblePatterns(patterns: VisualPattern[]): VisualPattern {
  if (patterns.length === 0) {
    throw new Error("mergeCompatiblePatterns requires at least one pattern.");
  }

  const [primary, ...rest] = patterns;
  const atoms = new Set(primary.atomsUsed);
  const tags = new Set(primary.tags);
  const exampleConcepts = new Set(primary.exampleConcepts);

  rest.forEach((pattern) => {
    pattern.atomsUsed.forEach((atom) => atoms.add(atom));
    pattern.tags.forEach((tag) => tags.add(tag));
    pattern.exampleConcepts.forEach((concept) => exampleConcepts.add(concept));
  });

  return {
    ...primary,
    name: patterns.map((pattern) => pattern.name).join(" + "),
    shortDescription: patterns.map((pattern) => pattern.shortDescription).join(" "),
    deepPurpose: patterns.map((pattern) => pattern.deepPurpose).join(" "),
    atomsUsed: [...atoms],
    stages: patterns.flatMap((pattern) => pattern.stages),
    layerTemplates: patterns.flatMap((pattern) => pattern.layerTemplates),
    objectTemplates: patterns.flatMap((pattern) => pattern.objectTemplates),
    relationTemplates: patterns.flatMap((pattern) => pattern.relationTemplates),
    flowTemplates: patterns.flatMap((pattern) => pattern.flowTemplates),
    transformationTemplates: patterns.flatMap((pattern) => pattern.transformationTemplates),
    interactionTemplates: patterns.flatMap((pattern) => pattern.interactionTemplates),
    preferredEngines: patterns.flatMap((pattern) => pattern.preferredEngines),
    fallbackEngines: patterns.flatMap((pattern) => pattern.fallbackEngines),
    exampleConcepts: [...exampleConcepts],
    tags: [...tags],
    understandingGoal: {
      userShouldUnderstand: patterns.flatMap((pattern) => pattern.understandingGoal.userShouldUnderstand),
      successSignal: patterns.map((pattern) => pattern.understandingGoal.successSignal).join(" "),
    },
  };
}
