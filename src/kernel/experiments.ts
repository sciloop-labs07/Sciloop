import { gravityWellDemo } from "@/src/examples/gravityWell";
import { createRecipeFromPattern } from "@/src/visual-engine/patterns";

export interface ExperimentVariable {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  description: string;
}

export interface ExperimentHypothesis {
  id: string;
  label: string;
  claim: string;
  assumptions: string[];
  falsificationTest: string;
  confidence: number;
}

export type ExperimentVisualKind = "orbit" | "reaction" | "ecosystem" | "climate" | "circuit" | "epidemic" | "learning" | "materials";

export interface ExperimentDefinition {
  id: string;
  slug: string;
  title: string;
  field: string;
  question: string;
  understandingGoal: string;
  variables: ExperimentVariable[];
  hypotheses: ExperimentHypothesis[];
  limitations: string[];
  visualKind: ExperimentVisualKind;
  visualRecipe: ReturnType<typeof createRecipeFromPattern>;
  semanticGraph?: ReturnType<typeof gravityWellDemo.createGraph>;
}

export interface ExperimentRun {
  runId: string;
  experimentId: string;
  variables: Record<string, number>;
  outcome: string;
  observations: string[];
  metrics: Record<string, number>;
  visualState: {
    kind: ExperimentVisualKind;
    patternId: string;
    engine: "svg-motion";
    causalChain: string[];
    series: number[];
    trajectory?: Array<{ t: number; x: number; y: number; radius: number }>;
  };
}

export type GravityRun = ExperimentRun;

const variables = (items: ExperimentVariable[]) => items;

export const gravityOrbitExperiment: ExperimentDefinition = {
  id: "gravity-orbit", slug: "gravity-orbit", title: "Gravity Orbit: bound, balanced, or escaping?", field: "physics",
  question: "How do mass, distance, and initial velocity decide whether a particle falls inward, orbits, or escapes?",
  understandingGoal: "See the causal relationship between field strength, velocity thresholds, and trajectory shape.",
  variables: variables([
    { id: "mass", label: "Mass", value: 0.68, min: 0.1, max: 1, step: 0.01, unit: "relative", description: "Strength of the central source." },
    { id: "initialVelocity", label: "Initial velocity", value: 0.62, min: 0.05, max: 1.4, step: 0.01, unit: "relative", description: "Starting tangential velocity of the particle." },
    { id: "distance", label: "Distance", value: 0.58, min: 0.25, max: 1, step: 0.01, unit: "relative", description: "Starting distance from the mass." },
  ]),
  hypotheses: [
    { id: "h1", label: "Field-dominant", claim: "Increasing mass or reducing distance bends the path inward more strongly.", assumptions: ["The source is fixed", "The particle is small enough not to change the field"], falsificationTest: "Hold velocity constant and weaken the field; the inward tendency should reduce.", confidence: 0.82 },
    { id: "h2", label: "Velocity-dominant", claim: "Velocity decides: too low falls inward, near-threshold circulates, and high velocity escapes.", assumptions: ["The force is attractive", "No drag is applied"], falsificationTest: "Sweep velocity across the same field and look for regime changes.", confidence: 0.91 },
    { id: "h3", label: "Threshold regime", claim: "A mathematical band separates bound orbit from escape.", assumptions: ["The model is approximately inverse-square"], falsificationTest: "Search around circular and escape velocity for a sharp outcome transition.", confidence: 0.87 },
  ],
  limitations: ["Normalized educational model, not a relativistic n-body simulation.", "No drag, collisions, or measurement noise."],
  visualKind: "orbit", visualRecipe: createRecipeFromPattern("field-influence", "Gravity orbit threshold"), semanticGraph: gravityWellDemo.createGraph(),
};

