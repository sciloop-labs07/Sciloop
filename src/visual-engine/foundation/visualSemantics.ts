import type { VisualAtomType, VisualForm } from "./visualTypes";

export interface VisualSemanticRule {
  id: string;
  label: string;
  description: string;
  appliesTo: VisualAtomType[];
  rendererHint: string;
}

/**
 * Semantic rules define how visual styling carries meaning.
 *
 * Future AI should reference these rules when it needs to express strength,
 * uncertainty, depth, synthesis, or understanding. Future renderers should
 * preserve these meanings even if the exact visual style changes.
 */
export const visualSemanticRules = [
  {
    id: "more-layers-deeper-reality",
    label: "More layers = deeper reality",
    description: "Additional layers reveal hidden structure, abstraction, or causal depth.",
    appliesTo: ["layer", "system"],
    rendererHint: "Use stacked planes, depth offsets, or nested bands.",
  },
  {
    id: "thicker-flow-stronger-movement",
    label: "Thicker flow = stronger movement",
    description: "Flow thickness, particle density, or speed should increase with movement strength.",
    appliesTo: ["flow", "energy", "information", "signal"],
    rendererHint: "Increase stroke width, pulse count, brightness, or velocity.",
  },
  {
    id: "dashed-edge-uncertain-relation",
    label: "Dashed edge = uncertain relation",
    description: "Dashed connections show inferred, weak, or unverified relationships.",
    appliesTo: ["edge", "cause", "effect", "uncertainty"],
    rendererHint: "Use dashed lines, lower opacity, and confidence labels.",
  },
  {
    id: "glow-active-understanding",
    label: "Glow = active understanding or important signal",
    description: "Glow marks a currently important signal, insight, or focus of comprehension.",
    appliesTo: ["signal", "human-understanding", "node", "information"],
    rendererHint: "Use a controlled halo, highlight ring, or active state.",
  },
  {
    id: "faded-node-hidden-or-weak",
    label: "Faded node = hidden or weak concept",
    description: "Lower opacity shows hidden, weak, background, or not-yet-understood ideas.",
    appliesTo: ["node", "layer", "uncertainty"],
    rendererHint: "Reduce opacity and contrast while preserving labels on inspection.",
  },
  {
    id: "circular-arrows-feedback-loop",
    label: "Circular arrows = feedback loop",
    description: "Looping arrows show outputs returning to influence future inputs.",
    appliesTo: ["feedback", "system"],
    rendererHint: "Use circular arrows or returning animated pulses.",
  },
  {
    id: "split-path-multiple-possibilities",
    label: "Split path = multiple possibilities",
    description: "A divided route shows branching futures, interpretations, or outcomes.",
    appliesTo: ["timeline", "uncertainty", "transformation", "effect"],
    rendererHint: "Use forked paths with distinct labels and confidence states.",
  },
  {
    id: "converging-paths-synthesis",
    label: "Converging paths = synthesis or solution",
    description: "Multiple inputs meeting at one point show integration, solution, or concept formation.",
    appliesTo: ["flow", "information", "human-understanding", "system"],
    rendererHint: "Animate streams or edges into a single focused node.",
  },
  {
    id: "expanding-field-influence",
    label: "Expanding field = influence",
    description: "A growing field means influence spreading through a system or environment.",
    appliesTo: ["field", "cause", "effect", "system"],
    rendererHint: "Use expanding gradients, ripples, or soft boundary growth.",
  },
  {
    id: "compression-simplifies-complexity",
    label: "Compression = simplification of complex reality",
    description: "Many noisy inputs compressing into one clearer structure shows understanding.",
    appliesTo: ["noise", "signal", "pattern", "human-understanding"],
    rendererHint: "Move scattered marks into an ordered packet, pattern, or summary node.",
  },
  {
    id: "contrast-separates-signal-from-noise",
    label: "Contrast separates signal from noise",
    description: "Signal should become visually cleaner and higher contrast than surrounding noise.",
    appliesTo: ["signal", "noise", "information"],
    rendererHint: "Use contrast, alignment, and reduced clutter around the signal.",
  },
  {
    id: "interaction-reveals-causal-control",
    label: "Interaction reveals causal control",
    description: "User controls should expose which variable changes which visual meaning.",
    appliesTo: ["interaction", "cause", "effect", "flow", "field"],
    rendererHint: "Bind controls to visible changes and label the affected atom.",
  },
] as const satisfies readonly VisualSemanticRule[];

export const suggestedVisualFormsByAtom = {
  node: "circle",
  edge: "line",
  layer: "stacked-plane",
  flow: "stream",
  field: "gradient-field",
  timeline: "sequence",
  scale: "scale-ladder",
  transformation: "before-process-after",
  cause: "cause-marker",
  effect: "effect-marker",
  feedback: "loop-arrow",
  system: "system-boundary",
  energy: "energy-pulse",
  information: "information-packet",
  "human-understanding": "understanding-glow",
  interaction: "control-handle",
  uncertainty: "uncertainty-haze",
  pattern: "repeating-motif",
  signal: "signal-beam",
  noise: "noise-cloud",
} as const satisfies Record<VisualAtomType, VisualForm>;

