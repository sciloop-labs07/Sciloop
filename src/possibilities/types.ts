export const POSSIBILITY_SCHEMA_VERSION = "0.1" as const;

export type EvidenceKind = "fact" | "inference" | "speculation" | "unknown";
export type EvidenceStrength = "strong" | "moderate" | "weak" | "unverified";
export type ScenarioClass = "supported" | "plausible" | "speculative";
export type ScenarioHorizon = "near" | "medium" | "long";
export type PossibilityLens =
  | "scientific"
  | "technical"
  | "economic"
  | "social"
  | "environmental"
  | "governance";

export interface PossibilitySource {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  publishedAt?: string;
  sourceType: "paper" | "official" | "dataset" | "report" | "news" | "user-input" | "unknown";
}

export interface EvidenceItem {
  id: string;
  statement: string;
  kind: EvidenceKind;
  strength: EvidenceStrength;
  sourceIds: string[];
  rationale?: string;
}

export interface EvidenceBrief {
  schemaVersion: typeof POSSIBILITY_SCHEMA_VERSION;
  id: string;
  subject: string;
  title: string;
  field: string;
  currentState: string;
  mechanism: string;
  history?: string[];
  evidence: EvidenceItem[];
  constraints: string[];
  dependencies: string[];
  unknowns: string[];
  sources: PossibilitySource[];
  generatedBy: "fixture" | "ai-polisher" | "fallback";
}

export interface CausalStep {
  id: string;
  label: string;
  explanation: string;
  evidenceIds: string[];
}

export interface PossibilityScenario {
  id: string;
  title: string;
  summary: string;
  classification: ScenarioClass;
  horizon: ScenarioHorizon;
  lens: PossibilityLens;
  trigger: string;
  causalChain: CausalStep[];
  requiredConditions: string[];
  potentialBenefits: string[];
  risks: string[];
  unknowns: string[];
  falsifiers: string[];
  evidenceIds: string[];
}

export interface ScenarioSet {
  schemaVersion: typeof POSSIBILITY_SCHEMA_VERSION;
  id: string;
  briefId: string;
  scenarios: PossibilityScenario[];
  generatedBy: "fixture" | "ai-scenario-engine" | "fallback";
  disclaimer: string;
}

export type VisualNodeKind = "state" | "condition" | "event" | "outcome" | "risk" | "unknown";
export type VisualEdgeKind = "causes" | "depends-on" | "constrains" | "enables" | "uncertain";

export interface VisualNode {
  id: string;
  label: string;
  kind: VisualNodeKind;
  evidenceIds: string[];
}

export interface VisualEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  kind: VisualEdgeKind;
  evidenceIds: string[];
}

export interface VisualSpec {
  schemaVersion: typeof POSSIBILITY_SCHEMA_VERSION;
  id: string;
  scenarioId: string;
  title: string;
  nodes: VisualNode[];
  edges: VisualEdge[];
  generatedBy: "deterministic-compiler" | "ai-visual-mapper" | "fallback";
}

export interface ValidationIssue {
  path: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult<T> {
  ok: boolean;
  value?: T;
  issues: ValidationIssue[];
}
