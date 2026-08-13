import type { KernelCapability, KernelCapabilityId } from "./types";

export const kernelCapabilities: KernelCapability[] = [
  {
    id: "evidence-extractor",
    label: "Evidence Extractor",
    purpose: "Collect, normalize, and separate sourced claims from inference.",
    accepts: ["news", "paper", "discovery", "research", "question"],
    produces: ["evidence-set", "claims", "sources"],
    riskLevel: "low",
    costClass: "medium",
    fallbackId: "reasoning-engine",
  },
  {
    id: "knowledge-mapper",
    label: "Knowledge Mapper",
    purpose: "Connect concepts, people, mechanisms, timelines, and open questions.",
    accepts: ["frontier", "history", "research", "concept", "discovery"],
    produces: ["knowledge-map", "concept-network", "open-questions"],
    riskLevel: "low",
    costClass: "low",
    fallbackId: "reasoning-engine",
  },
  {
    id: "reasoning-engine",
    label: "Reasoning Engine",
    purpose: "Turn a raw request into a structured explanation and next actions.",
    accepts: ["question", "compare", "plan", "explain", "code"],
    produces: ["structured-answer", "reasoning-trace", "next-action"],
    riskLevel: "medium",
    costClass: "medium",
    fallbackId: "learning-coach",
  },
  {
    id: "visual-modeler",
    label: "Visual Modeler",
    purpose: "Convert mechanisms and relationships into controlled visual recipes.",
    accepts: ["visual", "mechanism", "explain", "biology", "physics", "concept"],
    produces: ["semantic-model", "visual-recipe", "causal-explanation"],
    riskLevel: "low",
    costClass: "low",
    fallbackId: "reasoning-engine",
  },
  {
    id: "simulation-runner",
    label: "Simulation Runner",
    purpose: "Run bounded scenarios, change variables, and record observable consequences.",
    accepts: ["experiment", "simulate", "scenario", "variable", "sandbox", "model"],
    produces: ["simulation-run", "before-after-state", "observations"],
    riskLevel: "medium",
    costClass: "medium",
    fallbackId: "visual-modeler",
  },
  {
    id: "impact-planner",
    label: "Impact Planner",
    purpose: "Compare interventions against constraints, trade-offs, and community outcomes.",
    accepts: ["problem", "local", "community", "impact", "solution", "action"],
    produces: ["decision-model", "trade-off-analysis", "action-plan"],
    riskLevel: "high",
    costClass: "medium",
    fallbackId: "reasoning-engine",
  },
  {
    id: "learning-coach",
    label: "Learning Coach",
    purpose: "Adapt explanations, analogies, and checks for understanding to the learner.",
    accepts: ["student", "learn", "exam", "simple", "confused", "meaning"],
    produces: ["learning-path", "analogy", "checkpoint"],
    riskLevel: "low",
    costClass: "low",
    fallbackId: "reasoning-engine",
  },
];

export function getKernelCapability(id: KernelCapabilityId) {
  return kernelCapabilities.find((capability) => capability.id === id);
}
