/**
 * Core type contracts for SciLoop's controlled visual language.
 *
 * AI systems should use these types to describe structured visual meaning.
 * Renderers can later convert this meaning into Canvas, SVG, WebGL, or other
 * views without letting the AI invent arbitrary visuals directly.
 */

export type VisualAtomType =
  | "node"
  | "edge"
  | "layer"
  | "flow"
  | "field"
  | "timeline"
  | "scale"
  | "transformation"
  | "cause"
  | "effect"
  | "feedback"
  | "system"
  | "energy"
  | "information"
  | "human-understanding"
  | "interaction"
  | "uncertainty"
  | "pattern"
  | "signal"
  | "noise";

export type VisualForm =
  | "circle"
  | "labeled-card"
  | "line"
  | "arrow"
  | "stacked-plane"
  | "stream"
  | "gradient-field"
  | "sequence"
  | "scale-ladder"
  | "before-process-after"
  | "cause-marker"
  | "effect-marker"
  | "loop-arrow"
  | "system-boundary"
  | "energy-pulse"
  | "information-packet"
  | "understanding-glow"
  | "control-handle"
  | "uncertainty-haze"
  | "repeating-motif"
  | "signal-beam"
  | "noise-cloud";

export type VisualCertainty = "known" | "inferred" | "uncertain" | "unknown";
export type VisualIntensity = "low" | "medium" | "high" | "critical";

export interface VisualAtom {
  /** Stable machine id used by recipes and renderers. */
  id: VisualAtomType;
  /** Human-readable atom name. */
  name: string;
  /** What the atom means in the SciLoop visual language. */
  description: string;
  /** The conceptual meaning a renderer must preserve. */
  visualMeaning: string;
  /** Situations where this atom should be used. */
  commonUses: string[];
  /** Preferred visual form for future renderers. */
  suggestedVisualForm: VisualForm;
}

export interface VisualPosition {
  x: number;
  y: number;
}

export interface VisualLayer {
  id: string;
  label: string;
  depth: number;
  atoms: VisualAtomType[];
  visible: boolean;
  description?: string;
}

export interface VisualNode {
  id: string;
  label: string;
  atom: "node";
  position?: VisualPosition;
  certainty?: VisualCertainty;
  intensity?: VisualIntensity;
  layerId?: string;
}

export interface VisualEdge {
  id: string;
  atom: "edge";
  from: string;
  to: string;
  label?: string;
  certainty?: VisualCertainty;
  strength?: number;
}

export interface VisualFlow {
  id: string;
  atom: "flow";
  source: string;
  target: string;
  material: "energy" | "information" | "attention" | "money" | "force" | "causality" | "matter";
  rate: number;
  label?: string;
}

export interface VisualField {
  id: string;
  atom: "field";
  source?: string;
  label: string;
  influence: number;
  radius?: number;
  certainty?: VisualCertainty;
}

export interface VisualTimeline {
  id: string;
  atom: "timeline";
  stages: Array<{
    id: string;
    label: string;
    description: string;
  }>;
}

export interface VisualTransformation {
  id: string;
  atom: "transformation";
  before: string;
  process: string;
  after: string;
  label?: string;
}

export interface VisualFeedbackLoop {
  id: string;
  atom: "feedback";
  nodes: string[];
  polarity: "amplifying" | "balancing";
  strength: number;
  label?: string;
}

export interface VisualSystem {
  id: string;
  atom: "system";
  label: string;
  boundaryNodeIds: string[];
  layers: VisualLayer[];
  goal?: VisualUnderstandingGoal;
}

export interface VisualInteraction {
  id: string;
  atom: "interaction";
  label: string;
  targetId: string;
  controlType: "hover" | "drag" | "slider" | "toggle" | "scrub" | "select";
  understandingEffect: string;
}

export interface VisualUnderstandingGoal {
  id: string;
  label: string;
  audience: "student" | "researcher" | "builder" | "general";
  userShouldUnderstand: string[];
  successSignal: string;
}

export interface VisualLanguageExample {
  id: string;
  title: string;
  concept: string;
  atomsUsed: VisualAtomType[];
  layers: VisualLayer[];
  nodes: VisualNode[];
  edges: VisualEdge[];
  flows: VisualFlow[];
  fields: VisualField[];
  transformations: VisualTransformation[];
  feedbackLoops: VisualFeedbackLoop[];
  interactions: VisualInteraction[];
  understandingGoal: VisualUnderstandingGoal;
}

