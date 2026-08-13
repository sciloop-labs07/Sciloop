import type { VisualFeedbackSummary } from "@/src/visual-engine/feedback";
import type { VisualRecipe, VisualRecipeAudience } from "@/src/visual-engine/foundation";

export type MemoryCategory = "successful-explanation" | "pattern-success" | "engine-success" | "audience-success" | "analogy-success";

export interface MemoryScore {
  clarity: number;
  usefulness: number;
  confidence: number;
  feedbackCount: number;
  successRate: number;
}

export interface MemorySnapshot {
  recipe?: VisualRecipe;
  title: string;
  visualType: string;
  explanation: string;
  capturedAt: string;
}

export interface VisualMemory {
  id: string;
  category: MemoryCategory;
  concept: string;
  conceptKey: string;
  recipeId: string;
  patternId: string;
  engineId: string;
  audience: VisualRecipeAudience | string;
  clarityScore: number;
  usefulnessScore: number;
  successfulAnalogies: string[];
  feedbackSummary: VisualFeedbackSummary;
  score: MemoryScore;
  snapshot: MemorySnapshot;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryInsight {
  id: string;
  category: "pattern" | "engine" | "audience" | "analogy" | "concept";
  label: string;
  description: string;
  evidenceCount: number;
  score: number;
}

export interface MemoryEvolutionRecord {
  id: string;
  concept: string;
  statement: string;
  evidenceCount: number;
  createdAt: string;
  controlledAction: string;
}

export interface VisualMemoryAnalysis {
  totalMemories: number;
  averageClarity: number;
  averageUsefulness: number;
  successfulPatterns: MemoryInsight[];
  successfulEngines: MemoryInsight[];
  successfulAudiences: MemoryInsight[];
  successfulAnalogies: MemoryInsight[];
  repeatedSuccess: MemoryInsight[];
}

export interface VisualMemoryHealth {
  available: boolean;
  mode: "local-storage" | "memory";
  memoryCount: number;
  integrityValid: boolean;
  evolutionAvailable: boolean;
  reason?: string;
}
