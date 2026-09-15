import {
  validateRecipeFlows,
  validateRecipeRelations,
  type VisualRecipe,
} from "@/src/visual-engine/foundation";
import {
  getVisualEngine,
  visualEngineIds,
} from "@/src/visual-engine/engines";

import type { AIRecipeGuardrailResult, AIVisualTranslatorInput } from "./aiVisualTranslator.types";

function result(errors: string[], warnings: string[] = []): AIRecipeGuardrailResult {
  return { ok: errors.length === 0, errors, warnings };
}

export function guardAgainstRandomVisuals(text: string) {
  const blocked = ["<svg", "canvas.getcontext", "new image", "midjourney", "draw this exact"];
  const lower = text.toLowerCase();
  return blocked.some((token) => lower.includes(token))
    ? result(["AI output appears to contain uncontrolled visual/code instructions."])
    : result([]);
}

export function guardAgainstUnsupportedEngines(recipe: VisualRecipe) {
  const ids = new Set<string>(visualEngineIds);
  return ids.has(recipe.engineRecommendation.primary)
    ? result([])
    : result([`Unsupported engine id: ${recipe.engineRecommendation.primary}.`]);
}

export function guardAgainstMissingFallback(recipe: VisualRecipe) {
  return recipe.fallback?.title && recipe.fallback.description && recipe.fallback.messageForUser
    ? result([])
    : result(["Recipe is missing a safe fallback."]);
}

export function guardAgainstInvalidRelations(recipe: VisualRecipe) {
  return result([...validateRecipeRelations(recipe), ...validateRecipeFlows(recipe)]);
}

export function guardAgainstEmptyLayers(recipe: VisualRecipe) {
  return recipe.layers.length > 0 && recipe.objects.length > 0
    ? result([])
    : result(["Recipe must include layers and objects."]);
}

export function guardAgainstTooManyObjects(recipe: VisualRecipe, limit = 40) {
  return recipe.objects.length <= limit
    ? result([])
    : result([`Recipe has too many objects (${recipe.objects.length}/${limit}).`]);
}

export function guardAgainstOverComplexity(recipe: VisualRecipe) {
  const warnings: string[] = [];
  if (recipe.motion.length > 8) warnings.push("Recipe has many motion rules; renderer may simplify them.");
  if (recipe.interactions.length > 6) warnings.push("Recipe has many interactions; use progressive disclosure.");
  return result([], warnings);
}

export function guardAgainstFrontendApiKeyExposure(input: AIVisualTranslatorInput) {
  const text = `${input.rawText} ${(input.constraints ?? []).join(" ")}`.toLowerCase();
  return text.includes("api_key") || text.includes("sk-")
    ? result(["Input appears to include an API key or secret."])
    : result([]);
}

export function guardAgainstExperimentalEngine(recipe: VisualRecipe) {
  const engine = getVisualEngine(recipe.engineRecommendation.primary);
  if (engine?.id !== "webgpu-experimental") return result([]);
  const fallbacks = recipe.engineRecommendation.alternatives;
  return fallbacks.length > 0
    ? result([], ["WebGPU is experimental and must use fallback engines."])
    : result(["WebGPU recipe is missing fallback engines."]);
}

export function runAIRecipeGuardrails(recipe: VisualRecipe, input: AIVisualTranslatorInput): AIRecipeGuardrailResult {
  const checks = [
    guardAgainstRandomVisuals(input.rawText),
    guardAgainstUnsupportedEngines(recipe),
    guardAgainstMissingFallback(recipe),
    guardAgainstInvalidRelations(recipe),
    guardAgainstEmptyLayers(recipe),
    guardAgainstTooManyObjects(recipe),
    guardAgainstOverComplexity(recipe),
    guardAgainstFrontendApiKeyExposure(input),
    guardAgainstExperimentalEngine(recipe),
  ];

  return {
    ok: checks.every((check) => check.ok),
    errors: checks.flatMap((check) => check.errors),
    warnings: checks.flatMap((check) => check.warnings),
  };
}
