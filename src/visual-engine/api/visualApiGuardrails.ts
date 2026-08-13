import { runAIRecipeGuardrails } from "../ai";
import { routeEngineForRecipe } from "../engines";
import { validateVisualRecipe } from "../foundation";

import { createVisualApiFallbackOutput } from "./visualApiFallback";
import type { VisualApiInput, VisualApiOutput } from "./visualApi.types";

export function runVisualApiGuardrails(output: VisualApiOutput, input: VisualApiInput): VisualApiOutput {
  if (!output.ok || !output.recipe) {
    return createVisualApiFallbackOutput(input, [
      ...output.validationErrors,
      "ForLoop output failed before SciLoop guardrails.",
    ]);
  }
  const guardrails = runAIRecipeGuardrails(output.recipe, {
    rawText: input.rawText,
    topic: input.topic,
    difficulty: input.difficulty,
    preferredPatternId: input.preferredPatternId,
    preferredVisualType: input.preferredVisualType,
    preferredEngine: input.preferredEngine,
    needsInteraction: input.needsInteraction,
    needsMathLayer: input.needsMathLayer,
    needsRealLifeExample: input.needsRealLifeExample,
    constraints: input.constraints,
  });
  const validation = validateVisualRecipe(output.recipe);
  if (!guardrails.ok || !validation.ok) {
    return createVisualApiFallbackOutput(input, [...guardrails.errors, ...validation.errors]);
  }
  const routed = routeEngineForRecipe(output.recipe);
  return {
    ...output,
    selectedEngine: routed.primaryEngine,
    warnings: [...output.warnings, ...guardrails.warnings, ...routed.warnings],
    validationErrors: [],
  };
}
