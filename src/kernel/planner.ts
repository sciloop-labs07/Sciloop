import { kernelCapabilities } from "./registry";
import type {
  KernelCapabilityId,
  KernelRequirement,
  KernelWorkflowPlan,
} from "./types";

const domainSignals: Array<[KernelRequirement["domain"], string[]]> = [
  ["education", ["student", "exam", "learn", "school", "simple", "confused"]],
  ["research", ["paper", "hypothesis", "research", "evidence", "study", "citation"]],
  ["engineering", ["build", "design", "optimize", "prototype", "system"]],
  ["civic-impact", ["local", "community", "city", "climate", "impact", "problem"]],
];

const audienceSignals: Array<[KernelRequirement["audience"], string[]]> = [
  ["student", ["student", "exam", "learn", "simple", "confused"]],
  ["researcher", ["paper", "hypothesis", "citation", "evidence", "research"]],
  ["builder", ["build", "design", "prototype", "code", "system"]],
  ["community", ["local", "community", "city", "impact"]],
];

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

export function interpretRequirement(rawInput: string): KernelRequirement {
  const normalized = rawInput.trim().toLowerCase();
  const signals = normalized.split(/\s+/).filter((word) => word.length > 3).slice(0, 24);
  const domain = domainSignals.find(([, terms]) => includesAny(normalized, terms))?.[0] ?? "science";
  const audience = audienceSignals.find(([, terms]) => includesAny(normalized, terms))?.[0] ?? "curious";
  const requiredOutputs = [
    ...(includesAny(normalized, ["source", "evidence", "paper", "research", "news"]) ? ["evidence-set"] : []),
    ...(includesAny(normalized, ["visual", "show", "diagram", "mechanism", "explain"]) ? ["visual-recipe"] : []),
    ...(includesAny(normalized, ["simulate", "experiment", "what if", "scenario", "variable"]) ? ["simulation-run"] : []),
    ...(includesAny(normalized, ["solve", "problem", "impact", "action", "community"]) ? ["action-plan"] : []),
    ...(audience === "student" ? ["learning-path"] : []),
  ];

  return {
    id: `requirement-${Date.now()}`,
    rawInput: rawInput.trim() || "Explain a scientific idea.",
    normalizedGoal: rawInput.trim() || "Explain a scientific idea.",
    domain,
    audience,
    requiredOutputs: Array.from(new Set(requiredOutputs.length > 0 ? requiredOutputs : ["structured-answer"])),
    constraints: [
      "Use the smallest useful execution path.",
      "Keep claims distinguishable from inference and speculation.",
      ...(audience === "student" ? ["Prefer progressive explanation before technical detail."] : []),
      ...(domain === "civic-impact" ? ["Expose trade-offs and affected stakeholders."] : []),
    ],
    signals,
  };
}

function addCapability(ids: KernelCapabilityId[], id: KernelCapabilityId) {
  if (!ids.includes(id)) ids.push(id);
}

export function createWorkflowPlan(requirement: KernelRequirement): KernelWorkflowPlan {
  const selected: KernelCapabilityId[] = [];
  const input = requirement.rawInput.toLowerCase();
  const evidenceFirst = requirement.domain === "research" || includesAny(input, ["news", "paper", "source", "evidence"]);
  const experimentFirst = includesAny(input, ["simulate", "experiment", "what if", "scenario"]);

  if (evidenceFirst) addCapability(selected, "evidence-extractor");
  if (includesAny(input, ["frontier", "history", "scientist", "discovery", "concept"])) addCapability(selected, "knowledge-mapper");
  if (requirement.audience === "student") addCapability(selected, "learning-coach");
  addCapability(selected, "reasoning-engine");
  if (includesAny(input, ["visual", "show", "diagram", "mechanism", "physics", "biology", "explain"])) addCapability(selected, "visual-modeler");
  if (experimentFirst) addCapability(selected, "simulation-runner");
  if (requirement.domain === "civic-impact" || includesAny(input, ["solve", "impact", "action", "community"])) addCapability(selected, "impact-planner");
  if (selected.length === 1) addCapability(selected, "visual-modeler");

  const steps = selected.map((id, index) => {
    const capability = kernelCapabilities.find((item) => item.id === id)!;
    return {
      id: `step-${index + 1}-${id}`,
      order: index + 1,
      capabilityId: id,
      label: capability.label,
      purpose: capability.purpose,
      inputArtifacts: index === 0 ? ["question"] : ["previous-artifact"],
      outputArtifacts: capability.produces,
      requiresApproval: capability.riskLevel === "high",
    };
  });

  const requiresApproval = steps.some((step) => step.requiresApproval);
  const estimatedCost = steps.some((step) => ["evidence-extractor", "simulation-runner"].includes(step.capabilityId)) ? "medium" : "low";
  return {
    id: `plan-${Date.now()}`,
    title: `SciLoop plan for: ${requirement.normalizedGoal}`,
    strategy: evidenceFirst ? "evidence-first" : experimentFirst ? "experiment-first" : requirement.domain === "civic-impact" ? "action-first" : "explanation-first",
    steps,
    estimatedCost,
    requiresApproval,
    fallbacks: steps.map((step) => kernelCapabilities.find((capability) => capability.id === step.capabilityId)?.fallbackId).filter(Boolean) as string[],
    rationale: [
      `Detected ${requirement.domain} intent for a ${requirement.audience} audience.`,
      evidenceFirst ? "Evidence is placed before explanation because the request appears source-sensitive." : "The plan starts with interpretation and explanation to reduce unnecessary computation.",
      experimentFirst ? "A bounded simulation is included because the user asked about variables or scenarios." : "Simulation remains optional until the mechanism is clear.",
    ],
  };
}
