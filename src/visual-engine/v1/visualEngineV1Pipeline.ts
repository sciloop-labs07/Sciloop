import { translateWithMockAIUsingMemory, type AITranslatorAudience } from "@/src/visual-engine/ai";
import { getFeedbackByRecipeId } from "@/src/visual-engine/feedback";
import { validateVisualRecipe, type VisualRecipeDifficulty } from "@/src/visual-engine/foundation";
import { getAllMemories } from "@/src/visual-engine/memory";

import { SCILOOP_VISUAL_ENGINE_V1_NAME, VISUAL_ENGINE_V1_DEMO_CONCEPTS } from "./visualEngineV1.constants";
import type { VisualEngineV1PipelineInput, VisualEngineV1PipelineResult } from "./visualEngineV1.types";

export function getDefaultDemoConcept() {
  return VISUAL_ENGINE_V1_DEMO_CONCEPTS[0];
}

export function getVisualEngineV1PipelineSummary() {
  return {
    name: SCILOOP_VISUAL_ENGINE_V1_NAME,
    pipeline: "User idea → AI translator → visual recipe → pattern → engine router → renderer → feedback → memory",
    mode: "mock-demo-safe" as const,
  };
}

export function runVisualEngineV1DemoPipeline(input: VisualEngineV1PipelineInput): VisualEngineV1PipelineResult {
  const memories = input.memories ?? getAllMemories();
  const translation = translateWithMockAIUsingMemory({
    rawText: input.rawText,
    targetAudience: (input.targetAudience === "beginner" ? "student" : input.targetAudience) as AITranslatorAudience | undefined,
    difficulty: input.difficulty as VisualRecipeDifficulty | undefined,
    preferredMode: "mock",
    useVisualMemory: true,
  }, memories);
  const validation = validateVisualRecipe(translation.recipe);
  const feedback = getFeedbackByRecipeId(translation.recipe.id);

  return {
    ok: validation.ok,
    mode: "mock-demo-safe",
    input,
    translation,
    recipe: translation.recipe,
    selectedPattern: translation.selectedPattern,
    selectedEngine: translation.selectedEngine,
    validationErrors: validation.errors,
    warnings: translation.warnings,
    feedbackMetadata: { count: feedback.length, items: feedback },
    memoryMetadata: {
      count: memories.length,
      matched: translation.memoryUsed,
      summary: translation.memorySummary ?? "No matching successful visual memory was reused.",
    },
  };
}

export function runDemoConceptPipeline(conceptId: string) {
  const concept = VISUAL_ENGINE_V1_DEMO_CONCEPTS.find((item) => item.id === conceptId) ?? getDefaultDemoConcept();
  return runVisualEngineV1DemoPipeline({
    rawText: concept.userPrompt,
    targetAudience: concept.audience,
    difficulty: concept.audience === "kid" ? "kid" : concept.audience,
  });
}
