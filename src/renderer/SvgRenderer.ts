import type { SemanticGraph } from "@/src/semantic/SemanticTypes";

export function renderSemanticLabels(graph: SemanticGraph) {
  return graph.entities.map((entity) => ({
    id: entity.id,
    label: entity.label,
    x: entity.position.x,
    y: entity.position.y,
  }));
}
