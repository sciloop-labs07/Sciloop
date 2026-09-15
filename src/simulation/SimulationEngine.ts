import { compileGraphToPrimitives } from "@/src/grammar/VisualGrammar";
import type { PrimitiveInstance } from "@/src/grammar/PrimitiveTypes";
import type { SemanticGraph, Vec2 } from "@/src/semantic/SemanticTypes";
import { cloneGraph } from "@/src/semantic/SemanticGraph";

import { Timeline } from "./Timeline";
import { VariableStore } from "./VariableStore";

export interface SimulationSnapshot {
  graph: SemanticGraph;
  primitives: PrimitiveInstance[];
  timeline: number;
  selectedId?: string;
  hoveredId?: string;
  causalChain: string[];
}

export class SimulationEngine {
  graph: SemanticGraph;
  primitives: PrimitiveInstance[];
  variables: VariableStore;
  timeline = new Timeline();
  hoveredId?: string;
  selectedId?: string;

  constructor(graph: SemanticGraph) {
    this.graph = cloneGraph(graph);
    this.variables = new VariableStore(this.graph.variables);
    this.primitives = compileGraphToPrimitives(this.graph);
  }

  loadGraph(graph: SemanticGraph) {
    this.graph = cloneGraph(graph);
    this.variables.setAll(this.graph.variables);
    this.primitives = compileGraphToPrimitives(this.graph);
    this.timeline.reset();
    this.hoveredId = undefined;
    this.selectedId = undefined;
  }

  update(dt: number) {
    this.timeline.update(dt * this.variables.get("training_speed", 1));
    this.syncGraphVariables();
    this.primitives = this.primitives.map((primitive) => ({
      ...primitive,
      state: {
        ...primitive.state,
        phase: Number(primitive.state.phase || 0) + dt * Math.max(0.15, primitive.strength),
      },
    }));
  }

  reset() {
    this.timeline.reset();
    this.hoveredId = undefined;
    this.selectedId = undefined;
  }

  setVariable(id: string, value: number) {
    this.variables.set(id, value);
    this.syncGraphVariables();
  }

  setHovered(id?: string) {
    this.hoveredId = id;
  }

  setSelected(id?: string) {
    this.selectedId = id;
  }

  moveEntity(id: string, normalizedPosition: Vec2) {
    const entity = this.graph.entities.find((item) => item.id === id);
    if (!entity) return;
    entity.position = {
      x: Math.min(0.95, Math.max(0.05, normalizedPosition.x)),
      y: Math.min(0.95, Math.max(0.05, normalizedPosition.y)),
    };
  }

  snapshot(): SimulationSnapshot {
    return {
      graph: this.graph,
      primitives: this.primitives,
      timeline: this.timeline.value,
      hoveredId: this.hoveredId,
      selectedId: this.selectedId,
      causalChain: this.graph.meta?.causalChain ?? [],
    };
  }

  private syncGraphVariables() {
    const values = new Map(this.variables.list().map((variable) => [variable.id, variable.value]));
    this.graph.variables = this.graph.variables.map((variable) => ({
      ...variable,
      value: values.get(variable.id) ?? variable.value,
    }));
    for (const flow of this.graph.flows) {
      if (flow.id.includes("photon")) flow.rate = values.get("light_intensity") ?? flow.rate;
      if (flow.id.includes("water")) flow.rate = values.get("water_availability") ?? flow.rate;
      if (flow.id.includes("co2")) flow.rate = values.get("co2_availability") ?? flow.rate;
      if (flow.id.includes("money")) flow.rate = values.get("money_growth") ?? values.get("money_supply") ?? flow.rate;
      if (flow.id.includes("signal")) flow.rate = values.get("signal_strength") ?? flow.rate;
    }
    for (const force of this.graph.forces) {
      force.strength = values.get("mass_strength") ?? values.get("field_strength") ?? force.strength;
      force.radius = values.get("field_radius") ?? force.radius;
    }
  }
}
