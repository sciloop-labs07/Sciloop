import type { VisualMemory } from "./visualMemory.types";
import { getAllMemories } from "./visualMemoryStore";
import { normalizeConceptKey } from "./visualMemoryUtils";

function conceptMatches(memory: VisualMemory, concept: string) {
  const query = normalizeConceptKey(concept);
  return memory.conceptKey === query || memory.conceptKey.includes(query) || query.includes(memory.conceptKey);
}

function scoreMemory(memory: VisualMemory) {
  return memory.score.successRate + memory.score.feedbackCount * 3 + memory.score.confidence * 10;
}

export function getMemoriesForConcept(concept: string, memories = getAllMemories()) {
  return memories.filter((memory) => conceptMatches(memory, concept)).sort((a, b) => scoreMemory(b) - scoreMemory(a));
}

export function getBestMemoryForConcept(concept: string, memories = getAllMemories()) {
  return getMemoriesForConcept(concept, memories)[0];
}

export function getBestPatternForConcept(concept: string, memories = getAllMemories()) {
  return getBestMemoryForConcept(concept, memories)?.patternId;
}

export function getBestEngineForConcept(concept: string, memories = getAllMemories()) {
  return getBestMemoryForConcept(concept, memories)?.engineId;
}

export function getBestAnalogyForConcept(concept: string, memories = getAllMemories()) {
  return getMemoriesForConcept(concept, memories).flatMap((memory) => memory.successfulAnalogies)[0];
}

export function getTopSuccessfulVisuals(limit = 5, memories = getAllMemories()) {
  return [...memories].sort((a, b) => scoreMemory(b) - scoreMemory(a)).slice(0, limit);
}
