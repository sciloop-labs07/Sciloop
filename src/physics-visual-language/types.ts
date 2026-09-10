/**
 * Canonical semantic contract for Physics Visual Language.
 *
 * This layer describes what a visual means. It intentionally contains no
 * React, SVG, Canvas, WebGL, or WebGPU implementation details.
 */

export type PhysicsSubject = "electromagnetic-induction" | "general-relativity" | "higgs-field";
export type PhysicsEntityKind = "source" | "field" | "object" | "state" | "measurement" | "evidence" | "outcome";
export type PhysicsRenderer = "svg" | "canvas-2d" | "three-webgl" | "webgpu-experimental";
export type PhysicsCertainty = "known" | "inferred" | "uncertain";
export type PhysicsRelationKind = "causes" | "changes" | "influences" | "measures" | "supports";

export interface PhysicsEntity {
  id: string;
  label: string;
  kind: PhysicsEntityKind;
  description: string;
  certainty: PhysicsCertainty;
  visibleInFallback: boolean;
}

export interface PhysicsCausalRelation {
  id: string;
  from: string;
  to: string;
  kind: PhysicsRelationKind;
  label: string;
  directionMeaning: string;
  strength?: number;
}

export interface PhysicsQuantity {
  id: string;
  label: string;
  symbol?: string;
  unit?: string;
  valueType: "scalar" | "vector" | "distribution" | "categorical";
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  description: string;
}

export interface PhysicsEvidence {
  id: string;
  label: string;
  description: string;
  observable: string;
  sourceType: "experiment" | "observation" | "measurement" | "model";
  certainty: PhysicsCertainty;
}

export interface PhysicsUncertainty {
  id: string;
  label: string;
  description: string;
  representation: "interval" | "haze" | "distribution" | "branching" | "confidence";
  appliesTo: string[];
}

export interface PhysicsTimelineStage {
  id: string;
  label: string;
  description: string;
  entityIds: string[];
}

export interface PhysicsTimeline {
  stages: PhysicsTimelineStage[];
  progression: "ordered" | "continuous" | "cyclic";
  timeMeaning: string;
}

export interface PhysicsFallback {
  title: string;
  description: string;
  readingOrder: string[];
  accessibleSummary: string;
  visualForm: "labeled-flow" | "before-process-after" | "field-map";
}

export interface PhysicsRendererConfig {
  enabled: boolean;
  preferred: PhysicsRenderer;
  alternatives: PhysicsRenderer[];
  lazy: boolean;
  autoplay: boolean;
  reducedMotionSafe: boolean;
  maxParticles?: number;
}

export interface PhysicsVisualRecipe {
  id: string;
  version: "1.0";
  subject: PhysicsSubject;
  title: string;
  summary: string;
  understandingGoal: string;
  entities: PhysicsEntity[];
  causalRelations: PhysicsCausalRelation[];
  controlledVariable: PhysicsQuantity;
  measuredOutput: PhysicsQuantity;
  quantities: PhysicsQuantity[];
  evidence: PhysicsEvidence[];
  uncertainty: PhysicsUncertainty[];
  timeline: PhysicsTimeline;
  prediction: {
    prompt: string;
    expectedOutcome: string;
  };
  misconceptionGuard: string;
  comprehensionQuestion: string;
  publicRenderer: PhysicsRendererConfig;
  canvasRenderer: PhysicsRendererConfig;
  threeRenderer: PhysicsRendererConfig;
  fallback: PhysicsFallback;
  sources: string[];
}

