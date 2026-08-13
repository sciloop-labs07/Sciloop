export {
  experimentalEngineIds,
  heavyDependencyEngineIds,
  safeDefaultEngineId,
  visualEngineIds,
} from "./engine.constants";
export {
  getVisualEngine,
  visualEngines,
} from "./engineCapabilities";
export {
  engineFallbackStrategies,
  getFallbackEngines,
} from "./engineFallbacks";
export {
  engineRoutingRules,
  getMatchingEngineRules,
  type EngineRoutingRule,
} from "./engineRules";
export {
  rankEnginesForInput,
  scoreEngineForComplexity,
  scoreEngineForPattern,
  scoreEngineForRecipe,
  scoreEngineForVisualType,
} from "./engineScoring";
export {
  explainEngineChoice,
  getFallbackEngines as getRouterFallbackEngines,
  getRecommendedEngine,
  routeEngineForConceptText,
  routeEngineForPattern,
  routeEngineForRecipe,
  routeEngineForVisualType,
} from "./engineRouter";
export {
  engineRoutingExamples,
  fourierTransformEngineExample,
  globalProblemSolvingMapEngineExample,
  gravityEngineExample,
  heatToOrganizedEnergyEngineExample,
  sciloopKnowledgeGraphEngineExample,
  sciloopVisualUnderstandingEngineExample,
  webgpuParticleFrontierEngineExample,
} from "./engineExamples";
export {
  getEngineCategory,
  getEngineDisplayName,
  getEngineWarning,
  getSafeDefaultEngine,
  isEngineExperimental,
  isEngineInstalled,
  requiresHeavyDependency,
} from "./engineUtils";
export type {
  EngineComplexityLevel,
  EngineFallbackStrategy,
  EnginePerformanceProfile,
  EngineRecommendation,
  EngineRoutingInput,
  EngineRoutingResult,
  VisualEngine,
  VisualEngineCapability,
  VisualEngineCategory,
  VisualEngineId,
  VisualEngineStrength,
  VisualEngineUseCase,
  VisualEngineWeakness,
} from "./engine.types";
