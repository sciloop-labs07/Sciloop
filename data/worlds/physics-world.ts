import type {
  PhysicsCameraMode,
  SandboxPresetDefinition,
  PhysicsWorldView,
  SandboxControlState,
  SandboxParameterDefinition,
  SimulationState,
} from "@/lib/types";

type SimulationNumericKey = Exclude<keyof SimulationState, "annotations">;
type SandboxWeightMap = Partial<Record<SimulationNumericKey, number>>;
type SandboxDerivedMetric =
  | "biosphereIntensity"
  | "routeDensity"
  | "infrastructureIntensity"
  | "stormIntensity";

export const physicsWorldExperienceConfig: {
  defaultDiscoverySlug: string;
  defaultViewMode: PhysicsWorldView;
  defaultCameraMode: PhysicsCameraMode;
  defaultProgress: number;
  transitionDurationMs: number;
  autoplayTransitionOnLoad: boolean;
} = {
  defaultDiscoverySlug: "electromagnetic-induction",
  defaultViewMode: "quick",
  defaultCameraMode: "interactive",
  defaultProgress: 0,
  transitionDurationMs: 1450,
  autoplayTransitionOnLoad: true,
};

export const physicsWorldTransitionConfig = {
  visualState: {
    energyScale: {
      base: 0.98,
      glowStrengthWeight: 0.24,
      brightnessBiasWeight: 0.08,
      instabilityWeight: -0.06,
    },
    energyPulse: {
      base: 0.22,
      waveAmplitudeWeight: 0.54,
      fieldIntensityWeight: 0.24,
    },
    fieldOpacity: {
      base: 0.1,
      fieldIntensityWeight: 0.26,
      brightnessBiasWeight: 0.08,
    },
    particleOpacity: {
      base: 0.16,
      glowStrengthWeight: 0.24,
      brightnessBiasWeight: 0.16,
    },
    auraRadius: {
      base: 2.1,
      lensingWeight: 0.88,
      uncertaintyHaloWeight: 0.82,
    },
  },
  particleLayout: {
    radius: {
      base: 1.6,
      spreadBase: 2.2,
      orbitSpreadWeight: 2.6,
      uncertaintyHaloWeight: 0.38,
    },
    angleBase: 1.4,
    height: {
      base: 1.35,
      orbitSpreadWeight: 1,
      instabilityWeight: 0.6,
    },
  },
  fieldLines: {
    radius: {
      base: 2.05,
      step: 0.18,
      lensingWeight: 0.82,
    },
    wave: {
      base: 0.14,
      fieldIntensityWeight: 0.34,
      step: 0.018,
    },
    height: {
      base: 0.34,
      orbitSpreadWeight: 0.58,
      instabilityWeight: 0.22,
    },
    phaseStep: 0.82,
  },
};

export const physicsSandboxDefaults: SandboxControlState = {
  gravityStrength: 0.5,
  energyAbundance: 0.56,
  biologicalResilience: 0.48,
  travelEfficiency: 0.52,
  intelligenceAcceleration: 0.44,
  environmentStability: 0.62,
};

export const physicsSandboxParameterDefinitions: SandboxParameterDefinition[] = [
  {
    key: "gravityStrength",
    label: "Gravity strength",
    shortLabel: "Gravity",
    description: "Tightens clustering, curvature, and collapse risk.",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: physicsSandboxDefaults.gravityStrength,
  },
  {
    key: "energyAbundance",
    label: "Energy abundance",
    shortLabel: "Energy",
    description: "Boosts brightness, expansion, and active system throughput.",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: physicsSandboxDefaults.energyAbundance,
  },
  {
    key: "biologicalResilience",
    label: "Biological resilience",
    shortLabel: "Biology",
    description: "Strengthens habitability and persistence across a changing system.",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: physicsSandboxDefaults.biologicalResilience,
  },
  {
    key: "travelEfficiency",
    label: "Travel efficiency",
    shortLabel: "Travel",
    description: "Expands route density, reach, and system circulation.",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: physicsSandboxDefaults.travelEfficiency,
  },
  {
    key: "intelligenceAcceleration",
    label: "Intelligence acceleration",
    shortLabel: "Intelligence",
    description: "Builds structure, adaptation speed, and system optimization.",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: physicsSandboxDefaults.intelligenceAcceleration,
  },
  {
    key: "environmentStability",
    label: "Environment stability",
    shortLabel: "Environment",
    description: "Suppresses turbulence, fracture signals, and warning intensity.",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: physicsSandboxDefaults.environmentStability,
  },
];

export const physicsSandboxVisualWeights: Record<
  keyof SandboxControlState,
  SandboxWeightMap
