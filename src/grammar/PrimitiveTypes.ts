import type { SemanticGraph, Vec2 } from "@/src/semantic/SemanticTypes";

export type PrimitiveKind =
  | "node"
  | "edge"
  | "field"
  | "pulse"
  | "flow"
  | "particle_stream"
  | "boundary"
  | "wave"
  | "attractor"
  | "repulsor"
  | "deformation"
  | "temporal_transition"
  | "state_morph"
  | "signal_propagation";

export interface PrimitiveInstance {
  id: string;
  kind: PrimitiveKind;
  label: string;
  semanticMeaning: string;
  sourceId?: string;
  targetId?: string;
  position?: Vec2;
  color: string;
  strength: number;
  state: Record<string, number | string | boolean>;
}

export interface PrimitiveDefinition {
  id: PrimitiveKind;
  semanticMeaning: string;
  visualRepresentation: string;
  animationRules: string;
  interactionRules: string;
  physicsRules: string;
  update: (dt: number, primitive: PrimitiveInstance, graph: SemanticGraph) => PrimitiveInstance;
}
