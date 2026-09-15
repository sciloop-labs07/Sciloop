export {
  createFlowsFromPattern,
  createLayerTemplatesFromPattern,
  createObjectsFromPattern,
  createRecipeFromPattern,
  createRecipeFromVisualPattern,
  createRelationsFromPattern,
  createTransformationsFromPattern,
  getStarterRecipeEngine,
} from "./visualPatternFactory";
export {
  globalProblemSolvingPatternRecipe,
  gravityPatternRecipe,
  fourierTransformPatternRecipe,
  heatToOrganizedEnergyPatternRecipe,
  sciloopVisualUnderstandingPatternRecipe,
  visualPatternExampleRecipes,
} from "./visualPatternExamples";
export {
  rankPatternCandidates,
  suggestPatternByAtoms,
  suggestPatternByKeywords,
  suggestPatternByVisualType,
  suggestPatternsForConcept,
} from "./visualPatternMatcher";
export {
  allVisualPatterns,
  getPatternById,
  getPatternsByAtom,
  getPatternsByCategory,
  getPatternsByTag,
  getPatternsByVisualType,
  listAllPatternIds,
  listPatternSummaries,
} from "./visualPatternRegistry";
export {
  getPatternFallbackEngine,
  getPatternPrimaryEngine,
  getPatternUnderstandingGoal,
  mergeCompatiblePatterns,
  normalizePatternInput,
  patternSupportsVisualType,
  patternUsesAtom,
} from "./visualPatternUtils";
export { visualPatterns, type OfficialVisualPattern } from "./visualPatterns";
export type {
  VisualPattern,
  VisualPatternCandidate,
  VisualPatternCategory,
  VisualPatternEnginePreference,
  VisualPatternFlowTemplate,
  VisualPatternId,
  VisualPatternInteractionTemplate,
  VisualPatternLayerTemplate,
  VisualPatternMatchInput,
  VisualPatternObjectTemplate,
  VisualPatternRelationTemplate,
  VisualPatternStage,
  VisualPatternSummary,
  VisualPatternTransformationTemplate,
  VisualPatternUnderstandingGoal,
  VisualPatternUseCase,
} from "./visualPattern.types";
