import type { MemoryEvolutionRecord, VisualMemory } from "./visualMemory.types";
import { analyzeVisualMemory } from "./visualMemoryAnalyzer";

export function createMemoryEvolutionRecords(memories: VisualMemory[]): MemoryEvolutionRecord[] {
  const analysis = analyzeVisualMemory(memories);
  const now = new Date().toISOString();
  const records: MemoryEvolutionRecord[] = [];
  const topPattern = analysis.successfulPatterns[0];
  const topEngine = analysis.successfulEngines[0];
  const topAudience = analysis.successfulAudiences[0];
  const topAnalogy = analysis.successfulAnalogies[0];

  if (topPattern) records.push({
    id: `memory-evolution-pattern-${topPattern.label}`,
    concept: "Visual Pattern Library",
    statement: `${topPattern.label} is the strongest remembered pattern with ${topPattern.score}% success.`,
    evidenceCount: topPattern.evidenceCount,
    createdAt: now,
    controlledAction: "Prefer this pattern as a candidate, then keep normal validation and routing.",
  });
  if (topEngine) records.push({
    id: `memory-evolution-engine-${topEngine.label}`,
    concept: "Engine Router",
    statement: `${topEngine.label} performs best across remembered explanations.`,
    evidenceCount: topEngine.evidenceCount,
    createdAt: now,
    controlledAction: "Use this as routing context, never as an unconditional engine override.",
  });
  if (topAudience) records.push({
    id: `memory-evolution-audience-${topAudience.label}`,
    concept: "Audience",
    statement: `${topAudience.label} audiences average ${topAudience.score}% success in visual memory.`,
    evidenceCount: topAudience.evidenceCount,
    createdAt: now,
    controlledAction: "Match explanation depth to the remembered audience evidence.",
  });
  if (topAnalogy) records.push({
    id: `memory-evolution-analogy-${topAnalogy.label}`,
    concept: "Analogy",
    statement: `The analogy "${topAnalogy.label}" repeatedly supports clear explanations.`,
    evidenceCount: topAnalogy.evidenceCount,
    createdAt: now,
    controlledAction: "Offer the analogy as an optional layer when the concept matches.",
  });
  return records;
}
