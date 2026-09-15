import type { EvidenceBrief, PossibilityScenario, ScenarioSet } from "./types";
import { POSSIBILITY_SCHEMA_VERSION } from "./types";

export const QUANTUM_REASONING_SYSTEM_PROMPT = `You are the SciLoop Quantum Possibilities Reasoning Engine.

Transform scientific knowledge into a causal model of how human understanding, technology, experimentation, or capability changed through a discovery.

Always reason using: BEFORE → DISCOVERY → TRANSFORMATION → AFTER → POSSIBILITY.

Reconstruct what was known, unknown, observable, measurable, calculable, buildable, and limited before the discovery. Identify the mechanism revealed, the previous assumption changed, and the new variable or capability. Derive what became possible, easier, measurable, predictable, or buildable, then explore conditional future technologies, experiments, questions, and second-order effects.

Never confuse ESTABLISHED FACT with INFERENCE or SPECULATION. Label speculative conclusions explicitly. Never invent scientific facts, historical events, experiments, equations, measurements, or technological capabilities. Respect physical laws and known constraints; reject and explain possibilities that violate established physics. Prefer causal mechanisms over vague statements.

The final reasoning must allow another AI system to convert the result into a visual scene without reinterpreting the science.`;

export type QuantumConfidence = "established" | "supported" | "speculative";

export interface QuantumAnalysis {
  schemaVersion: typeof POSSIBILITY_SCHEMA_VERSION;
  discovery: { title: string; domain: string; summary: string };
  before: {
    knowledgeState: string;
    technologyState: string;
    measurementCapability: string;
    majorLimitations: string[];
    dominantModel: string;
  };
  discoveryMechanism: {
    whatWasDiscovered: string;
    mechanism: string;
    previousAssumptionChanged: string;
    newCapability: string;
  };
  transition: {
    removedLimitations: string[];
    newCapabilities: string[];
    causalChain: string[];
  };
  after: {
    scientificState: string;
    technologyState: string;
    humanCapability: string;
  };
  counterfactual: {
    withoutDiscovery: {
      limitationsRemain: string[];
      technologiesLikelyDelayed: string[];
      questionsRemainInaccessible: string[];
      alternatives: string[];
    };
    comparison: string;
  };
  impactModel: {
    knowledgeChange: number;
    technologyChange: number;
    measurementChange: number;
    predictionChange: number;
    engineeringChange: number;
    civilizationImpact: number;
  };
  futurePossibilities: Array<{
    possibility: string;
    whyItCouldHappen: string;
    mechanism: string;
    confidence: QuantumConfidence;
    whatIsAlreadyPossible: string;
    requiredBreakthroughs: string[];
  }>;
  visualScene: {
    beforeScene: string;
    discoveryScene: string;
    afterScene: string;
    futureScene: string;
    transitionAnimation: string;
  };
  generatedBy: "deterministic-reasoner";
  disclaimer: string;
}

const DISCLAIMER = "SciLoop Impact Model scores are qualitative comparisons, not objective scientific measurements. Future possibilities are conditional scenarios, not predictions.";

function first(items: string[], fallback: string) {
  return items[0] ?? fallback;
}

function firstMany(items: string[], fallback: string) {
  return items.length ? items.slice(0, 4) : [fallback];
}

function score(count: number, base = 34) {
  return Math.min(96, base + count * 12);
}

function scenarioConfidence(scenario: PossibilityScenario): QuantumConfidence {
  if (scenario.classification === "supported") return "established";
  if (scenario.classification === "plausible") return "supported";
  return "speculative";
}

function futurePossibilities(brief: EvidenceBrief, scenarios: ScenarioSet) {
  return scenarios.scenarios.slice(0, 3).map((scenario) => ({
    possibility: scenario.title,
    whyItCouldHappen: scenario.summary,
    mechanism: scenario.causalChain.map((step) => step.explanation).join(" Then "),
    confidence: scenarioConfidence(scenario),
    whatIsAlreadyPossible: first(scenario.potentialBenefits, brief.currentState),
    requiredBreakthroughs: scenario.requiredConditions.length ? scenario.requiredConditions : brief.dependencies,
  }));
}

