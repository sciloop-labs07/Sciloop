import {
  POSSIBILITY_SCHEMA_VERSION,
  type EvidenceBrief,
  type PossibilityLens,
  type PossibilityScenario,
  type ScenarioHorizon,
  type ScenarioSet,
  type ValidationIssue,
  type VisualSpec,
} from "./types";
import { validateEvidenceBrief, validateScenarioSet, validateVisualSpec } from "./validator";
import { configuredPossibilityProviders, generatePossibilityJson } from "./aiProvider";
import { buildQuantumAnalysis, QUANTUM_REASONING_SYSTEM_PROMPT, type QuantumAnalysis } from "./quantum";

export interface PossibilityPipelineOptions {
  lens?: PossibilityLens;
  includeVisual?: boolean;
  requireAiPreparation?: boolean;
}

export interface PossibilityStageReport {
  stage: "evidence-validation" | "evidence-polishing" | "reasoning-model" | "scenario-generation" | "scenario-validation" | "visual-compilation" | "visual-validation";
  status: "completed" | "fallback" | "blocked";
  provider: "validator" | "deterministic-fallback" | "deterministic-compiler" | "deterministic-reasoner" | "ai-polisher" | "ai-scenario-engine" | "provider-router";
  detail: string;
}

export interface PossibilityPipelineSuccess {
  ok: true;
  brief: EvidenceBrief;
  preparation: {
    status: "ai" | "verified-fallback";
    provider: string;
    detail: string;
  };
  analysis: QuantumAnalysis;
  scenarios: ScenarioSet;
  visuals: VisualSpec[];
  stages: PossibilityStageReport[];
  warnings: string[];
}

export interface PossibilityPipelineFailure {
  ok: false;
  stages: PossibilityStageReport[];
  issues: ValidationIssue[];
}

export type PossibilityPipelineResult = PossibilityPipelineSuccess | PossibilityPipelineFailure;

const DISCLAIMER = "These are conditional scenarios, not guaranteed predictions. Classifications describe how directly each scenario follows from the current brief.";

function firstEvidenceId(brief: EvidenceBrief) {
  return brief.evidence[0]?.id ?? "unreferenced";
}

function firstItems(items: string[], count: number, fallback: string) {
  return items.slice(0, count).length ? items.slice(0, count) : [fallback];
}

function scenarioFor(
  brief: EvidenceBrief,
  lens: PossibilityLens,
  horizon: ScenarioHorizon,
  index: number,
): PossibilityScenario {
  const evidenceId = firstEvidenceId(brief);
  const horizonLabel = horizon === "near" ? "near-term" : horizon === "medium" ? "medium-term" : "long-term";
  const dependency = brief.dependencies[index % Math.max(brief.dependencies.length, 1)] ?? "additional evidence and engineering progress";
  const constraint = brief.constraints[index % Math.max(brief.constraints.length, 1)] ?? "unresolved constraints";
  const benefit = brief.unknowns[index % Math.max(brief.unknowns.length, 1)] ?? "clearer evidence of real-world usefulness";
  const titles = [
    `${brief.subject}: measured progress`,
    `${brief.subject}: scale through dependencies`,
    `${brief.subject}: system-level transformation`,
  ];
  const classifications = ["supported", "plausible", "speculative"] as const;
  const summaries = [
    `A ${horizonLabel} pathway where current work improves understanding or performance without assuming every open problem is solved.`,
    `A ${horizonLabel} pathway where progress depends on solving ${dependency.toLowerCase()}.`,
    `A ${horizonLabel} pathway where the innovation changes a wider system if several constraints are resolved together.`,
  ];
  const causalChain = [
    { id: `${brief.id}-step-current-${index}`, label: "Current capability", explanation: brief.currentState, evidenceIds: [evidenceId] },
    { id: `${brief.id}-step-trigger-${index}`, label: "Required change", explanation: dependency, evidenceIds: [evidenceId] },
    { id: `${brief.id}-step-outcome-${index}`, label: "Possible outcome", explanation: benefit, evidenceIds: [evidenceId] },
  ];
  return {
    id: `${brief.id}-scenario-${horizon}`,
    title: titles[index],
    summary: summaries[index],
    classification: classifications[index],
    horizon,
    lens,
    trigger: `Progress becomes meaningful when ${dependency.toLowerCase()} improves.`,
    causalChain,
    requiredConditions: firstItems(brief.dependencies, index + 1, "More reliable evidence is required."),
    potentialBenefits: [benefit],
    risks: [constraint],
    unknowns: firstItems(brief.unknowns, index + 1, "The decisive unknown has not been established."),
    falsifiers: [`Evidence that the mechanism cannot overcome ${constraint.toLowerCase()}.`],
    evidenceIds: [evidenceId],
  };
}

