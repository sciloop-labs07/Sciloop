import type { VisualRecipe, VisualRecipeVisualType } from "@/src/visual-engine/foundation";
import type { VisualPattern } from "@/src/visual-engine/patterns";

import { visualEngines } from "./engineCapabilities";
import { getMatchingEngineRules } from "./engineRules";
import type {
  EngineComplexityLevel,
  EngineRoutingInput,
  VisualEngine,
} from "./engine.types";
import { getFallbackEngines } from "./engineFallbacks";

const visualTypeEngineMap: Partial<Record<VisualRecipeVisualType, VisualEngine["id"][]>> = {
  "concept-map": ["svg-motion", "react-tailwind"],
  transformation: ["svg-motion", "canvas-2d", "react-tailwind"],
  "flow-system": ["canvas-2d", "svg-motion"],
  "layered-reality": ["svg-motion", "react-tailwind"],
  timeline: ["svg-motion", "react-tailwind"],
  "feedback-loop": ["svg-motion", "react-tailwind"],
  comparison: ["react-tailwind", "svg-motion", "echarts"],
  simulation: ["canvas-2d", "three-r3f", "webgl"],
  "field-influence": ["svg-motion", "three-r3f", "canvas-2d"],
  network: ["d3", "svg-motion", "react-tailwind"],
  "decision-tree": ["d3", "svg-motion", "react-tailwind"],
  "signal-decomposition": ["canvas-2d", "svg-motion"],
  "innovation-pipeline": ["svg-motion", "react-tailwind"],
};

const complexityScore: Record<EngineComplexityLevel, Record<EngineComplexityLevel, number>> = {
  low: { low: 4, medium: 1, high: -2, frontier: -4 },
  medium: { low: 2, medium: 4, high: 1, frontier: -2 },
  high: { low: 0, medium: 2, high: 4, frontier: 1 },
  frontier: { low: -1, medium: 1, high: 3, frontier: 4 },
};

export function scoreEngineForVisualType(visualType: VisualRecipeVisualType, engine: VisualEngine) {
  const rankedEngines = visualTypeEngineMap[visualType] ?? ["react-tailwind"];
  const index = rankedEngines.indexOf(engine.id);
  if (index === -1) return 0;
  return Math.max(8 - index * 2, 2);
}

export function scoreEngineForComplexity(complexity: EngineComplexityLevel, engine: VisualEngine) {
  return complexityScore[complexity][engine.complexityLevel];
}

export function scoreEngineForRecipe(recipe: VisualRecipe, engine: VisualEngine) {
  let score = scoreEngineForVisualType(recipe.visualType, engine);
  const objectCount = recipe.objects.length;
  const hasMotion = recipe.motion.length > 0 || recipe.flows.length > 0;
  const hasInteractions = recipe.interactions.length > 0;

  if (objectCount > 25 && engine.performanceProfile.bestObjectCount !== "few") score += 3;
  if (objectCount <= 8 && engine.performanceProfile.bestObjectCount === "few") score += 2;
  if (hasMotion && ["canvas-2d", "svg-motion", "pixijs", "three-r3f"].includes(engine.id)) score += 2;
  if (hasInteractions && ["react-tailwind", "svg-motion", "phaser", "rive"].includes(engine.id)) score += 1;
  if (recipe.engineRecommendation.primary === engine.id) score += 4;
  if (recipe.engineRecommendation.alternatives.includes(engine.id as never)) score += 2;
  if (engine.installed) score += 2;
  if (!engine.installed && getFallbackEngines(engine.id).some((fallback) => visualEngines.find((candidate) => candidate.id === fallback)?.installed)) score -= 1;
  if (engine.complexityLevel === "frontier") score -= 3;

  return score;
}

export function scoreEngineForPattern(pattern: VisualPattern, engine: VisualEngine) {
  let score = scoreEngineForVisualType(pattern.visualType, engine);
  if (pattern.preferredEngines.some((preference) => preference.primary === engine.id)) score += 4;
  if (pattern.preferredEngines.some((preference) => preference.alternatives.includes(engine.id as never))) score += 2;
  if (pattern.atomsUsed.some((atom) => engine.exampleUseCases.some((useCase) => useCase.atoms.includes(atom)))) score += 2;
  if (engine.installed) score += 2;
  if (engine.complexityLevel === "frontier") score -= 3;
  return score;
}

export function rankEnginesForInput(input: EngineRoutingInput) {
  const rules = getMatchingEngineRules(input);
  const complexity = input.complexity ?? "low";

  return visualEngines
    .map((engine) => {
      let score = scoreEngineForComplexity(complexity, engine);
      const reasons: string[] = [];

      if (input.visualType) {
        const visualTypeScore = scoreEngineForVisualType(input.visualType, engine);
        score += visualTypeScore;
        if (visualTypeScore > 0) reasons.push(`Matches visual type ${input.visualType}.`);
      }

      if (input.recipe) {
        const recipeScore = scoreEngineForRecipe(input.recipe, engine);
        score += recipeScore;
        if (recipeScore > 0) reasons.push(`Fits recipe ${input.recipe.title}.`);
      }

      if (input.pattern) {
        const patternScore = scoreEngineForPattern(input.pattern, engine);
        score += patternScore;
        if (patternScore > 0) reasons.push(`Fits pattern ${input.pattern.name}.`);
      }

      rules.filter((rule) => rule.engineId === engine.id).forEach((rule) => {
        score += rule.score;
        reasons.push(rule.reason);
      });

      if (input.preferredEngine === engine.id) {
        score += 6;
        reasons.push("Caller preferred this engine.");
      }

      if (engine.installed) score += 2;
      if (!engine.supportedByCurrentProject) score -= 3;
      if (engine.id === "webgpu-experimental") score -= 5;

      return { engine, score, reasons };
    })
    .sort((a, b) => b.score - a.score || a.engine.name.localeCompare(b.engine.name));
}
