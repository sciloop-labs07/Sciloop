import { translateWithMockAI } from "./ai";
import { visualEngines } from "./engines";
import { analyzeFeedback, feedbackStorageManager } from "./feedback";
import { validateVisualRecipe, visualLanguageAtoms, visualRecipeExamples } from "./foundation";
import { allVisualPatterns } from "./patterns";
import { visualTechDemos } from "./visual-tech-lab";
import { createMemoryEvolutionRecords, getAllMemories, getVisualMemoryHealth } from "./memory";

export type VisualEngineHealthStatus = "healthy" | "warning" | "broken";

export interface VisualEngineHealthCheckItem {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
}

export interface VisualEngineHealthResult {
  status: VisualEngineHealthStatus;
  checks: VisualEngineHealthCheckItem[];
  warnings: string[];
  errors: string[];
  counts: {
    atoms: number;
    recipeExamples: number;
    patterns: number;
    engines: number;
    techLabDemos: number;
    memories: number;
  };
}

/**
 * Lightweight, deterministic health check for the controlled Visual Engine.
 * It performs no network calls, storage writes, or external AI requests.
 */
export function runVisualEngineHealthCheck(): VisualEngineHealthResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const invalidRecipes = visualRecipeExamples.filter((recipe) => !validateVisualRecipe(recipe).ok);
  const missingCriticalFallbacks = visualRecipeExamples.filter((recipe) => {
    const engine = visualEngines.find((candidate) => candidate.id === recipe.engineRecommendation.primary);
    return !engine || (engine.id !== "react-tailwind" && engine.fallbackEngineIds.length === 0);
  });

  let mockTranslatorAvailable = false;
  try {
    mockTranslatorAvailable = validateVisualRecipe(translateWithMockAI("Explain gravity visually").recipe).ok;
  } catch (error) {
    errors.push(`Mock translator failed: ${error instanceof Error ? error.message : "unknown error"}`);
  }

  let feedbackAnalyzerAvailable = false;
  let feedbackExportAvailable = false;
  const storageHealth = feedbackStorageManager.getArchitectureHealth();
  const memories = getAllMemories();
  const memoryHealth = getVisualMemoryHealth();
  const memoryEvolutionAvailable = Array.isArray(createMemoryEvolutionRecords(memories));
  try {
    const storedFeedback = feedbackStorageManager.getAllFeedback();
    feedbackAnalyzerAvailable = analyzeFeedback(storedFeedback).summary.totalCount === storedFeedback.length;
    feedbackExportAvailable = Array.isArray(JSON.parse(feedbackStorageManager.exportFeedback()));
  } catch (error) {
    errors.push(`Feedback analyzer failed: ${error instanceof Error ? error.message : "unknown error"}`);
  }

  if (invalidRecipes.length > 0) errors.push(`${invalidRecipes.length} example recipe(s) are invalid.`);
  if (missingCriticalFallbacks.length > 0) errors.push(`${missingCriticalFallbacks.length} critical example route(s) lack a fallback.`);
  if (visualTechDemos.some((demo) => demo.demoMode === "placeholder" && demo.installed)) {
    warnings.push("Some installed frontier technologies remain intentional placeholders.");
  }
  if (!storageHealth.database.available) {
    warnings.push(`Database feedback storage is unavailable: ${storageHealth.database.reason}.`);
  }

  const checks: VisualEngineHealthCheckItem[] = [
    { id: "atoms", label: "Visual language atoms", ok: visualLanguageAtoms.length > 0, detail: `${visualLanguageAtoms.length} controlled atoms` },
    { id: "recipes", label: "Example recipes", ok: invalidRecipes.length === 0, detail: `${visualRecipeExamples.length - invalidRecipes.length}/${visualRecipeExamples.length} valid` },
    { id: "patterns", label: "Pattern library", ok: allVisualPatterns.length > 0, detail: `${allVisualPatterns.length} reusable patterns` },
    { id: "engines", label: "Engine registry", ok: visualEngines.length > 0, detail: `${visualEngines.length} routed engines` },
    { id: "tech-lab", label: "Tech Frontier Lab", ok: visualTechDemos.length > 0, detail: `${visualTechDemos.length} comparable demos` },
    { id: "translator", label: "Mock translator", ok: mockTranslatorAvailable, detail: mockTranslatorAvailable ? "Safe mock translation available" : "Mock translation unavailable" },
    { id: "feedback", label: "Feedback analyzer", ok: feedbackAnalyzerAvailable, detail: feedbackAnalyzerAvailable ? "Stored or empty feedback handled safely" : "Feedback analyzer unavailable" },
    { id: "feedback-adapter", label: "Feedback adapter", ok: storageHealth.active.available, detail: "Storage manager resolves local or memory safely" },
    {
      id: "local-storage",
      label: "Local feedback adapter",
      ok: storageHealth.local.available || storageHealth.local.fallback === "memory",
      detail: "Browser local storage with SSR-safe memory fallback",
    },
    { id: "memory-storage", label: "Memory feedback fallback", ok: storageHealth.memory.available, detail: "In-memory fallback available" },
    {
      id: "database-storage",
      label: "Database feedback adapter",
      ok: !storageHealth.database.available && storageHealth.database.reason === "No database configured yet",
      detail: storageHealth.database.available ? "Database connected" : "Safe unavailable placeholder",
    },
    { id: "feedback-export", label: "Feedback export", ok: feedbackExportAvailable, detail: feedbackExportAvailable ? "Valid JSON export available" : "Feedback export failed" },
    { id: "visual-memory", label: "Visual memory store", ok: memoryHealth.available, detail: "Local-first memory store available" },
    { id: "memory-integrity", label: "Visual memory integrity", ok: memoryHealth.integrityValid, detail: "Stored memories pass controlled validation" },
    { id: "memory-evolution", label: "Memory evolution", ok: memoryEvolutionAvailable, detail: "Rule-based evolution notes available" },
    { id: "fallbacks", label: "Critical fallbacks", ok: missingCriticalFallbacks.length === 0, detail: missingCriticalFallbacks.length === 0 ? "All examples have safe routes" : `${missingCriticalFallbacks.length} missing` },
  ];

  checks.filter((check) => !check.ok).forEach((check) => {
    if (!errors.some((error) => error.includes(check.label))) errors.push(`${check.label}: ${check.detail}`);
  });

  return {
    status: errors.length > 0 ? "broken" : warnings.length > 0 ? "warning" : "healthy",
    checks,
    warnings,
    errors,
    counts: {
      atoms: visualLanguageAtoms.length,
      recipeExamples: visualRecipeExamples.length,
      patterns: allVisualPatterns.length,
      engines: visualEngines.length,
      techLabDemos: visualTechDemos.length,
      memories: memories.length,
    },
  };
}
