import { baseGraph, type DemoDefinition } from "@/src/semantic/examples";

export const photosynthesisDemo: DemoDefinition = {
  id: "photosynthesis",
  title: "Photosynthesis",
  summary: "Inputs enter a leaf converter; oxygen exits; glucose accumulates.",
  createGraph: () => {
    const graph = baseGraph(
      "photosynthesis",
      "Photosynthesis",
      "Light, water, and CO2 enter the leaf converter. If any input is low, glucose production slows.",
    );
    graph.entities = [
      { id: "sun", label: "Sunlight", type: "energy_source", position: { x: 0.14, y: 0.18 }, radius: 24 },
      { id: "water", label: "Water", type: "energy_source", position: { x: 0.14, y: 0.76 }, radius: 22 },
      { id: "co2", label: "CO2", type: "energy_source", position: { x: 0.32, y: 0.86 }, radius: 18 },
      { id: "leaf", label: "Leaf converter", type: "converter", position: { x: 0.52, y: 0.52 }, radius: 44 },
      { id: "oxygen", label: "Oxygen out", type: "output", position: { x: 0.84, y: 0.32 }, radius: 18 },
      { id: "glucose", label: "Glucose storage", type: "storage", position: { x: 0.84, y: 0.72 }, radius: 24 },
    ];
    graph.variables = [
      { id: "light_intensity", label: "Light Intensity", value: 0.8, min: 0, max: 1, step: 0.01 },
      { id: "water_availability", label: "Water Availability", value: 0.72, min: 0, max: 1, step: 0.01 },
      { id: "co2_availability", label: "CO2 Availability", value: 0.64, min: 0, max: 1, step: 0.01 },
    ];
    graph.flows = [
      { id: "photon_flow", source: "sun", target: "leaf", type: "energy", rate: 0.8, label: "light energy" },
      { id: "water_flow", source: "water", target: "leaf", type: "matter", rate: 0.72, label: "water input" },
      { id: "co2_flow", source: "co2", target: "leaf", type: "matter", rate: 0.64, label: "CO2 input" },
      { id: "oxygen_flow", source: "leaf", target: "oxygen", type: "matter", rate: 0.7, label: "oxygen release" },
      { id: "glucose_flow", source: "leaf", target: "glucose", type: "energy", rate: 0.7, label: "glucose storage" },
    ];
    graph.relations = [
      { id: "conversion", from: "leaf", to: "glucose", type: "conversion", strength: 0.7, label: "transforms inputs" },
    ];
    graph.constraints = [
      { id: "bottleneck", label: "Bottleneck: lowest input controls output", target: "leaf", type: "bottleneck", value: 0.64 },
    ];
    graph.meta = {
      demoId: "photosynthesis",
      parserConfidence: 1,
      causalChain: ["Light + water + CO2 enter", "Leaf converts inputs", "Oxygen exits", "Glucose accumulates"],
    };
    return graph;
  },
};
