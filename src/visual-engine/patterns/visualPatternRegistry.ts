import type {
  VisualAtomType,
  VisualRecipeVisualType,
} from "@/src/visual-engine/foundation";

import { visualPatterns } from "./visualPatterns";
import type {
  VisualPatternCategory,
  VisualPatternId,
  VisualPatternSummary,
} from "./visualPattern.types";
import { getPatternPrimaryEngine } from "./visualPatternUtils";

export const allVisualPatterns = visualPatterns;

export function getPatternById(patternId: VisualPatternId) {
  return allVisualPatterns.find((pattern) => pattern.id === patternId);
}

export function getPatternsByCategory(category: VisualPatternCategory) {
  return allVisualPatterns.filter((pattern) => pattern.category === category);
}

export function getPatternsByVisualType(visualType: VisualRecipeVisualType) {
  return allVisualPatterns.filter((pattern) => pattern.visualType === visualType);
}

export function getPatternsByAtom(atom: VisualAtomType) {
  return allVisualPatterns.filter((pattern) => pattern.atomsUsed.includes(atom));
}

export function getPatternsByTag(tag: string) {
  const normalizedTag = tag.toLowerCase();
  return allVisualPatterns.filter((pattern) => pattern.tags.some((patternTag) => patternTag.toLowerCase() === normalizedTag));
}

export function listAllPatternIds(): VisualPatternId[] {
  return allVisualPatterns.map((pattern) => pattern.id);
}

export function listPatternSummaries(): VisualPatternSummary[] {
  return allVisualPatterns.map((pattern) => ({
    id: pattern.id,
    name: pattern.name,
    shortDescription: pattern.shortDescription,
    category: pattern.category,
    visualType: pattern.visualType,
    primaryEngine: getPatternPrimaryEngine(pattern),
    exampleConcepts: pattern.exampleConcepts,
  }));
}
