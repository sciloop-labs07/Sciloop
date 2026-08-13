import { fourierTransformRecipe, heatToOrganizedEnergyRecipe } from "@/src/visual-engine/foundation";

import type { VisualMemory } from "./visualMemory.types";
import { calculateMemoryScore, emptyFeedbackSummary, generateMemoryId, normalizeConceptKey } from "./visualMemoryUtils";

const createdAt = "2026-06-20T12:00:00.000Z";

export const visualMemoryExamples: VisualMemory[] = [
  {
    id: generateMemoryId("Fourier Transform", fourierTransformRecipe.id),
    category: "successful-explanation",
    concept: "Fourier Transform",
    conceptKey: normalizeConceptKey("Fourier Transform"),
    recipeId: fourierTransformRecipe.id,
    patternId: "signal-decomposition",
    engineId: "svg-motion",
    audience: "student",
    clarityScore: 4.6,
    usefulnessScore: 4.7,
    successfulAnalogies: ["separating a musical chord into individual notes"],
    feedbackSummary: { ...emptyFeedbackSummary(), totalCount: 5, averageClarity: 4.6, averageUsefulness: 4.7 },
    score: calculateMemoryScore(4.6, 4.7, 5),
    snapshot: { recipe: fourierTransformRecipe, title: fourierTransformRecipe.title, visualType: fourierTransformRecipe.visualType, explanation: fourierTransformRecipe.explanation.simple, capturedAt: createdAt },
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: generateMemoryId("Heat to Organized Energy", heatToOrganizedEnergyRecipe.id),
    category: "successful-explanation",
    concept: "Heat to Organized Energy",
    conceptKey: normalizeConceptKey("Heat to Organized Energy"),
    recipeId: heatToOrganizedEnergyRecipe.id,
    patternId: "energy-flow",
    engineId: "canvas-2d",
    audience: "student",
    clarityScore: 4.3,
    usefulnessScore: 4.5,
    successfulAnalogies: ["random crowd movement becoming an organized line"],
    feedbackSummary: { ...emptyFeedbackSummary(), totalCount: 4, averageClarity: 4.3, averageUsefulness: 4.5 },
    score: calculateMemoryScore(4.3, 4.5, 4),
    snapshot: { recipe: heatToOrganizedEnergyRecipe, title: heatToOrganizedEnergyRecipe.title, visualType: heatToOrganizedEnergyRecipe.visualType, explanation: heatToOrganizedEnergyRecipe.explanation.simple, capturedAt: createdAt },
    createdAt,
    updatedAt: createdAt,
  },
];