export function buildFallbackScenarioSet(brief: EvidenceBrief, lens: PossibilityLens = "scientific"): ScenarioSet {
  return {
    schemaVersion: POSSIBILITY_SCHEMA_VERSION,
    id: `${brief.id}-scenarios`,
    briefId: brief.id,
    scenarios: [
      scenarioFor(brief, lens, "near", 0),
      scenarioFor(brief, lens, "medium", 1),
      scenarioFor(brief, lens, "long", 2),
    ],
    generatedBy: "fallback",
    disclaimer: DISCLAIMER,
  };
}

export function compileVisualSpec(scenario: PossibilityScenario): VisualSpec {
  const [current, trigger, outcome] = scenario.causalChain;
  const nodes = [
    { id: current.id, label: current.label, kind: "state" as const, evidenceIds: current.evidenceIds },
    { id: trigger.id, label: trigger.label, kind: "condition" as const, evidenceIds: trigger.evidenceIds },
    { id: outcome.id, label: outcome.label, kind: "outcome" as const, evidenceIds: outcome.evidenceIds },
    { id: `${scenario.id}-risk`, label: "Constraint / risk", kind: "risk" as const, evidenceIds: scenario.evidenceIds },
  ];
  const edges = [
    { id: `${scenario.id}-edge-1`, from: current.id, to: trigger.id, label: "enables", kind: "enables" as const, evidenceIds: current.evidenceIds },
    { id: `${scenario.id}-edge-2`, from: trigger.id, to: outcome.id, label: "may cause", kind: "causes" as const, evidenceIds: trigger.evidenceIds },
    { id: `${scenario.id}-edge-3`, from: trigger.id, to: `${scenario.id}-risk`, label: "constrained by", kind: "constrains" as const, evidenceIds: scenario.evidenceIds },
  ];
  return {
    schemaVersion: POSSIBILITY_SCHEMA_VERSION,
    id: `${scenario.id}-visual`,
    scenarioId: scenario.id,
    title: `${scenario.title} · causal map`,
    nodes,
    edges,
    generatedBy: "deterministic-compiler",
  };
}

export function crossReferenceIssues(brief: EvidenceBrief, scenarios: ScenarioSet, visuals: VisualSpec[]) {
  const issues: ValidationIssue[] = [];
  const evidenceIds = new Set(brief.evidence.map((entry) => entry.id));
  const scenarioIds = new Set(scenarios.scenarios.map((scenario) => scenario.id));
  const checkEvidence = (ids: string[], path: string) => ids.forEach((id) => {
    if (id !== "unreferenced" && !evidenceIds.has(id)) issues.push({ path, message: `Unknown evidence id: ${id}`, severity: "error" });
  });
  scenarios.scenarios.forEach((scenario, index) => {
    checkEvidence(scenario.evidenceIds, `scenarios[${index}].evidenceIds`);
    scenario.causalChain.forEach((step, stepIndex) => checkEvidence(step.evidenceIds, `scenarios[${index}].causalChain[${stepIndex}].evidenceIds`));
  });
  visuals.forEach((visual, visualIndex) => {
    if (!scenarioIds.has(visual.scenarioId)) issues.push({ path: `visuals[${visualIndex}].scenarioId`, message: "Visual references an unknown scenario.", severity: "error" });
    const nodeIds = new Set(visual.nodes.map((node) => node.id));
    visual.edges.forEach((edge, edgeIndex) => {
      if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) issues.push({ path: `visuals[${visualIndex}].edges[${edgeIndex}]`, message: "Visual edge references an unknown node.", severity: "error" });
      checkEvidence(edge.evidenceIds, `visuals[${visualIndex}].edges[${edgeIndex}].evidenceIds`);
    });
  });
  return issues;
}

