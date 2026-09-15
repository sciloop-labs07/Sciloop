export type Vec2 = { x: number; y: number };

export type SemanticEntityType =
  | "energy_source"
  | "converter"
  | "storage"
  | "output"
  | "mass"
  | "particle"
  | "neuron"
  | "value"
  | "system"
  | "generic";

export type SemanticRelationType =
  | "energy_flow"
  | "signal_flow"
  | "force"
  | "conversion"
  | "feedback"
  | "constraint"
  | "decay"
  | "growth"
  | "generic";

export interface SemanticEntity {
  id: string;
  label: string;
  type: SemanticEntityType;
  state?: Record<string, number | string | boolean>;
  position: Vec2;
  radius?: number;
}

export interface SemanticVariable {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export interface SemanticRelation {
  id: string;
  from: string;
  to: string;
  type: SemanticRelationType;
  strength: number;
  label?: string;
}

export interface SemanticFlow {
  id: string;
  source: string;
  target: string;
  type: "energy" | "signal" | "money" | "matter" | "information" | "generic";
  rate: number;
  label?: string;
}

export interface SemanticForce {
  id: string;
  source: string;
  target?: string;
  type: "attraction" | "repulsion" | "field" | "pressure";
  strength: number;
  radius?: number;
}

export interface SemanticConstraint {
  id: string;
  label: string;
  target?: string;
  type: "barrier" | "threshold" | "bottleneck";
  value?: number;
}

export interface SemanticTransition {
  id: string;
  label: string;
  fromState: string;
  toState: string;
  trigger: string;
}

export interface SemanticFeedbackLoop {
  id: string;
  label: string;
  nodes: string[];
  polarity: "amplifying" | "balancing";
  strength: number;
}

export interface SemanticGraph {
  id: string;
  title: string;
  explanation: string;
  warning?: string;
  entities: SemanticEntity[];
  variables: SemanticVariable[];
  relations: SemanticRelation[];
  flows: SemanticFlow[];
  forces: SemanticForce[];
  constraints: SemanticConstraint[];
  transitions: SemanticTransition[];
  feedbackLoops: SemanticFeedbackLoop[];
  meta?: {
    demoId?: string;
    parserConfidence?: number;
    causalChain?: string[];
  };
}

export interface GraphValidationResult {
  ok: boolean;
  warnings: string[];
  errors: string[];
}
