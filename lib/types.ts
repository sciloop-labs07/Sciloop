export type SubjectId = "physics";

export type MeaningEngineSubjectId =
  | "mathematics"
  | "physics"
  | "chemistry"
  | "biology"
  | "economics"
  | "geography";

export type MeaningEngineVisualMode =
  | "derivative-slope"
  | "probability-field"
  | "gravity-orbit"
  | "wave-motion"
  | "equilibrium-shift"
  | "catalyst-energy"
  | "cell-membrane"
  | "dna-replication"
  | "supply-demand"
  | "inflation-cycle"
  | "plate-tectonics"
  | "water-cycle";

export interface MeaningEngineSubject {
  id: MeaningEngineSubjectId;
  label: string;
  shortLabel: string;
  tagline: string;
  accent: string;
  glow: string;
  symbol: string;
}

export interface MeaningContributor {
  name: string;
  role: string;
  era: string;
}

export interface MeaningTimelineEntry {
  year: string;
  label: string;
  detail: string;
}

export interface MeaningExample {
  label: string;
  context: string;
}

export interface MeaningImpactItem {
  label: string;
  detail: string;
}

export interface MeaningExamTranslation {
  exam: string;
  meaning: string;
}

export interface MeaningConcept {
  id: string;
  subject: MeaningEngineSubjectId;
  conceptName: string;
  essence: string;
  simpleMeaning: string;
  symbolToReality: string;
  whyItExists: string;
  discoveredBy: MeaningContributor[];
  timeline: MeaningTimelineEntry[];
  realWorldExamples: MeaningExample[];
  impact: MeaningImpactItem[];
  futureInnovation: MeaningImpactItem[];
  examTranslation: MeaningExamTranslation;
  visualMode: MeaningEngineVisualMode;
}

export interface Subject {
  id: SubjectId;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  entryRoute: string;
  accent: string;
}

export type ConceptNodeKind = "law" | "experiment" | "effect" | "technology";

export interface ConceptNode {
  id: string;
  label: string;
  kind: ConceptNodeKind;
  weight: number;
  links: string[];
}

export interface SimulationState {
  particleCount: number;
  orbitSpeed: number;
  fieldIntensity: number;
  glowStrength: number;
  instability: number;
  uncertaintyHalo: number;
  colorBias: number;
  brightnessBias: number;
  waveAmplitude: number;
  lensing: number;
  orbitSpread: number;
  ringTilt: number;
  annotations: string[];
}

export interface SimulationPhase<TState extends SimulationState = SimulationState> {
  label: string;
  summary: string;
  state: TState;
}

export interface DiscoverySimulation<TState extends SimulationState = SimulationState> {
  before: SimulationPhase<TState>;
  after: SimulationPhase<TState>;
  mechanism: string;
  implication: string;
}

export interface Discovery {
  id: string;
  slug: string;
  subjectId: SubjectId;
  title: string;
  shortTitle: string;
  year: string;
  scientists: string[];
  tagline: string;
  summary: string;
  worldChange: string;
  confidence: number;
  quickView: string;
  mechanismView: string;
  cinematicView: string;
  conceptNodes: ConceptNode[];
  simulation: DiscoverySimulation;
}

export type PhysicsWorldView = "quick" | "mechanism" | "cinematic";
export type PhysicsCameraMode = "interactive" | "demo";
export type SimulationGraphicsMode = "auto" | "browser";
export type SimulationQuality = "auto" | "low" | "medium" | "high";
export type SimulationWarningSeverity = "nominal" | "watch" | "critical";
export type SandboxParameterKey =
  | "gravityStrength"
  | "energyAbundance"
  | "biologicalResilience"
  | "travelEfficiency"
  | "intelligenceAcceleration"
  | "environmentStability";
export interface SandboxControlState {
  gravityStrength: number;
  energyAbundance: number;
  biologicalResilience: number;
  travelEfficiency: number;
  intelligenceAcceleration: number;
  environmentStability: number;
}

export interface SandboxParameterDefinition {
  key: SandboxParameterKey;
  label: string;
  shortLabel: string;
  description: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface SandboxConsequence {
  id: string;
  label: string;
  status: SimulationWarningSeverity;
  summary: string;
  implication: string;
  unstableWhen: string;
}

export interface SimulationWarning {
  id: string;
  severity: SimulationWarningSeverity;
  title: string;
  description: string;
}

export type UniverseStateStatus =
  | "stable"
  | "unstable"
  | "chaotic"
  | "lifeless"
  | "hyper-productive"
  | "broken";

export interface UniverseStateMetrics {
  status: UniverseStateStatus;
  label: string;
  summary: string;
  stability: number;
  viability: number;
  complexity: number;
  structureSurvival: number;
  fracture: number;
  productivity: number;
}

export interface SandboxBottleneck {
  id: string;
  label: string;
  source: SandboxParameterKey | "system";
  severity: SimulationWarningSeverity;
  pressure: number;
  summary: string;
}

export interface SandboxPresetDefinition {
  id: string;
  label: string;
  iconKey: string;
  parameters: SandboxControlState;
}
