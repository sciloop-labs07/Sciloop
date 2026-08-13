import { translateWithMockAI } from "./ai";
import { routeEngineForRecipe, visualEngines } from "./engines";
import {
  DatabaseFeedbackAdapter,
  FeedbackStorageManager,
  MemoryFeedbackAdapter,
  analyzeFeedback,
  feedbackExamples,
  isVisualFeedbackRecord,
} from "./feedback";
import { validateVisualRecipe, visualRecipeExamples } from "./foundation";
import { allVisualPatterns } from "./patterns";
import {
  analyzeVisualMemory,
  createMemoryEvolutionRecords,
  getBestPatternForConcept,
  isVisualMemory,
  visualMemoryExamples,
} from "./memory";

export interface VisualEngineSelfTestResult {
  passed: boolean;
  checks: Array<{ name: string; passed: boolean; message: string }>;
}

/**
 * Internal test utility for projects without a dedicated unit-test framework.
 * This is safe to import in development and does not execute automatically.
 */
export function runVisualEngineSelfTest(): VisualEngineSelfTestResult {
  const recipePatternIds = new Set(allVisualPatterns.map((pattern) => pattern.recipePattern));
  const engineIds = new Set(visualEngines.map((engine) => engine.id));
  const mockResult = translateWithMockAI("Explain Fourier Transform visually");
  const routed = routeEngineForRecipe(visualRecipeExamples[0]);
  const sampleFeedback = feedbackExamples[0];
  const memoryAdapter = new MemoryFeedbackAdapter();
  memoryAdapter.saveFeedback(sampleFeedback);
  const manager = new FeedbackStorageManager(memoryAdapter);
  const invalidImport = manager.importFeedback(JSON.stringify([{ id: "broken" }]));
  const databaseHealth = new DatabaseFeedbackAdapter().getStorageHealth();
  const memoryAnalysis = analyzeVisualMemory(visualMemoryExamples);
  const checks = [
    {
      name: "Example recipes validate",
      passed: visualRecipeExamples.every((recipe) => validateVisualRecipe(recipe).ok),
      message: `${visualRecipeExamples.length} recipe example(s) checked.`,
    },
    {
      name: "Recipe patterns exist",
      passed: visualRecipeExamples.every((recipe) => recipePatternIds.has(recipe.pattern)),
      message: "Every example recipe maps to a registered recipe-pattern family.",
    },
    {
      name: "Engine router returns a valid route",
      passed: engineIds.has(routed.primaryEngine) && (routed.primaryEngine === "react-tailwind" || routed.fallbackEngines.length > 0),
      message: `Primary route: ${routed.primaryEngine}.`,
    },
    {
      name: "Mock translator returns a valid recipe",
      passed: validateVisualRecipe(mockResult.recipe).ok,
      message: `Mock translator selected ${mockResult.selectedPattern.id}.`,
    },
    {
      name: "Feedback analyzer handles empty data",
      passed: analyzeFeedback([]).summary.totalCount === 0,
      message: "Empty feedback produces a zero-value summary.",
    },
    {
      name: "Memory feedback adapter",
      passed: memoryAdapter.getAllFeedback().length === 1 && memoryAdapter.getFeedbackByRecipeId(sampleFeedback.recipeId).length === 1,
      message: "Memory adapter saves and queries feedback.",
    },
    {
      name: "Feedback record validation",
      passed: isVisualFeedbackRecord(sampleFeedback) && !isVisualFeedbackRecord({ id: "broken" }),
      message: "Valid records pass and incomplete records fail.",
    },
    {
      name: "Storage manager rejects invalid imports",
      passed: invalidImport.importedCount === 0 && invalidImport.rejectedCount === 1,
      message: "Corrupted imported feedback is rejected safely.",
    },
    {
      name: "Database unavailable fallback",
      passed: !databaseHealth.available && databaseHealth.fallback === "local-storage",
      message: databaseHealth.reason ?? "Database adapter status checked.",
    },
    {
      name: "Visual memory integrity",
      passed: visualMemoryExamples.every(isVisualMemory),
      message: `${visualMemoryExamples.length} controlled memory examples checked.`,
    },
    {
      name: "Visual memory registry",
      passed: getBestPatternForConcept("Fourier Transform", visualMemoryExamples) === "signal-decomposition",
      message: "Registry returns the strongest remembered pattern.",
    },
    {
      name: "Visual memory analysis",
      passed: memoryAnalysis.totalMemories === visualMemoryExamples.length && memoryAnalysis.averageClarity > 0,
      message: "Memory analyzer produces successful pattern and clarity signals.",
    },
    {
      name: "Visual memory evolution",
      passed: createMemoryEvolutionRecords(visualMemoryExamples).length > 0,
      message: "Memory evolution produces suggestion-only knowledge notes.",
    },
  ];

  return { passed: checks.every((check) => check.passed), checks };
}
