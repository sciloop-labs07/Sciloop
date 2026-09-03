import { PREDICTIVE_VISUAL_PACKAGE_VERSION, type PredictiveVisualPackage, type PredictiveVisualValidationIssue, type PredictiveVisualValidationResult } from "./predictiveVisual.types";

function issue(path: string, message: string, severity: PredictiveVisualValidationIssue["severity"] = "error"): PredictiveVisualValidationIssue {
  return { path, message, severity };
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Ensures no engine can turn unsupported semantics into a factual visual claim. */
export function validatePredictiveVisualPackage(value: unknown): PredictiveVisualValidationResult {
  const issues: PredictiveVisualValidationIssue[] = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, issues: [issue("package", "Expected a package object.")] };
  }

  const pkg = value as Partial<PredictiveVisualPackage>;
  if (pkg.schemaVersion !== PREDICTIVE_VISUAL_PACKAGE_VERSION) issues.push(issue("schemaVersion", "Unsupported predictive visual package version."));
  ["id", "title", "subject", "summary"].forEach((key) => {
    if (!hasText(pkg[key as keyof PredictiveVisualPackage])) issues.push(issue(key, "Expected a non-empty string."));
  });
  if (!Array.isArray(pkg.evidence)) issues.push(issue("evidence", "Expected an evidence list."));
  if (!Array.isArray(pkg.nodes) || pkg.nodes.length === 0) issues.push(issue("nodes", "At least one semantic node is required."));
  if (!Array.isArray(pkg.edges)) issues.push(issue("edges", "Expected an edge list."));
  if (!pkg.provenance || !hasText(pkg.provenance.engineId) || !hasText(pkg.provenance.engineVersion)) {
    issues.push(issue("provenance", "Engine id and version are required for auditability."));
  }

  const evidenceIds = new Set(Array.isArray(pkg.evidence) ? pkg.evidence.map((entry) => entry.id) : []);
  const nodeIds = new Set(Array.isArray(pkg.nodes) ? pkg.nodes.map((node) => node.id) : []);

  (pkg.nodes ?? []).forEach((node, index) => {
    const path = `nodes[${index}]`;
    if (!hasText(node.id) || !hasText(node.label) || !hasText(node.description)) issues.push(issue(path, "Node id, label, and description are required."));
    if (!Array.isArray(node.evidenceIds)) issues.push(issue(`${path}.evidenceIds`, "Expected an evidence id list."));
    node.evidenceIds?.forEach((id) => {
      if (!evidenceIds.has(id)) issues.push(issue(`${path}.evidenceIds`, `Unknown evidence id "${id}".`));
    });
    if (node.kind !== "unknown" && node.certainty === "known" && node.evidenceIds.length === 0) {
      issues.push(issue(`${path}.evidenceIds`, "Known nodes require at least one evidence reference."));
    }
    if (node.kind === "unknown" && node.certainty !== "unknown") {
      issues.push(issue(`${path}.certainty`, "Unknown nodes must retain unknown certainty."));
    }
  });

  (pkg.edges ?? []).forEach((edge, index) => {
    const path = `edges[${index}]`;
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) issues.push(issue(path, "Edges must reference existing semantic nodes."));
    if (typeof edge.strength !== "number" || edge.strength < 0 || edge.strength > 1) issues.push(issue(`${path}.strength`, "Strength must be between 0 and 1."));
    edge.evidenceIds?.forEach((id) => {
      if (!evidenceIds.has(id)) issues.push(issue(`${path}.evidenceIds`, `Unknown evidence id "${id}".`));
    });
  });

  return { ok: issues.every((entry) => entry.severity !== "error"), issues };
}