function parseJsonObject(content: string): unknown | undefined {
  if (content.length > 250_000) return undefined;
  const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start < 0 || end <= start) return undefined;
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      return undefined;
    }
  }
}

function normalizeStringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === "string") return item;
    if (!item || typeof item !== "object") return String(item ?? "");
    const record = item as Record<string, unknown>;
    return String(record.explanation || record.label || record.text || "").trim();
  }).filter(Boolean);
}

function normalizeScenarioSetCandidate(value: unknown, brief: EvidenceBrief, lens: PossibilityLens) {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  const scenarios = Array.isArray(raw.scenarios) ? raw.scenarios.map((item, index) => {
    if (!item || typeof item !== "object") return item;
    const scenario = item as Record<string, unknown>;
    const scenarioId = String(scenario.id || `scenario-${index + 1}`);
    const horizon = ["near", "medium", "long"].includes(String(scenario.horizon)) ? String(scenario.horizon) : (["near", "medium", "long"][index] || "long");
    const classification = ["supported", "plausible", "speculative"].includes(String(scenario.classification)) ? String(scenario.classification) : (horizon === "near" ? "supported" : horizon === "medium" ? "plausible" : "speculative");
    const causalChain = Array.isArray(scenario.causalChain)
      ? scenario.causalChain.map((step, stepIndex) => {
        if (!step || typeof step !== "object") return step;
        const normalizedStep = step as Record<string, unknown>;
        return {
          ...normalizedStep,
          id: String(normalizedStep.id || `${scenarioId}-step-${stepIndex}`),
          label: String(normalizedStep.label || `Causal step ${stepIndex + 1}`),
          explanation: String(normalizedStep.explanation || normalizedStep.label || "Further validation is required."),
          evidenceIds: normalizeStringList(normalizedStep.evidenceIds),
        };
      })
      : [];
    const fallbackEvidenceIds = [brief.evidence[0]?.id || "unreferenced"];
    const seedSteps = causalChain.length ? causalChain : [{
      id: `${scenarioId}-step-1`,
      label: "Current evidence",
      explanation: brief.currentState,
      evidenceIds: fallbackEvidenceIds,
    }];
    // The visual compiler renders a three-part current → condition → outcome
    // map. Providers sometimes return only one or two causal steps even when
    // the rest of the scenario is valid, so pad the validated representation
    // before compilation instead of allowing an undefined node to crash QP.
    const safeCausalChain = Array.from({ length: 3 }, (_, stepIndex) => seedSteps[stepIndex] || {
      id: `${scenarioId}-step-${stepIndex + 1}`,
      label: stepIndex === 1 ? "Required condition" : "Possible outcome",
      explanation: stepIndex === 1
        ? (brief.dependencies[0] || "Further validation is required.")
        : (brief.unknowns[0] || "The outcome remains conditional."),
      evidenceIds: fallbackEvidenceIds,
    });
    const trigger = Array.isArray(scenario.trigger)
      ? normalizeStringList(scenario.trigger)[0] || "Further validation is required."
      : String(scenario.trigger || "Further validation is required.");
    return {
      ...scenario,
      id: scenarioId,
      title: String(scenario.title || `${brief.field} conditional pathway`),
      summary: String(scenario.summary || "A conditional pathway that requires further validation."),
      classification,
      horizon,
      trigger,
      lens: ["scientific", "technical", "economic", "social", "environmental", "governance"].includes(String(scenario.lens))
        ? scenario.lens
        : lens,
      causalChain: safeCausalChain,
      requiredConditions: normalizeStringList(scenario.requiredConditions),
      potentialBenefits: normalizeStringList(scenario.potentialBenefits),
      risks: normalizeStringList(scenario.risks),
      unknowns: normalizeStringList(scenario.unknowns),
      falsifiers: normalizeStringList(scenario.falsifiers),
      evidenceIds: normalizeStringList(scenario.evidenceIds).length ? normalizeStringList(scenario.evidenceIds) : [brief.evidence[0]?.id || "unreferenced"],
    };
  }) : [];
  return {
    ...raw,
    id: String(raw.id || `${brief.id}-scenarios`),
    scenarios,
    schemaVersion: POSSIBILITY_SCHEMA_VERSION,
    briefId: brief.id,
    generatedBy: "ai-scenario-engine",
    disclaimer: String(raw.disclaimer || "Conditional scenarios, not predictions."),
  };
}

