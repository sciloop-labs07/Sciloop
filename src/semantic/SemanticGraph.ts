import type { SemanticEntity, SemanticGraph } from "./SemanticTypes";

export function getEntity(graph: SemanticGraph, id: string): SemanticEntity | undefined {
  return graph.entities.find((entity) => entity.id === id);
}

export function cloneGraph(graph: SemanticGraph): SemanticGraph {
  return structuredClone(graph) as SemanticGraph;
}

export function graphSummary(graph: SemanticGraph) {
  return {
    entities: graph.entities.length,
    relations: graph.relations.length,
    flows: graph.flows.length,
    forces: graph.forces.length,
    variables: graph.variables.length,
    feedbackLoops: graph.feedbackLoops.length,
  };
}
