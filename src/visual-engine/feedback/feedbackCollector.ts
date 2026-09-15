import type { VisualRecipe } from "@/src/visual-engine/foundation";

import { visualFeedbackDefaultScore, visualFeedbackRatings } from "./feedback.constants";
import { saveVisualFeedback } from "./feedbackStore";
import type {
  FeedbackValidationResult,
  VisualFeedback,
  VisualFeedbackInput,
} from "./feedback.types";
import {
  clampScore,
  generateFeedbackId,
  getCurrentTimestamp,
  normalizeImprovementList,
  normalizeIssueList,
} from "./feedbackUtils";

export function normalizeFeedbackInput(input: VisualFeedbackInput): VisualFeedbackInput {
  return {
    ...input,
    recipeId: input.recipeId.trim(),
    patternId: input.patternId.trim(),
    engineId: input.engineId.trim(),
    concept: input.concept.trim(),
    audienceLevel: input.audienceLevel?.trim(),
    clarityScore: clampScore(input.clarityScore),
    complexityScore: clampScore(input.complexityScore),
    motionScore: clampScore(input.motionScore),
    usefulnessScore: clampScore(input.usefulnessScore),
    selectedIssues: normalizeIssueList(input.selectedIssues),
    selectedImprovements: normalizeImprovementList(input.selectedImprovements),
    freeText: input.freeText?.trim().slice(0, 2000),
    source: input.source ?? "manual",
  };
}

export function validateFeedbackInput(input: VisualFeedbackInput): FeedbackValidationResult {
  const errors: string[] = [];
  if (!input.recipeId.trim()) errors.push("Recipe ID is required.");
  if (!input.patternId.trim()) errors.push("Pattern ID is required.");
  if (!input.engineId.trim()) errors.push("Engine ID is required.");
  if (!input.concept.trim()) errors.push("Concept is required.");
  if (!visualFeedbackRatings.includes(input.rating)) errors.push("Rating is invalid.");
  return { valid: errors.length === 0, errors };
}

export function createVisualFeedback(input: VisualFeedbackInput): VisualFeedback {
  const normalized = normalizeFeedbackInput(input);
  const validation = validateFeedbackInput(normalized);
  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }
  return {
    ...normalized,
    id: generateFeedbackId(),
    createdAt: getCurrentTimestamp(),
    source: normalized.source ?? "manual",
  };
}

export function submitVisualFeedback(input: VisualFeedbackInput) {
  return saveVisualFeedback(createVisualFeedback(input));
}

export function createDefaultFeedback(recipe: VisualRecipe): VisualFeedbackInput {
  return {
    recipeId: recipe.id,
    patternId: recipe.pattern,
    engineId: recipe.engineRecommendation.primary,
    concept: recipe.concept,
    visualType: recipe.visualType,
    audienceLevel: recipe.targetAudience,
    rating: "okay",
    clarityScore: visualFeedbackDefaultScore,
    complexityScore: visualFeedbackDefaultScore,
    motionScore: visualFeedbackDefaultScore,
    usefulnessScore: visualFeedbackDefaultScore,
    selectedIssues: [],
    selectedImprovements: [],
    freeText: "",
    source: "renderer-demo",
  };
}
