import type { VisualApiInput } from "./visualApi.types";

export function buildForloopVisualSystemPrompt() {
  return `You are the SciLoop Visual Recipe Translator.
Return valid JSON only. Do not create art, image prompts, SVG, Canvas, component code, or renderer code.
Translate meaning into a controlled visual recipe. SciLoop owns rendering and validation.

Allowed atoms: Node, Edge, Layer, Flow, Field, Timeline, Scale, Transformation, Cause, Effect, Feedback, System, Energy, Information, HumanUnderstanding, Interaction, Uncertainty, Pattern, Signal, Noise.
Allowed reusable patterns: Input Process Output, Problem Solution, Cause Effect, Random to Organized, Hidden Visible Layer, Micro Macro, Past Present Future, System Feedback Loop, Network Growth, Energy Flow, Signal Decomposition, Decision Tree, Knowledge Graph, Conflict Resolution, Innovation Pipeline, Field Influence, Compression of Complexity, Multiple Possibilities Best Path, Weak Signal Strong Signal, Local Action Global Impact.
Allowed engines: react-tailwind, svg-motion, canvas-2d, d3, echarts, lottie, rive, pixijs, phaser, three-r3f, webgl, webgpu-experimental, maplibre, deckgl.

Rules:
1. Always include a safe fallback.
2. Include layers, objects, relations or flows, explanation, and audience adaptation.
3. Never output raw visual code.
4. Never invent an engine.
5. WebGPU must include webgl or canvas-2d fallback.
6. Prefer react-tailwind, svg-motion, or canvas-2d for V1.
7. Optimize for clarity, low text, visible cause-effect, and human feedback readiness.`;
}

export function buildForloopVisualUserPrompt(input: VisualApiInput) {
  return `Create a controlled SciLoop Visual Recipe JSON.
Raw text: ${input.rawText}
Topic: ${input.topic ?? "auto-detect"}
Source type: ${input.sourceType ?? "concept"}
Target audience: ${input.targetAudience ?? "beginner"}
Difficulty: ${input.difficulty ?? "beginner"}
Preferred pattern id: ${input.preferredPatternId ?? "auto-select"}
Preferred visual type: ${input.preferredVisualType ?? "auto-select"}
Preferred engine: ${input.preferredEngine ?? "auto-select"}
Needs math layer: ${input.needsMathLayer ? "yes" : "only if useful"}
Needs real-life example: ${input.needsRealLifeExample === false ? "optional" : "yes"}
Needs interaction: ${input.needsInteraction ? "yes" : "only if useful"}
Language: ${input.language ?? "English"}
Constraints: ${(input.constraints ?? ["Use safe SciLoop V1 rendering only."]).join("; ")}

Return one JSON object with: id, title, concept, summary, difficulty, targetAudience, visualType, pattern, atomsUsed, layers, objects, relations, flows, transformations, feedbackLoops, timeline, interactions, motion, engineRecommendation { primary, fallbacks, reason }, explanation { mainIdea, steps, kidVersion, realLifeExample, mathLayer, whyThisVisualPattern }, fallback, assessment, tags.`;
}

export const bestVisualConstraints = [
  "Choose the clearest visual pattern for human understanding.",
  "Prefer SciLoop V1 stable engines first.",
  "Use multiple layers if it improves clarity.",
  "Add a real-life example.",
  "Add a kid-level explanation.",
  "Add a math layer only when useful.",
  "Use interaction only if it improves understanding.",
  "Avoid random visuals.",
  "Prioritize clarity, low text, strong layers, visible cause-effect, engine fallback, and human feedback readiness.",
];
