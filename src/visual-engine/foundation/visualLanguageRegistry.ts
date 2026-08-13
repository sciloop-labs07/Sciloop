import { randomInformationToUnderstandingDemo } from "./demoVisualLanguageObject";
import { visualLanguageAtoms } from "./visualLanguage";
import {
  suggestedVisualFormsByAtom,
  visualSemanticRules,
} from "./visualSemantics";
import type { VisualAtom, VisualAtomType } from "./visualTypes";

export const visualAtomRegistry = Object.fromEntries(
  visualLanguageAtoms.map((atom) => [atom.id, atom]),
) as unknown as Record<VisualAtomType, VisualAtom>;

export function getVisualAtom(type: VisualAtomType) {
  return visualAtomRegistry[type];
}

export function getSemanticRulesForAtom(type: VisualAtomType) {
  return visualSemanticRules.filter((rule) =>
    (rule.appliesTo as readonly VisualAtomType[]).includes(type),
  );
}

export function getSuggestedVisualForm(type: VisualAtomType) {
  return suggestedVisualFormsByAtom[type];
}

/**
 * Single foundation registry for future recipe schemas, AI translators, and
 * renderers. It centralizes the controlled language so every later layer uses
 * the same atoms, semantic rules, visual forms, and examples.
 */
export const visualLanguageRegistry = {
  atoms: visualLanguageAtoms,
  atomsByType: visualAtomRegistry,
  semanticRules: visualSemanticRules,
  suggestedVisualForms: suggestedVisualFormsByAtom,
  examples: {
    randomInformationToUnderstanding: randomInformationToUnderstandingDemo,
  },
  getAtom: getVisualAtom,
  getSemanticRulesForAtom,
  getSuggestedVisualForm,
} as const;
