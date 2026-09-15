import type { VisualRecipe, VisualRecipeVisualType } from "@/src/visual-engine/foundation";
import type { VisualPattern } from "@/src/visual-engine/patterns";

import { getVisualEngine, visualEngines } from "./engineCapabilities";
import { getFallbackEngines as getFallbackEngineIds } from "./engineFallbacks";
import { rankEnginesForInput } from "./engineScoring";
import type {
  EngineRecommendation,
  EngineRoutingInput,
  EngineRoutingResult,
  VisualEngineId,
} from "./engine.types";
import { getEngineWarning, getSafeDefaultEngine } from "./engineUtils";

function toRecommendation(engineId: VisualEngineId, score: number, reason: string): EngineRecommendation {
  const engine = getVisualEngine(engineId);
  const fallbackEngines = getFallbackEngineIds(engineId);
  const warnings = [getEngineWarning(engineId)].filter((warning): warning is string => Boolean(warning));

  return {
    primaryEngine: engineId,
    fallbackEngines,
    confidence: Math.max(0.1, Math.min(0.98, score / 28)),
    reason,
    warnings,
    requiredDependencies: engine?.requiredDependencies ?? [],
    installed: engine?.installed ?? false,
    supportedByCurrentProject: engine?.supportedByCurrentProject ?? false,
  };
}

export function getRecommendedEngine(input: EngineRoutingInput): EngineRoutingResult {
  const ranked = rankEnginesForInput(input);
  const best = ranked[0];

  if (!best) {
    const safeDefault = getSafeDefaultEngine();
    const recommendation = toRecommendation(safeDefault, 8, "No routing signal matched, so SciLoop used the safe default engine.");
    return { ...recommendation, rankedEngines: [recommendation] };
  }

  const chosenEngineId = best.engine.installed
    ? best.engine.id
    : best.engine.fallbackEngineIds.find((fallbackId) => getVisualEngine(fallbackId)?.installed) ?? getSafeDefaultEngine();
  const chosenEngine = getVisualEngine(chosenEngineId) ?? best.engine;
  const reason = chosenEngineId === best.engine.id
    ? best.reasons.join(" ") || `${chosenEngine.name} is the highest scoring engine.`
    : `${best.engine.name} scored highest, but it is not installed. Routed to installed fallback ${chosenEngine.name}.`;

  const primary = toRecommendation(chosenEngineId, best.score, reason);
  const rankedEngines = ranked.slice(0, 5).map((entry) => toRecommendation(
    entry.engine.id,
    entry.score,
    entry.reasons.join(" ") || `${entry.engine.name} is a candidate engine.`,
  ));

  return {
    ...primary,
    rankedEngines,
  };
}

export function routeEngineForRecipe(recipe: VisualRecipe) {
  return getRecommendedEngine({
    recipe,
    visualType: recipe.visualType,
    atoms: recipe.atomsUsed,
    complexity: recipe.objects.length > 20 ? "high" : recipe.objects.length > 8 ? "medium" : "low",
  });
}

export function routeEngineForPattern(pattern: VisualPattern) {
  return getRecommendedEngine({
    pattern,
    visualType: pattern.visualType,
    atoms: pattern.atomsUsed,
    conceptText: `${pattern.name} ${pattern.tags.join(" ")}`,
    complexity: pattern.preferredEngines.some((engine) => engine.primary === "webgpu-experimental") ? "frontier" : "low",
  });
}

export function routeEngineForVisualType(visualType: VisualRecipeVisualType) {
  return getRecommendedEngine({ visualType });
}

export function routeEngineForConceptText(input: string) {
  return getRecommendedEngine({ conceptText: input });
}

export function getFallbackEngines(engineId: VisualEngineId) {
  return getFallbackEngineIds(engineId);
}

export function explainEngineChoice(result: EngineRoutingResult) {
  const engine = visualEngines.find((candidate) => candidate.id === result.primaryEngine);
  const fallbackNames = result.fallbackEngines
    .map((fallbackId) => visualEngines.find((candidate) => candidate.id === fallbackId)?.name ?? fallbackId)
    .join(", ");

  return `${engine?.name ?? result.primaryEngine}: ${result.reason} Fallbacks: ${fallbackNames || "none"}.`;
}