function normalizeEvidenceBriefCandidate(value: unknown, sourceBrief: EvidenceBrief) {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  const sourceFallback = sourceBrief.sources[0];
  const sources = (Array.isArray(raw.sources) && raw.sources.length ? raw.sources : sourceBrief.sources).map((item, index) => {
    const source = item && typeof item === "object" ? item as Record<string, unknown> : {};
    const sourceType = ["paper", "official", "dataset", "report", "news", "user-input", "unknown"].includes(String(source.sourceType))
      ? String(source.sourceType)
      : "unknown";
    return {
      ...source,
      id: String(source.id || `source-${index + 1}`),
      title: String(source.title || sourceFallback?.title || "Supplied source"),
      publisher: String(source.publisher || sourceFallback?.publisher || "Supplied source"),
      sourceType,
      url: typeof source.url === "string" ? source.url : "",
    };
  });
  const evidence = (Array.isArray(raw.evidence) && raw.evidence.length ? raw.evidence : sourceBrief.evidence).map((item, index) => {
    const entry = item && typeof item === "object" ? item as Record<string, unknown> : {};
    const kind = ["fact", "inference", "speculation", "unknown"].includes(String(entry.kind)) ? String(entry.kind) : "unknown";
    const strength = ["strong", "moderate", "weak", "unverified"].includes(String(entry.strength)) ? String(entry.strength) : "unverified";
    return {
      ...entry,
      id: String(entry.id || `evidence-${index + 1}`),
      statement: String(entry.statement || "Evidence statement requires review."),
      kind,
      strength,
      sourceIds: normalizeStringList(entry.sourceIds).length ? normalizeStringList(entry.sourceIds) : [String(sources[0]?.id || "source-1")],
      rationale: typeof entry.rationale === "string" ? entry.rationale : "AI-prepared from the supplied brief.",
    };
  });
  return {
    ...raw,
    schemaVersion: POSSIBILITY_SCHEMA_VERSION,
    id: String(raw.id || sourceBrief.id),
    subject: String(raw.subject || sourceBrief.subject),
    title: String(raw.title || sourceBrief.title),
    field: String(raw.field || sourceBrief.field),
    currentState: String(raw.currentState || sourceBrief.currentState),
    mechanism: String(raw.mechanism || sourceBrief.mechanism),
    history: normalizeStringList(raw.history).length ? normalizeStringList(raw.history) : sourceBrief.history || [],
    evidence,
    constraints: normalizeStringList(raw.constraints).length ? normalizeStringList(raw.constraints) : sourceBrief.constraints,
    dependencies: normalizeStringList(raw.dependencies).length ? normalizeStringList(raw.dependencies) : sourceBrief.dependencies,
    unknowns: normalizeStringList(raw.unknowns).length ? normalizeStringList(raw.unknowns) : sourceBrief.unknowns,
    sources,
    generatedBy: "ai-polisher",
  };
}

function attemptSummary(result: { attempts?: Array<{ provider: string; status: string; reason?: string }> } | null) {
  if (!result?.attempts?.length) return "No configured provider attempts were made.";
  return result.attempts.map((attempt) => `${attempt.provider}:${attempt.status}${attempt.reason ? ` (${attempt.reason})` : ""}`).join(" → ");
}

function containsUnsupportedProbability(value: unknown) {
  return /\b\d{1,3}\s*%|\b\d{1,3}\s*percent\b/i.test(JSON.stringify(value));
}

