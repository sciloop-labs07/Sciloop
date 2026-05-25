import { registerDefaultPrimitives } from "@/src/grammar/VisualGrammar";
import { parseConceptToGraph } from "@/src/semantic/SemanticParser";
import type { DemoDefinition } from "@/src/semantic/examples";
import type { SemanticGraph } from "@/src/semantic/SemanticTypes";

export class VisualLanguageEngine {
  private demos = new Map<string, DemoDefinition>();

  constructor() {
    registerDefaultPrimitives();
  }

  registerDemo(demo: DemoDefinition) {
    this.demos.set(demo.id, demo);
  }

  getDemos() {
    return [...this.demos.values()];
  }

  createDemoGraph(id: string): SemanticGraph {
    return this.demos.get(id)?.createGraph() ?? parseConceptToGraph("unknown concept");
  }

  compileConcept(text: string): SemanticGraph {
    return parseConceptToGraph(text);
  }
}
