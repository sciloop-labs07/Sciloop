import type { VisualFeedback, VisualFeedbackSummary } from "@/src/visual-engine/feedback";
import { analyzeFeedback } from "@/src/visual-engine/feedback";
import type { VisualRecipe } from "@/src/visual-engine/foundation";

import type { MemoryScore, VisualMemory } from "./visualMemory.types";

export const visualMemoryStorageKey = "sciloop.visual.memory.v1";
export const visualMemoryUpdatedEvent = "sciloop-visual-memory-updated";

export function normalizeConceptKey(concept: string) {
  return concept.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

export function generateMemoryId(concept: string, recipeId: string) {
  return `memory-${normalizeConceptKey(concept).replace(/\s+/g, "-").slice(0, 48)}-${recipeId}`;
}

export function calculateMemoryScore(clarity: number, usefulness: number, feedbackCount: number): MemoryScore {
  const average = (clarity + usefulness) / 2;
  return {
    clarity,
    usefulness,
    feedbackCount,
    confidence: Math.round(Math.min(0.98, 0.5 + feedbackCount * 0.08 + average * 0.06) * 100) / 100,
    successRate: Math.round((average / 5) * 100),
  };
}

export function extractAnalogies(feedback: VisualFeedback[]) {
  return [...new Set(feedback.flatMap((item) => {
    const analogies: string[] = [];
    if (item.selectedImprovements.includes("add-real-life-example")) analogies.push("real-life example");
    const match = item.freeText?.match(/(?:like|analogy|example:?)\s+([^.!?]+)/i);
    if (match?.[1]) analogies.push(match[1].trim().slice(0, 120));
    return analogies;
  }))];
}

export function isSuccessfulFeedback(feedback: VisualFeedback) {
  return feedback.clarityScore >= 4 && feedback.usefulnessScore >= 4 && !["confusing", "failed"].includes(feedback.rating);
}

export function createMemoryFromFeedback(feedback: VisualFeedback[], recipe?: VisualRecipe): VisualMemory | undefined {
  const successful = feedback.filter(isSuccessfulFeedback);
  if (successful.length === 0) return undefined;
  const latest = successful[0];
  const analysis = analyzeFeedback(successful);
  const clarity = analysis.summary.averageClarity;
  const usefulness = analysis.summary.averageUsefulness;
  const now = new Date().toISOString();

  return {
    id: generateMemoryId(latest.concept, latest.recipeId),
    category: "successful-explanation",
    concept: latest.concept,
    conceptKey: normalizeConceptKey(latest.concept),
    recipeId: latest.recipeId,
    patternId: latest.patternId,
    engineId: latest.engineId,
    audience: latest.audienceLevel ?? "general",
    clarityScore: clarity,
    usefulnessScore: usefulness,
    successfulAnalogies: extractAnalogies(successful),
    feedbackSummary: analysis.summary,
    score: calculateMemoryScore(clarity, usefulness, successful.length),
    snapshot: {
      recipe,
      title: recipe?.title ?? latest.concept,
      visualType: recipe?.visualType ?? latest.visualType,
      explanation: recipe?.explanation.simple ?? latest.freeText ?? "Successful visual explanation.",
      capturedAt: now,
    },
    createdAt: now,
    updatedAt: now,
  };
}

export function isVisualMemory(value: unknown): value is VisualMemory {
  if (!value || typeof value !== "object") return false;
  const memory = value as Partial<VisualMemory>;
  return typeof memory.id === "string"
    && typeof memory.concept === "string"
    && typeof memory.conceptKey === "string"
    && typeof memory.recipeId === "string"
    && typeof memory.patternId === "string"
    && typeof memory.engineId === "string"
    && typeof memory.clarityScore === "number"
    && typeof memory.usefulnessScore === "number"
    && Array.isArray(memory.successfulAnalogies)
    && typeof memory.createdAt === "string"
    && typeof memory.updatedAt === "string";
}

export function emptyFeedbackSummary(): VisualFeedbackSummary {
  return {
    totalCount: 0,
    averageClarity: 0,
    averageComplexity: 0,
    averageMotion: 0,
    averageUsefulness: 0,
    byPattern: {},
    byEngine: {},
    byRecipe: {},
  };
}
