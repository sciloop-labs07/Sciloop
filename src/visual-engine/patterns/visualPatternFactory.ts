import {
  createAssessment,
  createFallback,
  createFeedbackLoop,
  createFlow,
  createInteraction,
  createLayer,
  createObject,
  createRelation,
  createTransformation,
  createVisualRecipe,
  type VisualRecipe,
  type VisualRecipeLayer,
  type VisualRecipeObject,
  type VisualRecipeRelation,
} from "@/src/visual-engine/foundation";
import type {
  VisualFeedbackLoop,
  VisualFlow,
  VisualTransformation,
} from "@/src/visual-engine/foundation";

import { getPatternById } from "./visualPatternRegistry";
import type {
  VisualPattern,
  VisualPatternId,
  VisualPatternInteractionTemplate,
  VisualPatternLayerTemplate,
  VisualPatternObjectTemplate,
  VisualPatternRelationTemplate,
} from "./visualPattern.types";
import { getPatternFallbackEngine, getPatternPrimaryEngine } from "./visualPatternUtils";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function uniqueById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function createLayerTemplatesFromPattern(pattern: VisualPattern): VisualRecipeLayer[] {
  return uniqueById(pattern.layerTemplates).map((template: VisualPatternLayerTemplate) =>
    createLayer({
      id: template.id,
      title: template.title,
      description: template.description,
      depth: template.depth,
      atomsUsed: template.atomsUsed,
      visibleByDefault: true,
    }),
  );
}

export function createObjectsFromPattern(pattern: VisualPattern): VisualRecipeObject[] {
  const objects = uniqueById(pattern.objectTemplates);
  const count = Math.max(objects.length - 1, 1);

  return objects.map((template: VisualPatternObjectTemplate, index) =>
    createObject({
      id: template.id,
      label: template.label,
      atom: template.atom,
      layerId: template.layerId,
      description: template.description,
      position: {
        x: 0.12 + (0.76 * index) / count,
        y: 0.5,
      },
      certainty: index === 0 ? "known" : "inferred",
      importance: template.importance,
    }),
  );
}

export function createRelationsFromPattern(pattern: VisualPattern): VisualRecipeRelation[] {
  return uniqueById(pattern.relationTemplates).map((template: VisualPatternRelationTemplate) =>
    createRelation({
      id: template.id,
      fromObjectId: template.fromObjectId,
      toObjectId: template.toObjectId,
      atom: template.atom,
      label: template.label,
      description: template.description,
      strength: template.strength,
      certainty: "inferred",
    }),
  );
}

export function createFlowsFromPattern(pattern: VisualPattern): VisualFlow[] {
  return uniqueById(pattern.flowTemplates).map((template) =>
    createFlow({
      id: template.id,
      atom: "flow",
      source: template.source,
      target: template.target,
      material: template.material,
      rate: template.rate,
      label: template.label,
    }),
  );
}

export function createTransformationsFromPattern(pattern: VisualPattern): VisualTransformation[] {
  return uniqueById(pattern.transformationTemplates).map((template) =>
    createTransformation({
      id: template.id,
      atom: "transformation",
      before: template.before,
      process: template.process,
      after: template.after,
      label: template.label,
    }),
  );
}

function createInteractionsFromPattern(pattern: VisualPattern) {
  return uniqueById(pattern.interactionTemplates).map((template: VisualPatternInteractionTemplate) =>
    createInteraction({
      id: template.id,
      atom: "interaction",
      label: template.label,
      targetId: template.targetId,
      controlType: template.controlType,
      understandingEffect: template.understandingEffect,
      mode: pattern.defaultRecipeMode,
    }),
  );
}

function createFeedbackLoopsFromPattern(pattern: VisualPattern): VisualFeedbackLoop[] {
  const objectIds = pattern.objectTemplates.map((template) => template.id);
  if (!pattern.relationTemplates.some((template) => template.atom === "feedback") || objectIds.length < 2) {
    return [];
  }

  return [
    createFeedbackLoop({
      id: `${pattern.id}-feedback-loop`,
      atom: "feedback",
      nodes: objectIds,
      polarity: "amplifying",
      strength: 0.76,
      label: pattern.name,
    }),
  ];
}

export function createRecipeFromVisualPattern(pattern: VisualPattern, concept: string): VisualRecipe {
  const layers = createLayerTemplatesFromPattern(pattern);
  const objects = createObjectsFromPattern(pattern);
  const relations = createRelationsFromPattern(pattern);
  const flows = createFlowsFromPattern(pattern);
  const transformations = createTransformationsFromPattern(pattern);
  const interactions = createInteractionsFromPattern(pattern);
  const feedbackLoops = createFeedbackLoopsFromPattern(pattern);
  const conceptSlug = slugify(concept || pattern.name);

  return createVisualRecipe({
    id: `recipe-${conceptSlug}-${pattern.id}`,
    title: concept,
    concept,
    summary: `${concept} explained with the ${pattern.name} visual pattern.`,
    difficulty: "beginner",
    targetAudience: "general",
    visualType: pattern.visualType,
    pattern: pattern.recipePattern,
    atomsUsed: pattern.atomsUsed,
    layers,
    objects,
    relations,
    flows,
    transformations,
    feedbackLoops,
    timeline: {
      id: `${pattern.id}-timeline`,
      stages: pattern.stages.map((stage) => ({
        id: stage.id,
        label: stage.label,
        description: stage.description,
        relatedObjectIds: objects.filter((object) => object.id.includes(stage.id)).map((object) => object.id),
      })),
    },
    interactions,
    motion: [],
    engineRecommendation: {
      primary: getPatternPrimaryEngine(pattern),
      alternatives: pattern.preferredEngines.flatMap((engine) => engine.alternatives),
      reason: pattern.preferredEngines[0]?.reason ?? `${pattern.name} can be rendered safely with a lightweight renderer.`,
      avoid: pattern.fallbackEngines.includes("webgpu-experimental") ? ["webgpu-experimental"] : undefined,
    },
    explanation: {
      simple: pattern.shortDescription,
      detailed: pattern.deepPurpose,
      keyTakeaways: pattern.understandingGoal.userShouldUnderstand,
      visualReadingOrder: objects.map((object) => object.label),
    },
    fallback: createFallback({
      title: `${pattern.name} fallback`,
      description: `Show ${pattern.name} as labeled cards connected in order.`,
      safeVisualType: pattern.visualType,
      messageForUser: `Read the starter recipe through the ${pattern.name} pattern.`,
    }),
    assessment: createAssessment({
      checksUnderstanding: true,
      expectedUserInsight: pattern.understandingGoal.successSignal,
      questions: [`Where does ${concept} enter the ${pattern.name} structure?`],
      successCriteria: [pattern.understandingGoal.successSignal],
    }),
    understandingGoal: {
      id: `${pattern.id}-understanding-goal`,
      label: pattern.name,
      audience: "general",
      userShouldUnderstand: pattern.understandingGoal.userShouldUnderstand,
      successSignal: pattern.understandingGoal.successSignal,
    },
    tags: [...pattern.tags, pattern.id],
  });
}

export function createRecipeFromPattern(patternId: VisualPatternId, concept: string): VisualRecipe {
  const pattern = getPatternById(patternId);

  if (!pattern) {
    throw new Error(`Unknown visual pattern: ${patternId}`);
  }

  return createRecipeFromVisualPattern(pattern, concept);
}

export function getStarterRecipeEngine(pattern: VisualPattern) {
  return getPatternFallbackEngine(pattern);
}
