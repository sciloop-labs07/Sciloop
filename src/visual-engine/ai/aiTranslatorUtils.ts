import type { AITranslatorAudience, AITranslatorSourceType, AIVisualTranslatorInput } from "./aiVisualTranslator.types";

export function cleanTranslatorInput(input: string) {
  return input.replace(/\s+/g, " ").trim();
}

export function extractKeywordsFromInput(input: AIVisualTranslatorInput | string) {
  const text = typeof input === "string" ? input : `${input.topic ?? ""} ${input.rawText}`;
  return cleanTranslatorInput(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

export function detectLikelyConceptDomain(input: AIVisualTranslatorInput | string) {
  const keywords = new Set(extractKeywordsFromInput(input));
  if (["fourier", "frequency", "wave", "signal"].some((word) => keywords.has(word))) return "math-signal";
  if (["gravity", "mass", "field", "force"].some((word) => keywords.has(word))) return "physics-field";
  if (["heat", "energy", "particle", "motion"].some((word) => keywords.has(word))) return "energy-system";
  if (["global", "problem", "map", "solve"].some((word) => keywords.has(word))) return "global-systems";
  if (["news", "innovation", "product", "invention"].some((word) => keywords.has(word))) return "innovation-news";
  return "general-understanding";
}

export function detectAudienceLevel(input: AIVisualTranslatorInput): AITranslatorAudience {
  if (input.targetAudience) return input.targetAudience;
  const text = input.rawText.toLowerCase();
  if (text.includes("kid") || text.includes("child")) return "kid";
  if (text.includes("research")) return "researcher";
  if (text.includes("build") || text.includes("developer")) return "builder";
  if (text.includes("student")) return "student";
  return "general";
}

export function detectNeedsMathLayer(input: AIVisualTranslatorInput) {
  if (typeof input.needsMathLayer === "boolean") return input.needsMathLayer;
  const keywords = new Set(extractKeywordsFromInput(input));
  return ["fourier", "equation", "math", "frequency", "transform"].some((word) => keywords.has(word));
}

export function detectNeedsInteraction(input: AIVisualTranslatorInput) {
  if (typeof input.needsInteraction === "boolean") return input.needsInteraction;
  const keywords = new Set(extractKeywordsFromInput(input));
  return ["interactive", "slider", "drag", "explore", "choose"].some((word) => keywords.has(word));
}

export function detectSourceType(input: AIVisualTranslatorInput): AITranslatorSourceType {
  if (input.sourceType) return input.sourceType;
  const text = input.rawText.toLowerCase();
  if (text.includes("news") || text.includes("latest")) return "news";
  if (text.includes("explain")) return "explanation";
  if (text.endsWith("?")) return "question";
  return input.topic ? "topic" : "concept";
}

export function summarizeTranslatorDecision(patternName: string, engineName: string, fallbackUsed: boolean) {
  return `Selected ${patternName}, routed to ${engineName}${fallbackUsed ? ", with a safe fallback recipe" : ""}.`;
}
