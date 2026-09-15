import type { GraphValidationResult, SemanticGraph } from "./SemanticTypes";

export function validateGraph(graph: SemanticGraph): GraphValidationResult {
  const entityIds = new Set(graph.entities.map((entity) => entity.id));
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!graph.entities.length) {
    errors.push("Graph has no entities to render.");
  }

  for (const relation of graph.relations) {
    if (!entityIds.has(relation.from)) {
      warnings.push(`Relation "${relation.id}" references missing source "${relation.from}".`);
    }
    if (!entityIds.has(relation.to)) {
      warnings.push(`Relation "${relation.id}" references missing target "${relation.to}".`);
    }
  }

  for (const flow of graph.flows) {
    if (!entityIds.has(flow.source)) {
      warnings.push(`Flow "${flow.id}" references missing source "${flow.source}".`);
    }
    if (!entityIds.has(flow.target)) {
      warnings.push(`Flow "${flow.id}" references missing target "${flow.target}".`);
    }
  }

  for (const force of graph.forces) {
    if (!entityIds.has(force.source)) {
      warnings.push(`Force "${force.id}" references missing source "${force.source}".`);
    }
    if (force.target && !entityIds.has(force.target)) {
      warnings.push(`Force "${force.id}" references missing target "${force.target}".`);
    }
  }

  return {
    ok: errors.length === 0,
    warnings,
    errors,
  };
}
