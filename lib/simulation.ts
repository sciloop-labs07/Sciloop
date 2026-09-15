import type {
  DiscoverySimulation,
  SimulationPhase,
  SimulationState,
} from "@/lib/types";
import { clamp, lerp } from "@/lib/utils";

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

export type SimulationStage = "before" | "transition" | "after";

export function interpolateSimulationState(
  beforeState: SimulationState,
  afterState: SimulationState,
  progress: number,
): SimulationState {
  const safeProgress = clamp(progress);
  const interpolated = {} as Record<(typeof simulationNumericKeys)[number], number>;

  simulationNumericKeys.forEach((key) => {
    interpolated[key] = lerp(beforeState[key], afterState[key], safeProgress);
  });

  return {
    ...interpolated,
    particleCount: Math.round(interpolated.particleCount),
    annotations: safeProgress < 0.5 ? beforeState.annotations : afterState.annotations,
  };
}

export function getSimulationStage(progress: number): SimulationStage {
  const safeProgress = clamp(progress);

  if (safeProgress <= 0.08) {
    return "before";
  }

  if (safeProgress >= 0.92) {
    return "after";
  }

  return "transition";
}

export function getActiveSimulationPhase(
  simulation: DiscoverySimulation,
  progress: number,
): SimulationPhase {
  return getSimulationStage(progress) === "after"
    ? simulation.after
    : simulation.before;
}

export function normalizeParticleCount(
  count: number,
  minCount: number,
  maxCount: number,
) {
  if (maxCount <= minCount) {
    return 0;
  }

  return clamp((count - minCount) / (maxCount - minCount));
}
