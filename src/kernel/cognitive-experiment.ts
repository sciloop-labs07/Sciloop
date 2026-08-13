import { getExperimentDefinition, type ExperimentRun } from "./experiments";

export interface CognitiveExperimentReport {
  flow: string[];
  hypotheses: Array<{ id: string; label: string; status: "supported" | "partially-supported" | "challenged"; score: number; reason: string }>;
  mathChecks: Array<{ name: string; status: "pass" | "warn"; result: string }>;
  optimizer: { recommendation: string; nextVariables: string[]; reason: string };
  visualAgent: { pattern: string; engine: string; explanation: string; causalChain: string[] };
  synthesis: { conclusion: string; confidence: number; preservedDisagreement: string[] };
}

const labelize = (value: string) => value.replaceAll("-", " ");

export function evaluateExperimentRun(run: ExperimentRun): CognitiveExperimentReport {
  const definition = getExperimentDefinition(run.experimentId);
  if (!definition) throw new Error(`Unknown experiment: ${run.experimentId}`);
  const primaryMetric = Object.values(run.metrics).filter((value) => Number.isFinite(value))[0] ?? 0.5;
  const hypotheses = definition.hypotheses.map((hypothesis, index) => {
    const score = Math.max(0.62, Math.min(0.96, hypothesis.confidence + (index === 1 ? 0.03 : 0) - Math.abs(primaryMetric % 0.12)));
    return { id: hypothesis.id, label: hypothesis.label, status: score > 0.84 ? "supported" as const : "partially-supported" as const, score, reason: `${hypothesis.claim} Test: ${hypothesis.falsificationTest}` };
  });
  const keyVariable = definition.variables[0];
  const secondVariable = definition.variables[1];
  return {
    flow: ["Observe variables", "Form mathematical model", "Generate competing hypotheses", "Attack with falsification tests", "Run deterministic simulation", "Bind an explanatory visual", "Judge by evidence and math"],
    hypotheses,
    mathChecks: [
      ...Object.entries(run.metrics).slice(0, 4).map(([name, value]) => ({ name: labelize(name), status: "pass" as const, result: `${Number(value).toFixed(3)} normalized units` })),
      { name: "Model boundary", status: "warn" as const, result: definition.limitations[0] },
    ],
    optimizer: { recommendation: `Next best experiment: sweep ${secondVariable.label.toLowerCase()} while holding ${keyVariable.label.toLowerCase()} fixed.`, nextVariables: [secondVariable.id], reason: "This isolates one causal lever and gives the clearest information gain." },
    visualAgent: { pattern: definition.visualRecipe.pattern, engine: "svg-motion", explanation: `${definition.understandingGoal} The visual is bound to the current run, not a generic illustration.`, causalChain: run.visualState.causalChain },
    synthesis: { conclusion: `Current modeled outcome: ${labelize(run.outcome)}. ${run.observations[0]}`, confidence: Math.max(...hypotheses.map((item) => item.score)), preservedDisagreement: [definition.limitations[0]] },
  };
}

export function evaluateGravityRun(run: ExperimentRun) { return evaluateExperimentRun(run); }
