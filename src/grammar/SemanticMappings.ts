import { semanticColors } from "@/src/utils/color";

import type { PrimitiveKind } from "./PrimitiveTypes";

export interface SemanticMapping {
  semantic: string;
  primitive: PrimitiveKind;
  color: string;
  explanation: string;
}

export const semanticMappings: SemanticMapping[] = [
  { semantic: "Energy", primitive: "particle_stream", color: semanticColors.energy, explanation: "Glowing particles move from source to receiver." },
  { semantic: "Constraint", primitive: "boundary", color: semanticColors.constraint, explanation: "Rigid barriers block or redirect motion." },
  { semantic: "Influence", primitive: "field", color: semanticColors.force, explanation: "Fields bend nearby paths or change opacity." },
  { semantic: "Growth", primitive: "state_morph", color: semanticColors.growth, explanation: "Nodes expand, branch, or gain density." },
  { semantic: "Decay", primitive: "state_morph", color: semanticColors.decay, explanation: "Nodes fade, fragment, or lose coherence." },
  { semantic: "Feedback", primitive: "signal_propagation", color: semanticColors.feedback, explanation: "Pulses loop back to amplify or balance a system." },
  { semantic: "Conflict", primitive: "edge", color: semanticColors.constraint, explanation: "Opposing vectors collide or cancel." },
  { semantic: "Entropy", primitive: "particle_stream", color: "#c2b28f", explanation: "Particles disperse and pattern coherence falls." },
  { semantic: "Optimization", primitive: "attractor", color: semanticColors.signal, explanation: "Motion converges toward a stable path or attractor." },
  { semantic: "Stability", primitive: "wave", color: semanticColors.information, explanation: "Smooth cycles indicate predictable dynamics." },
  { semantic: "Instability", primitive: "wave", color: semanticColors.decay, explanation: "Noisy oscillation marks unstable dynamics." },
  { semantic: "Information", primitive: "pulse", color: semanticColors.information, explanation: "Discrete pulses encode signal strength." },
  { semantic: "Learning", primitive: "signal_propagation", color: semanticColors.signal, explanation: "Edges thicken as weights update from error." },
  { semantic: "Money", primitive: "flow", color: semanticColors.money, explanation: "Token flow shows money expansion and value pressure." },
];

export function mappingForSemantic(semantic: string) {
  const lower = semantic.toLowerCase();
  return semanticMappings.find((mapping) => mapping.semantic.toLowerCase() === lower);
}
