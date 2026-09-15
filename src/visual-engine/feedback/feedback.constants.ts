import type {
  VisualFeedbackCategory,
  VisualFeedbackImprovement,
  VisualFeedbackRating,
} from "./feedback.types";

export const visualFeedbackRatings: VisualFeedbackRating[] = [
  "very-clear",
  "clear",
  "okay",
  "confusing",
  "failed",
];

export const visualFeedbackIssueCategories: VisualFeedbackCategory[] = [
  "too-simple",
  "too-complex",
  "too-much-text",
  "not-enough-motion",
  "too-much-motion",
  "unclear-flow",
  "unclear-layers",
  "unclear-labels",
  "wrong-pattern",
  "wrong-engine",
  "missing-real-life-example",
  "missing-math-layer",
  "not-interactive-enough",
];

export const visualFeedbackImprovementOptions: VisualFeedbackImprovement[] = [
  "add-kid-level-version",
  "add-real-life-example",
  "add-step-by-step-motion",
  "add-math-layer",
  "add-interaction",
  "reduce-text",
  "simplify-layers",
  "show-hidden-mechanism",
  "show-before-after",
  "show-feedback-loop",
  "use-different-pattern",
  "use-different-engine",
];

export const visualFeedbackStorageKey = "sciloop.visual.feedback.v1";
export const visualFeedbackUpdatedEvent = "sciloop-feedback-updated";
export const visualFeedbackScoreMin = 1;
export const visualFeedbackScoreMax = 5;
export const visualFeedbackDefaultScore = 3;

export const visualFeedbackRatingLabels: Record<VisualFeedbackRating, string> = {
  "very-clear": "Very clear",
  clear: "Clear",
  okay: "Okay",
  confusing: "Confusing",
  failed: "Failed",
};

export const visualFeedbackIssueLabels: Record<VisualFeedbackCategory, string> = {
  "too-simple": "Too simple",
  "too-complex": "Too complex",
  "too-much-text": "Too much text",
  "not-enough-motion": "Not enough motion",
  "too-much-motion": "Too much motion",
  "unclear-flow": "Unclear flow",
  "unclear-layers": "Unclear layers",
  "unclear-labels": "Unclear labels",
  "wrong-pattern": "Wrong pattern",
  "wrong-engine": "Wrong engine",
  "missing-real-life-example": "Missing real-life example",
  "missing-math-layer": "Missing math layer",
  "not-interactive-enough": "Not interactive enough",
};

export const visualFeedbackImprovementLabels: Record<VisualFeedbackImprovement, string> = {
  "add-kid-level-version": "Add kid-level version",
  "add-real-life-example": "Add real-life example",
  "add-step-by-step-motion": "Add step-by-step motion",
  "add-math-layer": "Add math layer",
  "add-interaction": "Add interaction",
  "reduce-text": "Reduce text",
  "simplify-layers": "Simplify layers",
  "show-hidden-mechanism": "Show hidden mechanism",
  "show-before-after": "Show before/after",
  "show-feedback-loop": "Show feedback loop",
  "use-different-pattern": "Use different pattern",
  "use-different-engine": "Use different engine",
};
