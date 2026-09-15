import {
  createRecipeFromPattern,
  createRecipeFromVisualPattern,
  getPatternById,
  mergeCompatiblePatterns,
  type VisualPattern,
  type VisualPatternId,
} from "@/src/visual-engine/patterns";
import type { VisualRecipe } from "@/src/visual-engine/foundation";

import type { AIRecipeDraft, AIVisualTranslatorInput } from "./aiVisualTranslator.types";
import { cleanTranslatorInput, detectLikelyConceptDomain } from "./aiTranslatorUtils";

function mustGetPattern(patternId: VisualPatternId): VisualPattern {
  const pattern = getPatternById(patternId);
  if (!pattern) throw new Error(`Missing mock translator pattern: ${patternId}`);
  return pattern;
}

function draftFromRecipe(recipe: VisualRecipe, selectedPatternId: VisualPatternId): AIRecipeDraft {
  return {
    ...recipe,
    selectedPatternId,
    selectedEngineId: recipe.engineRecommendation.primary,
  };
}

export function translateWithMockAI(input: AIVisualTranslatorInput): AIRecipeDraft {
  const text = cleanTranslatorInput(`${input.topic ?? ""} ${input.rawText}`).toLowerCase();
  const domain = detectLikelyConceptDomain(input);

  if (input.preferredPatternId) {
    return draftFromRecipe(createRecipeFromPattern(input.preferredPatternId, input.topic ?? input.rawText), input.preferredPatternId);
  }

  if (domain === "math-signal" || /fourier|frequency|wave|signal/.test(text)) {
    return draftFromRecipe(createRecipeFromPattern("signal-decomposition", "Fourier Transform"), "signal-decomposition");
  }

  if (domain === "physics-field" || /gravity|mass|field/.test(text)) {
    return draftFromRecipe(createRecipeFromPattern("field-influence", input.topic ?? "Gravity"), "field-influence");
  }

  if (domain === "energy-system" || /heat|energy|random|particle/.test(text)) {
    const pattern = mergeCompatiblePatterns([mustGetPattern("random-to-organized"), mustGetPattern("energy-flow")]);
    return draftFromRecipe(createRecipeFromVisualPattern(pattern, "Heat to Organized Energy"), "random-to-organized");
  }

  if (domain === "global-systems" || /global|problem|solve|map/.test(text)) {
    const pattern = mergeCompatiblePatterns([mustGetPattern("local-action-global-impact"), mustGetPattern("network-growth")]);
    return draftFromRecipe(createRecipeFromVisualPattern(pattern, "Global Problem Solving"), "local-action-global-impact");
  }

  if (domain === "innovation-news" || /innovation|news|product|invention/.test(text)) {
    const pattern = mergeCompatiblePatterns([mustGetPattern("innovation-pipeline"), mustGetPattern("compression-of-complexity")]);
    return draftFromRecipe(createRecipeFromVisualPattern(pattern, input.topic ?? "Innovation News to Visual Understanding"), "innovation-pipeline");
  }

  return draftFromRecipe(createRecipeFromPattern("compression-of-complexity", input.topic ?? "Random Information to Human Understanding"), "compression-of-complexity");
}