export const reactionRateExperiment: ExperimentDefinition = {
  id: "reaction-rate", slug: "reaction-rate", title: "Reaction Rate: how fast does conversion happen?", field: "chemistry",
  question: "How do temperature, concentration, and catalyst strength change a reaction's conversion rate?",
  understandingGoal: "See why productive molecular collisions increase nonlinearly as conditions become more favorable.",
  variables: variables([
    { id: "temperature", label: "Temperature", value: 48, min: 10, max: 90, step: 1, unit: "°C", description: "Controls the fraction of collisions that clear the activation barrier." },
    { id: "concentration", label: "Concentration", value: 0.55, min: 0.1, max: 1, step: 0.01, unit: "relative", description: "Controls how often reactant molecules meet." },
    { id: "catalyst", label: "Catalyst", value: 0.35, min: 0, max: 1, step: 0.01, unit: "relative", description: "Lowers the modeled activation barrier without changing final equilibrium." },
  ]),
  hypotheses: [
    { id: "h1", label: "Collision-frequency", claim: "Higher concentration increases the rate by making collisions more frequent.", assumptions: ["Reactants are well mixed"], falsificationTest: "Raise concentration at fixed temperature and compare the early slope.", confidence: 0.85 },
    { id: "h2", label: "Activation-energy", claim: "Temperature and catalyst amplify productive collisions more than raw collision count alone.", assumptions: ["A single effective energy barrier"], falsificationTest: "Hold concentration fixed and compare a catalyst sweep.", confidence: 0.9 },
    { id: "h3", label: "Saturation", claim: "The conversion curve flattens as reactants are depleted.", assumptions: ["Closed batch system"], falsificationTest: "Continue the run after the initial fast phase.", confidence: 0.82 },
  ],
  limitations: ["Educational kinetic model; it does not identify a real chemical mechanism.", "Do not use it to choose laboratory conditions without domain-specific safety review."],
  visualKind: "reaction", visualRecipe: createRecipeFromPattern("cause-effect", "Reaction rate and activation barrier"),
};

export const ecosystemBalanceExperiment: ExperimentDefinition = {
  id: "ecosystem-balance", slug: "ecosystem-balance", title: "Ecosystem Balance: resilience or collapse?", field: "biology",
  question: "How do nutrient supply, predation pressure, and habitat quality shape a small ecosystem over time?",
  understandingGoal: "Understand delayed feedback: a population can look healthy before a resource or predator imbalance appears.",
  variables: variables([
    { id: "nutrients", label: "Nutrient supply", value: 0.62, min: 0.1, max: 1, step: 0.01, unit: "relative", description: "Baseline energy entering the food web." },
    { id: "predation", label: "Predation pressure", value: 0.38, min: 0, max: 1, step: 0.01, unit: "relative", description: "Top-down population control." },
    { id: "habitat", label: "Habitat quality", value: 0.7, min: 0.1, max: 1, step: 0.01, unit: "relative", description: "Carrying capacity and recovery potential." },
  ]),
  hypotheses: [
    { id: "h1", label: "Resource-first", claim: "Low nutrients cap growth regardless of low predation.", assumptions: ["Primary productivity is limiting"], falsificationTest: "Increase nutrients at fixed predation and compare carrying capacity.", confidence: 0.86 },
    { id: "h2", label: "Predator-control", claim: "High predation can stabilize an otherwise overshooting population.", assumptions: ["Predators track prey with a short delay"], falsificationTest: "Raise predation near high nutrients and inspect oscillation amplitude.", confidence: 0.79 },
    { id: "h3", label: "Resilience-threshold", claim: "Poor habitat lowers recovery until shocks cause a persistent decline.", assumptions: ["Habitat quality affects reproduction and refuge"], falsificationTest: "Lower habitat while holding other variables fixed and test recovery.", confidence: 0.9 },
  ],
  limitations: ["Conceptual population model, not a biodiversity assessment.", "It omits species-specific behavior, disease, and migration."],
  visualKind: "ecosystem", visualRecipe: createRecipeFromPattern("system-feedback-loop", "Ecosystem resilience feedback"),
};

