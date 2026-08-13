export const visualEngineIds = [
  "react-tailwind",
  "svg-motion",
  "canvas-2d",
  "d3",
  "echarts",
  "lottie",
  "rive",
  "pixijs",
  "phaser",
  "three-r3f",
  "webgl",
  "webgpu-experimental",
  "maplibre",
  "deckgl",
] as const;

export const safeDefaultEngineId = "react-tailwind" as const;

export const experimentalEngineIds = [
  "webgpu-experimental",
] as const;

export const heavyDependencyEngineIds = [
  "d3",
  "echarts",
  "lottie",
  "rive",
  "pixijs",
  "phaser",
  "three-r3f",
  "maplibre",
  "deckgl",
] as const;
