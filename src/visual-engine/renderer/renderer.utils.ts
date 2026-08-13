import type {
  VisualRecipe,
  VisualRecipeLayer,
  VisualRecipeObject,
  VisualRecipeRelation,
} from "@/src/visual-engine/foundation";
import type { VisualFlow } from "@/src/visual-engine/foundation";

export function groupObjectsByLayer(recipe: VisualRecipe) {
  const grouped = new Map<string, VisualRecipeObject[]>();
  recipe.layers.forEach((layer) => grouped.set(layer.id, []));
  recipe.objects.forEach((object) => {
    const current = grouped.get(object.layerId) ?? [];
    current.push(object);
    grouped.set(object.layerId, current);
  });
  return grouped;
}

export function getObjectById(recipe: VisualRecipe, id: string) {
  return recipe.objects.find((object) => object.id === id);
}

export function getRelationsForObject(recipe: VisualRecipe, objectId: string) {
  return recipe.relations.filter(
    (relation) => relation.fromObjectId === objectId || relation.toObjectId === objectId,
  );
}

export function getFlowsForLayer(recipe: VisualRecipe, layerId: string) {
  const ids = new Set(
    recipe.objects.filter((object) => object.layerId === layerId).map((object) => object.id),
  );
  return recipe.flows.filter((flow) => ids.has(flow.source) || ids.has(flow.target));
}

export function getLayerDepthStyle(layer: VisualRecipeLayer) {
  const depth = Math.max(0, layer.depth);
  return {
    transform: `translateY(${depth * 3}px)`,
    boxShadow: `0 ${18 + depth * 4}px ${42 + depth * 8}px rgba(0, 0, 0, ${0.18 + depth * 0.03})`,
  };
}

export function getNodeVisualState(object: VisualRecipeObject) {
  const importance = object.importance ?? 0.5;
  const isUncertain = object.certainty === "uncertain" || object.certainty === "unknown";
  const isStrong = importance >= 0.8;

  return {
    isUncertain,
    isStrong,
    className: [
      "rounded-[22px] border p-4 transition-all duration-300",
      isUncertain ? "border-dashed border-amber-200/24 bg-amber-200/[0.04]" : "border-white/10 bg-white/[0.04]",
      isStrong ? "shadow-[0_0_34px_rgba(143,233,255,0.13)] ring-1 ring-cyan-200/18" : "",
    ].filter(Boolean).join(" "),
  };
}

export function getEdgeVisualStyle(relation: VisualRecipeRelation) {
  const uncertain = relation.certainty === "uncertain" || relation.certainty === "unknown";
  const width = Math.max(1.5, 1 + relation.strength * 3);
  return {
    strokeDasharray: uncertain ? "8 7" : "none",
    strokeWidth: width,
    opacity: uncertain ? 0.58 : 0.86,
  };
}

export function getFlowVisualStyle(flow: VisualFlow) {
  const width = Math.max(2, 2 + flow.rate * 6);
  const tone =
    flow.material === "energy" ? "rgba(243, 200, 141, 0.92)" :
    flow.material === "money" ? "rgba(134, 239, 172, 0.9)" :
    flow.material === "force" ? "rgba(196, 181, 253, 0.9)" :
    "rgba(143, 233, 255, 0.92)";

  return {
    strokeWidth: width,
    color: tone,
  };
}

export function shouldUseMotion() {
  if (typeof window === "undefined") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function labelForObject(object?: VisualRecipeObject, fallback = "Missing object") {
  return object?.label ?? fallback;
}

