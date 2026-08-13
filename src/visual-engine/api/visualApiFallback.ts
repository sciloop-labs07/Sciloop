import { translateWithMockAI } from "../ai";

import type { VisualApiInput, VisualApiOutput } from "./visualApi.types";

export function createVisualApiFallbackOutput(input: VisualApiInput, reasons: string[] = []): VisualApiOutput {
  const result = translateWithMockAI({
    rawText: input.rawText,
    topic: input.topic,
    difficulty: input.difficulty,
    preferredPatternId: input.preferredPatternId,
    preferredVisualType: input.preferredVisualType,
    preferredEngine: input.preferredEngine,
    needsMathLayer: input.needsMathLayer,
    needsRealLifeExample: input.needsRealLifeExample,
    needsInteraction: input.needsInteraction,
    constraints: input.constraints,
  });
  return {
    ok: true,
    mode: "mock",
    recipe: result.recipe,
    selectedPattern: result.selectedPattern.id,
    selectedEngine: result.selectedEngine.primaryEngine,
    confidence: result.confidence,
    reasoningSummary: "ForLoop was unavailable or unsafe, so SciLoop used its controlled mock translator.",
    warnings: [...reasons, ...result.warnings],
    validationErrors: result.validationErrors,
    fallbackUsed: true,
  };
}
