import {
  createRecipeFromPattern,
  createRecipeFromVisualPattern,
  getPatternById,
  mergeCompatiblePatterns,
  type VisualPatternId,
} from "@/src/visual-engine/patterns";
import type { VisualRecipe } from "@/src/visual-engine/foundation";

import type { AIVisualTranslatorInput } from "./aiVisualTranslator.types";
import { cleanTranslatorInput } from "./aiTranslatorUtils";

function topicFromInput(input: AIVisualTranslatorInput | string) {
  if (typeof input === "string") return cleanTranslatorInput(input) || "Visual Understanding";
  return cleanTranslatorInput(input.topic ?? input.rawText) || "Visual Understanding";
}

function mustGetPattern(patternId: VisualPatternId) {
  const pattern = getPatternById(patternId);
  if (!pattern) throw new Error(`Missing fallback pattern: ${patternId}`);
  return pattern;
}

export function createSimpleConceptMapFallback(topic: string): VisualRecipe {
  return createRecipeFromPattern("cause-effect", topic);
}

export function createLayeredRealityFallback(topic: string): VisualRecipe {
  return createRecipeFromPattern("hidden-visible-layer", topic);
}

export function createCompressionOfComplexityFallback(topic: string): VisualRecipe {
  return createRecipeFromPattern("compression-of-complexity", topic);
}

export function createFallbackRecipeFromText(input: AIVisualTranslatorInput | string): VisualRecipe {
  return createCompressionOfComplexityFallback(topicFromInput(input));
}

export function createInvalidAIOutputFallback(input: AIVisualTranslatorInput, errors: string[]): VisualRecipe {
  const recipe = createFallbackRecipeFromText(input);
  return {
    ...recipe,
    summary: `${recipe.summary} Fallback used because translator output was invalid.`,
    explanation: {
      ...recipe.explanation,
      keyTakeaways: [...recipe.explanation.keyTakeaways, `Fallback reason: ${errors.join("; ")}`],
    },
  };
}

export function createMergedFallbackRecipe(topic: string, patternIds: VisualPatternId[]): VisualRecipe {
  const patterns = patternIds.map(mustGetPattern);
  return createRecipeFromVisualPattern(mergeCompatiblePatterns(patterns), topic);
}
