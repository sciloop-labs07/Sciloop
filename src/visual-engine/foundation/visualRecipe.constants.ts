/**
 * Controlled Visual Recipe values.
 *
 * These strings are recommendations and categories only. They do not install
 * or require any rendering engine. Future renderers decide which supported
 * runtime can safely display each recipe.
 */

export const visualRecipeTypes = [
  "concept-map",
  "transformation",
  "flow-system",
  "layered-reality",
  "timeline",
  "feedback-loop",
  "comparison",
  "simulation",
  "field-influence",
  "network",
  "decision-tree",
  "signal-decomposition",
  "innovation-pipeline",
] as const;

export const visualRecipeDifficulties = [
  "kid",
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;

export const visualRecipeModes = [
  "static",
  "animated",
  "interactive",
  "simulation",
  "lab",
] as const;

export const visualRecipeEngineRecommendations = [
  "react-tailwind",
  "svg-motion",
  "canvas-2d",
  "d3",
  "echarts",
  "pixijs",
  "phaser",
  "three-r3f",
  "maplibre",
  "webgpu-experimental",
] as const;

export const visualRecipePatterns = [
  "random-to-organized",
  "signal-decomposition",
  "energy-flow",
  "cause-effect",
  "feedback-loop",
  "layer-reveal",
  "scale-shift",
  "comparison",
  "network-propagation",
  "innovation-pipeline",
] as const;