export function buildQuantumAnalysis(brief: EvidenceBrief, scenarios: ScenarioSet): QuantumAnalysis {
  const history = brief.history?.length ? brief.history.join(" ") : "The historical record supplied for this signal is limited; the current brief is the basis for this reconstruction.";
  const limitations = firstMany(brief.constraints, "The decisive technical and scientific limitations are not yet established.");
  const dependencies = firstMany(brief.dependencies, "Additional evidence and engineering progress are required.");
  const facts = brief.evidence.filter((entry) => entry.kind === "fact").map((entry) => entry.statement);
  const unknowns = firstMany(brief.unknowns, "The important unknowns remain open.");
  const currentCapability = first(facts, brief.currentState);
  const capability = first(dependencies, "A new capability emerges from the mechanism described in the discovery.");

  return {
    schemaVersion: POSSIBILITY_SCHEMA_VERSION,
    discovery: { title: brief.title, domain: brief.field, summary: brief.currentState },
    before: {
      knowledgeState: history,
      technologyState: `Before this frontier, the working capability was bounded by ${first(limitations, "known constraints").toLowerCase()}.`,
      measurementCapability: `Researchers could observe the existing system, but measurement and prediction were limited by ${first(limitations, "the supplied constraints").toLowerCase()}.`,
      majorLimitations: limitations,
      dominantModel: `The prior model treated ${brief.subject} as a system whose useful performance depended on overcoming ${first(limitations, "unresolved limitations").toLowerCase()}.`,
    },
    discoveryMechanism: {
      whatWasDiscovered: currentCapability,
      mechanism: brief.mechanism,
      previousAssumptionChanged: `The discovery challenges the assumption that ${brief.subject} must remain limited by ${first(limitations, "the current bottleneck").toLowerCase()}.`,
      newCapability: capability,
    },
    transition: {
      removedLimitations: limitations,
      newCapabilities: dependencies,
      causalChain: [
        `Existing state: ${brief.currentState}`,
        `Mechanism: ${brief.mechanism}`,
        `New degree of freedom: ${capability}`,
        `Conditioned outcome: future progress depends on ${first(dependencies, "further validation").toLowerCase()}.`,
      ],
    },
    after: {
      scientificState: `The field can now investigate ${brief.subject} with the mechanism described in the discovery, while keeping ${unknowns[0].toLowerCase()} explicit.`,
      technologyState: `Systems can be designed around ${capability.toLowerCase()}, but the supplied constraints still determine whether they scale.`,
      humanCapability: `People gain a more controllable way to study, measure, or build around ${brief.subject}.`,
    },
    counterfactual: {
      withoutDiscovery: {
        limitationsRemain: limitations,
        technologiesLikelyDelayed: dependencies.map((item) => `${item} would likely remain harder to develop.`),
        questionsRemainInaccessible: unknowns,
        alternatives: [`Researchers would likely continue improving adjacent approaches to ${brief.subject}.`, "The field could progress, but without this mechanism as a direct route."],
      },
      comparison: `Without the discovery, ${first(limitations, "the core limitation").toLowerCase()} remains the organizing constraint. With it, the constraint becomes an engineering or evidence problem that can be tested through ${first(dependencies, "further experiments").toLowerCase()}.`,
    },
    impactModel: {
      knowledgeChange: score(facts.length),
      technologyChange: score(dependencies.length, 30),
      measurementChange: score(brief.evidence.length, 28),
      predictionChange: score(brief.evidence.filter((entry) => entry.kind !== "unknown").length, 30),
      engineeringChange: score(limitations.length, 32),
      civilizationImpact: score(scenarios.scenarios.filter((scenario) => scenario.classification !== "speculative").length, 30),
    },
    futurePossibilities: futurePossibilities(brief, scenarios),
    visualScene: {
      beforeScene: `A research or engineering environment showing ${first(limitations, "the original bottleneck").toLowerCase()} and the limited capability before ${brief.title}.`,
      discoveryScene: `Researchers isolate the mechanism: ${brief.mechanism}`,
      afterScene: `The mechanism is connected to a new system built around ${capability.toLowerCase()}, with remaining constraints visible.`,
      futureScene: `Conditional branches show ${scenarios.scenarios.map((scenario) => scenario.title).join(", ")}.`,
      transitionAnimation: "The limiting state contracts into the discovered mechanism, then branches into condition-dependent outcomes; uncertainty remains visible instead of becoming a promise.",
    },
    generatedBy: "deterministic-reasoner",
    disclaimer: DISCLAIMER,
  };
}