function evidencePolisherPrompts(brief: EvidenceBrief) {
  return {
    system: `${QUANTUM_REASONING_SYSTEM_PROMPT}\n\nYou are SciLoop AI1, the evidence-preparation stage before Quantum Possibilities. Produce a careful, source-limited research packet for AI2. Return ONLY one JSON object matching the supplied EvidenceBrief shape. Improve clarity and completeness using only the supplied material. Preserve every source id and do not add citations. Separate facts, inferences, speculation, and unknowns. Never invent a source, person, date, number, result, historical event, or technical capability. Do not create probability percentages. If something is unsupported, mark it unknown and add it to unknowns. Keep constraints and dependencies concrete. Set generatedBy to ai-polisher.`,
    user: `Prepare this innovation for Quantum Possibilities. The packet must be useful for a causal BEFORE → DISCOVERY → TRANSFORMATION → AFTER → POSSIBILITY analysis, while remaining honest about evidence limits. Keep the same schema and IDs where possible.\n\n${JSON.stringify(brief)}`,
  };
}

function scenarioEnginePrompts(brief: EvidenceBrief) {
  return {
    system: `${QUANTUM_REASONING_SYSTEM_PROMPT}\n\nYou are SciLoop AI2, a future-possibility engine. Return ONLY one JSON object matching the supplied ScenarioSet shape. Generate exactly three conditional scenarios: near, medium, and long. Use classifications supported, plausible, or speculative; never output probabilities or percentages. Every causal step and scenario claim must reference an existing evidence id. Include conditions, benefits, risks, unknowns, and falsifiers. These are scenarios, not predictions. Set generatedBy to ai-scenario-engine.\n\nRequired JSON shape (use the exact keys; arrays must be present):\n{"schemaVersion":"0.1","id":"<id>","briefId":"${brief.id}","scenarios":[{"id":"<id>","title":"<title>","summary":"<conditional summary>","classification":"supported","horizon":"near","lens":"scientific","trigger":"<condition>","causalChain":[{"id":"<id>","label":"<label>","explanation":"<explanation>","evidenceIds":["${brief.evidence[0]?.id || "e1"}"]}],"requiredConditions":[],"potentialBenefits":[],"risks":[],"unknowns":[],"falsifiers":[],"evidenceIds":["${brief.evidence[0]?.id || "e1"}"]}],"generatedBy":"ai-scenario-engine","disclaimer":"Conditional scenarios, not predictions."}\nUse the same structure three times with horizons near, medium, and long.`,
    user: `Generate a careful possibility set from this validated EvidenceBrief. Do not add facts that are not present.\n\n${JSON.stringify(brief)}`,
  };
}

