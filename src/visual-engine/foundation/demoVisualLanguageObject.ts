import type { VisualLanguageExample } from "./visualTypes";

/**
 * Tiny data-only example for Command 2.
 *
 * It shows how a future AI translator should describe meaning with SciLoop's
 * visual language instead of directly producing arbitrary renderer output.
 */
export const randomInformationToUnderstandingDemo = {
  id: "demo-random-information-to-understanding",
  title: "Random information becoming human understanding",
  concept: "Random information becomes useful when noise is filtered into signal, organized into a pattern, and transformed into human understanding.",
  atomsUsed: [
    "noise",
    "signal",
    "flow",
    "transformation",
    "layer",
    "human-understanding",
  ],
  layers: [
    {
      id: "raw-input-layer",
      label: "Raw input",
      depth: 0,
      atoms: ["noise", "signal"],
      visible: true,
      description: "The learner first sees mixed random input and weak signal.",
    },
    {
      id: "meaning-layer",
      label: "Meaning layer",
      depth: 1,
      atoms: ["pattern", "human-understanding"],
      visible: true,
      description: "Useful structure emerges after filtering and compression.",
    },
  ],
  nodes: [
    {
      id: "noise-cloud",
      label: "Random information",
      atom: "node",
      position: { x: 0.15, y: 0.52 },
      certainty: "unknown",
      intensity: "medium",
      layerId: "raw-input-layer",
    },
    {
      id: "signal-core",
      label: "Signal",
      atom: "node",
      position: { x: 0.46, y: 0.42 },
      certainty: "inferred",
      intensity: "high",
      layerId: "raw-input-layer",
    },
    {
      id: "understanding-state",
      label: "Human understanding",
      atom: "node",
      position: { x: 0.82, y: 0.5 },
      certainty: "known",
      intensity: "high",
      layerId: "meaning-layer",
    },
  ],
  edges: [
    {
      id: "noise-to-signal-filter",
      atom: "edge",
      from: "noise-cloud",
      to: "signal-core",
      label: "filter",
      certainty: "inferred",
      strength: 0.62,
    },
    {
      id: "signal-to-understanding",
      atom: "edge",
      from: "signal-core",
      to: "understanding-state",
      label: "organize",
      certainty: "known",
      strength: 0.86,
    },
  ],
  flows: [
    {
      id: "information-flow",
      atom: "flow",
      source: "noise-cloud",
      target: "understanding-state",
      material: "information",
      rate: 0.74,
      label: "information becomes meaning",
    },
  ],
  fields: [
    {
      id: "attention-field",
      atom: "field",
      source: "signal-core",
      label: "Attention focuses useful signal",
      influence: 0.7,
      radius: 0.52,
      certainty: "inferred",
    },
  ],
  transformations: [
    {
      id: "noise-signal-understanding-transform",
      atom: "transformation",
      before: "noise-cloud",
      process: "signal-core",
      after: "understanding-state",
      label: "filter, compress, understand",
    },
  ],
  feedbackLoops: [],
  interactions: [
    {
      id: "adjust-noise-filter",
      atom: "interaction",
      label: "Adjust filter strength",
      targetId: "noise-to-signal-filter",
      controlType: "slider",
      understandingEffect: "Shows how stronger filtering makes the useful signal easier to understand.",
    },
  ],
  understandingGoal: {
    id: "understand-signal-from-noise",
    label: "Understand signal extraction",
    audience: "student",
    userShouldUnderstand: [
      "Noise is not yet meaning.",
      "Signal is useful structure inside noisy input.",
      "Understanding appears when signal is organized into a stable pattern.",
    ],
    successSignal: "The learner can explain why filtering and patterning are needed before understanding appears.",
  },
} as const satisfies VisualLanguageExample;

