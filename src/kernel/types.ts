export type KernelIntentDomain =
  | "science"
  | "education"
  | "research"
  | "engineering"
  | "civic-impact"
  | "general";

export type KernelCapabilityId =
  | "evidence-extractor"
  | "knowledge-mapper"
  | "reasoning-engine"
  | "visual-modeler"
  | "simulation-runner"
  | "impact-planner"
  | "learning-coach";

export type KernelRiskLevel = "low" | "medium" | "high";
export type KernelCostClass = "low" | "medium" | "high";

export interface KernelRequirement {
  id: string;
  rawInput: string;
  normalizedGoal: string;
  domain: KernelIntentDomain;
  audience: "curious" | "student" | "researcher" | "builder" | "community";
  requiredOutputs: string[];
  constraints: string[];
  signals: string[];
}

export interface KernelCapability {
  id: KernelCapabilityId;
  label: string;
  purpose: string;
  accepts: string[];
  produces: string[];
  riskLevel: KernelRiskLevel;
  costClass: KernelCostClass;
  fallbackId?: KernelCapabilityId;
}

export interface KernelPlanStep {
  id: string;
  order: number;
  capabilityId: KernelCapabilityId;
  label: string;
  purpose: string;
  inputArtifacts: string[];
  outputArtifacts: string[];
  requiresApproval: boolean;
}

export interface KernelWorkflowPlan {
  id: string;
  title: string;
  strategy: "evidence-first" | "explanation-first" | "experiment-first" | "action-first";
  steps: KernelPlanStep[];
  estimatedCost: KernelCostClass;
  requiresApproval: boolean;
  fallbacks: string[];
  rationale: string[];
}

export interface KernelEvaluationResult {
  status: "ready" | "warning" | "blocked";
  score: number;
  checks: Array<{ id: string; label: string; passed: boolean; detail: string }>;
  warnings: string[];
}

export interface KernelEvolutionProposal {
  id: string;
  type: "workflow-improvement" | "capability-improvement" | "policy-review";
  target: string;
  title: string;
  reason: string;
  suggestedChange: string;
  expectedImpact: string;
  requiresApproval: boolean;
}

export interface KernelPlanResponse {
  ok: true;
  requirement: KernelRequirement;
  plan: KernelWorkflowPlan;
  evaluation: KernelEvaluationResult;
  evolution: KernelEvolutionProposal[];
  availableCapabilities: KernelCapability[];
}