export const climateAlbedoExperiment: ExperimentDefinition = {
  id: "climate-albedo", slug: "climate-albedo", title: "Climate Albedo: cooling feedback or warming lock-in?", field: "climate",
  question: "How do incoming energy, surface reflectivity, and greenhouse trapping shift a simplified climate balance?",
  understandingGoal: "Make competing warming and cooling feedbacks visible without claiming a real-world forecast.",
  variables: variables([
    { id: "solarInput", label: "Solar input", value: 0.6, min: 0.2, max: 1, step: 0.01, unit: "relative", description: "Incoming energy in the simplified system." },
    { id: "albedo", label: "Surface reflectivity", value: 0.42, min: 0.1, max: 0.9, step: 0.01, unit: "relative", description: "Fraction of incoming energy reflected away." },
    { id: "trapping", label: "Heat trapping", value: 0.48, min: 0, max: 1, step: 0.01, unit: "relative", description: "Retention of outgoing heat in the simplified system." },
  ]),
  hypotheses: [
    { id: "h1", label: "Energy-balance", claim: "Net warming follows absorbed energy plus retained heat.", assumptions: ["Single global energy box"], falsificationTest: "Increase albedo at fixed input and trapping; net balance should cool.", confidence: 0.9 },
    { id: "h2", label: "Albedo-feedback", claim: "Lower reflectivity can create a reinforcing warming loop.", assumptions: ["Reflectivity responds to warming direction"], falsificationTest: "Perturb albedo around a threshold and compare trajectory direction.", confidence: 0.84 },
    { id: "h3", label: "Trapping-dominant", claim: "High heat trapping can overwhelm modest reflective cooling.", assumptions: ["No ocean or regional delay is modeled"], falsificationTest: "Sweep trapping while keeping solar input and albedo fixed.", confidence: 0.87 },
  ],
  limitations: ["A teaching model only—not a climate projection or policy calculator.", "It omits ocean dynamics, geography, aerosols, and time lags."],
  visualKind: "climate", visualRecipe: createRecipeFromPattern("system-feedback-loop", "Climate energy and albedo feedback"),
};

export const circuitResonanceExperiment: ExperimentDefinition = {
  id: "circuit-resonance", slug: "circuit-resonance", title: "Circuit Resonance: signal clarity or loss?", field: "engineering",
  question: "How do drive frequency, resistance, and capacitance shape response in a simplified resonant circuit?",
  understandingGoal: "Make the tradeoff between tuned response, loss, and unstable overdrive visible.",
  variables: variables([
    { id: "frequency", label: "Drive frequency", value: 0.58, min: 0.1, max: 1, step: 0.01, unit: "relative", description: "Input frequency compared with the circuit's natural frequency." },
    { id: "resistance", label: "Resistance", value: 0.32, min: 0.05, max: 1, step: 0.01, unit: "relative", description: "Energy lost per cycle." },
    { id: "capacitance", label: "Capacitance", value: 0.62, min: 0.1, max: 1, step: 0.01, unit: "relative", description: "Energy storage and tuning control." },
  ]),
  hypotheses: [
    { id: "h1", label: "Tuning", claim: "Response peaks when drive and natural frequency align.", assumptions: ["Linear circuit approximation"], falsificationTest: "Sweep frequency while holding loss constant.", confidence: 0.9 },
    { id: "h2", label: "Loss-control", claim: "Higher resistance broadens and lowers the response peak.", assumptions: ["Resistance is frequency independent"], falsificationTest: "Increase resistance at the tuned point.", confidence: 0.86 },
    { id: "h3", label: "Storage-shift", claim: "Changing capacitance shifts the natural frequency and therefore the peak.", assumptions: ["Inductance is fixed"], falsificationTest: "Change capacitance and search for the new peak.", confidence: 0.84 },
  ], limitations: ["Normalized teaching model, not an electronics design tool.", "It omits component tolerances, nonlinearities, and safety limits."], visualKind: "circuit", visualRecipe: createRecipeFromPattern("energy-flow", "Circuit resonance response"),
};

