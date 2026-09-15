import type { VisualRecipe } from "./visualRecipe.types";

/**
 * Schema-like defaults and structural requirements for Visual Recipes.
 *
 * Zod is not installed in this project, so this file intentionally uses
 * TypeScript-safe defaults and lightweight manual checks instead of adding a
 * dependency. Future commands can swap these helpers for Zod if the project
 * chooses to install it.
 */

export const visualRecipeRequiredFields = [
  "id",
  "title",
  "concept",
  "visualType",
  "layers",
  "objects",
  "engineRecommendation",
  "fallback",
] as const satisfies readonly (keyof VisualRecipe)[];

export const visualRecipeDefaultMetadata = {
  createdBy: "system",
  version: "0.1.0",
  confidence: 0.7,
} as const satisfies VisualRecipe["metadata"];

export const visualRecipeDefaultExplanation = {
  simple: "This recipe explains a concept using SciLoop's controlled visual language.",
  detailed: "The recipe should preserve cause, structure, motion, and human understanding before any renderer draws it.",
  keyTakeaways: [],
  visualReadingOrder: [],
} as const satisfies VisualRecipe["explanation"];

export const visualRecipeDefaultFallback = {
  title: "Readable fallback",
  description: "If the preferred renderer is unavailable, show a simple concept map with labels.",
  safeVisualType: "concept-map",
  messageForUser: "This concept can still be understood with a simpler visual layout.",
} as const satisfies VisualRecipe["fallback"];

export const visualRecipeDefaultAssessment = {
  checksUnderstanding: false,
  expectedUserInsight: "The user should understand the main relationship in the concept.",
  questions: [],
  successCriteria: [],
} as const satisfies VisualRecipe["assessment"];

export function createEmptyVisualRecipe(overrides: Partial<VisualRecipe> = {}): VisualRecipe {
  return {
    id: overrides.id ?? "visual-recipe-draft",
    title: overrides.title ?? "Untitled Visual Recipe",
    concept: overrides.concept ?? "Unspecified concept",
    summary: overrides.summary ?? "A structured visual explanation recipe.",
    metadata: overrides.metadata ?? { ...visualRecipeDefaultMetadata },
    difficulty: overrides.difficulty ?? "beginner",
    targetAudience: overrides.targetAudience ?? "student",
    visualType: overrides.visualType ?? "concept-map",
    pattern: overrides.pattern ?? "cause-effect",
    atomsUsed: overrides.atomsUsed ?? ["node", "edge"],
    layers: overrides.layers ?? [],
    objects: overrides.objects ?? [],
    relations: overrides.relations ?? [],
    flows: overrides.flows ?? [],
    transformations: overrides.transformations ?? [],
    feedbackLoops: overrides.feedbackLoops ?? [],
    timeline: overrides.timeline ?? { id: "default-timeline", stages: [] },
    interactions: overrides.interactions ?? [],
    motion: overrides.motion ?? [],
    engineRecommendation: overrides.engineRecommendation ?? {
      primary: "react-tailwind",
      alternatives: ["svg-motion"],
      reason: "Default readable layout for early recipes.",
    },
    explanation: overrides.explanation ?? { ...visualRecipeDefaultExplanation },
    fallback: overrides.fallback ?? { ...visualRecipeDefaultFallback },
    assessment: overrides.assessment ?? { ...visualRecipeDefaultAssessment },
    understandingGoal: overrides.understandingGoal,
    tags: overrides.tags ?? [],
  };
}

