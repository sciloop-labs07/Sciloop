import { baseGraph, type DemoDefinition } from "@/src/semantic/examples";

export const gravityWellDemo: DemoDefinition = {
  id: "gravity-well",
  title: "Gravity Well",
  summary: "Mass curves a field, bends paths, and creates escape thresholds.",
  createGraph: () => {
    const graph = baseGraph(
      "gravity-well",
      "Gravity Well",
      "Mass increases field curvature, the field changes trajectories, low velocity falls inward, high velocity escapes.",
    );
    graph.entities = [
      { id: "mass", label: "Mass", type: "mass", position: { x: 0.5, y: 0.52 }, radius: 36, state: { draggable: true } },
      { id: "particle", label: "Test particle", type: "particle", position: { x: 0.18, y: 0.28 }, radius: 10 },
      { id: "escape", label: "Escape threshold", type: "system", position: { x: 0.82, y: 0.24 }, radius: 12 },
    ];
    graph.variables = [
      { id: "mass_strength", label: "Mass", value: 0.68, min: 0.1, max: 1, step: 0.01 },
      { id: "initial_velocity", label: "Initial Velocity", value: 0.44, min: 0.05, max: 1, step: 0.01 },
      { id: "field_radius", label: "Field Radius", value: 0.74, min: 0.25, max: 1, step: 0.01 },
    ];
    graph.relations = [
      { id: "mass_bends_field", from: "mass", to: "particle", type: "force", strength: 0.8, label: "curves path" },
    ];
    graph.forces = [
      { id: "gravity_field", source: "mass", target: "particle", type: "attraction", strength: 0.8, radius: 0.72 },
    ];
    graph.transitions = [
      { id: "escape_event", label: "Escape threshold", fromState: "bound orbit", toState: "escape path", trigger: "velocity > escape threshold" },
    ];
    graph.meta = {
      demoId: "gravity-well",
      parserConfidence: 1,
      causalChain: ["Mass increases", "Field curvature deepens", "Path bends more strongly", "Velocity decides orbit or escape"],
    };
    return graph;
  },
};
