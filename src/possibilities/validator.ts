import type {
  EvidenceBrief,
  ScenarioSet,
  ValidationIssue,
  ValidationResult,
  VisualSpec,
} from "./types";
import { POSSIBILITY_SCHEMA_VERSION } from "./types";

const MAX_TEXT_LENGTH = 2_000;
const MAX_ITEMS = 24;

function issue(path: string, message: string, severity: ValidationIssue["severity"] = "error"): ValidationIssue {
  return { path, message, severity };
}

function text(value: unknown, path: string, issues: ValidationIssue[]) {
  if (typeof value !== "string" || !value.trim()) {
    issues.push(issue(path, "Expected a non-empty string."));
    return;
  }
  if (value.length > MAX_TEXT_LENGTH) {
    issues.push(issue(path, `Text exceeds the ${MAX_TEXT_LENGTH}-character limit.`));
  }
}

function stringList(value: unknown, path: string, issues: ValidationIssue[]) {
  if (!Array.isArray(value)) {
    issues.push(issue(path, "Expected a list of strings."));
    return;
  }
  if (value.length > MAX_ITEMS) {
    issues.push(issue(path, `List exceeds the ${MAX_ITEMS}-item limit.`));
  }
  value.forEach((item, index) => text(item, `${path}[${index}]`, issues));
}

function baseChecks(value: unknown, path: string, issues: ValidationIssue[]): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push(issue(path, "Expected an object."));
    return false;
  }
  return true;
}

function arraySize(value: unknown, path: string, issues: ValidationIssue[]) {
  if (!Array.isArray(value)) {
    issues.push(issue(path, "Expected a list."));
    return false;
  }
  if (value.length > MAX_ITEMS) {
    issues.push(issue(path, `List exceeds the ${MAX_ITEMS}-item limit.`));
  }
  return true;
}

export function validateEvidenceBrief(value: unknown): ValidationResult<EvidenceBrief> {
  const issues: ValidationIssue[] = [];
  if (!baseChecks(value, "brief", issues)) return { ok: false, issues };
  if (value.schemaVersion !== POSSIBILITY_SCHEMA_VERSION) issues.push(issue("brief.schemaVersion", "Unsupported schema version."));
  ["id", "subject", "title", "field", "currentState", "mechanism", "generatedBy"].forEach((key) => text(value[key], `brief.${key}`, issues));
  stringList(value.constraints, "brief.constraints", issues);
  stringList(value.dependencies, "brief.dependencies", issues);
  stringList(value.unknowns, "brief.unknowns", issues);
  if (!arraySize(value.sources, "brief.sources", issues)) return { ok: false, issues };
  if (!arraySize(value.evidence, "brief.evidence", issues)) return { ok: false, issues };

  (value.sources as unknown[]).forEach((source, index) => {
    if (!baseChecks(source, `brief.sources[${index}]`, issues)) return;
    ["id", "title", "publisher", "sourceType"].forEach((key) => text(source[key], `brief.sources[${index}].${key}`, issues));
    if (source.url !== undefined && typeof source.url !== "string") issues.push(issue(`brief.sources[${index}].url`, "URL must be a string."));
  });
  (value.evidence as unknown[]).forEach((entry, index) => {
    if (!baseChecks(entry, `brief.evidence[${index}]`, issues)) return;
    ["id", "statement", "kind", "strength"].forEach((key) => text(entry[key], `brief.evidence[${index}].${key}`, issues));
    stringList(entry.sourceIds, `brief.evidence[${index}].sourceIds`, issues);
    if (entry.rationale !== undefined) text(entry.rationale, `brief.evidence[${index}].rationale`, issues);
  });
  return { ok: issues.every((item) => item.severity !== "error"), value: issues.length ? undefined : value as unknown as EvidenceBrief, issues };
}

function validateScenario(scenario: unknown, path: string, issues: ValidationIssue[]) {
  if (!baseChecks(scenario, path, issues)) return;
  ["id", "title", "summary", "classification", "horizon", "lens", "trigger"].forEach((key) => text(scenario[key], `${path}.${key}`, issues));
  ["requiredConditions", "potentialBenefits", "risks", "unknowns", "falsifiers", "evidenceIds"].forEach((key) => stringList(scenario[key], `${path}.${key}`, issues));
  if (!arraySize(scenario.causalChain, `${path}.causalChain`, issues)) return;
  (scenario.causalChain as unknown[]).forEach((step, index) => {
    if (!baseChecks(step, `${path}.causalChain[${index}]`, issues)) return;
    ["id", "label", "explanation"].forEach((key) => text(step[key], `${path}.causalChain[${index}].${key}`, issues));
    stringList(step.evidenceIds, `${path}.causalChain[${index}].evidenceIds`, issues);
  });
}

export function validateScenarioSet(value: unknown): ValidationResult<ScenarioSet> {
  const issues: ValidationIssue[] = [];
  if (!baseChecks(value, "scenarioSet", issues)) return { ok: false, issues };
  if (value.schemaVersion !== POSSIBILITY_SCHEMA_VERSION) issues.push(issue("scenarioSet.schemaVersion", "Unsupported schema version."));
  ["id", "briefId", "generatedBy", "disclaimer"].forEach((key) => text(value[key], `scenarioSet.${key}`, issues));
  if (!arraySize(value.scenarios, "scenarioSet.scenarios", issues)) return { ok: false, issues };
  const scenarios = value.scenarios as unknown[];
  scenarios.forEach((scenario, index) => validateScenario(scenario, `scenarioSet.scenarios[${index}]`, issues));
  if (scenarios.length < 1) issues.push(issue("scenarioSet.scenarios", "At least one scenario is required."));
  return { ok: issues.every((item) => item.severity !== "error"), value: issues.length ? undefined : value as unknown as ScenarioSet, issues };
}

export function validateVisualSpec(value: unknown): ValidationResult<VisualSpec> {
  const issues: ValidationIssue[] = [];
  if (!baseChecks(value, "visualSpec", issues)) return { ok: false, issues };
  if (value.schemaVersion !== POSSIBILITY_SCHEMA_VERSION) issues.push(issue("visualSpec.schemaVersion", "Unsupported schema version."));
  ["id", "scenarioId", "title", "generatedBy"].forEach((key) => text(value[key], `visualSpec.${key}`, issues));
  if (!arraySize(value.nodes, "visualSpec.nodes", issues)) return { ok: false, issues };
  if (!arraySize(value.edges, "visualSpec.edges", issues)) return { ok: false, issues };
  (value.nodes as unknown[]).forEach((node, index) => {
    if (!baseChecks(node, `visualSpec.nodes[${index}]`, issues)) return;
    ["id", "label", "kind"].forEach((key) => text(node[key], `visualSpec.nodes[${index}].${key}`, issues));
    stringList(node.evidenceIds, `visualSpec.nodes[${index}].evidenceIds`, issues);
  });
  (value.edges as unknown[]).forEach((edge, index) => {
    if (!baseChecks(edge, `visualSpec.edges[${index}]`, issues)) return;
    ["id", "from", "to", "label", "kind"].forEach((key) => text(edge[key], `visualSpec.edges[${index}].${key}`, issues));
    stringList(edge.evidenceIds, `visualSpec.edges[${index}].evidenceIds`, issues);
  });
  return { ok: issues.every((item) => item.severity !== "error"), value: issues.length ? undefined : value as unknown as VisualSpec, issues };
}
