import type { SemanticGraph } from "@/src/semantic/SemanticTypes";
import { semanticColors } from "@/src/utils/color";

import { registerPrimitive } from "./PrimitiveRegistry";
import type { PrimitiveDefinition, PrimitiveInstance, PrimitiveKind } from "./PrimitiveTypes";

function makePrimitive(id: PrimitiveKind, semanticMeaning: string, visualRepresentation: string): PrimitiveDefinition {
  return {
    id,
    semanticMeaning,
    visualRepresentation,
    animationRules: "Motion encodes cause, direction, strength, and state change.",
    interactionRules: "Hover to inspect; drag entities when allowed; sliders update variable-driven strength.",
    physicsRules: "Use lightweight causal motion, not photorealistic physics.",
    update: (dt, primitive) => ({
      ...primitive,
      state: {
        ...primitive.state,
        phase: Number(primitive.state.phase || 0) + dt * primitive.strength,
      },
    }),
  };
}

export function registerDefaultPrimitives() {
  const definitions: PrimitiveDefinition[] = [
    makePrimitive("node", "Entity or state", "Labeled circle/card"),
    makePrimitive("edge", "Relation", "Line with arrow and label"),
    makePrimitive("field", "Distributed influence", "Soft gradient field"),
    makePrimitive("pulse", "Discrete information packet", "Moving bright dot"),
    makePrimitive("flow", "Continuous transfer", "Directional stream line"),
    makePrimitive("particle_stream", "Energy, money, or matter flow", "Many small moving particles"),
    makePrimitive("boundary", "Constraint", "Barrier or threshold line"),
    makePrimitive("wave", "Oscillation or propagation", "Readable wave ribbon"),
    makePrimitive("attractor", "Convergence or gravity", "Curved paths toward center"),
    makePrimitive("repulsor", "Avoidance or pressure", "Paths pushed outward"),
    makePrimitive("deformation", "Changed space/field", "Warped grid"),
    makePrimitive("temporal_transition", "Before/after change", "Stage marker sequence"),
    makePrimitive("state_morph", "Growth, decay, storage", "Size or opacity change"),
    makePrimitive("signal_propagation", "Signal or feedback loop", "Traveling pulse along edges"),
  ];
  definitions.forEach(registerPrimitive);
}

export function compileGraphToPrimitives(graph: SemanticGraph): PrimitiveInstance[] {
  const primitives: PrimitiveInstance[] = [];

  for (const entity of graph.entities) {
    primitives.push({
      id: `primitive-${entity.id}`,
      kind: entity.type === "mass" ? "attractor" : "node",
      label: entity.label,
      semanticMeaning: entity.type,
      sourceId: entity.id,
      position: entity.position,
      color: entity.type === "mass" ? semanticColors.force : semanticColors.neutral,
      strength: Number(entity.state?.strength || 1),
      state: { phase: 0 },
    });
  }

  for (const relation of graph.relations) {
    const kind: PrimitiveKind =
      relation.type === "feedback" ? "signal_propagation" :
      relation.type === "force" ? "field" :
      relation.type === "constraint" ? "boundary" :
      relation.type === "conversion" ? "state_morph" :
      "edge";
    primitives.push({
      id: `primitive-${relation.id}`,
      kind,
      label: relation.label || relation.type.replaceAll("_", " "),
      semanticMeaning: relation.type,
      sourceId: relation.from,
      targetId: relation.to,
      color: relation.type === "energy_flow" ? semanticColors.energy : relation.type === "signal_flow" ? semanticColors.signal : semanticColors.force,
      strength: relation.strength,
      state: { phase: 0 },
    });
  }

  for (const flow of graph.flows) {
    primitives.push({
      id: `primitive-${flow.id}`,
      kind: flow.type === "signal" ? "pulse" : flow.type === "money" ? "flow" : "particle_stream",
      label: flow.label || flow.type,
      semanticMeaning: flow.type,
      sourceId: flow.source,
      targetId: flow.target,
      color: flow.type === "money" ? semanticColors.money : flow.type === "signal" ? semanticColors.signal : semanticColors.energy,
      strength: flow.rate,
      state: { phase: 0 },
    });
  }

  for (const force of graph.forces) {
    primitives.push({
      id: `primitive-${force.id}`,
      kind: force.type === "repulsion" ? "repulsor" : force.type === "field" ? "deformation" : "attractor",
      label: force.type,
      semanticMeaning: force.type,
      sourceId: force.source,
      targetId: force.target,
      color: semanticColors.force,
      strength: force.strength,
      state: { phase: 0 },
    });
  }

  for (const constraint of graph.constraints) {
    primitives.push({
      id: `primitive-${constraint.id}`,
      kind: "boundary",
      label: constraint.label,
      semanticMeaning: constraint.type,
      targetId: constraint.target,
      color: semanticColors.constraint,
      strength: Number(constraint.value || 1),
      state: { phase: 0 },
    });
  }

  return primitives;
}
