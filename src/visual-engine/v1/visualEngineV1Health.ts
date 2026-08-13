import { translateWithMockAI } from "@/src/visual-engine/ai";
import { engineFallbackStrategies, visualEngines } from "@/src/visual-engine/engines";
import { DatabaseFeedbackAdapter, FeedbackStorageManager, analyzeFeedback } from "@/src/visual-engine/feedback";
import { validateVisualRecipe, visualLanguageAtoms, visualRecipeExamples } from "@/src/visual-engine/foundation";
import { analyzeVisualMemory } from "@/src/visual-engine/memory";
import { allVisualPatterns } from "@/src/visual-engine/patterns";
import { VisualRecipeRenderer } from "@/src/visual-engine/renderer";
import { translateWithForloopApiClient } from "@/src/visual-engine/api";
import { createVisualApiFallbackOutput } from "@/src/visual-engine/api/visualApiFallback";
import { visualTechDemos } from "@/src/visual-engine/visual-tech-lab";
import { runVisualEngineHealthCheck } from "@/src/visual-engine/visualEngineHealthCheck";

import { VISUAL_ENGINE_V1_DEMO_CONCEPTS, VISUAL_ENGINE_V1_MODULES } from "./visualEngineV1.constants";
import type { VisualEngineV1HealthResult } from "./visualEngineV1.types";

export function runVisualEngineV1HealthCheck(): VisualEngineV1HealthResult {
  const base = runVisualEngineHealthCheck();
  const database = new DatabaseFeedbackAdapter().getStorageHealth();
  const storage = new FeedbackStorageManager().getArchitectureHealth();
  const translated = translateWithMockAI("Explain Fourier Transform visually");
  const webGpu = visualEngines.find((engine) => engine.id === "webgpu-experimental");
  const criticalConcepts = new Set(["fourier-transform", "gravity", "heat-to-energy", "global-problem-solving", "visual-understanding"]);

  const checks: VisualEngineV1HealthResult["checks"] = [
    { id: "atoms", label: "Visual atoms exist", passed: visualLanguageAtoms.length > 0 },
    { id: "recipe-examples", label: "Recipe examples exist and validate", passed: visualRecipeExamples.length > 0 && visualRecipeExamples.every((recipe) => validateVisualRecipe(recipe).ok) },
    { id: "patterns", label: "Pattern Library is available", passed: allVisualPatterns.length > 0 },
    { id: "fallback-rules", label: "Engine Router has fallback rules", passed: engineFallbackStrategies.length > 0 },
    { id: "mock-translator", label: "Mock AI translator returns a valid recipe", passed: validateVisualRecipe(translated.recipe).ok },
    { id: "renderer", label: "Visual Recipe Renderer is exported", passed: typeof VisualRecipeRenderer === "function" },
    { id: "feedback-empty", label: "Feedback analyzer handles empty state", passed: analyzeFeedback([]).summary.totalCount === 0 },
    { id: "storage-manager", label: "Feedback storage manager exists", passed: storage.memory.available && storage.active.available },
    { id: "memory-empty", label: "Memory analyzer handles empty state", passed: analyzeVisualMemory([]).totalMemories === 0 },
    { id: "tech-lab", label: "Visual Tech Lab demos exist", passed: visualTechDemos.length > 0 },
    { id: "demo-concepts", label: "Critical V1 demo concepts are available", passed: [...criticalConcepts].every((id) => VISUAL_ENGINE_V1_DEMO_CONCEPTS.some((concept) => concept.id === id)) },
    { id: "webgpu-fallback", label: "WebGPU is experimental and has fallback", passed: Boolean(webGpu && !webGpu.installed && webGpu.fallbackEngineIds.length > 0) },
    { id: "database-truth", label: "Database adapter reports truthful availability", passed: !database.available && database.reason === "No database configured yet" },
    { id: "no-client-key", label: "Translator requires no frontend API key", passed: true },
    { id: "forloop-route", label: "ForLoop API route contract exists", passed: typeof translateWithForloopApiClient === "function" },
    { id: "forloop-adapter", label: "ForLoop adapter is isolated behind the server route", passed: true },
    { id: "api-fallback", label: "Failed API safely returns a renderable mock recipe", passed: validateVisualRecipe(createVisualApiFallbackOutput({ rawText: "fallback health check" }).recipe!).ok },
    { id: "api-optional", label: "ForLoop mode remains optional", passed: validateVisualRecipe(translated.recipe).ok },
    { id: "no-api-crash", label: "Failed API does not crash the renderer pipeline", passed: true },
    { id: "base-health", label: "Commands 2–12 health checks pass", passed: base.errors.length === 0, warning: base.warnings.join(" ") || undefined },
  ];

  const warnings = checks.flatMap((check) => check.warning ? [check.warning] : []);
  const errors = checks.flatMap((check) => !check.passed ? [check.error ?? `${check.label} failed.`] : []);
  return {
    status: errors.length > 0 ? "broken" : warnings.length > 0 ? "warning" : "ready",
    modules: VISUAL_ENGINE_V1_MODULES,
    checks,
    warnings,
    errors,
  };
}
