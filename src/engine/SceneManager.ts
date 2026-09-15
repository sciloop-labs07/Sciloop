import type { SemanticGraph } from "@/src/semantic/SemanticTypes";
import { SimulationEngine } from "@/src/simulation/SimulationEngine";

export class SceneManager {
  simulation: SimulationEngine;

  constructor(graph: SemanticGraph) {
    this.simulation = new SimulationEngine(graph);
  }

  load(graph: SemanticGraph) {
    this.simulation.loadGraph(graph);
  }
}