> = {
  gravityStrength: {
    particleCount: -18,
    orbitSpeed: -0.06,
    fieldIntensity: 0.08,
    glowStrength: -0.02,
    instability: 0.18,
    uncertaintyHalo: 0.12,
    colorBias: 0.02,
    brightnessBias: -0.04,
    waveAmplitude: 0.1,
    lensing: 0.34,
    orbitSpread: -0.22,
    ringTilt: 0.08,
  },
  energyAbundance: {
    particleCount: 46,
    orbitSpeed: 0.08,
    fieldIntensity: 0.26,
    glowStrength: 0.32,
    instability: 0.08,
    uncertaintyHalo: 0.04,
    colorBias: 0.03,
    brightnessBias: 0.28,
    waveAmplitude: 0.16,
    lensing: 0.04,
    orbitSpread: 0.08,
    ringTilt: 0.02,
  },
  biologicalResilience: {
    particleCount: 18,
    orbitSpeed: 0.02,
    fieldIntensity: 0.06,
    glowStrength: 0.08,
    instability: -0.14,
    uncertaintyHalo: -0.04,
    colorBias: -0.05,
    brightnessBias: 0.06,
    waveAmplitude: -0.04,
    lensing: -0.02,
    orbitSpread: 0.04,
    ringTilt: -0.02,
  },
  travelEfficiency: {
    particleCount: 28,
    orbitSpeed: 0.22,
    fieldIntensity: 0.1,
    glowStrength: 0.08,
    instability: 0.04,
    uncertaintyHalo: -0.02,
    colorBias: 0,
    brightnessBias: 0.08,
    waveAmplitude: 0.14,
    lensing: -0.02,
    orbitSpread: 0.18,
    ringTilt: 0.06,
  },
  intelligenceAcceleration: {
    particleCount: 24,
    orbitSpeed: 0.1,
    fieldIntensity: 0.22,
    glowStrength: 0.18,
    instability: -0.12,
    uncertaintyHalo: -0.08,
    colorBias: 0.04,
    brightnessBias: 0.12,
    waveAmplitude: 0.1,
    lensing: 0.02,
    orbitSpread: 0.08,
    ringTilt: 0.04,
  },
  environmentStability: {
    particleCount: 12,
    orbitSpeed: 0.04,
    fieldIntensity: 0.08,
    glowStrength: 0.04,
    instability: -0.34,
    uncertaintyHalo: -0.22,
    colorBias: -0.02,
    brightnessBias: 0.06,
    waveAmplitude: -0.18,
    lensing: -0.04,
    orbitSpread: -0.08,
    ringTilt: -0.1,
  },
};

export const physicsSandboxDerivedWeights: Record<
  SandboxDerivedMetric,
  Partial<Record<keyof SandboxControlState, number>>
> = {
  biosphereIntensity: {
    biologicalResilience: 0.72,
    environmentStability: 0.36,
    energyAbundance: 0.12,
    gravityStrength: -0.18,
  },
  routeDensity: {
    travelEfficiency: 0.66,
    intelligenceAcceleration: 0.34,
    energyAbundance: 0.18,
    environmentStability: 0.08,
  },
  infrastructureIntensity: {
    energyAbundance: 0.54,
    intelligenceAcceleration: 0.44,
    travelEfficiency: 0.18,
    environmentStability: 0.08,
  },
  stormIntensity: {
    environmentStability: -0.76,
    gravityStrength: 0.22,
    energyAbundance: 0.12,
    travelEfficiency: 0.08,
  },
};

export const physicsSandboxPresets: SandboxPresetDefinition[] = [
  {
    id: "earth-like",
    label: "Earth-like",
    iconKey: "earth",
    parameters: {
      ...physicsSandboxDefaults,
    },
  },
  {
    id: "low-gravity",
    label: "Low g",
    iconKey: "gravityStrength",
    parameters: {
      gravityStrength: 0.22,
      energyAbundance: 0.58,
      biologicalResilience: 0.62,
      travelEfficiency: 0.58,
      intelligenceAcceleration: 0.5,
      environmentStability: 0.74,
    },
  },
  {
    id: "ultra-intelligence",
    label: "Ultra mind",
    iconKey: "intelligenceAcceleration",
    parameters: {
      gravityStrength: 0.48,
      energyAbundance: 0.78,
      biologicalResilience: 0.56,
      travelEfficiency: 0.74,
      intelligenceAcceleration: 0.95,
      environmentStability: 0.68,
    },
  },
  {
    id: "no-aging",
    label: "No aging",
    iconKey: "biologicalResilience",
    parameters: {
      gravityStrength: 0.46,
      energyAbundance: 0.7,
      biologicalResilience: 0.94,
      travelEfficiency: 0.56,
      intelligenceAcceleration: 0.62,
      environmentStability: 0.8,
    },
  },
  {
    id: "high-energy",
    label: "High energy",
    iconKey: "energyAbundance",
    parameters: {
      gravityStrength: 0.42,
      energyAbundance: 0.96,
      biologicalResilience: 0.4,
      travelEfficiency: 0.84,
      intelligenceAcceleration: 0.78,
      environmentStability: 0.46,
    },
  },
  {
    id: "broken-physics",
    label: "Broken",
    iconKey: "broken",
    parameters: {
      gravityStrength: 0.96,
      energyAbundance: 0.94,
      biologicalResilience: 0.12,
      travelEfficiency: 0.2,
      intelligenceAcceleration: 0.18,
      environmentStability: 0.08,
    },
  },
];
