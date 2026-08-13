import {
  visualFeedbackDefaultScore,
  visualFeedbackImprovementOptions,
  visualFeedbackIssueCategories,
  visualFeedbackScoreMax,
  visualFeedbackScoreMin,
} from "./feedback.constants";
import type {
  VisualFeedback,
  VisualFeedbackCategory,
  VisualFeedbackImprovement,
  VisualFeedbackSummary,
} from "./feedback.types";

export function generateFeedbackId() {
  return `feedback-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getCurrentTimestamp() {
  return new Date().toISOString();
}

export function clampScore(value: number) {
  if (!Number.isFinite(value)) return visualFeedbackDefaultScore;
  return Math.max(visualFeedbackScoreMin, Math.min(visualFeedbackScoreMax, Math.round(value)));
}

export function normalizeIssueList(issues: string[]): VisualFeedbackCategory[] {
  const allowed = new Set<string>(visualFeedbackIssueCategories);
  return [...new Set(issues.filter((issue) => allowed.has(issue)))] as VisualFeedbackCategory[];
}

export function normalizeImprovementList(improvements: string[]): VisualFeedbackImprovement[] {
  const allowed = new Set<string>(visualFeedbackImprovementOptions);
  return [...new Set(improvements.filter((improvement) => allowed.has(improvement)))] as VisualFeedbackImprovement[];
}

function groupBy(feedbackList: VisualFeedback[], key: keyof Pick<VisualFeedback, "patternId" | "engineId" | "recipeId">) {
  return feedbackList.reduce<Record<string, number>>((groups, feedback) => {
    groups[feedback[key]] = (groups[feedback[key]] ?? 0) + 1;
    return groups;
  }, {});
}

export function groupFeedbackByPattern(feedbackList: VisualFeedback[]) {
  return groupBy(feedbackList, "patternId");
}

export function groupFeedbackByEngine(feedbackList: VisualFeedback[]) {
  return groupBy(feedbackList, "engineId");
}

export function groupFeedbackByRecipe(feedbackList: VisualFeedback[]) {
  return groupBy(feedbackList, "recipeId");
}

export function formatFeedbackSummary(summary: VisualFeedbackSummary) {
  if (summary.totalCount === 0) return "No feedback yet.";
  return `${summary.totalCount} feedback item(s). Average clarity ${summary.averageClarity}/5, usefulness ${summary.averageUsefulness}/5.`;
}

export function countValues<T extends string>(values: T[]) {
  return values.reduce<Record<T, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

export function humanizeFeedbackValue(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