export const epidemicDynamicsExperiment: ExperimentDefinition = {
  id: "epidemic-dynamics", slug: "epidemic-dynamics", title: "Epidemic Dynamics: contained or accelerating?", field: "public health",
  question: "How do contact rate, protection, and recovery change a simplified outbreak trajectory?",
  understandingGoal: "Show why small changes around the reproduction threshold create very different outcomes.",
  variables: variables([
    { id: "contactRate", label: "Contact rate", value: 0.56, min: 0.05, max: 1, step: 0.01, unit: "relative", description: "Opportunity for transmission in the model." },
    { id: "protection", label: "Protection", value: 0.34, min: 0, max: 1, step: 0.01, unit: "relative", description: "Combined reduction from protective measures." },
    { id: "recovery", label: "Recovery rate", value: 0.48, min: 0.05, max: 1, step: 0.01, unit: "relative", description: "How quickly infectious cases leave the transmission pool." },
  ]),
  hypotheses: [
    { id: "h1", label: "Threshold", claim: "When modeled reproduction falls below one, spread contracts.", assumptions: ["Homogeneous mixing"], falsificationTest: "Increase protection until the trajectory bends downward.", confidence: 0.92 },
    { id: "h2", label: "Contact-driven", claim: "Contact rate is the strongest accelerating lever near the threshold.", assumptions: ["Protection works uniformly"], falsificationTest: "Sweep contacts while holding recovery fixed.", confidence: 0.86 },
    { id: "h3", label: "Recovery-buffer", claim: "Faster recovery lowers the infectious pool even when contacts remain high.", assumptions: ["No reinfection in the run"], falsificationTest: "Increase recovery at constant contact rate.", confidence: 0.83 },
  ], limitations: ["Conceptual teaching model, not medical guidance or a local forecast.", "It omits age structure, networks, testing, and real epidemiological data."], visualKind: "epidemic", visualRecipe: createRecipeFromPattern("system-feedback-loop", "Epidemic threshold dynamics"),
};

export const neuralLearningExperiment: ExperimentDefinition = {
  id: "neural-learning", slug: "neural-learning", title: "Neural Learning: convergence or instability?", field: "computing",
  question: "How do learning rate, data noise, and regularization affect a simplified learning system?",
  understandingGoal: "Show the difference between rapid useful learning, slow learning, and unstable overshooting.",
  variables: variables([
    { id: "learningRate", label: "Learning rate", value: 0.46, min: 0.02, max: 1, step: 0.01, unit: "relative", description: "Size of each model update." },
    { id: "noise", label: "Data noise", value: 0.28, min: 0, max: 1, step: 0.01, unit: "relative", description: "Uncertainty in the training signal." },
    { id: "regularization", label: "Regularization", value: 0.4, min: 0, max: 1, step: 0.01, unit: "relative", description: "Constraint against brittle overfitting." },
  ]),
  hypotheses: [
    { id: "h1", label: "Step-size", claim: "An excessive learning rate destabilizes updates.", assumptions: ["Fixed optimization landscape"], falsificationTest: "Raise learning rate and inspect loss oscillation.", confidence: 0.9 },
    { id: "h2", label: "Noise-limit", claim: "Noise limits the achievable smoothness of convergence.", assumptions: ["Noise is independent"], falsificationTest: "Increase noise at a stable learning rate.", confidence: 0.85 },
    { id: "h3", label: "Constraint-benefit", claim: "Moderate regularization improves generalizable learning under noise.", assumptions: ["Model has excess capacity"], falsificationTest: "Sweep regularization with noisy data.", confidence: 0.82 },
  ], limitations: ["A conceptual optimizer model, not a benchmark or production model selection tool.", "It does not represent a particular dataset or architecture."], visualKind: "learning", visualRecipe: createRecipeFromPattern("multiple-possibilities-best-path", "Learning convergence landscape"),
};

