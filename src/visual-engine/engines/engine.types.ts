import type {
  VisualAtomType,
  VisualRecipe,
  VisualRecipeVisualType,
} from "@/src/visual-engine/foundation";
import type { VisualPattern } from "@/src/visual-engine/patterns";

import type { visualEngineIds } from "./engine.constants";

export type VisualEngineId = (typeof visualEngineIds)[number];

export type VisualEngineCategory =
  | "layout"
  | "diagram"
  | "simulation"
  | "data"
  | "animation"
  | "game"
  | "spatial"
  | "gpu"
  | "map";

export type VisualEngineCapability =
  | "cards"
  | "dashboards"
  | "diagrams"
  | "arrows"
  | "nodes"
  | "charts"
  | "graphs"
  | "trees"
  | "particles"
  | "waves"
  | "signals"
  | "games"
  | "3d"
  | "maps"
  | "geospatial-layers"
  | "gpu-compute"
  | "prebuilt-animation"
  | "interactive-animation";

export interface VisualEngineStrength {
  label: string;
  description: string;
}

export interface VisualEngineWeakness {
  label: string;
  description: string;
}

export interface VisualEngineUseCase {
  label: string;
  description: string;
  visualTypes: VisualRecipeVisualType[];
  atoms: VisualAtomType[];
  keywords: string[];
}

export type EngineComplexityLevel = "low" | "medium" | "high" | "frontier";

export interface EnginePerformanceProfile {
  renderCost: "low" | "medium" | "high";
  animationCost: "low" | "medium" | "high";
  bestObjectCount: "few" | "many" | "massive";
  notes: string;
}

export interface VisualEngine {
  id: VisualEngineId;
  name: string;
  category: VisualEngineCategory;
  description: string;
  bestFor: string[];
  avoidFor: string[];
  capabilities: VisualEngineCapability[];
  strengths: VisualEngineStrength[];
  weaknesses: VisualEngineWeakness[];
  performanceProfile: EnginePerformanceProfile;
  complexityLevel: EngineComplexityLevel;
  dependencyStatus: "native" | "installed" | "missing" | "planned" | "experimental";
  installed: boolean;
  supportedByCurrentProject: boolean;
  requiredDependencies: string[];
  fallbackEngineIds: VisualEngineId[];
  exampleUseCases: VisualEngineUseCase[];
  tags: string[];
}

export interface EngineRecommendation {
  primaryEngine: VisualEngineId;
  fallbackEngines: VisualEngineId[];
  confidence: number;
  reason: string;
  warnings: string[];
  requiredDependencies: string[];
  installed: boolean;
  supportedByCurrentProject: boolean;
}

export interface EngineRoutingInput {
  recipe?: VisualRecipe;
  pattern?: VisualPattern;
  visualType?: VisualRecipeVisualType;
  conceptText?: string;
  atoms?: VisualAtomType[];
  complexity?: EngineComplexityLevel;
  preferredEngine?: VisualEngineId;
}

export interface EngineRoutingResult extends EngineRecommendation {
  rankedEngines: EngineRecommendation[];
}

export interface EngineFallbackStrategy {
  engineId: VisualEngineId;
  fallbackEngineIds: VisualEngineId[];
  reason: string;
}
