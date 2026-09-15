import {
  physicsSandboxDefaults,
  physicsSandboxDerivedWeights,
  physicsSandboxParameterDefinitions,
  physicsSandboxVisualWeights,
} from "@/data/worlds/physics-world";
import type {
  SandboxBottleneck,
  SandboxConsequence,
  SandboxControlState,
  SandboxParameterKey,
  SimulationState,
  UniverseStateMetrics,
  SimulationWarning,
  SimulationWarningSeverity,
} from "@/lib/types";
import { clamp } from "@/lib/utils";

const simulationNumericKeys = [
  "particleCount",
  "orbitSpeed",
  "fieldIntensity",
  "glowStrength",
  "instability",
  "uncertaintyHalo",
  "colorBias",
  "brightnessBias",
  "waveAmplitude",
  "lensing",
  "orbitSpread",
  "ringTilt",
] as const satisfies ReadonlyArray<Exclude<keyof SimulationState, "annotations">>;

function getCenteredDelta(key: SandboxParameterKey, parameters: SandboxControlState) {
  return parameters[key] - physicsSandboxDefaults[key];
}

function getSeverity(value: number): SimulationWarningSeverity {
  if (value >= 0.78) {
    return "critical";
  }

  if (value >= 0.52) {
    return "watch";
  }

  return "nominal";
}

export interface SandboxVisualSignals {
  biosphereIntensity: number;
  routeDensity: number;
  infrastructureIntensity: number;
  stormIntensity: number;
  riskScore: number;
}

export function applySandboxToSimulationState(
  baseState: SimulationState,
  parameters: SandboxControlState,
) {
  const nextState = { ...baseState };

  physicsSandboxParameterDefinitions.forEach((definition) => {
    const delta = getCenteredDelta(definition.key, parameters);
    const weights = physicsSandboxVisualWeights[definition.key];

    simulationNumericKeys.forEach((stateKey) => {
      const weight = weights[stateKey] ?? 0;
      nextState[stateKey] += delta * weight;
    });
  });

  return {
    ...nextState,
    particleCount: Math.max(72, Math.round(nextState.particleCount)),
    orbitSpeed: clamp(nextState.orbitSpeed),
    fieldIntensity: clamp(nextState.fieldIntensity),
    glowStrength: clamp(nextState.glowStrength),
    instability: clamp(nextState.instability),
    uncertaintyHalo: clamp(nextState.uncertaintyHalo),
    colorBias: ((nextState.colorBias % 1) + 1) % 1,
    brightnessBias: clamp(nextState.brightnessBias),
    waveAmplitude: clamp(nextState.waveAmplitude),
    lensing: clamp(nextState.lensing),
    orbitSpread: clamp(nextState.orbitSpread),
    ringTilt: clamp(nextState.ringTilt),
    annotations: baseState.annotations,
  };
}

export function buildSandboxVisualSignals(parameters: SandboxControlState): SandboxVisualSignals {
  const result = {
    biosphereIntensity: 0.34,
    routeDensity: 0.28,
    infrastructureIntensity: 0.26,
    stormIntensity: 0.22,
  };

  (
    Object.keys(physicsSandboxDerivedWeights) as Array<
      keyof typeof physicsSandboxDerivedWeights
    >
  ).forEach((metricKey) => {
    let value = result[metricKey];

    physicsSandboxParameterDefinitions.forEach((definition) => {
      const weight = physicsSandboxDerivedWeights[metricKey][definition.key] ?? 0;
      value += getCenteredDelta(definition.key, parameters) * weight;
    });

    result[metricKey] = clamp(value);
  });

  const riskScore = clamp(
    result.stormIntensity * 0.44 +
      (1 - parameters.environmentStability) * 0.34 +
      parameters.gravityStrength * 0.12 +
      (1 - parameters.biologicalResilience) * 0.1,
  );

  return {
    ...result,
    riskScore,
  };
}

export function buildSandboxWarnings(
  parameters: SandboxControlState,
  signals: SandboxVisualSignals,
): SimulationWarning[] {
  const warnings: SimulationWarning[] = [];

  if (signals.riskScore >= 0.58) {
    warnings.push({
      id: "stability-margin",
      severity: getSeverity(signals.riskScore),
      title: "Stability margin is shrinking",
      description:
        "Higher gravity and lower environmental stability are increasing turbulence, fracture risk, and warning intensity across the system.",
    });
  }

  if (
    parameters.energyAbundance >= 0.74 &&
    parameters.environmentStability <= 0.42
  ) {
    warnings.push({
      id: "energy-surge",
      severity: "watch",
      title: "Energy throughput is outrunning local control",
      description:
        "Brightness and system activity are rising faster than the environment can absorb cleanly, so the world begins to feel volatile rather than efficient.",
    });
  }

  if (
    parameters.travelEfficiency >= 0.72 &&
    parameters.intelligenceAcceleration <= 0.38
  ) {
    warnings.push({
      id: "network-drift",
      severity: "watch",
      title: "Reach is expanding faster than coordination",
      description:
        "Route density is increasing, but intelligence capacity is not scaling at the same pace, so the network becomes harder to optimize and stabilize.",
    });
  }

  return warnings;
}