export const materialStressExperiment: ExperimentDefinition = {
  id: "material-stress", slug: "material-stress", title: "Material Stress: elastic, yielding, or failing?", field: "materials",
  question: "How do load, temperature, and defect level change a material's modeled stress response?",
  understandingGoal: "Reveal why safety margin depends on material condition as well as applied load.",
  variables: variables([
    { id: "load", label: "Applied load", value: 0.56, min: 0.05, max: 1, step: 0.01, unit: "relative", description: "External stress on the specimen." },
    { id: "temperature", label: "Temperature", value: 0.34, min: 0, max: 1, step: 0.01, unit: "relative", description: "Modeled environmental weakening factor." },
    { id: "defects", label: "Defect level", value: 0.2, min: 0, max: 1, step: 0.01, unit: "relative", description: "Internal flaws that concentrate stress." },
  ]),
  hypotheses: [
    { id: "h1", label: "Load-threshold", claim: "Increasing load crosses elastic and yield thresholds.", assumptions: ["Uniform loading"], falsificationTest: "Sweep load while holding material condition fixed.", confidence: 0.91 },
    { id: "h2", label: "Defect-concentration", claim: "Defects lower the effective failure threshold.", assumptions: ["Defects act as stress concentrators"], falsificationTest: "Increase defects at a constant load.", confidence: 0.88 },
    { id: "h3", label: "Thermal-weakening", claim: "Temperature reduces the modeled safety margin.", assumptions: ["Single material regime"], falsificationTest: "Increase temperature without changing load.", confidence: 0.81 },
  ], limitations: ["Educational normalized model, not a structural safety analysis.", "Never use this simulation to certify a material, part, or structure."], visualKind: "materials", visualRecipe: createRecipeFromPattern("cause-effect", "Material stress threshold"),
};

export const experimentRegistry = [gravityOrbitExperiment, reactionRateExperiment, ecosystemBalanceExperiment, climateAlbedoExperiment, circuitResonanceExperiment, epidemicDynamicsExperiment, neuralLearningExperiment, materialStressExperiment] as const;

function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
function normalized(input: Partial<Record<string, number>>, definition: ExperimentDefinition) {
  return Object.fromEntries(definition.variables.map((item) => [item.id, clamp(Number(input[item.id] ?? item.value), item.min, item.max)]));
}
function line(start: number, end: number) { return Array.from({ length: 25 }, (_, index) => start + (end - start) * (index / 24)); }
function baseRun(experimentId: string, variables: Record<string, number>, outcome: string, observations: string[], metrics: Record<string, number>, visualState: ExperimentRun["visualState"]): ExperimentRun {
  return { runId: `${experimentId}-${Date.now().toString(36)}`, experimentId, variables, outcome, observations, metrics, visualState };
}

export function runGravityOrbitExperiment(input: Partial<Record<string, number>> = {}): GravityRun {
  const v = normalized(input, gravityOrbitExperiment); const circularVelocity = Math.sqrt(v.mass / v.distance); const escapeVelocity = circularVelocity * Math.sqrt(2); const velocityRatio = v.initialVelocity / circularVelocity;
  const outcome = velocityRatio < 0.82 ? "inward-fall" : velocityRatio > 1.18 ? "escape-path" : "stable-orbit"; const fieldStrength = v.mass / (v.distance * v.distance);
  const trajectory = Array.from({ length: 28 }, (_, index) => { const t = index / 27; const drift = outcome === "inward-fall" ? 1 - t * 0.58 : outcome === "escape-path" ? 1 + t * 0.8 : 1 + Math.sin(t * Math.PI) * 0.04; const radius = v.distance * drift; const angle = t * Math.PI * 3.4; return { t, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, radius }; });
  const observations = outcome === "inward-fall" ? ["The particle is below the circular-velocity band.", "The path contracts inward."] : outcome === "escape-path" ? ["The particle is above the bound-orbit band.", "Kinetic motion opens the path toward escape."] : ["The particle is inside the bound-orbit band.", "Attraction and tangential motion remain balanced."];
  return baseRun(gravityOrbitExperiment.id, v, outcome, observations, { circularVelocity, escapeVelocity, velocityRatio, fieldStrength }, { kind: "orbit", patternId: "field-influence", engine: "svg-motion", causalChain: ["Mass increases", "Field strength changes", "Velocity is compared with thresholds", `Trajectory becomes ${outcome}`], series: trajectory.map((point) => point.radius), trajectory });
}

