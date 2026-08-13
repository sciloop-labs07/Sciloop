import {
  getFeedbackByEngineId,
  getFeedbackByPatternId,
  getFeedbackByRecipeId,
} from "./feedbackStore";
import type {
  FeedbackAnalysisResult,
  VisualFeedback,
  VisualFeedbackCategory,
  VisualFeedbackImprovement,
  VisualFeedbackInsight,
  VisualFeedbackSummary,
} from "./feedback.types";
import {
  countValues,
  groupFeedbackByEngine,
  groupFeedbackByPattern,
  groupFeedbackByRecipe,
  humanizeFeedbackValue,
} from "./feedbackUtils";

function average(feedbackList: VisualFeedback[], key: keyof Pick<VisualFeedback, "clarityScore" | "complexityScore" | "motionScore" | "usefulnessScore">) {
  if (feedbackList.length === 0) return 0;
  const value = feedbackList.reduce((sum, feedback) => sum + feedback[key], 0) / feedbackList.length;
  return Math.round(value * 10) / 10;
}

function mostCommon<T extends string>(values: T[]) {
  const counts = countValues(values);
  return (Object.entries(counts) as Array<[T, number]>)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0];
}

export function calculateAverageClarity(feedbackList: VisualFeedback[]) {
  return average(feedbackList, "clarityScore");
}

export function calculateAverageComplexity(feedbackList: VisualFeedback[]) {
  return average(feedbackList, "complexityScore");
}

export function findMostCommonIssues(feedbackList: VisualFeedback[]) {
  return mostCommon(feedbackList.flatMap((feedback) => feedback.selectedIssues)) as VisualFeedbackCategory | undefined;
}

export function findMostRequestedImprovements(feedbackList: VisualFeedback[]) {
  return mostCommon(feedbackList.flatMap((feedback) => feedback.selectedImprovements)) as VisualFeedbackImprovement | undefined;
}

function createInsights(feedbackList: VisualFeedback[], summary: VisualFeedbackSummary): VisualFeedbackInsight[] {
  if (feedbackList.length === 0) return [];
  const insights: VisualFeedbackInsight[] = [];
  if (summary.averageClarity > 0 && summary.averageClarity < 3) {
    insights.push({
      label: "Clarity needs attention",
      description: `Average clarity is ${summary.averageClarity}/5.`,
      severity: "high",
    });
  }
  if (summary.mostCommonIssue) {
    insights.push({
      label: humanizeFeedbackValue(summary.mostCommonIssue),
      description: `The most repeated issue is ${humanizeFeedbackValue(summary.mostCommonIssue).toLowerCase()}.`,
      severity: "medium",
      relatedIssue: summary.mostCommonIssue,
    });
  }
  if (summary.mostRequestedImprovement) {
    insights.push({
      label: humanizeFeedbackValue(summary.mostRequestedImprovement),
      description: `This is the most requested controlled improvement.`,
      severity: "medium",
      relatedImprovement: summary.mostRequestedImprovement,
    });
  }
  return insights;
}

export function analyzeFeedback(feedbackList: VisualFeedback[]): FeedbackAnalysisResult {
  const summary: VisualFeedbackSummary = {
    totalCount: feedbackList.length,
    averageClarity: calculateAverageClarity(feedbackList),
    averageComplexity: calculateAverageComplexity(feedbackList),
    averageMotion: average(feedbackList, "motionScore"),
    averageUsefulness: average(feedbackList, "usefulnessScore"),
    mostCommonIssue: findMostCommonIssues(feedbackList),
    mostRequestedImprovement: findMostRequestedImprovements(feedbackList),
    byPattern: groupFeedbackByPattern(feedbackList),
    byEngine: groupFeedbackByEngine(feedbackList),
    byRecipe: groupFeedbackByRecipe(feedbackList),
  };

  return {
    summary,
    insights: createInsights(feedbackList, summary),
    evolutionNotes: [],
  };
}

export function summarizeFeedbackForPattern(patternId: string) {
  return analyzeFeedback(getFeedbackByPatternId(patternId));
}

export function summarizeFeedbackForEngine(engineId: string) {
  return analyzeFeedback(getFeedbackByEngineId(engineId));
}

export function summarizeFeedbackForRecipe(recipeId: string) {
  return analyzeFeedback(getFeedbackByRecipeId(recipeId));
}
