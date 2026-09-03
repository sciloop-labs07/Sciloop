import type { PossibilityPipelineSuccess } from "./pipeline";
import type { EvidenceItem, PossibilityScenario } from "./types";
import {
  PREDICTIVE_VISUAL_PACKAGE_VERSION,
  type PredictiveCertainty,
  type PredictiveSemanticEdge,
  type PredictiveSemanticKind,
  type PredictiveSemanticNode,
  type PredictiveVisualPackage,
} from "@/src/visual-engine/foundation";

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

function certaintyForEvidence(entry: EvidenceItem): PredictiveCertainty {
  if (entry.kind === "unknown") return "unknown";
  if (entry.kind === "speculation") return "uncertain";
  if (entry.kind === "inference") return "inferred";
  return "known";
}

function semanticKindForEvidence(entry: EvidenceItem): PredictiveSemanticKind {
  return entry.kind === "unknown" ? "unknown" : "evidence";
}

function scenarioStrength(scenario: PossibilityScenario) {
  // Visual relationship emphasis, not a probability or forecast confidence.
  return scenario.classification === "supported" ? 0.8 : scenario.classification === "plausible" ? 0.6 : 0.4;
}

/**
 * Converts SciLoop's validated possibility result into the engine-neutral
 * package consumed by the deterministic visual language compiler.
 */
export function predictiveVisualPackageFromPossibilityResult(
  result: PossibilityPipelineSuccess,
  generatedAt = new Date().toISOString(),
): PredictiveVisualPackage {
  const nodes: PredictiveSemanticNode[] = [];
  const edges: PredictiveSemanticEdge[] = [];
  const firstEvidenceId = result.brief.evidence[0]?.id;
  const unknownEvidenceIds = result.brief.evidence.filter((entry) => entry.kind === "unknown").map((entry) => entry.id);

  nodes.push({
    id: `${result.brief.id}-signal`,
    label: "Current signal",
    description: result.brief.currentState,
    kind: "signal",
    certainty: firstEvidenceId ? "known" : "inferred",
    evidenceIds: firstEvidenceId ? [firstEvidenceId] : [],
  });

  result.brief.evidence.forEach((entry) => {
    nodes.push({
      id: `evidence-${entry.id}`,
      label: entry.statement,
      description: entry.rationale ?? `Evidence classified as ${entry.kind}.`,
      kind: semanticKindForEvidence(entry),
      certainty: certaintyForEvidence(entry),
      evidenceIds: [entry.id],
    });
    edges.push({
      id: `signal-to-evidence-${entry.id}`,
      from: `${result.brief.id}-signal`,
      to: `evidence-${entry.id}`,
      label: entry.kind === "unknown" ? "leaves open" : "is supported by",
      kind: entry.kind === "unknown" ? "uncertain" : "depends-on",
      strength: entry.kind === "unknown" ? 0.3 : 0.7,
      certainty: certaintyForEvidence(entry),
      evidenceIds: [entry.id],
    });
  });

  result.scenarios.scenarios.forEach((scenario) => {
    const scenarioNodeIds: string[] = [];
    scenario.causalChain.forEach((step, index) => {
      const kind: PredictiveSemanticKind = index === 0 ? "signal" : index === scenario.causalChain.length - 1 ? "outcome" : "condition";
      nodes.push({
        id: step.id,
        label: step.label,
        description: step.explanation,
        kind,
        certainty: scenario.classification === "supported" ? "inferred" : "uncertain",
        evidenceIds: step.evidenceIds,
        scenarioIds: [scenario.id],
      });
      scenarioNodeIds.push(step.id);
      if (index > 0) {
        edges.push({
          id: `${scenario.id}-causal-${index}`,
          from: scenarioNodeIds[index - 1],
          to: step.id,
          label: "leads to if conditions hold",
          kind: "causes",
          strength: scenarioStrength(scenario),
          certainty: scenario.classification === "supported" ? "inferred" : "uncertain",
          evidenceIds: step.evidenceIds,
          scenarioIds: [scenario.id],
        });
      }
    });

    scenario.risks.forEach((risk, index) => {
      const riskId = `${scenario.id}-risk-${index + 1}`;
      nodes.push({
        id: riskId,
        label: "Risk / constraint",
        description: risk,
        kind: "risk",
        certainty: "uncertain",
        evidenceIds: scenario.evidenceIds,
        scenarioIds: [scenario.id],
      });
      edges.push({
        id: `${scenario.id}-risk-edge-${index + 1}`,
        from: scenarioNodeIds[1] ?? scenarioNodeIds[0],
        to: riskId,
        label: "is constrained by",
        kind: "constrains",
        strength: 0.5,
        certainty: "uncertain",
        evidenceIds: scenario.evidenceIds,
        scenarioIds: [scenario.id],
      });
    });

    scenario.unknowns.forEach((unknown, index) => {
      const unknownId = `${scenario.id}-unknown-${index + 1}`;
      nodes.push({
        id: unknownId,
        label: "Open question",
        description: unknown,
        kind: "unknown",
        certainty: "unknown",
        evidenceIds: unknownEvidenceIds,
        scenarioIds: [scenario.id],
      });
      edges.push({
        id: `${scenario.id}-unknown-edge-${index + 1}`,
        from: scenarioNodeIds[scenarioNodeIds.length - 1],
        to: unknownId,
        label: "remains uncertain because",
        kind: "uncertain",
        strength: 0.3,
        certainty: "unknown",
        evidenceIds: unknownEvidenceIds,
        scenarioIds: [scenario.id],
      });
    });
  });

  return {
    schemaVersion: PREDICTIVE_VISUAL_PACKAGE_VERSION,
    id: `${result.brief.id}-predictive-visual`,
    title: `${result.brief.title} · visual model`,
    subject: result.brief.subject,
    summary: "An evidence-linked causal model with conditional scenarios, visible constraints, and explicit unknowns.",
    evidence: result.brief.evidence,
    sources: result.brief.sources,
    nodes,
    edges,
    scenarios: result.scenarios.scenarios,
    assumptions: unique(result.scenarios.scenarios.flatMap((scenario) => scenario.requiredConditions)),
    risks: unique(result.scenarios.scenarios.flatMap((scenario) => scenario.risks)),
    unknowns: unique([...result.brief.unknowns, ...result.scenarios.scenarios.flatMap((scenario) => scenario.unknowns)]),
    provenance: {
      engineId: "sciloop-deterministic-possibility-pipeline",
      engineVersion: "0.1",
      generatedAt,
      evidenceBriefId: result.brief.id,
      scenarioSetId: result.scenarios.id,
      humanApprovalRequired: true,
    },
  };
}
