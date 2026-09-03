import type { EvidenceItem, PossibilityScenario, PossibilitySource } from "@/src/possibilities/types";

export const PREDICTIVE_VISUAL_PACKAGE_VERSION = "0.1" as const;

export type PredictiveSemanticKind =
  | "signal"
  | "evidence"
  | "variable"
  | "condition"
  | "event"
  | "outcome"
  | "risk"
  | "unknown";

export type PredictiveCertainty = "known" | "inferred" | "uncertain" | "unknown";
export type PredictiveEdgeKind = "causes" | "depends-on" | "constrains" | "enables" | "uncertain";

export interface PredictiveSemanticNode {
  id: string;
  label: string;
  description: string;
  kind: PredictiveSemanticKind;
  certainty: PredictiveCertainty;
  evidenceIds: string[];
  scenarioIds?: string[];
}

export interface PredictiveSemanticEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  kind: PredictiveEdgeKind;
  strength: number;
  certainty: PredictiveCertainty;
  evidenceIds: string[];
  scenarioIds?: string[];
}

export interface PredictiveVisualProvenance {
  engineId: string;
  engineVersion: string;
  generatedAt: string;
  evidenceBriefId?: string;
  scenarioSetId?: string;
  humanApprovalRequired: boolean;
}

/**
 * Versioned bridge from any research engine to SciLoop-owned renderers.
 * Engines may propose structured semantics; only SciLoop compiles the visuals.
 */
export interface PredictiveVisualPackage {
  schemaVersion: typeof PREDICTIVE_VISUAL_PACKAGE_VERSION;
  id: string;
  title: string;
  subject: string;
  summary: string;
  evidence: EvidenceItem[];
  sources: PossibilitySource[];
  nodes: PredictiveSemanticNode[];
  edges: PredictiveSemanticEdge[];
  scenarios: PossibilityScenario[];
  assumptions: string[];
  risks: string[];
  unknowns: string[];
  provenance: PredictiveVisualProvenance;
}

export interface PredictiveVisualValidationIssue {
  path: string;
  message: string;
  severity: "error" | "warning";
}

export interface PredictiveVisualValidationResult {
  ok: boolean;
  issues: PredictiveVisualValidationIssue[];
}
