import type { VisualEngineId } from "@/src/visual-engine/engines";

export type VisualTechId =
  | "react-tailwind"
  | "svg"
  | "svg-motion"
  | "css-animation"
  | "canvas-2d"
  | "d3"
  | "echarts"
  | "lottie"
  | "rive"
  | "pixijs"
  | "phaser"
  | "three"
  | "react-three-fiber"
  | "webgl"
  | "webgpu-experimental"
  | "maplibre"
  | "deckgl";

export type VisualTechStatus = "ready-now" | "safe-fallback" | "future-upgrade" | "experimental" | "heavy-dependency";
export type VisualTechPerformanceLevel = "low" | "medium" | "high" | "frontier";
export type VisualTechInstallStatus = "installed" | "native" | "missing" | "experimental";
export type VisualTechDemoMode = "live" | "placeholder";
export type VisualTechCapability = "excellent" | "good" | "possible" | "not-ideal" | "future-only";

export interface VisualTechUseCase {
  label: string;
  description: string;
}

export interface VisualTechComparison {
  clarity: number;
  performance: number;
  interaction: number;
  complexity: number;
  dependencyCost: number;
  bestVisualPattern: string;
  bestSciLoopUseCase: string;
}

export interface VisualTechDemo {
  id: VisualTechId;
  engineId: VisualEngineId;
  name: string;
  description: string;
  bestFor: string[];
  notBestFor: string[];
  demoStatus: VisualTechStatus;
  demoMode: VisualTechDemoMode;
  installed: boolean;
  installStatus: VisualTechInstallStatus;
  dependencyName?: string;
  primaryUseCase: VisualTechUseCase;
  fallbackTech: VisualTechId[];
  performanceLevel: VisualTechPerformanceLevel;
  interactionLevel: "none" | "low" | "medium" | "high";
  learningValue: string;
  recommendedForSciLoop: "use-now" | "use-as-fallback" | "evaluate-later" | "frontier-only";
  notes: string;
  comparison: VisualTechComparison;
  capabilityScores: Record<string, VisualTechCapability>;
  routerConceptHint: string;
}
