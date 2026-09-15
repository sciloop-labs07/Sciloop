import type {
  VisualAtomType,
  VisualRecipeVisualType,
} from "@/src/visual-engine/foundation";

import { allVisualPatterns, getPatternsByAtom, getPatternsByVisualType } from "./visualPatternRegistry";
import type {
  VisualPattern,
  VisualPatternCandidate,
  VisualPatternMatchInput,
} from "./visualPattern.types";
import { normalizePatternInput } from "./visualPatternUtils";

const keywordPatternRules: Array<{
  keywords: string[];
  patternIds: VisualPattern["id"][];
  reason: string;
}> = [
  {
    keywords: ["noise", "signal", "wave", "frequency", "fourier"],
    patternIds: ["signal-decomposition"],
    reason: "Signal, wave, or frequency language maps to Signal Decomposition.",
  },
  {
    keywords: ["heat", "energy", "motion", "flow"],
    patternIds: ["energy-flow", "random-to-organized"],
    reason: "Energy and flow language maps to Energy Flow and Random -> Organized.",
  },
  {
    keywords: ["gravity", "magnet", "magnetic", "influence", "field"],
    patternIds: ["field-influence"],
    reason: "Invisible influence language maps to Field Influence.",
  },
  {
    keywords: ["problem", "issue", "bottleneck", "challenge"],
    patternIds: ["problem-solution"],
    reason: "Challenge language maps to Problem -> Solution.",
  },
  {
    keywords: ["feedback", "loop", "improve", "evolve", "iterate"],
    patternIds: ["system-feedback-loop"],
    reason: "Loop and improvement language maps to System Feedback Loop.",
  },
  {
    keywords: ["data", "insight", "understanding", "complexity"],
    patternIds: ["compression-of-complexity", "random-to-organized"],
    reason: "Understanding and complexity language maps to compression or ordering patterns.",
  },
  {
    keywords: ["invention", "innovation", "product", "pipeline"],
    patternIds: ["innovation-pipeline"],
    reason: "Invention and product language maps to Innovation Pipeline.",
  },
  {
    keywords: ["local", "global", "impact", "scale"],
    patternIds: ["local-action-global-impact", "network-growth"],
    reason: "Scale and impact language maps to local-to-global and network patterns.",
  },
];

function addCandidate(
  candidates: Map<string, VisualPatternCandidate>,
  pattern: VisualPattern,
  score: number,
  reason: string,
) {
  const existing = candidates.get(pattern.id);
  if (existing) {
    existing.score += score;
    existing.reasons.push(reason);
    return;
  }
  candidates.set(pattern.id, { pattern, score, reasons: [reason] });
}

export function rankPatternCandidates(candidates: VisualPatternCandidate[], input: VisualPatternMatchInput | string) {
  const terms = typeof input === "string" ? normalizePatternInput(input) : normalizePatternInput(input.concept ?? input.keywords);
  const termSet = new Set(terms);

  return candidates
    .map((candidate) => {
      const directKeywordScore = candidate.pattern.whenToUse.reduce((score, useCase) => {
        return score + useCase.keywords.filter((keyword) => termSet.has(keyword)).length;
      }, 0);
      const tagScore = candidate.pattern.tags.filter((tag) => termSet.has(tag)).length;
      return {
        ...candidate,
        score: candidate.score + directKeywordScore * 2 + tagScore,
      };
    })
    .sort((a, b) => b.score - a.score || a.pattern.name.localeCompare(b.pattern.name));
}

export function suggestPatternByKeywords(keywords: string[] | string) {
  const terms = normalizePatternInput(keywords);
  const termSet = new Set(terms);
  const candidates = new Map<string, VisualPatternCandidate>();

  keywordPatternRules.forEach((rule) => {
    const matches = rule.keywords.filter((keyword) => termSet.has(keyword));
    if (matches.length === 0) return;

    rule.patternIds.forEach((patternId) => {
      const pattern = allVisualPatterns.find((candidate) => candidate.id === patternId);
      if (pattern) {
        addCandidate(candidates, pattern, matches.length * 5, rule.reason);
      }
    });
  });

  allVisualPatterns.forEach((pattern) => {
    pattern.whenToUse.forEach((useCase) => {
      const matches = useCase.keywords.filter((keyword) => termSet.has(keyword));
      if (matches.length > 0) {
        addCandidate(candidates, pattern, matches.length * 2, `Matched pattern keywords: ${matches.join(", ")}.`);
      }
    });
  });

  return rankPatternCandidates([...candidates.values()], { keywords: terms });
}

export function suggestPatternByVisualType(visualType: VisualRecipeVisualType) {
  return getPatternsByVisualType(visualType).map((pattern) => ({
    pattern,
    score: 4,
    reasons: [`Pattern supports visual type ${visualType}.`],
  }));
}

export function suggestPatternByAtoms(atoms: VisualAtomType[]) {
  const candidates = new Map<string, VisualPatternCandidate>();

  atoms.forEach((atom) => {
    getPatternsByAtom(atom).forEach((pattern) => {
      addCandidate(candidates, pattern, 2, `Pattern uses atom ${atom}.`);
    });
  });

  return rankPatternCandidates([...candidates.values()], { atoms });
}

export function suggestPatternsForConcept(input: VisualPatternMatchInput | string) {
  const matchInput: VisualPatternMatchInput = typeof input === "string" ? { concept: input } : input;
  const candidates = new Map<string, VisualPatternCandidate>();

  suggestPatternByKeywords([...(matchInput.keywords ?? []), ...(normalizePatternInput(matchInput.concept))]).forEach((candidate) => {
    addCandidate(candidates, candidate.pattern, candidate.score, candidate.reasons.join(" "));
  });

  if (matchInput.visualType) {
    suggestPatternByVisualType(matchInput.visualType).forEach((candidate) => {
      addCandidate(candidates, candidate.pattern, candidate.score, candidate.reasons.join(" "));
    });
  }

  if (matchInput.atoms) {
    suggestPatternByAtoms(matchInput.atoms).forEach((candidate) => {
      addCandidate(candidates, candidate.pattern, candidate.score, candidate.reasons.join(" "));
    });
  }

  if (matchInput.tags) {
    const tags = new Set(matchInput.tags.map((tag) => tag.toLowerCase()));
    allVisualPatterns.forEach((pattern) => {
      const matches = pattern.tags.filter((tag) => tags.has(tag.toLowerCase()));
      if (matches.length > 0) {
        addCandidate(candidates, pattern, matches.length * 2, `Matched tags: ${matches.join(", ")}.`);
      }
    });
  }

  return rankPatternCandidates([...candidates.values()], matchInput).slice(0, 5);
}
