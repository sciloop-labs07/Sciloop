import type { PhysicsVisualRecipe } from "./types";

export interface PhysicsRecipeIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
}

const hasText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

export function validatePhysicsVisualRecipe(recipe: PhysicsVisualRecipe | null | undefined): PhysicsRecipeIssue[] {
  if (!recipe) return [{ severity: "error", code: "missing-recipe", message: "Physics visual recipe is missing." }];

  const issues: PhysicsRecipeIssue[] = [];
  const entityIds = new Set(recipe.entities.map((entity) => entity.id));
  const quantityIds = new Set(recipe.quantities.concat(recipe.controlledVariable, recipe.measuredOutput).map((quantity) => quantity.id));

  for (const [field, value] of Object.entries(recipe)) {
    if (["entities", "causalRelations", "quantities", "evidence", "uncertainty", "sources"].includes(field)) continue;
    if (typeof value === "string" && !hasText(value)) issues.push({ severity: "error", code: "empty-field", message: `${field} must not be empty.` });
  }

  if (recipe.entities.length < 2) issues.push({ severity: "error", code: "insufficient-entities", message: "A recipe needs at least a cause and an effect entity." });
  if (!recipe.causalRelations.length) issues.push({ severity: "error", code: "missing-causality", message: "A recipe must contain at least one causal relation." });
  if (!recipe.timeline.stages.length) issues.push({ severity: "error", code: "missing-timeline", message: "A recipe must define its time or conceptual progression." });
  if (!recipe.fallback.accessibleSummary || !recipe.fallback.readingOrder.length) issues.push({ severity: "error", code: "inaccessible-fallback", message: "A fallback needs an accessible summary and reading order." });
  if (!recipe.publicRenderer.reducedMotionSafe || !recipe.canvasRenderer.reducedMotionSafe || !recipe.threeRenderer.reducedMotionSafe) issues.push({ severity: "error", code: "reduced-motion", message: "Every renderer must define reduced-motion behavior." });
  if (recipe.threeRenderer.preferred === "webgpu-experimental") issues.push({ severity: "error", code: "webgpu-public-default", message: "WebGPU must not be the preferred interactive renderer." });
  if (!recipe.sources.length) issues.push({ severity: "warning", code: "missing-sources", message: "Physics recipes should identify their scientific sources." });

  for (const relation of recipe.causalRelations) {
    if (!entityIds.has(relation.from) || !entityIds.has(relation.to)) {
      issues.push({ severity: "error", code: "invalid-relation", message: `Causal relation "${relation.id}" references an unknown entity.` });
    }
    if (!hasText(relation.directionMeaning)) issues.push({ severity: "error", code: "missing-direction", message: `Causal relation "${relation.id}" needs an explicit direction meaning.` });
  }

  for (const quantity of [recipe.controlledVariable, recipe.measuredOutput, ...recipe.quantities]) {
    if (!quantityIds.has(quantity.id)) issues.push({ severity: "error", code: "invalid-quantity", message: `Quantity "${quantity.id}" is not registered.` });
    if (!hasText(quantity.description)) issues.push({ severity: "error", code: "missing-quantity-description", message: `Quantity "${quantity.id}" needs a description.` });
  }

  for (const stage of recipe.timeline.stages) {
    for (const entityId of stage.entityIds) {
      if (!entityIds.has(entityId)) issues.push({ severity: "error", code: "invalid-stage-entity", message: `Timeline stage "${stage.id}" references an unknown entity.` });
    }
  }

  for (const entityId of recipe.fallback.readingOrder) {
    if (!entityIds.has(entityId)) issues.push({ severity: "error", code: "invalid-reading-order", message: `Fallback reading order references unknown entity "${entityId}".` });
  }

  return issues;
}

export function isValidPhysicsVisualRecipe(recipe: PhysicsVisualRecipe | null | undefined) {
  return validatePhysicsVisualRecipe(recipe).every((issue) => issue.severity !== "error");
}

