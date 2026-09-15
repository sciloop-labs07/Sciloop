import {
  fourierTransformRecipe,
  heatToOrganizedEnergyRecipe,
} from "@/src/visual-engine/foundation";
import {
  gravityPatternRecipe,
  sciloopVisualUnderstandingPatternRecipe,
} from "@/src/visual-engine/patterns";

import {
  routeEngineForConceptText,
  routeEngineForRecipe,
} from "./engineRouter";

export const fourierTransformEngineExample = {
  label: "Fourier Transform",
  expected: "svg-motion primary, canvas-2d fallback or enhancement",
  result: routeEngineForRecipe(fourierTransformRecipe),
};

export const heatToOrganizedEnergyEngineExample = {
  label: "Heat to Organized Energy",
  expected: "canvas-2d primary, svg-motion fallback, pixijs future upgrade",
  result: routeEngineForRecipe(heatToOrganizedEnergyRecipe),
};

export const gravityEngineExample = {
  label: "Gravity",
  expected: "svg-motion primary, three-r3f future upgrade",
  result: routeEngineForRecipe(gravityPatternRecipe),
};

export const globalProblemSolvingMapEngineExample = {
  label: "Global Problem Solving Map",
  expected: "maplibre primary if installed, react-tailwind + svg-motion fallback",
  result: routeEngineForConceptText("Global problem solving map with geography, local action, and global impact"),
};

export const sciloopKnowledgeGraphEngineExample = {
  label: "SciLoop Knowledge Graph",
  expected: "d3 primary if installed, svg-motion fallback",
  result: routeEngineForConceptText("SciLoop knowledge graph of connected concepts and relationships"),
};

export const webgpuParticleFrontierEngineExample = {
  label: "WebGPU Particle Frontier",
  expected: "webgpu-experimental only if supported, webgl/canvas fallback",
  result: routeEngineForConceptText("WebGPU frontier massive particles compute visual"),
};

export const sciloopVisualUnderstandingEngineExample = {
  label: "SciLoop Visual Understanding",
  expected: "svg-motion or react-tailwind for controlled compression of complexity",
  result: routeEngineForRecipe(sciloopVisualUnderstandingPatternRecipe),
};

export const engineRoutingExamples = [
  fourierTransformEngineExample,
  heatToOrganizedEnergyEngineExample,
  gravityEngineExample,
  globalProblemSolvingMapEngineExample,
  sciloopKnowledgeGraphEngineExample,
  webgpuParticleFrontierEngineExample,
  sciloopVisualUnderstandingEngineExample,
] as const;
