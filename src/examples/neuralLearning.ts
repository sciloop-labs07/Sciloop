import { baseGraph, type DemoDefinition } from "@/src/semantic/examples";

export const neuralLearningDemo: DemoDefinition = {
  id: "neural-learning",
  title: "Neural Network Learning",
  summary: "Signals move forward; error moves backward; edge weights update.",
  createGraph: () => {
    const graph = baseGraph(
      "neural-learning",
      "Neural Network Learning",
      "Input signal propagates, prediction forms, error flows backward, and weights update so future prediction improves.",
    );
    graph.entities = [
      { id: "input", label: "Input", type: "neuron", position: { x: 0.16, y: 0.5 }, radius: 18 },
      { id: "hidden_a", label: "Hidden A", type: "neuron", position: { x: 0.43, y: 0.32 }, radius: 17 },
      { id: "hidden_b", label: "Hidden B", type: "neuron", position: { x: 0.43, y: 0.68 }, radius: 17 },
      { id: "output", label: "Prediction", type: "neuron", position: { x: 0.72, y: 0.5 }, radius: 18 },
      { id: "error", label: "Error", type: "output", position: { x: 0.9, y: 0.5 }, radius: 15 },
    ];
    graph.variables = [
      { id: "learning_rate", label: "Learning Rate", value: 0.48, min: 0, max: 1, step: 0.01 },
      { id: "noise", label: "Noise", value: 0.18, min: 0, max: 1, step: 0.01 },
      { id: "training_speed", label: "Training Speed", value: 0.56, min: 0.1, max: 1, step: 0.01 },
    ];
    graph.relations = [
      { id: "i_to_a", from: "input", to: "hidden_a", type: "signal_flow", strength: 0.58, label: "weight" },
      { id: "i_to_b", from: "input", to: "hidden_b", type: "signal_flow", strength: 0.42, label: "weight" },
      { id: "a_to_o", from: "hidden_a", to: "output", type: "signal_flow", strength: 0.62, label: "weight" },
      { id: "b_to_o", from: "hidden_b", to: "output", type: "signal_flow", strength: 0.36, label: "weight" },
      { id: "error_back", from: "error", to: "hidden_a", type: "feedback", strength: 0.6, label: "error correction" },
    ];
    graph.flows = [
      { id: "forward_signal", source: "input", target: "output", type: "signal", rate: 0.7, label: "forward pass" },
      { id: "back_error", source: "error", target: "input", type: "information", rate: 0.55, label: "backprop pulse" },
    ];
    graph.feedbackLoops = [
      { id: "learning_loop", label: "Prediction error updates weights", nodes: ["input", "hidden_a", "output", "error"], polarity: "balancing", strength: 0.6 },
    ];
    graph.meta = {
      demoId: "neural-learning",
      parserConfidence: 1,
      causalChain: ["Signal moves forward", "Prediction is compared", "Error moves backward", "Weights visibly change"],
    };
    return graph;
  },
};