function runReactionRate(input: Partial<Record<string, number>>): ExperimentRun {
  const v = normalized(input, reactionRateExperiment); const rate = v.concentration * (0.22 + v.catalyst * 0.78) * Math.exp((v.temperature - 10) / 82); const conversion = clamp(1 - Math.exp(-rate * 2.4), 0, 0.995); const outcome = conversion > 0.78 ? "rapid-conversion" : conversion > 0.42 ? "steady-conversion" : "slow-conversion";
  return baseRun("reaction-rate", v, outcome, [`Modeled conversion reaches ${(conversion * 100).toFixed(0)}%.`, "The curve rises quickly then flattens as reactant availability falls."], { rate, conversion, productiveCollisionIndex: rate * 100 }, { kind: "reaction", patternId: "cause-effect", engine: "svg-motion", causalChain: ["Temperature and catalyst raise productive collisions", "Rate increases", "Reactant stock declines", `Conversion becomes ${outcome}`], series: line(0, conversion) });
}

function runEcosystemBalance(input: Partial<Record<string, number>>): ExperimentRun {
  const v = normalized(input, ecosystemBalanceExperiment); const resilience = v.habitat * (0.55 + v.nutrients * 0.45); const pressure = v.predation * 0.72; const balance = resilience - Math.abs(pressure - 0.3) * 0.58; const outcome = balance < 0.28 ? "fragile-decline" : balance > 0.68 ? "resource-overshoot" : "resilient-balance";
  const populationEnd = clamp(0.25 + balance, 0.05, 0.95);
  return baseRun("ecosystem-balance", v, outcome, [`Resilience score is ${(balance * 100).toFixed(0)}%.`, outcome === "resilient-balance" ? "Resource supply and control remain within a recoverable range." : "The system leaves its recoverable balance range."], { resilience, pressure, balance, populationEnd }, { kind: "ecosystem", patternId: "system-feedback-loop", engine: "svg-motion", causalChain: ["Nutrients feed population growth", "Predation regulates growth", "Habitat sets recovery capacity", `System enters ${outcome}`], series: line(0.38, populationEnd) });
}

function runClimateAlbedo(input: Partial<Record<string, number>>): ExperimentRun {
  const v = normalized(input, climateAlbedoExperiment); const absorbed = v.solarInput * (1 - v.albedo); const retained = absorbed * v.trapping; const netForcing = absorbed + retained - 0.34; const outcome = netForcing > 0.22 ? "warming-lock-in" : netForcing < -0.02 ? "cooling-dominant" : "near-balance";
  return baseRun("climate-albedo", v, outcome, [`Net modeled forcing is ${netForcing.toFixed(3)} relative units.`, "Reflectivity lowers absorbed energy while trapping raises retained heat."], { absorbed, retained, netForcing, equilibriumIndex: clamp(0.5 + netForcing, 0, 1) }, { kind: "climate", patternId: "system-feedback-loop", engine: "svg-motion", causalChain: ["Solar energy arrives", "Albedo reflects a share", "Trapping retains heat", `Climate state trends toward ${outcome}`], series: line(0.5, clamp(0.5 + netForcing, 0, 1)) });
}

function runCircuitResonance(input: Partial<Record<string, number>>): ExperimentRun {
  const v = normalized(input, circuitResonanceExperiment); const natural = 0.68 - (v.capacitance - 0.5) * 0.36; const detuning = Math.abs(v.frequency - natural); const response = clamp((1 - detuning * 2.3) * (1 - v.resistance * 0.65), 0, 1); const outcome = response > 0.72 ? "clear-resonance" : response > 0.38 ? "damped-response" : "signal-loss";
  return baseRun("circuit-resonance", v, outcome, [`Response amplitude reaches ${(response * 100).toFixed(0)}%.`, "Tuning raises response; resistance drains stored energy."], { naturalFrequency: natural, detuning, response }, { kind: "circuit", patternId: "energy-flow", engine: "svg-motion", causalChain: ["Drive enters circuit", "Capacitance shifts tuning", "Resistance dissipates energy", `Signal becomes ${outcome}`], series: Array.from({ length: 25 }, (_, index) => clamp(response * Math.sin((index / 24) * Math.PI * 3) ** 2, 0, 1)) });
}

