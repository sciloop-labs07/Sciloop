import type { VisualRecipeVisualType } from "@/src/visual-engine/foundation";

export type VisualFeedbackRating = "very-clear" | "clear" | "okay" | "confusing" | "failed";

export type VisualFeedbackCategory =
  | "too-simple"
  | "too-complex"
  | "too-much-text"
  | "not-enough-motion"
  | "too-much-motion"
  | "unclear-flow"
  | "unclear-layers"
  | "unclear-labels"
  | "wrong-pattern"
  | "wrong-engine"
  | "missing-real-life-example"
  | "missing-math-layer"
  | "not-interactive-enough";

export type VisualFeedbackImprovement =
  | "add-kid-level-version"
  | "add-real-life-example"
  | "add-step-by-step-motion"
  | "add-math-layer"
  | "add-interaction"
  | "reduce-text"
  | "simplify-layers"
  | "show-hidden-mechanism"
  | "show-before-after"
  | "show-feedback-loop"
  | "use-different-pattern"
  | "use-different-engine";

export type FeedbackStorageMode = "local-storage" | "memory";
export type VisualFeedbackSource = "renderer-demo" | "ai-translator-demo" | "tech-lab" | "manual";

export interface VisualFeedbackTarget {
  recipeId: string;
  patternId: string;
  engineId: string;
  concept: string;
  visualType: VisualRecipeVisualType;
  audienceLevel?: string;
}

export interface VisualFeedbackInput extends VisualFeedbackTarget {
  rating: VisualFeedbackRating;
  clarityScore: number;
  complexityScore: number;
  motionScore: number;
  usefulnessScore: number;
  selectedIssues: VisualFeedbackCategory[];
  selectedImprovements: VisualFeedbackImprovement[];
  freeText?: string;
  source?: VisualFeedbackSource;
}

export interface VisualFeedback extends VisualFeedbackInput {
  id: string;
  createdAt: string;
  source: VisualFeedbackSource;
}

export interface VisualFeedbackSummary {
  totalCount: number;
  averageClarity: number;
  averageComplexity: number;
  averageMotion: number;
  averageUsefulness: number;
  mostCommonIssue?: VisualFeedbackCategory;
  mostRequestedImprovement?: VisualFeedbackImprovement;
  byPattern: Record<string, number>;
  byEngine: Record<string, number>;
  byRecipe: Record<string, number>;
}

export interface VisualFeedbackInsight {
  label: string;
  description: string;
  severity: "low" | "medium" | "high";
  relatedIssue?: VisualFeedbackCategory;
  relatedImprovement?: VisualFeedbackImprovement;
}

export interface VisualEvolutionNote {
  id: string;
  targetType: "pattern" | "recipe" | "engine" | "visual-language";
  targetId: string;
  title: string;
  description: string;
  evidenceCount: number;
  suggestedAction: string;
}

export interface VisualPatternImprovement {
  patternId: string;
  notes: VisualEvolutionNote[];
}

export interface VisualRecipeImprovement {
  recipeId: string;
  notes: VisualEvolutionNote[];
}

export interface FeedbackAnalysisResult {
  summary: VisualFeedbackSummary;
  insights: VisualFeedbackInsight[];
  evolutionNotes: VisualEvolutionNote[];
}

export interface FeedbackValidationResult {
  valid: boolean;
  errors: string[];
}

export interface FeedbackTranslatorContext {
  recipeId: string;
  feedbackCount: number;
  summary: string;
  claritySignals: string[];
  requestedImprovements: VisualFeedbackImprovement[];
  guardrail: string;
}
