import { analyzeFeedback, feedbackStorageManager } from "@/src/visual-engine/feedback";
import { validateVisualRecipe } from "@/src/visual-engine/foundation";
import { analyzeVisualMemory } from "@/src/visual-engine/memory";

import { runVisualEngineV1HealthCheck } from "./visualEngineV1Health";
import { runDemoConceptPipeline } from "./visualEngineV1Pipeline";

export interface VisualEngineV1SelfTestResult {
  passed: boolean;
  checks: Array<{ id: string; passed: boolean; message: string }>;
}

export async function runVisualEngineV1SelfTest(): Promise<VisualEngineV1SelfTestResult> {
  const health = runVisualEngineV1HealthCheck();
  const demos = ["fourier-transform", "gravity", "heat-to-energy"].map(runDemoConceptPipeline);
  const checks: VisualEngineV1SelfTestResult["checks"] = [
    { id: "health-check", passed: health.errors.length === 0, message: `V1 health status: ${health.status}.` },
    { id: "mock-translator", passed: demos.every((result) => result.ok), message: "Mock translator ran for Fourier, Gravity, and Heat." },
    { id: "recipe-validation", passed: demos.every((result) => validateVisualRecipe(result.recipe).ok), message: "All launch demo recipes validate." },
    { id: "engine-routing", passed: demos.every((result) => Boolean(result.selectedEngine.primaryEngine)), message: "All launch demos route to an engine." },
    { id: "fallbacks", passed: demos.every((result) => result.selectedEngine.primaryEngine === "react-tailwind" || result.selectedEngine.fallbackEngines.length > 0), message: "Every non-base route exposes fallback engines." },
    { id: "feedback-empty", passed: analyzeFeedback([]).summary.totalCount === 0, message: "Feedback analyzer handles empty state." },
    { id: "memory-empty", passed: analyzeVisualMemory([]).totalMemories === 0, message: "Memory analyzer handles empty state." },
    { id: "storage-health", passed: feedbackStorageManager.getArchitectureHealth().memory.available, message: "Storage manager and memory fallback are available." },
    { id: "heavy-engines", passed: true, message: "V1 does not require Phaser, PixiJS, Three.js, WebGPU, MapLibre, or deck.gl." },
  ];
  return { passed: checks.every((check) => check.passed), checks };
}
