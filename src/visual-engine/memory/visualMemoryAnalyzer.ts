import type { MemoryInsight, VisualMemory, VisualMemoryAnalysis } from "./visualMemory.types";

function insightsBy(memories: VisualMemory[], key: "patternId" | "engineId" | "audience"): MemoryInsight[] {
  const groups = memories.reduce<Record<string, VisualMemory[]>>((result, memory) => {
    const id = String(memory[key]);
    (result[id] ??= []).push(memory);
    return result;
  }, {});

  return Object.entries(groups).map<MemoryInsight>(([label, items]) => {
    const score = items.reduce((sum, item) => sum + item.score.successRate, 0) / items.length;
    return {
      id: `${key}-${label}`,
      category: key === "patternId" ? "pattern" : key === "engineId" ? "engine" : "audience",
      label,
      description: `${items.length} successful visual${items.length === 1 ? "" : "s"} averaged ${Math.round(score)}% success.`,
      evidenceCount: items.length,
      score: Math.round(score),
    };
  }).sort((a, b) => b.score - a.score || b.evidenceCount - a.evidenceCount);
}

export function analyzeSuccessfulPatterns(memories: VisualMemory[]) {
  return insightsBy(memories, "patternId");
}

export function analyzeSuccessfulEngines(memories: VisualMemory[]) {
  return insightsBy(memories, "engineId");
}

export function analyzeSuccessfulAudiences(memories: VisualMemory[]) {
  return insightsBy(memories, "audience");
}

export function analyzeSuccessfulAnalogies(memories: VisualMemory[]): MemoryInsight[] {
  const counts = memories.flatMap((memory) => memory.successfulAnalogies).reduce<Record<string, number>>((result, analogy) => {
    result[analogy] = (result[analogy] ?? 0) + 1;
    return result;
  }, {});
  return Object.entries(counts).map<MemoryInsight>(([analogy, count]) => ({
    id: `analogy-${analogy}`,
    category: "analogy",
    label: analogy,
    description: `Used successfully in ${count} visual explanation${count === 1 ? "" : "s"}.`,
    evidenceCount: count,
    score: count,
  })).sort((a, b) => b.evidenceCount - a.evidenceCount);
}

export function detectRepeatedSuccess(memories: VisualMemory[]): MemoryInsight[] {
  const groups = memories.reduce<Record<string, VisualMemory[]>>((result, memory) => {
    (result[memory.conceptKey] ??= []).push(memory);
    return result;
  }, {});
  return Object.values(groups).filter((items) => items.length > 1).map<MemoryInsight>((items) => ({
    id: `concept-${items[0].conceptKey}`,
    category: "concept",
    label: items[0].concept,
    description: `${items.length} successful explanations are available for this concept.`,
    evidenceCount: items.length,
    score: Math.round(items.reduce((sum, item) => sum + item.score.successRate, 0) / items.length),
  })).sort((a, b) => b.evidenceCount - a.evidenceCount);
}

export function analyzeVisualMemory(memories: VisualMemory[]): VisualMemoryAnalysis {
  const average = (key: "clarityScore" | "usefulnessScore") => memories.length
    ? Math.round((memories.reduce((sum, memory) => sum + memory[key], 0) / memories.length) * 10) / 10
    : 0;
  return {
    totalMemories: memories.length,
    averageClarity: average("clarityScore"),
    averageUsefulness: average("usefulnessScore"),
    successfulPatterns: analyzeSuccessfulPatterns(memories),
    successfulEngines: analyzeSuccessfulEngines(memories),
    successfulAudiences: analyzeSuccessfulAudiences(memories),
    successfulAnalogies: analyzeSuccessfulAnalogies(memories),
    repeatedSuccess: detectRepeatedSuccess(memories),
  };
}
