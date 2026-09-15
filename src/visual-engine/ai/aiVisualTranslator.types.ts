import type {
  VisualRecipe,
  VisualRecipeDifficulty,
  VisualRecipeVisualType,
} from "@/src/visual-engine/foundation";
import type {
  EngineRoutingResult,
  VisualEngineId,
} from "@/src/visual-engine/engines";
import type {
  VisualPattern,
  VisualPatternId,
} from "@/src/visual-engine/patterns";
import type { VisualMemory } from "@/src/visual-engine/memory";

export type AITranslatorMode = "mock" | "forloop-api" | "provider" | "hybrid";
export type AITranslatorSourceType = "topic" | "concept" | "news" | "question" | "explanation" | "unknown";
export type AITranslatorAudience = "kid" | "student" | "researcher" | "builder" | "general";
export type AITranslatorComplexity = "simple" | "standard" | "advanced";

export interface AIVisualTranslatorInput {
  rawText: string;
  topic?: string;
  sourceType?: AITranslatorSourceType;
  targetAudience?: AITranslatorAudience;
  difficulty?: VisualRecipeDifficulty;
  preferredMode?: AITranslatorMode;
  preferredPatternId?: VisualPatternId;
  preferredVisualType?: VisualRecipeVisualType;
  preferredEngine?: VisualEngineId;
  needsInteraction?: boolean;
  needsMathLayer?: boolean;
  needsRealLifeExample?: boolean;
  language?: string;
  constraints?: string[];
  useVisualMemory?: boolean;
}

export interface AIRecipeDraft extends Partial<VisualRecipe> {
  rawAiJson?: unknown;
  selectedPatternId?: VisualPatternId;
  selectedEngineId?: VisualEngineId;
}

export interface AIRecipeNormalizationResult {
  recipe: VisualRecipe;
  warnings: string[];
}

export interface AIRecipeGuardrailResult {
  ok: boolean;
  warnings: string[];
  errors: string[];
}

export interface AITranslatorError {
  code: string;
  message: string;
  recoverable: boolean;
}

export interface AIVisualTranslatorOutput {
  recipe: VisualRecipe;
  selectedPattern: VisualPattern;
  selectedEngine: EngineRoutingResult;
  confidence: number;
  reasoningSummary: string;
  warnings: string[];
  fallbackUsed: boolean;
  validationErrors: string[];
  memoryUsed?: VisualMemory;
  memorySummary?: string;
}

export type AITranslatorResult = AIVisualTranslatorOutput;

export interface AITranslatorProvider {
  name: string;
  available: boolean;
  requiresServerSideKey: boolean;
  translate: (input: AIVisualTranslatorInput) => Promise<AIRecipeDraft>;
}
