import {
  createVisualRecipe,
  type VisualAtomType,
  type VisualRecipe,
} from "@/src/visual-engine/foundation";
import {
  createRecipeFromPattern,
  getPatternById,
} from "@/src/visual-engine/patterns";
import { getVisualEngine } from "@/src/visual-engine/engines";

import type {
  AIRecipeDraft,
  AIRecipeNormalizationResult,
  AIVisualTranslatorInput,
} from "./aiVisualTranslator.types";
import { createFallbackRecipeFromText } from "./aiRecipeFallback";

const supportedRelationAtoms = new Set(["edge", "cause", "effect", "feedback"]);

export function normalizeRecipeAtoms(recipe: VisualRecipe): VisualRecipe {
  const atoms = new Set<VisualAtomType>(recipe.atomsUsed);
  recipe.layers.forEach((layer) => layer.atomsUsed.forEach((atom) => atoms.add(atom)));
  recipe.objects.forEach((object) => atoms.add(object.atom));
  recipe.relations.forEach((relation) => atoms.add(relation.atom));
  recipe.flows.forEach(() => atoms.add("flow"));
  recipe.transformations.forEach(() => atoms.add("transformation"));
  recipe.feedbackLoops.forEach(() => atoms.add("feedback"));
  return { ...recipe, atomsUsed: [...atoms] };
}

export function normalizeRecipePattern(recipe: VisualRecipe): VisualRecipe {
  return recipe;
}

export function normalizeRecipeEngine(recipe: VisualRecipe): VisualRecipe {
  const primary = getVisualEngine(recipe.engineRecommendation.primary);
  if (primary) return recipe;
  return {
    ...recipe,
    engineRecommendation: {
      ...recipe.engineRecommendation,
      primary: "react-tailwind",
      alternatives: ["svg-motion"],
      reason: "Unsupported engine normalized to React + Tailwind.",
    },
  };
}

export function normalizeRecipeLayers(recipe: VisualRecipe): VisualRecipe {
  return {
    ...recipe,
    layers: recipe.layers.map((layer, index) => ({
      ...layer,
      depth: Number.isFinite(layer.depth) ? layer.depth : index,
      visibleByDefault: layer.visibleByDefault ?? true,
    })),
  };
}

export function normalizeRecipeObjects(recipe: VisualRecipe): VisualRecipe {
  const layerId = recipe.layers[0]?.id ?? "main-layer";
  return {
    ...recipe,
    objects: recipe.objects.map((object, index) => ({
      ...object,
      layerId: recipe.layers.some((layer) => layer.id === object.layerId) ? object.layerId : layerId,
      importance: object.importance ?? 0.7,
      position: object.position ?? { x: 0.15 + index * 0.25, y: 0.5 },
    })),
  };
}

export function normalizeRecipeRelations(recipe: VisualRecipe): VisualRecipe {
  const objectIds = new Set(recipe.objects.map((object) => object.id));
  return {
    ...recipe,
    relations: recipe.relations
      .filter((relation) => objectIds.has(relation.fromObjectId) && objectIds.has(relation.toObjectId))
      .map((relation) => ({
        ...relation,
        atom: supportedRelationAtoms.has(relation.atom) ? relation.atom : "edge",
        strength: Math.max(0.1, Math.min(1, relation.strength ?? 0.6)),
      })),
  };
}

export function normalizeRecipeFallback(recipe: VisualRecipe): VisualRecipe {
  if (recipe.fallback?.title && recipe.fallback.description && recipe.fallback.messageForUser) {
    return recipe;
  }
  return {
    ...recipe,
    fallback: {
      title: `${recipe.title} fallback`,
      description: "Show the idea as labeled cards connected in order.",
      safeVisualType: recipe.visualType,
      messageForUser: "Read the concept left to right through the safest visual form.",
    },
  };
}

export function fillMissingRecipeFields(draft: AIRecipeDraft, input?: AIVisualTranslatorInput): VisualRecipe {
  if (draft.id && draft.title && draft.layers?.length && draft.objects?.length && draft.engineRecommendation && draft.fallback) {
    return createVisualRecipe(draft as VisualRecipe);
  }

  const topic = draft.title ?? input?.topic ?? input?.rawText ?? "Visual Understanding";
  const patternId = draft.selectedPatternId ?? input?.preferredPatternId ?? "compression-of-complexity";
  const pattern = getPatternById(patternId);
  return pattern ? createRecipeFromPattern(pattern.id, topic) : createFallbackRecipeFromText(topic);
}

export function normalizeAIRecipeDraft(draft: AIRecipeDraft, input?: AIVisualTranslatorInput): AIRecipeNormalizationResult {
  const warnings: string[] = [];
  let recipe = fillMissingRecipeFields(draft, input);

  recipe = normalizeRecipeLayers(recipe);
  recipe = normalizeRecipeObjects(recipe);
  recipe = normalizeRecipeRelations(recipe);
  recipe = normalizeRecipeFallback(recipe);
  recipe = normalizeRecipeEngine(recipe);
  recipe = normalizeRecipeAtoms(recipe);
  recipe = normalizeRecipePattern(recipe);

  if (!draft.layers?.length || !draft.objects?.length) {
    warnings.push("Draft was incomplete, so SciLoop filled missing recipe fields from the selected pattern.");
  }

  return { recipe, warnings };
}
