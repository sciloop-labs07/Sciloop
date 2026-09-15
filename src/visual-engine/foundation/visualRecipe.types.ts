import type {
  VisualAtomType,
  VisualCertainty,
  VisualFeedbackLoop,
  VisualFlow,
  VisualInteraction as FoundationVisualInteraction,
  VisualPosition,
  VisualTransformation,
  VisualUnderstandingGoal,
} from "./visualTypes";
import type {
  visualRecipeDifficulties,
  visualRecipeEngineRecommendations,
  visualRecipeModes,
  visualRecipePatterns,
  visualRecipeTypes,
} from "./visualRecipe.constants";

export type VisualRecipeDifficulty = (typeof visualRecipeDifficulties)[number];
export type VisualRecipeMode = (typeof visualRecipeModes)[number];
export type VisualRecipeVisualType = (typeof visualRecipeTypes)[number];
export type VisualRecipePattern = (typeof visualRecipePatterns)[number];
export type VisualRecipeEngine = (typeof visualRecipeEngineRecommendations)[number];
export type VisualRecipeAudience = "kid" | "student" | "researcher" | "builder" | "general";

export interface VisualRecipeMetadata {
  createdBy: "human" | "ai" | "system";
  version: string;
  source?: string;
  confidence: number;
}

export interface VisualRecipeLayer {
  id: string;
  title: string;
  description: string;
  depth: number;
  atomsUsed: VisualAtomType[];
  visibleByDefault: boolean;
}

export interface VisualRecipeObject {
  id: string;
  label: string;
  atom: VisualAtomType;
  layerId: string;
  description: string;
  /** Evidence remains attached to the meaning, not the renderer. */
  evidenceIds?: string[];
  /** Links this visual object back to a controlled semantic-model category. */
  semanticKind?: "signal" | "evidence" | "variable" | "condition" | "event" | "outcome" | "risk" | "unknown";
  /** Conditional scenario branches represented by this object, when applicable. */
  scenarioIds?: string[];
  position?: VisualPosition;
  certainty?: VisualCertainty;
  importance?: number;
}

export interface VisualRecipeRelation {
  id: string;
  fromObjectId: string;
  toObjectId: string;
  atom: Extract<VisualAtomType, "edge" | "cause" | "effect" | "feedback">;
  label: string;
  description?: string;
  strength: number;
  evidenceIds?: string[];
  scenarioIds?: string[];
  certainty?: VisualCertainty;
}

export interface VisualRecipeMotion {
  id: string;
  targetId: string;
  meaning: string;
  motionType: "pulse" | "flow" | "fade" | "grow" | "compress" | "split" | "converge" | "loop" | "scan";
  speed: number;
  intensity: number;
}

export interface VisualRecipeInteraction extends FoundationVisualInteraction {
  mode: VisualRecipeMode;
}

export interface VisualRecipeEngineRecommendation {
  primary: VisualRecipeEngine;
  alternatives: VisualRecipeEngine[];
  reason: string;
  avoid?: VisualRecipeEngine[];
}

export interface VisualRecipeExplanation {
  simple: string;
  detailed: string;
  keyTakeaways: string[];
  visualReadingOrder: string[];
}

export interface VisualRecipeFallback {
  title: string;
  description: string;
  safeVisualType: VisualRecipeVisualType;
  messageForUser: string;
}

export interface VisualRecipeAssessment {
  checksUnderstanding: boolean;
  expectedUserInsight: string;
  questions: string[];
  successCriteria: string[];
}

export interface VisualRecipeTimeline {
  id: string;
  stages: Array<{
    id: string;
    label: string;
    description: string;
    relatedObjectIds: string[];
  }>;
}

/**
 * A Visual Recipe is the controlled bridge between an idea and a renderer.
 *
 * AI should output this structured recipe instead of random SVG, Canvas code,
 * or image prompts. SciLoop renderers will later choose how to display the
 * recipe while preserving the visual language atoms and semantic rules.
 */
export interface VisualRecipe {
  id: string;
  title: string;
  concept: string;
  summary: string;
  metadata: VisualRecipeMetadata;
  difficulty: VisualRecipeDifficulty;
  targetAudience: VisualRecipeAudience;
  visualType: VisualRecipeVisualType;
  pattern: VisualRecipePattern;
  atomsUsed: VisualAtomType[];
  layers: VisualRecipeLayer[];
  objects: VisualRecipeObject[];
  relations: VisualRecipeRelation[];
  flows: VisualFlow[];
  transformations: VisualTransformation[];
  feedbackLoops: VisualFeedbackLoop[];
  timeline: VisualRecipeTimeline;
  interactions: VisualRecipeInteraction[];
  motion: VisualRecipeMotion[];
  engineRecommendation: VisualRecipeEngineRecommendation;
  explanation: VisualRecipeExplanation;
  fallback: VisualRecipeFallback;
  assessment: VisualRecipeAssessment;
  understandingGoal?: VisualUnderstandingGoal;
  tags: string[];
}