export async function runPossibilityAiPipeline(brief: unknown, options: PossibilityPipelineOptions = {}): Promise<PossibilityPipelineResult> {
  const initial = validateEvidenceBrief(brief);
  const stages: PossibilityStageReport[] = [];
  if (!initial.ok || !initial.value) {
    stages.push({ stage: "evidence-validation", status: "blocked", provider: "validator", detail: "Evidence brief failed validation." });
    return { ok: false, stages, issues: initial.issues };
  }
  stages.push({ stage: "evidence-validation", status: "completed", provider: "validator", detail: "Evidence brief accepted." });

  const fallback = runPossibilityPipeline(initial.value, options);
  if (!fallback.ok) return fallback;

  let polishedBrief = initial.value;
  let preparation: PossibilityPipelineSuccess["preparation"] = {
    status: "verified-fallback",
    provider: "verified source brief",
    detail: "The verified source brief was used because no AI preparation provider is configured.",
  };
  const configured = configuredPossibilityProviders();
  if (!configured.length) {
    stages.push({ stage: "evidence-polishing", status: "fallback", provider: "provider-router", detail: "No possibility provider is configured; using the verified evidence brief." });
    if (options.requireAiPreparation) {
      stages.push({ stage: "evidence-polishing", status: "blocked", provider: "provider-router", detail: "Quantum Possibilities was stopped because no SciLoop AI preparation provider is configured." });
      return {
        ok: false,
        stages,
        issues: [{ path: "brief", message: "Configure a real AI provider before generating Quantum Possibilities.", severity: "error" }],
      };
    }
  } else {
    const polish = evidencePolisherPrompts(initial.value);
    const polishResult = await generatePossibilityJson(polish.system, polish.user, {
      providers: configured,
      accept: (content) => {
        const parsed = parseJsonObject(content);
        const candidate = normalizeEvidenceBriefCandidate(parsed, initial.value!);
        return validateEvidenceBrief(candidate).ok;
      },
    });
    const parsed = polishResult ? parseJsonObject(polishResult.content) : undefined;
    const candidate = normalizeEvidenceBriefCandidate(parsed, initial.value);
    const validation = validateEvidenceBrief(candidate);
    if (polishResult && validation.ok && validation.value) {
      polishedBrief = validation.value;
      preparation = {
        status: "ai",
        provider: polishResult.provider,
        detail: `SciLoop AI prepared and validated the evidence packet with ${polishResult.provider}. Attempts: ${attemptSummary(polishResult)}.`,
      };
      stages.push({ stage: "evidence-polishing", status: "completed", provider: "ai-polisher", detail: `Evidence brief polished by ${polishResult.provider}. Attempts: ${attemptSummary(polishResult)}.` });
    } else {
      stages.push({ stage: "evidence-polishing", status: "fallback", provider: "provider-router", detail: `AI1 output was unavailable or failed validation. Attempts: ${attemptSummary(polishResult)}.` });
      if (options.requireAiPreparation) {
        stages.push({ stage: "evidence-polishing", status: "blocked", provider: "provider-router", detail: `Quantum Possibilities was stopped because SciLoop AI could not produce a validated evidence packet. Attempts: ${attemptSummary(polishResult)}.` });
        return {
          ok: false,
          stages,
          issues: [{ path: "brief", message: "SciLoop AI evidence preparation did not return a validated packet.", severity: "error" }],
        };
      }
    }
  }

  let scenarios = buildFallbackScenarioSet(polishedBrief, options.lens);
  const scenarioProvider = configured.length > 0;
  if (scenarioProvider) {
    const prompt = scenarioEnginePrompts(polishedBrief);
    const scenarioResult = await generatePossibilityJson(prompt.system, prompt.user, {
      providers: configured,
      accept: (content) => {
        const parsed = parseJsonObject(content);
        const candidate = normalizeScenarioSetCandidate(parsed, polishedBrief, options.lens || "scientific");
        const validation = validateScenarioSet(candidate);
        return Boolean(validation.ok && validation.value && !crossReferenceIssues(polishedBrief, validation.value, []).length && !containsUnsupportedProbability(validation.value));
      },
    });
    const parsed = scenarioResult ? parseJsonObject(scenarioResult.content) : undefined;
    const candidate = normalizeScenarioSetCandidate(parsed, polishedBrief, options.lens || "scientific");
    const validation = validateScenarioSet(candidate);
    const candidateScenarios = validation.value;
    const references = candidateScenarios ? crossReferenceIssues(polishedBrief, candidateScenarios, []) : [];
    if (scenarioResult && validation.ok && candidateScenarios && !references.length && !containsUnsupportedProbability(candidateScenarios)) {
      scenarios = candidateScenarios;
      stages.push({ stage: "scenario-generation", status: "completed", provider: "ai-scenario-engine", detail: `Scenarios generated by ${scenarioResult.provider}. Attempts: ${attemptSummary(scenarioResult)}.` });
    } else {
      stages.push({ stage: "scenario-generation", status: "fallback", provider: "provider-router", detail: `AI2 output was unavailable or failed validation; using deterministic scenarios. Attempts: ${attemptSummary(scenarioResult)}.` });
    }
  } else {
    stages.push({ stage: "scenario-generation", status: "fallback", provider: "deterministic-fallback", detail: "No possibility provider is configured; generated deterministic scenarios." });
  }

  stages.push({ stage: "scenario-validation", status: "completed", provider: "validator", detail: "Scenario set accepted." });
  const analysis = buildQuantumAnalysis(polishedBrief, scenarios);
  stages.push({ stage: "reasoning-model", status: "completed", provider: "deterministic-reasoner", detail: "Built the BEFORE → DISCOVERY → AFTER → POSSIBILITY causal model." });
  const visuals = options.includeVisual === false ? [] : scenarios.scenarios.map(compileVisualSpec);
  stages.push({ stage: "visual-compilation", status: "completed", provider: "deterministic-compiler", detail: "Compiled causal maps from validated scenario structure." });
  const visualIssues = visuals.flatMap((visual) => validateVisualSpec(visual).issues);
  const referenceIssues = crossReferenceIssues(polishedBrief, scenarios, visuals);
  stages.push({ stage: "visual-validation", status: visualIssues.length || referenceIssues.length ? "blocked" : "completed", provider: "validator", detail: visualIssues.length || referenceIssues.length ? "Visual specification failed validation." : "Visual specifications accepted." });
  if (visualIssues.length || referenceIssues.length) return { ok: false, stages, issues: [...visualIssues, ...referenceIssues] };
  return {
    ok: true,
    brief: polishedBrief,
    preparation,
    analysis,
    scenarios,
    visuals,
    stages,
    warnings: [DISCLAIMER, ...(configured.length ? [] : ["AI providers are not configured; SciLoop is showing deterministic scenarios."])],
  };
}

