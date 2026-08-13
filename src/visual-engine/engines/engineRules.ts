import type { VisualAtomType, VisualRecipeVisualType } from "@/src/visual-engine/foundation";

import type { EngineRoutingInput, VisualEngineId } from "./engine.types";

export interface EngineRoutingRule {
  id: string;
  label: string;
  engineId: VisualEngineId;
  fallbackEngineIds: VisualEngineId[];
  score: number;
  reason: string;
  matches: (input: EngineRoutingInput) => boolean;
}

function hasAnyAtom(input: EngineRoutingInput, atoms: VisualAtomType[]) {
  const inputAtoms = new Set([
    ...(input.atoms ?? []),
    ...(input.recipe?.atomsUsed ?? []),
    ...(input.pattern?.atomsUsed ?? []),
  ]);
  return atoms.some((atom) => inputAtoms.has(atom));
}

function hasVisualType(input: EngineRoutingInput, visualTypes: VisualRecipeVisualType[]) {
  const visualType = input.visualType ?? input.recipe?.visualType ?? input.pattern?.visualType;
  return visualType ? visualTypes.includes(visualType) : false;
}

function hasConcept(input: EngineRoutingInput, keywords: string[]) {
  const text = [
    input.conceptText,
    input.recipe?.title,
    input.recipe?.concept,
    input.recipe?.summary,
    input.pattern?.name,
    input.pattern?.shortDescription,
    ...(input.pattern?.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return keywords.some((keyword) => text.includes(keyword));
}

/**
 * Heavy engines should only be chosen when a rule clearly needs them. Most
 * concepts should stay in React, SVG, or Canvas until richer rendering is
 * truly useful for understanding.
 */
export const engineRoutingRules: EngineRoutingRule[] = [
  {
    id: "simple-concept-card",
    label: "Simple concept card",
    engineId: "react-tailwind",
    fallbackEngineIds: [],
    score: 8,
    reason: "Simple cards, dashboards, and explanation panels are safest in React + Tailwind.",
    matches: (input) => hasVisualType(input, ["comparison", "concept-map"]) && !hasConcept(input, ["graph", "network", "wave", "map", "3d"]),
  },
  {
    id: "diagram-nodes-arrows",
    label: "Diagram / nodes / arrows",
    engineId: "svg-motion",
    fallbackEngineIds: ["react-tailwind"],
    score: 10,
    reason: "Diagrams, nodes, arrows, cause-effect, and transformations fit SVG motion.",
    matches: (input) => hasVisualType(input, ["concept-map", "transformation", "layered-reality"]) || hasAnyAtom(input, ["node", "edge", "cause", "effect", "transformation"]),
  },
  {
    id: "timeline",
    label: "Timeline",
    engineId: "svg-motion",
    fallbackEngineIds: ["react-tailwind"],
    score: 8,
    reason: "Timelines can use SVG sequencing with React cards as fallback.",
    matches: (input) => hasVisualType(input, ["timeline"]) || hasAnyAtom(input, ["timeline"]),
  },
  {
    id: "normal-chart",
    label: "Normal chart",
    engineId: "echarts",
    fallbackEngineIds: ["react-tailwind", "svg-motion"],
    score: 9,
    reason: "Standard charts and statistics fit ECharts when installed.",
    matches: (input) => hasConcept(input, ["chart", "statistics", "stats", "dashboard", "comparison"]),
  },
  {
    id: "data-relationship-graph",
    label: "Data relationship / graph",
    engineId: "d3",
    fallbackEngineIds: ["svg-motion", "react-tailwind"],
    score: 11,
    reason: "Graphs, networks, trees, and data relationships fit D3 when installed.",
    matches: (input) => hasVisualType(input, ["network", "decision-tree"]) || hasConcept(input, ["knowledge graph", "graph", "network", "tree"]),
  },
  {
    id: "signal-wave-particles",
    label: "Signal / wave / particles",
    engineId: "canvas-2d",
    fallbackEngineIds: ["svg-motion", "react-tailwind"],
    score: 12,
    reason: "Signals, waves, particles, and repeated motion fit Canvas 2D.",
    matches: (input) => hasVisualType(input, ["signal-decomposition", "simulation"]) || hasConcept(input, ["signal", "wave", "frequency", "particle"]) || hasAnyAtom(input, ["signal", "flow", "energy"]),
  },
  {
    id: "many-animated-objects",
    label: "Many animated objects",
    engineId: "pixijs",
    fallbackEngineIds: ["canvas-2d", "svg-motion"],
    score: 9,
    reason: "Many animated 2D objects fit PixiJS later, with Canvas fallback now.",
    matches: (input) => hasConcept(input, ["many animated", "sprites", "particle field", "thousands"]),
  },
  {
    id: "game-like-learning",
    label: "Game-like learning",
    engineId: "phaser",
    fallbackEngineIds: ["react-tailwind", "svg-motion"],
    score: 10,
    reason: "Game-like labs, scoring, missions, and levels fit Phaser later.",
    matches: (input) => hasConcept(input, ["game", "mission", "score", "level", "quest"]),
  },
  {
    id: "spatial-3d",
    label: "3D / cosmic / spatial",
    engineId: "three-r3f",
    fallbackEngineIds: ["svg-motion", "canvas-2d"],
    score: 11,
    reason: "Spatial, molecular, cosmic, and 3D concepts fit Three/R3F when 3D matters.",
    matches: (input) => hasConcept(input, ["3d", "spatial", "cosmic", "molecule", "planet", "orbit"]),
  },
  {
    id: "map-geography",
    label: "Map / geography",
    engineId: "maplibre",
    fallbackEngineIds: ["react-tailwind", "svg-motion"],
    score: 12,
    reason: "Geography and local/global problem solving fit MapLibre when installed.",
    matches: (input) => hasConcept(input, ["map", "geography", "city", "country", "global problem", "location"]),
  },
  {
    id: "large-geospatial-data",
    label: "Large geospatial data",
    engineId: "deckgl",
    fallbackEngineIds: ["maplibre", "react-tailwind", "svg-motion"],
    score: 13,
    reason: "Large geospatial layers fit deck.gl later, with MapLibre/card fallbacks.",
    matches: (input) => hasConcept(input, ["geospatial", "large map", "movement flows", "global-scale", "data layers"]),
  },
  {
    id: "gpu-frontier",
    label: "GPU frontier",
    engineId: "webgpu-experimental",
    fallbackEngineIds: ["webgl", "canvas-2d", "svg-motion"],
    score: 14,
    reason: "GPU frontier experiments may use WebGPU only with strong fallback.",
    matches: (input) => hasConcept(input, ["webgpu", "gpu frontier", "massive particles", "compute"]),
  },
];

export function getMatchingEngineRules(input: EngineRoutingInput) {
  return engineRoutingRules.filter((rule) => rule.matches(input));
}
