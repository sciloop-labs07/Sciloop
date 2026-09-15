import { baseGraph } from "./examples";
import type { SemanticGraph } from "./SemanticTypes";

function has(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

export function parseConceptToGraph(input: string): SemanticGraph {
  const raw = input.trim();
  const text = raw.toLowerCase();

  if (!raw) {
    const graph = createGenericGraph("Empty concept", "Enter a concept to compile.");
    graph.warning = "No input received. Showing a safe generic graph.";
    return graph;
  }

  if (has(text, ["gravity", "mass", "attract", "trajectory", "trajectories", "field"])) {
    const graph = baseGraph("parsed-gravity", raw, "Mass or force creates influence; nearby paths curve toward the stronger field.");
    graph.entities = [
      { id: "source", label: has(text, ["mass"]) ? "Mass" : "Source", type: "mass", position: { x: 0.35, y: 0.5 }, radius: 34 },
      { id: "affected", label: has(text, ["particle"]) ? "Particle" : "Affected object", type: "particle", position: { x: 0.68, y: 0.36 }, radius: 14 },
    ];
    graph.variables = [
      { id: "field_strength", label: "Field Strength", value: 0.7, min: 0, max: 1, step: 0.01 },
      { id: "motion_speed", label: "Motion Speed", value: 0.45, min: 0, max: 1, step: 0.01 },
      { id: "distance", label: "Distance", value: 0.55, min: 0, max: 1, step: 0.01 },
    ];
    graph.relations = [{ id: "field_relation", from: "source", to: "affected", type: "force", strength: 0.7, label: "bends trajectory" }];
    graph.forces = [{ id: "attraction", source: "source", target: "affected", type: "attraction", strength: 0.7, radius: 0.7 }];
    graph.meta = { demoId: "gravity-well", parserConfidence: 0.82, causalChain: ["Source creates field", "Field bends path", "Motion outcome depends on speed"] };
    return graph;
  }

  if (has(text, ["energy", "sun", "plant", "photosynthesis", "convert", "transform", "flow"])) {
    const graph = baseGraph("parsed-energy-flow", raw, "Energy moves from a source to a receiver and can be converted into stored output.");
    graph.entities = [
      { id: "source", label: has(text, ["sun"]) ? "Sun" : "Source", type: "energy_source", position: { x: 0.18, y: 0.42 }, radius: 26 },
      { id: "converter", label: has(text, ["plant"]) ? "Plant" : "Converter", type: "converter", position: { x: 0.5, y: 0.5 }, radius: 34 },
      { id: "output", label: "Stored output", type: "storage", position: { x: 0.82, y: 0.56 }, radius: 22 },
    ];
    graph.variables = [
      { id: "energy_rate", label: "Energy Rate", value: 0.7, min: 0, max: 1, step: 0.01 },
      { id: "conversion_efficiency", label: "Conversion Efficiency", value: 0.62, min: 0, max: 1, step: 0.01 },
      { id: "storage_capacity", label: "Storage Capacity", value: 0.74, min: 0, max: 1, step: 0.01 },
    ];
    graph.flows = [
      { id: "source_flow", source: "source", target: "converter", type: "energy", rate: 0.7, label: "energy flow" },
      { id: "storage_flow", source: "converter", target: "output", type: "energy", rate: 0.62, label: "converted output" },
    ];
    graph.relations = [{ id: "conversion", from: "converter", to: "output", type: "conversion", strength: 0.62, label: "transforms" }];
    graph.meta = { demoId: "photosynthesis", parserConfidence: 0.78, causalChain: ["Energy enters", "Converter transforms it", "Output accumulates"] };
    return graph;
  }

  if (has(text, ["signal", "neuron", "neurons", "learn", "learning", "weights", "backprop"])) {
    const graph = baseGraph("parsed-learning", raw, "Signals propagate forward; error feedback updates connection strength.");
    graph.entities = [
      { id: "input", label: "Input signal", type: "neuron", position: { x: 0.16, y: 0.5 }, radius: 18 },
      { id: "hidden", label: "Weighted link", type: "neuron", position: { x: 0.48, y: 0.5 }, radius: 20 },
      { id: "output", label: "Output", type: "neuron", position: { x: 0.78, y: 0.5 }, radius: 18 },
    ];
    graph.variables = [
      { id: "signal_strength", label: "Signal Strength", value: 0.66, min: 0, max: 1, step: 0.01 },
      { id: "learning_rate", label: "Learning Rate", value: 0.46, min: 0, max: 1, step: 0.01 },
      { id: "noise", label: "Noise", value: 0.18, min: 0, max: 1, step: 0.01 },
    ];
    graph.relations = [
      { id: "forward", from: "input", to: "output", type: "signal_flow", strength: 0.66, label: "forward signal" },
      { id: "feedback", from: "output", to: "hidden", type: "feedback", strength: 0.46, label: "error correction" },
    ];
    graph.flows = [{ id: "signal", source: "input", target: "output", type: "signal", rate: 0.66, label: "signal pulse" }];
    graph.feedbackLoops = [{ id: "learning", label: "Error changes future signal", nodes: ["input", "hidden", "output"], polarity: "balancing", strength: 0.46 }];
    graph.meta = { demoId: "neural-learning", parserConfidence: 0.82, causalChain: ["Signal moves", "Prediction forms", "Feedback changes weights"] };
    return graph;
  }

  if (has(text, ["money", "inflation", "price", "purchasing", "goods"])) {
    const graph = baseGraph("parsed-money", raw, "Money tokens flow toward goods; if supply grows faster than goods, value pressure changes.");
    graph.entities = [
      { id: "money", label: "Money", type: "energy_source", position: { x: 0.16, y: 0.5 }, radius: 24 },
      { id: "goods", label: "Goods", type: "value", position: { x: 0.52, y: 0.5 }, radius: 28 },
      { id: "power", label: "Purchasing power", type: "value", position: { x: 0.82, y: 0.5 }, radius: 22 },
    ];
    graph.variables = [
      { id: "money_supply", label: "Money Supply", value: 0.68, min: 0, max: 1, step: 0.01 },
      { id: "goods_supply", label: "Goods Supply", value: 0.42, min: 0, max: 1, step: 0.01 },
      { id: "velocity", label: "Velocity", value: 0.55, min: 0, max: 1, step: 0.01 },
    ];
    graph.flows = [{ id: "money_flow", source: "money", target: "goods", type: "money", rate: 0.68, label: "token flow" }];
    graph.relations = [{ id: "power_decay", from: "goods", to: "power", type: "decay", strength: 0.6, label: "value pressure" }];
    graph.meta = { demoId: "economic-inflation", parserConfidence: 0.8, causalChain: ["Money tokens increase", "Goods are limited", "Price pressure rises", "Purchasing power falls"] };
    return graph;
  }

  if (has(text, ["feedback", "amplifies", "amplify", "growth"])) {
    const graph = createGenericGraph(raw, "Feedback loops can amplify growth when output returns as stronger input.");
    graph.feedbackLoops = [{ id: "feedback_loop", label: "Amplifying feedback", nodes: ["cause", "effect"], polarity: "amplifying", strength: 0.7 }];
    graph.relations.push({ id: "loop", from: "effect", to: "cause", type: "feedback", strength: 0.7, label: "amplifies" });
    graph.variables.push({ id: "feedback_strength", label: "Feedback Strength", value: 0.7, min: 0, max: 1, step: 0.01 });
    graph.meta = { demoId: "generic", parserConfidence: 0.7, causalChain: ["Output loops back", "Input grows", "Effect amplifies"] };
    return graph;
  }

  if (has(text, ["entropy", "disorder"])) {
    const graph = createGenericGraph(raw, "Entropy means pattern becomes less concentrated and more spread out.");
    graph.variables.push({ id: "disorder", label: "Disorder", value: 0.68, min: 0, max: 1, step: 0.01 });
    graph.flows.push({ id: "dispersal", source: "cause", target: "effect", type: "generic", rate: 0.68, label: "dispersal" });
    graph.meta = { demoId: "generic", parserConfidence: 0.68, causalChain: ["Pattern begins concentrated", "Particles disperse", "Order decreases"] };
    return graph;
  }

  if (has(text, ["constraint", "block", "blocks", "barrier"])) {
    const graph = createGenericGraph(raw, "A constraint blocks motion, forcing the causal path to stop or route around it.");
    graph.constraints.push({ id: "barrier", label: "Constraint barrier", target: "effect", type: "barrier", value: 0.8 });
    graph.relations[0] = { id: "blocked_motion", from: "cause", to: "effect", type: "constraint", strength: 0.8, label: "blocked path" };
    graph.meta = { demoId: "generic", parserConfidence: 0.72, causalChain: ["Motion begins", "Constraint blocks path", "Effect is reduced"] };
    return graph;
  }

  const fallback = createGenericGraph(raw, "Partial semantic parse: the engine found a generic cause to effect pattern.");
  fallback.warning = "Unknown concept pattern. Generated generic node-edge-flow graph.";
  return fallback;
}

function createGenericGraph(title: string, explanation: string): SemanticGraph {
  const graph = baseGraph("parsed-generic", title, explanation);
  graph.entities = [
    { id: "cause", label: "Cause", type: "generic", position: { x: 0.22, y: 0.5 }, radius: 24 },
    { id: "mechanism", label: "Mechanism", type: "system", position: { x: 0.5, y: 0.5 }, radius: 28 },
    { id: "effect", label: "Effect", type: "output", position: { x: 0.78, y: 0.5 }, radius: 24 },
  ];
  graph.variables = [
    { id: "cause_strength", label: "Cause Strength", value: 0.6, min: 0, max: 1, step: 0.01 },
    { id: "transfer_rate", label: "Transfer Rate", value: 0.55, min: 0, max: 1, step: 0.01 },
    { id: "resistance", label: "Resistance", value: 0.25, min: 0, max: 1, step: 0.01 },
  ];
  graph.relations = [
    { id: "cause_to_mechanism", from: "cause", to: "mechanism", type: "generic", strength: 0.6, label: "causes" },
    { id: "mechanism_to_effect", from: "mechanism", to: "effect", type: "generic", strength: 0.55, label: "changes" },
  ];
  graph.flows = [{ id: "generic_flow", source: "cause", target: "effect", type: "generic", rate: 0.55, label: "effect travel" }];
  graph.meta = { demoId: "generic", parserConfidence: 0.36, causalChain: ["Cause changes", "Mechanism transfers effect", "Outcome appears"] };
  return graph;
}
