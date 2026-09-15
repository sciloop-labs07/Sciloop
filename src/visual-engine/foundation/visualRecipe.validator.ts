import type { VisualRecipe } from "./visualRecipe.types";

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

type RuntimeVisualRecipe = Partial<VisualRecipe> | null | undefined;

function objectIds(recipe: RuntimeVisualRecipe) {
  return new Set(Array.isArray(recipe?.objects) ? recipe.objects.map((object) => object.id) : []);
}

export function validateRecipeRelations(recipe: RuntimeVisualRecipe): string[] {
  if (!Array.isArray(recipe?.relations)) return ["Recipe relations must be an array."];
  const ids = objectIds(recipe);
  return recipe.relations.flatMap((relation) => {
    const errors: string[] = [];
    if (!ids.has(relation.fromObjectId)) {
      errors.push(`Relation "${relation.id}" points from missing object "${relation.fromObjectId}".`);
    }
    if (!ids.has(relation.toObjectId)) {
      errors.push(`Relation "${relation.id}" points to missing object "${relation.toObjectId}".`);
    }
    return errors;
  });
}

export function validateRecipeFlows(recipe: RuntimeVisualRecipe): string[] {
  if (!Array.isArray(recipe?.flows)) return ["Recipe flows must be an array."];
  const ids = objectIds(recipe);
  return recipe.flows.flatMap((flow) => {
    const errors: string[] = [];
    if (!hasText(flow.source)) {
      errors.push(`Flow "${flow.id}" is missing a source.`);
    } else if (!ids.has(flow.source)) {
      errors.push(`Flow "${flow.id}" source "${flow.source}" does not match a recipe object.`);
    }
    if (!hasText(flow.target)) {
      errors.push(`Flow "${flow.id}" is missing a target.`);
    } else if (!ids.has(flow.target)) {
      errors.push(`Flow "${flow.id}" target "${flow.target}" does not match a recipe object.`);
    }
    return errors;
  });
}

export function validateRecipeFallback(recipe: RuntimeVisualRecipe): string[] {
  const errors: string[] = [];
  if (!recipe?.fallback) {
    return ["Recipe is missing fallback."];
  }
  if (!hasText(recipe.fallback.title)) errors.push("Fallback is missing title.");
  if (!hasText(recipe.fallback.description)) errors.push("Fallback is missing description.");
  if (!hasText(recipe.fallback.messageForUser)) errors.push("Fallback is missing messageForUser.");
  return errors;
}

export function getRecipeValidationErrors(recipe: RuntimeVisualRecipe): string[] {
  const errors: string[] = [];

  if (!recipe || typeof recipe !== "object") return ["Visual recipe is missing or invalid."];
  if (!hasText(recipe.id)) errors.push("Recipe is missing id.");
  if (!hasText(recipe.title)) errors.push("Recipe is missing title.");
  if (!hasText(recipe.concept)) errors.push("Recipe is missing concept.");
  if (!hasText(recipe.visualType)) errors.push("Recipe is missing visualType.");
  if (!Array.isArray(recipe.layers) || recipe.layers.length === 0) {
    errors.push("Recipe must have at least one layer.");
  }
  if (!Array.isArray(recipe.objects) || recipe.objects.length === 0) {
    errors.push("Recipe must have at least one object.");
  }
  if (!recipe.engineRecommendation) {
    errors.push("Recipe is missing engineRecommendation.");
  } else if (!hasText(recipe.engineRecommendation.primary)) {
    errors.push("Engine recommendation is missing primary engine.");
  }

  errors.push(...validateRecipeRelations(recipe));
  errors.push(...validateRecipeFlows(recipe));
  errors.push(...validateRecipeFallback(recipe));

  return errors;
}

export function validateVisualRecipe(recipe: RuntimeVisualRecipe) {
  const errors = getRecipeValidationErrors(recipe);
  return {
    ok: errors.length === 0,
    errors,
  };
}

export function isValidVisualRecipe(recipe: RuntimeVisualRecipe) {
  return validateVisualRecipe(recipe).ok;
}
