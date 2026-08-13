import type { EngineFallbackStrategy, VisualEngineId } from "./engine.types";

export const engineFallbackStrategies: EngineFallbackStrategy[] = [
  {
    engineId: "webgpu-experimental",
    fallbackEngineIds: ["webgl", "canvas-2d", "svg-motion"],
    reason: "Every experimental GPU path needs a WebGL, Canvas, and SVG fallback.",
  },
  {
    engineId: "webgl",
    fallbackEngineIds: ["canvas-2d", "svg-motion", "react-tailwind"],
    reason: "GPU graphics can degrade into Canvas, then simple diagrams.",
  },
  {
    engineId: "three-r3f",
    fallbackEngineIds: ["canvas-2d", "svg-motion", "react-tailwind"],
    reason: "3D worlds should still have a 2D conceptual rendering path.",
  },
  {
    engineId: "phaser",
    fallbackEngineIds: ["react-tailwind", "svg-motion"],
    reason: "Learning games can degrade into cards plus diagrams.",
  },
  {
    engineId: "pixijs",
    fallbackEngineIds: ["canvas-2d", "svg-motion"],
    reason: "Many animated 2D objects can degrade into Canvas or SVG.",
  },
  {
    engineId: "d3",
    fallbackEngineIds: ["svg-motion", "react-tailwind"],
    reason: "Graphs and trees can degrade into simpler SVG diagrams.",
  },
  {
    engineId: "echarts",
    fallbackEngineIds: ["react-tailwind", "svg-motion"],
    reason: "Charts can degrade into cards, tables, and simple SVG comparisons.",
  },
  {
    engineId: "maplibre",
    fallbackEngineIds: ["react-tailwind", "svg-motion"],
    reason: "Maps can degrade into regional cards and relationship diagrams.",
  },
  {
    engineId: "deckgl",
    fallbackEngineIds: ["maplibre", "react-tailwind", "svg-motion"],
    reason: "Large geospatial layers can degrade into maps, then cards and diagrams.",
  },
  {
    engineId: "lottie",
    fallbackEngineIds: ["svg-motion", "react-tailwind"],
    reason: "Prebuilt animation can degrade into SVG motion or static cards.",
  },
  {
    engineId: "rive",
    fallbackEngineIds: ["svg-motion", "react-tailwind"],
    reason: "Interactive vector animation can degrade into SVG or static UI.",
  },
  {
    engineId: "canvas-2d",
    fallbackEngineIds: ["svg-motion", "react-tailwind"],
    reason: "Canvas concepts should have SVG and card fallbacks.",
  },
  {
    engineId: "svg-motion",
    fallbackEngineIds: ["react-tailwind"],
    reason: "Diagrams can degrade into structured cards.",
  },
  {
    engineId: "react-tailwind",
    fallbackEngineIds: [],
    reason: "React and Tailwind are the safe default surface.",
  },
];

export function getFallbackEngines(engineId: VisualEngineId): VisualEngineId[] {
  return engineFallbackStrategies.find((strategy) => strategy.engineId === engineId)?.fallbackEngineIds ?? ["react-tailwind"];
}
