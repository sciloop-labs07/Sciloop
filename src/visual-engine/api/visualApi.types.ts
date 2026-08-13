import type { VisualRecipe, VisualRecipeVisualType } from "../foundation";
import type { VisualEngineId } from "../engines";
import type { VisualPatternId } from "../patterns";

export type VisualApiMode = "mock" | "forloop-api";
export type VisualApiStatus = "available" | "missing-config" | "error" | "disabled";

export interface VisualApiInput {
  rawText: string;
  topic?: string;
  sourceType?: "concept" | "news" | "question" | "lesson" | "problem" | "innovation";
  targetAudience?: "kid" | "beginner" | "intermediate" | "advanced" | "expert";
  difficulty?: "kid" | "beginner" | "intermediate" | "advanced" | "expert";
  preferredPatternId?: VisualPatternId;
  preferredVisualType?: VisualRecipeVisualType;
  preferredEngine?: VisualEngineId;
  needsMathLayer?: boolean;
  needsRealLifeExample?: boolean;
  needsInteraction?: boolean;
  language?: string;
  constraints?: string[];
}

export interface VisualApiOutput {
  ok: boolean;
  mode: VisualApiMode;
  recipe?: VisualRecipe;
  rawRecipeJson?: unknown;
  selectedPattern?: VisualPatternId;
  selectedEngine?: VisualEngineId;
  confidence?: number;
  reasoningSummary?: string;
  warnings: string[];
  validationErrors: string[];
  fallbackUsed: boolean;
  error?: string;
}

export interface ForloopApiConfigStatus {
  status: VisualApiStatus;
  providerName?: string;
  modelName?: string;
  hasServerSideKey: boolean;
  backendReachable?: boolean;
  readyProviderCount?: number;
  configuredProviderCount?: number;
  message: string;
}

export interface ForloopApiRequestPayload {
  input: VisualApiInput;
  systemPrompt: string;
  userPrompt: string;
  responseFormat: "json";
}

export interface VisualRecipeApiProvider {
  name: string;
  available(): Promise<ForloopApiConfigStatus>;
  generateVisualRecipe(input: VisualApiInput): Promise<VisualApiOutput>;
}