export function runPossibilityPipeline(brief: unknown, options: PossibilityPipelineOptions = {}): PossibilityPipelineResult {
  const stages: PossibilityStageReport[] = [];
  const briefResult = validateEvidenceBrief(brief);
  if (!briefResult.ok || !briefResult.value) {
    stages.push({ stage: "evidence-validation", status: "blocked", provider: "validator", detail: "Evidence brief failed validation." });
    return { ok: false, stages, issues: briefResult.issues };
  }
  stages.push({ stage: "evidence-validation", status: "completed", provider: "validator", detail: "Evidence brief accepted." });

  const scenarioSet = buildFallbackScenarioSet(briefResult.value, options.lens);
  stages.push({ stage: "scenario-generation", status: "fallback", provider: "deterministic-fallback", detail: "Generated three conditional scenarios without making unsupported probability claims." });
  const scenarioResult = validateScenarioSet(scenarioSet);
  if (!scenarioResult.ok || !scenarioResult.value) {
    stages.push({ stage: "scenario-validation", status: "blocked", provider: "validator", detail: "Generated scenario set failed validation." });
    return { ok: false, stages, issues: scenarioResult.issues };
  }
  stages.push({ stage: "scenario-validation", status: "completed", provider: "validator", detail: "Scenario set accepted." });

  const analysis = buildQuantumAnalysis(briefResult.value, scenarioSet);
  stages.push({ stage: "reasoning-model", status: "completed", provider: "deterministic-reasoner", detail: "Built the BEFORE → DISCOVERY → AFTER → POSSIBILITY causal model." });
  const visuals = options.includeVisual === false ? [] : scenarioSet.scenarios.map(compileVisualSpec);
  if (visuals.length) stages.push({ stage: "visual-compilation", status: "completed", provider: "deterministic-compiler", detail: "Compiled causal maps from validated scenario structure." });
  const visualIssues = visuals.flatMap((visual) => validateVisualSpec(visual).issues);
  stages.push({ stage: "visual-validation", status: visualIssues.length ? "blocked" : "completed", provider: "validator", detail: visualIssues.length ? "Visual specification failed validation." : "Visual specifications accepted." });
  const referenceIssues = crossReferenceIssues(briefResult.value, scenarioSet, visuals);
  if (visualIssues.length || referenceIssues.length) return { ok: false, stages, issues: [...visualIssues, ...referenceIssues] };
  return {
    ok: true,
    brief: briefResult.value,
    preparation: {
      status: "verified-fallback",
      provider: "verified source brief",
      detail: "The deterministic path used the verified source brief without an AI preparation call.",
    },
    analysis,
    scenarios: scenarioSet,
    visuals,
    stages,
    warnings: [DISCLAIMER],
  };
}
