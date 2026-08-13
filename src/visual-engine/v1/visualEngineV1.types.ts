import type { AITranslatorResult } from "@/src/visual-engine/ai";
import type { VisualFeedback } from "@/src/visual-engine/feedback";
import type { VisualMemory } from "@/src/visual-engine/memory";

export type VisualEngineV1Status = "ready" | "warning" | "broken" | "demo-only";

export type VisualEngineV1ModuleId =
  | "visual-language"
  | "visual-recipes"
  | "renderer"
  | "patterns"
  | "engine-router"
  | "tech-lab"
  | "ai-translator"
  | "feedback"
  | "feedback-storage"
  | "visual-memory"
  | "health-check";

export interface VisualEngineV1ModuleStatus {
  id: VisualEngineV1ModuleId;
  name: string;
  status: VisualEngineV1Status;
  description: string;
  readyNow: boolean;
  demoMode: boolean;
  warnings: string[];
  nextUpgrade?: string;
}

export interface VisualEngineV1PipelineStep {
  id: string;
  title: string;
  description: string;
  input: string;
  output: string;
  moduleId: VisualEngineV1ModuleId;
}

export interface VisualEngineV1DemoConcept {
  id: string;
  title: string;
  userPrompt: string;
  expectedPattern: string;
  expectedEngine: string;
  explanationGoal: string;
  audience: "kid" | "beginner" | "intermediate" | "advanced";
  domain: "math" | "physics" | "energy" | "global-problems" | "innovation" | "ai" | "education" | "general";
}

export interface VisualEngineV1HealthResult {
  status: VisualEngineV1Status;
  modules: VisualEngineV1ModuleStatus[];
  checks: Array<{ id: string; label: string; passed: boolean; warning?: string; error?: string }>;
  warnings: string[];
  errors: string[];
}

export interface VisualEngineV1PipelineInput {
  rawText: string;
  targetAudience?: string;
  difficulty?: string;
  memories?: VisualMemory[];
}

export interface VisualEngineV1PipelineResult {
  ok: boolean;
  mode: "mock-demo-safe" | "forloop-api";
  input: VisualEngineV1PipelineInput;
  translation: AITranslatorResult;
  recipe: AITranslatorResult["recipe"];
  selectedPattern: AITranslatorResult["selectedPattern"];
  selectedEngine: AITranslatorResult["selectedEngine"];
  validationErrors: string[];
  warnings: string[];
  feedbackMetadata: { count: number; items: VisualFeedback[] };
  memoryMetadata: { count: number; matched?: VisualMemory; summary: string };
}
