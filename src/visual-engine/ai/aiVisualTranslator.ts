import {
  getPatternById,
  suggestPatternsForConcept,
} from "@/src/visual-engine/patterns";
import {
  getEngineDisplayName,
  routeEngineForRecipe,
} from "@/src/visual-engine/engines";
import {
  validateVisualRecipe,
  type VisualRecipe,
} from "@/src/visual-engine/foundation";
import {
  getBestMemoryForConcept,
  type VisualMemory,
} from "@/src/visual-engine/memory";

import type {
  AIRecipeDraft,
  AITranslatorProvider,
  AITranslatorResult,
  AIVisualTranslatorInput,
} from "./aiVisualTranslator.types";
import { createInvalidAIOutputFallback } from "./aiRecipeFallback";
import { runAIRecipeGuardrails } from "./aiRecipeGuardrails";
import { normalizeAIRecipeDraft } from "./aiRecipeNormalizer";
import { translateWithMockAI as createMockDraft } from "./aiTranslatorMock";
import {
  cleanTranslatorInput,
  detectAudienceLevel,
  detectSourceType,
  summarizeTranslatorDecision,
} from "./aiTranslatorUtils";

function normalizeInput(input: AIVisualTranslatorInput | string): AIVisualTranslatorInput {
  if (typeof input === "string") {
    return {
      rawText: cleanTranslatorInput(input),
      sourceType: detectSourceType({ rawText: input }),
      targetAudience: "general",
      difficulty: "beginner",
      preferredMode: "mock",
    };
  }

  return {
    ...input,
    rawText: cleanTranslatorInput(input.rawText),
    sourceType: detectSourceType(input),
    targetAudience: detectAudienceLevel(input),
    difficulty: input.difficulty ?? "beginner",
    preferredMode: input.preferredMode ?? "mock",
  };
}

function selectedPatternFromDraft(input: AIVisualTranslatorInput, draft: AIRecipeDraft) {
  const suggested = suggestPatternsForConcept({
    concept: `${input.topic ?? ""} ${input.rawText}`,
    visualType: input.preferredVisualType,
    tags: input.constraints,
  });
  return getPatternById(draft.selectedPatternId ?? input.preferredPatternId ?? suggested[0]?.pattern.id ?? "compression-of-complexity")
    ?? suggested[0]?.pattern
    ?? getPatternById("compression-of-complexity");
}

function finalizeTranslation(input: AIVisualTranslatorInput, draft: AIRecipeDraft): AITranslatorResult {
  const normalization = normalizeAIRecipeDraft(draft, input);
  let recipe: VisualRecipe = normalization.recipe;
  let fallbackUsed = false;
  const guardrails = runAIRecipeGuardrails(recipe, input);
  const validation = validateVisualRecipe(recipe);

  if (!guardrails.ok || !validation.ok) {
    recipe = createInvalidAIOutputFallback(input, [...guardrails.errors, ...validation.errors]);
    fallbackUsed = true;
  }

  const selectedPattern = selectedPatternFromDraft(input, draft) ?? getPatternById("compression-of-complexity");
  if (!selectedPattern) {
    throw new Error("SciLoop fallback pattern is missing.");
  }

  const selectedEngine = routeEngineForRecipe(recipe);
  const finalValidation = validateVisualRecipe(recipe);

  return {
    recipe,
    selectedPattern,
    selectedEngine,
    confidence: fallbackUsed ? 0.62 : Math.max(0.7, selectedEngine.confidence),
    reasoningSummary: summarizeTranslatorDecision(selectedPattern.name, getEngineDisplayName(selectedEngine.primaryEngine), fallbackUsed),
    warnings: [...normalization.warnings, ...guardrails.warnings, ...selectedEngine.warnings],
    fallbackUsed,
    validationErrors: finalValidation.errors,
  };
}

export function translateWithMockAI(input: AIVisualTranslatorInput | string): AITranslatorResult {
  const normalizedInput = normalizeInput(input);
  return finalizeTranslation(normalizedInput, createMockDraft(normalizedInput));
}

/**
 * Optional, controlled reuse path. Memory supplies known pattern/engine
 * preferences and a validated recipe snapshot; normal guardrails still run.
 */
export function translateWithMockAIUsingMemory(
  input: AIVisualTranslatorInput | string,
  memories: VisualMemory[],
): AITranslatorResult {
  const normalizedInput = normalizeInput(input);
  if (normalizedInput.useVisualMemory === false) return translateWithMockAI(normalizedInput);
  const memory = getBestMemoryForConcept(`${normalizedInput.topic ?? ""} ${normalizedInput.rawText}`, memories);
  if (!memory) return translateWithMockAI(normalizedInput);

  const rememberedPattern = getPatternById(memory.patternId as Parameters<typeof getPatternById>[0]);
  const draft: AIRecipeDraft = memory.snapshot.recipe
    ? {
        ...memory.snapshot.recipe,
        selectedPatternId: rememberedPattern?.id,
        selectedEngineId: memory.engineId as AIRecipeDraft["selectedEngineId"],
      }
    : createMockDraft({
        ...normalizedInput,
        preferredPatternId: rememberedPattern?.id ?? normalizedInput.preferredPatternId,
        preferredEngine: memory.engineId as AIVisualTranslatorInput["preferredEngine"],
      });
  const result = finalizeTranslation(normalizedInput, draft);
  return {
    ...result,
    memoryUsed: memory,
    memorySummary: `Reused successful memory for ${memory.concept}: ${memory.patternId} with ${memory.engineId}.`,
    reasoningSummary: `${result.reasoningSummary} Visual Memory supplied a reviewed prior explanation.`,
  };
}

export async function translateWithProvider(input: AIVisualTranslatorInput | string, provider: AITranslatorProvider): Promise<AITranslatorResult> {
  const normalizedInput = normalizeInput(input);
  if (!provider.available) {
    return translateWithMockAI(normalizedInput);
  }
  const draft = await provider.translate(normalizedInput);
  return finalizeTranslation(normalizedInput, draft);
}

export function translateTextToVisualRecipe(input: AIVisualTranslatorInput | string): AITranslatorResult {
  return translateWithMockAI(input);
}

export function translateTopicToVisualRecipe(topic: string): AITranslatorResult {
  return translateWithMockAI({ rawText: topic, topic, sourceType: "topic" });
}

export function translateNewsToVisualRecipe(input: AIVisualTranslatorInput | string): AITranslatorResult {
  const normalizedInput = normalizeInput(input);
  return translateWithMockAI({ ...normalizedInput, sourceType: "news" });
}

export function translateConceptToVisualRecipe(input: AIVisualTranslatorInput | string): AITranslatorResult {
  const normalizedInput = normalizeInput(input);
  return translateWithMockAI({ ...normalizedInput, sourceType: "concept" });
}
