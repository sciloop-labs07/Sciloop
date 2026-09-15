import {
  visualFeedbackImprovementOptions,
  visualFeedbackIssueCategories,
  visualFeedbackRatings,
} from "./feedback.constants";
import type { VisualFeedback } from "./feedback.types";
import type { FeedbackStorageAdapter } from "./feedbackStorage.types";

const validSources = new Set(["renderer-demo", "ai-translator-demo", "tech-lab", "manual"]);
const validRatings = new Set<string>(visualFeedbackRatings);
const validIssues = new Set<string>(visualFeedbackIssueCategories);
const validImprovements = new Set<string>(visualFeedbackImprovementOptions);

function isScore(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 1 && value <= 5;
}

export function isVisualFeedbackRecord(value: unknown): value is VisualFeedback {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<VisualFeedback>;
  return typeof item.id === "string"
    && item.id.trim().length > 0
    && typeof item.recipeId === "string"
    && item.recipeId.trim().length > 0
    && typeof item.patternId === "string"
    && item.patternId.trim().length > 0
    && typeof item.engineId === "string"
    && item.engineId.trim().length > 0
    && typeof item.concept === "string"
    && item.concept.trim().length > 0
    && typeof item.visualType === "string"
    && validRatings.has(item.rating ?? "")
    && isScore(item.clarityScore)
    && isScore(item.complexityScore)
    && isScore(item.motionScore)
    && isScore(item.usefulnessScore)
    && Array.isArray(item.selectedIssues)
    && item.selectedIssues.every((issue) => validIssues.has(issue))
    && Array.isArray(item.selectedImprovements)
    && item.selectedImprovements.every((improvement) => validImprovements.has(improvement))
    && typeof item.createdAt === "string"
    && !Number.isNaN(Date.parse(item.createdAt))
    && validSources.has(item.source ?? "");
}

export function parseFeedbackJson(json: string) {
  const parsed: unknown = JSON.parse(json);
  if (!Array.isArray(parsed)) throw new Error("Feedback import must be a JSON array.");
  return parsed;
}

export function filterValidFeedback(values: unknown[]) {
  const valid: VisualFeedback[] = [];
  const errors: string[] = [];
  values.forEach((value, index) => {
    if (isVisualFeedbackRecord(value)) valid.push(value);
    else errors.push(`Item ${index + 1} is not a valid VisualFeedback record.`);
  });
  return { valid, errors };
}

export function createAdapterQueryHelpers(adapter: Pick<FeedbackStorageAdapter, "getAllFeedback">) {
  return {
    byRecipe: (recipeId: string) => adapter.getAllFeedback().filter((feedback) => feedback.recipeId === recipeId),
    byPattern: (patternId: string) => adapter.getAllFeedback().filter((feedback) => feedback.patternId === patternId),
    byEngine: (engineId: string) => adapter.getAllFeedback().filter((feedback) => feedback.engineId === engineId),
  };
}
