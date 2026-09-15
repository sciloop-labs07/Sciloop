import type { SemanticGraph } from "./SemanticTypes";

export interface DemoDefinition {
  id: string;
  title: string;
  summary: string;
  createGraph: () => SemanticGraph;
}

export function baseGraph(id: string, title: string, explanation: string): SemanticGraph {
  return {
    id,
    title,
    explanation,
    entities: [],
    variables: [],
    relations: [],
    flows: [],
    forces: [],
    constraints: [],
    transitions: [],
    feedbackLoops: [],
    meta: { demoId: id, causalChain: [] },
  };
}
