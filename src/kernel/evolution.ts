import type { KernelEvolutionProposal, KernelEvaluationResult, KernelRequirement, KernelWorkflowPlan } from "./types";

export function proposeKernelEvolution(
  requirement: KernelRequirement,
  plan: KernelWorkflowPlan,
  evaluation: KernelEvaluationResult,
): KernelEvolutionProposal[] {
  const proposals: KernelEvolutionProposal[] = [];
  if (!plan.steps.some((step) => step.capabilityId === "simulation-runner")) {
    proposals.push({
      id: `proposal-${Date.now()}-simulation`,
      type: "workflow-improvement",
      target: plan.id,
      title: "Offer a bounded experiment next",
      reason: "The workflow explains the request but does not yet test a variable or consequence.",
      suggestedChange: "Add simulation-runner after visual-modeler when the user asks a follow-up what-if question.",
      expectedImpact: "Increase understanding through observable consequences without forcing simulation into every answer.",
      requiresApproval: false,
    });
  }
  if (requirement.domain === "research" && !plan.steps.some((step) => step.capabilityId === "evidence-extractor")) {
    proposals.push({
      id: `proposal-${Date.now()}-evidence`,
      type: "policy-review",
      target: "research-workflows",
      title: "Require evidence extraction for research intent",
      reason: "Research requests must distinguish sourced claims from interpretation.",
      suggestedChange: "Block final research briefs until evidence coverage is above the configured threshold.",
      expectedImpact: "Reduce unsupported scientific claims.",
      requiresApproval: true,
    });
  }
  if (evaluation.status !== "ready") {
    proposals.push({
      id: `proposal-${Date.now()}-quality`,
      type: "capability-improvement",
      target: plan.id,
      title: "Improve plan quality gates",
      reason: evaluation.warnings.join(" ") || "The plan did not pass every quality check.",
      suggestedChange: "Add or strengthen a missing capability, fallback, or approval gate before release.",
      expectedImpact: "Make future workflows more reliable and auditable.",
      requiresApproval: true,
    });
  }
  return proposals;
}