export function buildSandboxConsequences(
  parameters: SandboxControlState,
  signals: SandboxVisualSignals,
): SandboxConsequence[] {
  return [
    {
      id: "gravity-order",
      label: "Orbital order",
      status: getSeverity(
        clamp(parameters.gravityStrength * 0.6 + signals.stormIntensity * 0.4),
      ),
      summary:
        parameters.gravityStrength >= 0.6
          ? "Curvature deepens and clusters pull inward, making the scene feel more compressed and collapse-prone."
          : "Orbits stay loose enough for circulation, observation, and slower restructuring.",
      implication:
        parameters.gravityStrength >= 0.6
          ? "More energy is spent surviving curvature and collapse instead of exploring the field."
          : "The system preserves exploration space instead of over-committing to central gravity wells.",
      unstableWhen:
        "Instability rises when gravity climbs without matching environment stability or intelligence.",
    },
    {
      id: "energy-throughput",
      label: "Energy throughput",
      status: getSeverity(
        clamp(parameters.energyAbundance * 0.72 + (1 - parameters.environmentStability) * 0.28),
      ),
      summary:
        parameters.energyAbundance >= 0.64
          ? "Infrastructure brightens, particles multiply, and the world behaves like a more active power network."
          : "Low energy abundance keeps the scene dimmer, slower, and more locally constrained.",
      implication:
        parameters.energyAbundance >= 0.64
          ? "More throughput unlocks capability, but it also exposes weak coordination and weak environmental buffering."
          : "The system stays safer, but it cannot build or propagate change at meaningful scale.",
      unstableWhen:
        "Energy becomes disruptive when abundance rises faster than environmental or cognitive control.",
    },
    {
      id: "habitability",
      label: "Habitability",
      status: getSeverity(
        clamp((1 - signals.biosphereIntensity) * 0.74 + signals.stormIntensity * 0.26),
      ),
      summary:
        signals.biosphereIntensity >= 0.52
          ? "A resilient biosphere halo appears, signaling that local conditions can absorb change rather than collapse under it."
          : "Habitability thins out, and the world starts to look survivable only in pockets instead of broadly.",
      implication:
        signals.biosphereIntensity >= 0.52
          ? "Stable biology turns raw physics and energy into a more durable living system."
          : "Without resilience, intelligence and energy gains do not translate into long-lived ecosystems.",
      unstableWhen:
        "Biological resilience falls when storms intensify or gravity overwhelms the surrounding environment.",
    },
    {
      id: "coordination",
      label: "Coordination",
      status: getSeverity(
        clamp(signals.routeDensity * 0.44 + parameters.intelligenceAcceleration * 0.3 + signals.riskScore * 0.26),
      ),
      summary:
        signals.routeDensity >= 0.5
          ? "Travel lanes and exchange routes thicken, turning the world into a coordinated network instead of isolated pockets."
          : "The system remains fragmented, with less reach and weaker synchronization between active regions.",
      implication:
        signals.routeDensity >= 0.5
          ? "Travel efficiency plus intelligence acceleration makes the system responsive rather than merely bright."
          : "Without coordination, the world gains local activity but not high-order organization.",
      unstableWhen:
        "Networks become brittle when route density outpaces intelligence and environment stability.",
    },
  ];
}

