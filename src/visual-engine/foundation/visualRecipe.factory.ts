import {
  visualRecipeDefaultAssessment,
  visualRecipeDefaultExplanation,
  visualRecipeDefaultFallback,
  visualRecipeDefaultMetadata,
} from "./visualRecipe.schema";
import type {
  VisualRecipe,
  VisualRecipeAssessment,
  VisualRecipeEngineRecommendation,
  VisualRecipeFallback,
  VisualRecipeInteraction,
  VisualRecipeLayer,
  VisualRecipeObject,
  VisualRecipeRelation,
} from "./visualRecipe.types";
import type {
  VisualAtomType,
  VisualFeedbackLoop,
  VisualFlow,
  VisualTransformation,
} from "./visualTypes";

export function createLayer(input: VisualRecipeLayer): VisualRecipeLayer {
  return input;
}

export function createObject(input: VisualRecipeObject): VisualRecipeObject {
  return input;
}

export function createRelation(input: VisualRecipeRelation): VisualRecipeRelation {
  return input;
}

export function createFlow(input: VisualFlow): VisualFlow {
  return input;
}

export function createTransformation(input: VisualTransformation): VisualTransformation {
  return input;
}

export function createFeedbackLoop(input: VisualFeedbackLoop): VisualFeedbackLoop {
  return input;
}

export function createEngineRecommendation(
  input: VisualRecipeEngineRecommendation,
): VisualRecipeEngineRecommendation {
  return input;
}

export function createFallback(input: VisualRecipeFallback): VisualRecipeFallback {
  return input;
}

export function createAssessment(input: VisualRecipeAssessment): VisualRecipeAssessment {
  return input;
}

export function createInteraction(input: VisualRecipeInteraction): VisualRecipeInteraction {
  return input;
}

/**
 * Factory for consistent Visual Recipe objects.
 *
 * Future AI translators should prefer this shape: provide controlled atoms,
 * layers, objects, relations, explanation, fallback, and renderer
 * recommendations. The renderer later decides how to draw it.
 */
export function createVisualRecipe(input: Omit<VisualRecipe, "metadata"> & {
  metadata?: VisualRecipe["metadata"];
}): VisualRecipe {
  const atoms = new Set<VisualAtomType>(input.atomsUsed);
  input.layers.forEach((layer) => layer.atomsUsed.forEach((atom) => atoms.add(atom)));
  input.objects.forEach((object) => atoms.add(object.atom));
  input.relations.forEach((relation) => atoms.add(relation.atom));
  input.flows.forEach(() => atoms.add("flow"));
  input.transformations.forEach(() => atoms.add("transformation"));
  input.feedbackLoops.forEach(() => atoms.add("feedback"));
  input.interactions.forEach(() => atoms.add("interaction"));

  return {
    ...input,
    metadata: input.metadata ?? { ...visualRecipeDefaultMetadata },
    atomsUsed: [...atoms],
    explanation: input.explanation ?? { ...visualRecipeDefaultExplanation },
    fallback: input.fallback ?? { ...visualRecipeDefaultFallback },
    assessment: input.assessment ?? { ...visualRecipeDefaultAssessment },
  };
}

