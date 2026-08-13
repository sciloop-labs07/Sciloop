import {
  getAllVisualFeedback,
  getFeedbackByEngineId,
  getFeedbackByPatternId,
  getFeedbackByRecipeId,
} from "./feedbackStore";
import type {
  FeedbackTranslatorContext,
  VisualEvolutionNote,
  VisualFeedback,
  VisualFeedbackCategory,
  VisualPatternImprovement,
  VisualRecipeImprovement,
} from "./feedback.types";
import { countValues, humanizeFeedbackValue } from "./feedbackUtils";

const issueActions: Partial<Record<VisualFeedbackCategory, string>> = {
  "unclear-flow": "Strengthen arrows and direction cues, then reveal the flow step by step.",
  "too-complex": "Reduce visible layers and objects, simplify language, and consider a kid-level mode.",
  "too-simple": "Add an optional deeper layer without weakening the primary explanation.",
  "too-much-text": "Replace repeated prose with labels, grouping, and visual relationships.",
  "not-enough-motion": "Add purposeful step-by-step motion that explains change or direction.",
  "too-much-motion": "Reduce simultaneous animation and preserve motion only where it carries meaning.",
  "unclear-layers": "Clarify depth, layer names, and the order in which layers should be revealed.",
  "unclear-labels": "Use shorter labels and connect each label more visibly to its object.",
  "wrong-pattern": "Return the concept to the Visual Pattern Matcher for a controlled alternative.",
  "wrong-engine": "Return the recipe to the Engine Router and compare safer fallback engines.",
  "missing-real-life-example": "Add a real-world analogy layer tied to the same controlled visual structure.",
  "missing-math-layer": "Add an optional math layer after the intuitive explanation.",
  "not-interactive-enough": "Add one purposeful interaction that tests or reveals understanding.",
};

function createNotes(feedbackList: VisualFeedback[], targetType: VisualEvolutionNote["targetType"], targetId: string) {
  const counts = countValues(feedbackList.flatMap((feedback) => feedback.selectedIssues));
  const threshold = feedbackList.length <= 2 ? 1 : 2;

  return (Object.entries(counts) as Array<[VisualFeedbackCategory, number]>)
    .filter(([, count]) => count >= threshold)
    .sort((a, b) => b[1] - a[1])
    .map(([issue, count]) => ({
      id: `evolution-${targetType}-${targetId}-${issue}`,
      targetType,
      targetId,
      title: humanizeFeedbackValue(issue),
      description: `${count} feedback response${count === 1 ? "" : "s"} reported ${humanizeFeedbackValue(issue).toLowerCase()}.`,
      evidenceCount: count,
      suggestedAction: issueActions[issue] ?? "Review this signal before changing the controlled visual language.",
    }));
}

/**
 * Evolution notes improve patterns, recipes, engines, and visual language.
 * They never rewrite a visual automatically: human understanding is the final
 * metric, and controlled visual language remains a guardrail for future AI.
 */
export function createEvolutionNotesFromFeedback(feedbackList: VisualFeedback[]) {
  return createNotes(feedbackList, "visual-language", "sciloop");
}

export function suggestPatternImprovements(patternId: string, feedbackList?: VisualFeedback[]): VisualPatternImprovement {
  const feedback = feedbackList?.filter((item) => item.patternId === patternId) ?? getFeedbackByPatternId(patternId);
  return { patternId, notes: createNotes(feedback, "pattern", patternId) };
}

export function suggestRecipeImprovements(recipeId: string, feedbackList?: VisualFeedback[]): VisualRecipeImprovement {
  const feedback = feedbackList?.filter((item) => item.recipeId === recipeId) ?? getFeedbackByRecipeId(recipeId);
  return { recipeId, notes: createNotes(feedback, "recipe", recipeId) };
}

export function suggestEngineImprovements(engineId: string, feedbackList?: VisualFeedback[]) {
  const feedback = feedbackList?.filter((item) => item.engineId === engineId) ?? getFeedbackByEngineId(engineId);
  return createNotes(feedback, "engine", engineId);
}

export function suggestVisualLanguageImprovements(feedbackList: VisualFeedback[] = getAllVisualFeedback()) {
  return createNotes(feedbackList, "visual-language", "sciloop");
}

export function createFeedbackContextForTranslator(recipeId: string): FeedbackTranslatorContext {
  const feedback = getFeedbackByRecipeId(recipeId);
  const issueCounts = countValues(feedback.flatMap((item) => item.selectedIssues));
  const requestedImprovements = [...new Set(feedback.flatMap((item) => item.selectedImprovements))];
  const claritySignals = (Object.entries(issueCounts) as Array<[VisualFeedbackCategory, number]>)
    .sort((a, b) => b[1] - a[1])
    .map(([issue, count]) => `${count} user${count === 1 ? "" : "s"} reported ${humanizeFeedbackValue(issue).toLowerCase()}`);

  return {
    recipeId,
    feedbackCount: feedback.length,
    summary: feedback.length === 0
      ? "No local feedback is available for this recipe."
      : claritySignals.slice(0, 4).join("; ") || `${feedback.length} feedback response(s) contained no selected issues.`,
    claritySignals,
    requestedImprovements,
    guardrail: "Use these notes as context only. Do not overwrite SciLoop's controlled visual language or bypass recipe validation.",
  };
}
