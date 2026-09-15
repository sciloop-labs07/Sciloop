import type { KernelEvaluationResult, KernelRequirement, KernelWorkflowPlan } from "./types";

export function evaluateWorkflowPlan(requirement: KernelRequirement, plan: KernelWorkflowPlan): KernelEvaluationResult {
  const checks = [
    {
      id: "has-steps",
      label: "Executable workflow",
      passed: plan.steps.length > 0,
      detail: `${plan.steps.length} capability step(s) selected.`,
    },
    {
      id: "has-reasoning",
      label: "Interpretation layer",
      passed: plan.steps.some((step) => step.capabilityId === "reasoning-engine"),
      detail: "Every workflow needs a structured interpretation stage.",
    },
    {
      id: "source-awareness",
      label: "Source-aware planning",
      passed: requirement.domain !== "research" || plan.steps.some((step) => step.capabilityId === "evidence-extractor"),
      detail: requirement.domain === "research" ? "Research plans require an evidence stage." : "No research-only evidence gate required.",
    },
    {
      id: "fallbacks",
      label: "Fallback coverage",
      passed: plan.fallbacks.length > 0,
      detail: `${plan.fallbacks.length} fallback route(s) available.`,
    },
    {
      id: "approval-gate",
      label: "Risk gate",
      passed: plan.requiresApproval ? plan.steps.some((step) => step.requiresApproval) : true,
      detail: plan.requiresApproval ? "High-impact work is marked for approval." : "No high-impact approval gate required.",
    },
  ];
  const warnings = checks.filter((check) => !check.passed).map((check) => check.detail);
  const score = Math.round((checks.filter((check) => check.passed).length / checks.length) * 100);
  return {
    status: checks.every((check) => check.passed) ? "ready" : score >= 60 ? "warning" : "blocked",
    score,
    checks,
    warnings,
  };
}