export function buildUniverseStateMetrics(
  parameters: SandboxControlState,
  signals: SandboxVisualSignals,
): UniverseStateMetrics {
  const stability = clamp(
    parameters.environmentStability * 0.42 +
      parameters.biologicalResilience * 0.14 +
      parameters.intelligenceAcceleration * 0.14 +
      (1 - signals.stormIntensity) * 0.18 +
      (1 - parameters.gravityStrength) * 0.12,
  );
  const viability = clamp(
    signals.biosphereIntensity * 0.48 +
      parameters.biologicalResilience * 0.18 +
      parameters.environmentStability * 0.18 +
      (1 - signals.riskScore) * 0.16,
  );
  const complexity = clamp(
    signals.infrastructureIntensity * 0.34 +
      signals.routeDensity * 0.24 +
      parameters.intelligenceAcceleration * 0.24 +
      parameters.energyAbundance * 0.18,
  );
  const structureSurvival = clamp(
    stability * 0.38 +
      viability * 0.22 +
      complexity * 0.16 +
      (1 - parameters.gravityStrength) * 0.08 +
      (1 - signals.riskScore) * 0.16,
  );
  const fracture = clamp(
    signals.riskScore * 0.52 +
      signals.stormIntensity * 0.28 +
      parameters.gravityStrength * 0.2,
  );
  const productivity = clamp(
    parameters.energyAbundance * 0.32 +
      parameters.intelligenceAcceleration * 0.22 +
      signals.infrastructureIntensity * 0.18 +
      signals.routeDensity * 0.16 +
      stability * 0.12,
  );

  if (fracture >= 0.86 || stability <= 0.16) {
    return {
      status: "broken",
      label: "Broken",
      summary: "Rule collapse",
      stability,
      viability,
      complexity,
      structureSurvival,
      fracture,
      productivity,
    };
  }

  if (viability <= 0.26 && structureSurvival <= 0.38) {
    return {
      status: "lifeless",
      label: "Lifeless",
      summary: "Life systems fade",
      stability,
      viability,
      complexity,
      structureSurvival,
      fracture,
      productivity,
    };
  }

  if (fracture >= 0.68 || stability <= 0.38) {
    return {
      status: "chaotic",
      label: "Chaotic",
      summary: "Runaway turbulence",
      stability,
      viability,
      complexity,
      structureSurvival,
      fracture,
      productivity,
    };
  }

  if (productivity >= 0.78 && stability >= 0.5 && complexity >= 0.62) {
    return {
      status: "hyper-productive",
      label: "Hyper",
      summary: "Growth surge",
      stability,
      viability,
      complexity,
      structureSurvival,
      fracture,
      productivity,
    };
  }

  if (stability <= 0.56 || fracture >= 0.5) {
    return {
      status: "unstable",
      label: "Unstable",
      summary: "Stress pockets",
      stability,
      viability,
      complexity,
      structureSurvival,
      fracture,
      productivity,
    };
  }

  return {
    status: "stable",
    label: "Stable",
    summary: "Balanced field",
    stability,
    viability,
    complexity,
    structureSurvival,
    fracture,
    productivity,
  };
}

export function buildSandboxBottleneck(
  parameters: SandboxControlState,
  signals: SandboxVisualSignals,
): SandboxBottleneck {
  const candidates: SandboxBottleneck[] = [
    {
      id: "collapse-well",
      label: "Collapse well",
      source: "gravityStrength",
      pressure: clamp(parameters.gravityStrength * 0.64 + signals.riskScore * 0.36),
      severity: "nominal",
      summary: "Curvature is compressing the field faster than the world can stabilize it.",
    },
    {
      id: "heat-choke",
      label: "Heat choke",
      source: "energyAbundance",
      pressure: clamp(
        parameters.energyAbundance * 0.58 +
          (1 - parameters.environmentStability) * 0.42,
      ),
      severity: "nominal",
      summary: "Energy throughput is outpacing local cooling and containment.",
    },
    {
      id: "life-drain",
      label: "Life drain",
      source: "biologicalResilience",
      pressure: clamp(
        (1 - parameters.biologicalResilience) * 0.58 +
          (1 - signals.biosphereIntensity) * 0.42,
      ),
      severity: "nominal",
      summary: "Biology is struggling to hold shape as the environment absorbs less change.",
    },
    {
      id: "coordination-choke",
      label: "Coordination choke",
      source: "intelligenceAcceleration",
      pressure: clamp(
        parameters.travelEfficiency * 0.46 +
          (1 - parameters.intelligenceAcceleration) * 0.54,
      ),
      severity: "nominal",
      summary: "Movement is expanding faster than cognition, so the network loses coherence.",
    },
    {
      id: "storm-fracture",
      label: "Storm fracture",
      source: "environmentStability",
      pressure: clamp(
        (1 - parameters.environmentStability) * 0.76 +
          signals.stormIntensity * 0.24,
      ),
      severity: "nominal",
      summary: "The surrounding field is shedding stability and opening turbulent fracture zones.",
    },
  ];

  const bottleneck = candidates.sort((left, right) => right.pressure - left.pressure)[0];

  return {
    ...bottleneck,
    severity: getSeverity(bottleneck.pressure),
  };
}

export function getSandboxChangeSummary(parameters: SandboxControlState) {
  const sorted = [...physicsSandboxParameterDefinitions]
    .map((definition) => ({
      label: definition.shortLabel,
      key: definition.key,
      magnitude: Math.abs(getCenteredDelta(definition.key, parameters)),
      direction: getCenteredDelta(definition.key, parameters) >= 0 ? "up" : "down",
    }))
    .sort((left, right) => right.magnitude - left.magnitude);

  return sorted.slice(0, 3).map((item) => {
    const directionText = item.direction === "up" ? "raised" : "reduced";
    return `${item.label} ${directionText}`;
  });
}

export function getSandboxParameterNarrative(parameters: SandboxControlState) {
  const changes = getSandboxChangeSummary(parameters);

  if (changes.length === 0) {
    return "Reality Sandbox is at its calibrated baseline.";
  }

  return `Reality Sandbox is bending ${changes.join(", ")}.`;
}

export function getSandboxModeHint() {
  return "Browser mode renders locally with the full simulation scene and does not require an external renderer.";
}
