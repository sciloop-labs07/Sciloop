import type {
  VisualAtomType,
  VisualRecipeEngine,
  VisualRecipeMode,
  VisualRecipePattern,
  VisualRecipeVisualType,
} from "@/src/visual-engine/foundation";

export type VisualPatternId =
  | "input-process-output"
  | "problem-solution"
  | "cause-effect"
  | "random-to-organized"
  | "hidden-visible-layer"
  | "micro-macro"
  | "past-present-future"
  | "system-feedback-loop"
  | "network-growth"
  | "energy-flow"
  | "signal-decomposition"
  | "decision-tree"
  | "knowledge-graph"
  | "conflict-resolution"
  | "innovation-pipeline"
  | "field-influence"
  | "compression-of-complexity"
  | "multiple-possibilities-best-path"
  | "weak-signal-strong-signal"
  | "local-action-global-impact";

export type VisualPatternCategory =
  | "transformation"
  | "causality"
  | "systems"
  | "layers"
  | "scale"
  | "timeline"
  | "network"
  | "decision"
  | "field"
  | "learning";

export interface VisualPatternUseCase {
  label: string;
  description: string;
  keywords: string[];
}

export interface VisualPatternStage {
  id: string;
  label: string;
  description: string;
}

export interface VisualPatternLayerTemplate {
  id: string;
  title: string;
  description: string;
  depth: number;
  atomsUsed: VisualAtomType[];
}

export interface VisualPatternObjectTemplate {
  id: string;
  label: string;
  atom: VisualAtomType;
  layerId: string;
  description: string;
  importance: number;
}

export interface VisualPatternRelationTemplate {
  id: string;
  fromObjectId: string;
  toObjectId: string;
  atom: "edge" | "cause" | "effect" | "feedback";
  label: string;
  description: string;
  strength: number;
}

export interface VisualPatternFlowTemplate {
  id: string;
  source: string;
  target: string;
  material: "energy" | "information" | "attention" | "money" | "force" | "causality" | "matter";
  rate: number;
  label: string;
}

export interface VisualPatternTransformationTemplate {
  id: string;
  before: string;
  process: string;
  after: string;
  label: string;
}

export interface VisualPatternInteractionTemplate {
  id: string;
  label: string;
  targetId: string;
  controlType: "hover" | "drag" | "slider" | "toggle" | "scrub" | "select";
  understandingEffect: string;
}

export interface VisualPatternEnginePreference {
  primary: VisualRecipeEngine;
  alternatives: VisualRecipeEngine[];
  reason: string;
}

export interface VisualPatternUnderstandingGoal {
  userShouldUnderstand: string[];
  successSignal: string;
}

/**
 * Visual patterns are reusable explanation structures. They prevent random
 * visual design by giving future AI translators controlled forms to choose
 * from before a Visual Recipe reaches a renderer.
 */
export interface VisualPattern {
  id: VisualPatternId;
  name: string;
  shortDescription: string;
  deepPurpose: string;
  category: VisualPatternCategory;
  whenToUse: VisualPatternUseCase[];
  avoidWhen: string[];
  atomsUsed: VisualAtomType[];
  visualType: VisualRecipeVisualType;
  recipePattern: VisualRecipePattern;
  defaultRecipeMode: VisualRecipeMode;
  stages: VisualPatternStage[];
  layerTemplates: VisualPatternLayerTemplate[];
  objectTemplates: VisualPatternObjectTemplate[];
  relationTemplates: VisualPatternRelationTemplate[];
  flowTemplates: VisualPatternFlowTemplate[];
  transformationTemplates: VisualPatternTransformationTemplate[];
  interactionTemplates: VisualPatternInteractionTemplate[];
  preferredEngines: VisualPatternEnginePreference[];
  fallbackEngines: VisualRecipeEngine[];
  exampleConcepts: string[];
  understandingGoal: VisualPatternUnderstandingGoal;
  tags: string[];
}

export interface VisualPatternSummary {
  id: VisualPatternId;
  name: string;
  shortDescription: string;
  category: VisualPatternCategory;
  visualType: VisualRecipeVisualType;
  primaryEngine: VisualRecipeEngine;
  exampleConcepts: string[];
}

export interface VisualPatternMatchInput {
  concept?: string;
  keywords?: string[];
  visualType?: VisualRecipeVisualType;
  atoms?: VisualAtomType[];
  tags?: string[];
}

export interface VisualPatternCandidate {
  pattern: VisualPattern;
  score: number;
  reasons: string[];
}
