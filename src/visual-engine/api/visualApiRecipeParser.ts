import { normalizeAIRecipeDraft } from "../ai";
import type { AIRecipeDraft, AIVisualTranslatorInput } from "../ai";
import type { VisualRecipeDifficulty, VisualRecipeVisualType } from "../foundation";
import { getPatternById } from "../patterns";

import type { VisualApiInput, VisualApiOutput } from "./visualApi.types";
import { resolveVisualRecipeEngine, resolveVisualApiPattern, safeApiMessage } from "./visualApiUtils";

function parseJson(content: unknown) {
  if (typeof content !== "string") return content;
  try {
    return JSON.parse(content);
  } catch {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(content.slice(start, end + 1));
    throw new Error("ForLoop response did not contain valid JSON.");
  }
}

export function parseVisualApiRecipeResponse(content: unknown, input: VisualApiInput): VisualApiOutput {
  try {
    const raw = parseJson(content);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new Error("ForLoop response was not a JSON object.");
    }
    const candidate = raw as Record<string, unknown>;
    const patternId = resolveVisualApiPattern(candidate.pattern ?? candidate.chosenTemplate ?? input.preferredPatternId);
    const pattern = getPatternById(patternId);
    const engineBlock = candidate.engineRecommendation as Record<string, unknown> | undefined;
    const engineId = resolveVisualRecipeEngine(engineBlock?.primary ?? input.preferredEngine);
    const explanation = candidate.explanation as Record<string, unknown> | undefined;
    const providerMeta = candidate.providerMeta as Record<string, unknown> | undefined;
    const aiInput: AIVisualTranslatorInput = {
      rawText: input.rawText,
      topic: input.topic,
      difficulty: input.difficulty as VisualRecipeDifficulty | undefined,
      preferredPatternId: patternId,
      preferredVisualType: candidate.visualType as VisualRecipeVisualType | undefined,
      preferredEngine: engineId,
      needsInteraction: input.needsInteraction,
      needsMathLayer: input.needsMathLayer,
      needsRealLifeExample: input.needsRealLifeExample,
      constraints: input.constraints,
    };
    const draft: AIRecipeDraft = {
      id: typeof candidate.id === "string" ? candidate.id : undefined,
      title: safeApiMessage(candidate.title, input.topic ?? input.rawText),
      concept: safeApiMessage(candidate.concept, input.topic ?? input.rawText),
      summary: safeApiMessage(candidate.summary, `A controlled visual explanation for ${input.topic ?? input.rawText}.`),
      difficulty: aiInput.difficulty,
      targetAudience: input.targetAudience === "beginner"
        ? "student"
        : input.targetAudience === "intermediate"
          ? "builder"
          : input.targetAudience === "advanced" || input.targetAudience === "expert"
            ? "researcher"
            : input.targetAudience,
      visualType: pattern?.visualType,
      pattern: pattern?.recipePattern,
      selectedPatternId: patternId,
      selectedEngineId: engineId,
    };
    const normalized = normalizeAIRecipeDraft(draft, aiInput);
    const recipe = {
      ...normalized.recipe,
      summary: draft.summary ?? normalized.recipe.summary,
      engineRecommendation: {
        ...normalized.recipe.engineRecommendation,
        primary: engineId,
        reason: safeApiMessage(engineBlock?.reason, normalized.recipe.engineRecommendation.reason),
      },
      explanation: {
        ...normalized.recipe.explanation,
        simple: safeApiMessage(explanation?.mainIdea, normalized.recipe.explanation.simple),
        detailed: safeApiMessage(explanation?.whyThisVisualPattern, normalized.recipe.explanation.detailed),
        keyTakeaways: Array.isArray(explanation?.steps)
          ? explanation.steps.filter((item): item is string => typeof item === "string").slice(0, 6)
          : normalized.recipe.explanation.keyTakeaways,
      },
      metadata: { ...normalized.recipe.metadata, createdBy: "ai" as const, source: "forloop-api" },
    };
    return {
      ok: true,
      mode: "forloop-api",
      recipe,
      rawRecipeJson: raw,
      selectedPattern: patternId,
      selectedEngine: engineId,
      confidence: typeof candidate.confidence === "number" ? candidate.confidence : 0.82,
      reasoningSummary: `ForLoop ${String(providerMeta?.provider || "provider router")} selected meaning and structure; SciLoop rebuilt it as a controlled recipe.`,
      warnings: [
        ...normalized.warnings,
        ...(Array.isArray(explanation?.warnings) ? explanation.warnings.filter((item): item is string => typeof item === "string") : []),
      ],
      validationErrors: [],
      fallbackUsed: false,
    };
  } catch (error) {
    return {
      ok: false,
      mode: "forloop-api",
      rawRecipeJson: content,
      warnings: [],
      validationErrors: [error instanceof Error ? error.message : "Failed to parse ForLoop JSON."],
      fallbackUsed: true,
      error: "Failed to parse ForLoop visual recipe response.",
    };
  }
}