function runEpidemicDynamics(input: Partial<Record<string, number>>): ExperimentRun {
  const v = normalized(input, epidemicDynamicsExperiment); const reproduction = (v.contactRate * (1 - v.protection) * 2.6) / (0.25 + v.recovery); const outcome = reproduction > 1.2 ? "accelerating-spread" : reproduction < 0.92 ? "contained-spread" : "threshold-watch"; const end = clamp(0.08 * reproduction, 0.03, 0.94);
  return baseRun("epidemic-dynamics", v, outcome, [`Modeled reproduction index is ${reproduction.toFixed(2)}.`, "The trajectory is driven by contact opportunity, protection, and recovery."], { reproduction, effectiveProtection: v.protection, activeFraction: end }, { kind: "epidemic", patternId: "system-feedback-loop", engine: "svg-motion", causalChain: ["Contacts create exposure", "Protection blocks a share", "Recovery removes active cases", `Trend becomes ${outcome}`], series: line(0.08, end) });
}

function runNeuralLearning(input: Partial<Record<string, number>>): ExperimentRun {
  const v = normalized(input, neuralLearningExperiment); const instability = v.learningRate * (1.15 - v.regularization * 0.45) + v.noise * 0.25; const finalLoss = clamp(0.12 + v.noise * 0.52 + Math.abs(v.learningRate - 0.43) * 0.85 - v.regularization * 0.18, 0.04, 1); const outcome = instability > 0.88 ? "unstable-updates" : finalLoss < 0.36 ? "useful-convergence" : "slow-noisy-learning";
  return baseRun("neural-learning", v, outcome, [`Modeled final loss is ${(finalLoss * 100).toFixed(0)}%.`, "The curve represents training behavior under the selected controls."], { instability, finalLoss, generalizationIndex: clamp(1 - finalLoss, 0, 1) }, { kind: "learning", patternId: "multiple-possibilities-best-path", engine: "svg-motion", causalChain: ["Learning rate sets update size", "Noise perturbs gradients", "Regularization constrains complexity", `Learning becomes ${outcome}`], series: Array.from({ length: 25 }, (_, index) => clamp(0.9 - (0.9 - finalLoss) * (index / 24) + (outcome === "unstable-updates" ? Math.sin(index * 1.7) * 0.16 : 0), 0, 1)) });
}

function runMaterialStress(input: Partial<Record<string, number>>): ExperimentRun {
  const v = normalized(input, materialStressExperiment); const effectiveStress = v.load * (1 + v.defects * 0.9 + v.temperature * 0.45); const safetyMargin = 1 - effectiveStress; const outcome = effectiveStress > 0.92 ? "failure-risk" : effectiveStress > 0.64 ? "yield-zone" : "elastic-zone";
  return baseRun("material-stress", v, outcome, [`Effective stress index is ${effectiveStress.toFixed(2)}.`, "Load is amplified by defect concentration and modeled thermal weakening."], { effectiveStress, safetyMargin, defectAmplification: 1 + v.defects * 0.9 }, { kind: "materials", patternId: "cause-effect", engine: "svg-motion", causalChain: ["Load is applied", "Defects concentrate stress", "Temperature lowers margin", `Material enters ${outcome}`], series: line(0.12, clamp(effectiveStress, 0, 1)) });
}

export function listExperimentDefinitions() { return experimentRegistry; }
export function getExperimentDefinition(id = "gravity-orbit") { return experimentRegistry.find((item) => item.id === id); }
export function runExperiment(id: string, input: Partial<Record<string, number>> = {}): ExperimentRun | undefined {
  if (id === "gravity-orbit") return runGravityOrbitExperiment(input);
  if (id === "reaction-rate") return runReactionRate(input);
  if (id === "ecosystem-balance") return runEcosystemBalance(input);
  if (id === "climate-albedo") return runClimateAlbedo(input);
  if (id === "circuit-resonance") return runCircuitResonance(input);
  if (id === "epidemic-dynamics") return runEpidemicDynamics(input);
  if (id === "neural-learning") return runNeuralLearning(input);
  if (id === "material-stress") return runMaterialStress(input);
  return undefined;
}
