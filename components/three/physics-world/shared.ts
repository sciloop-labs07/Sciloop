import * as THREE from "three";

import {
  PHYSICS_WORLD_FIELD,
  PHYSICS_WORLD_PARTICLES,
  PHYSICS_WORLD_QUALITY_PRESETS,
} from "@/components/three/physics-world/constants";
import { physicsWorldTransitionConfig } from "@/data/worlds/physics-world";
import {
  applySandboxToSimulationState,
  buildSandboxVisualSignals,
} from "@/lib/reality-sandbox";
import { interpolateSimulationState } from "@/lib/simulation";
import type {
  Discovery,
  PhysicsCameraMode,
  PhysicsWorldView,
  SandboxControlState,
  SimulationState,
  SimulationQuality,
} from "@/lib/types";
import { clamp } from "@/lib/utils";

export interface PhysicsWorldRenderProps {
  discovery: Discovery;
  progress: number;
  viewMode: PhysicsWorldView;
  cameraMode: PhysicsCameraMode;
  sandboxParameters: SandboxControlState;
  quality: SimulationQuality;
  isPaused: boolean;
}

export interface PhysicsVisualState extends SimulationState {
  energyScale: number;
  energyPulse: number;
  fieldOpacity: number;
  particleOpacity: number;
  auraRadius: number;
  nearParticleCount: number;
  farParticleCount: number;
  fieldLineCount: number;
  routeDensity: number;
  biosphereIntensity: number;
  infrastructureIntensity: number;
  stormIntensity: number;
  riskScore: number;
}

export function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export function colorFromHsl(hue: number, saturation: number, lightness: number) {
  const color = new THREE.Color();
  color.setHSL(hue, saturation, lightness);
  return color;
}

export function buildPhysicsVisualState(
  discovery: Discovery,
  progress: number,
  sandboxParameters: SandboxControlState,
  quality: SimulationQuality,
): PhysicsVisualState {
  const visualConfig = physicsWorldTransitionConfig.visualState;
  const qualityPreset = PHYSICS_WORLD_QUALITY_PRESETS[quality];
  const interpolatedBase = interpolateSimulationState(
    discovery.simulation.before.state,
    discovery.simulation.after.state,
    progress,
  );
  const base = applySandboxToSimulationState(interpolatedBase, sandboxParameters);
  const signals = buildSandboxVisualSignals(sandboxParameters);
  const safeParticleCount = Math.min(
    PHYSICS_WORLD_PARTICLES.maxTotalCount,
    Math.max(
      PHYSICS_WORLD_PARTICLES.minTotalCount,
      Math.round(base.particleCount * qualityPreset.particleMultiplier),
    ),
  );
  const nearParticleCount = Math.max(
    32,
    Math.round(safeParticleCount * PHYSICS_WORLD_PARTICLES.nearRatio),
  );
  const farParticleCount = Math.max(
    PHYSICS_WORLD_PARTICLES.minFarCount,
    safeParticleCount - nearParticleCount,
  );
  const fieldLineCount = Math.max(
    3,
    Math.round(PHYSICS_WORLD_FIELD.lineCount * qualityPreset.fieldLineMultiplier),
  );

  return {
    ...base,
    particleCount: safeParticleCount,
    orbitSpeed: clamp(base.orbitSpeed),
    fieldIntensity: clamp(base.fieldIntensity),
    glowStrength: clamp(base.glowStrength),
    instability: clamp(base.instability),
    uncertaintyHalo: clamp(base.uncertaintyHalo),
    colorBias: ((base.colorBias % 1) + 1) % 1,
    brightnessBias: clamp(base.brightnessBias),
    energyScale:
      visualConfig.energyScale.base +
      base.glowStrength * visualConfig.energyScale.glowStrengthWeight +
      base.brightnessBias * visualConfig.energyScale.brightnessBiasWeight +
      base.instability * visualConfig.energyScale.instabilityWeight,
    energyPulse:
      visualConfig.energyPulse.base +
      base.waveAmplitude * visualConfig.energyPulse.waveAmplitudeWeight +
      base.fieldIntensity * visualConfig.energyPulse.fieldIntensityWeight,
    fieldOpacity:
      visualConfig.fieldOpacity.base +
      base.fieldIntensity * visualConfig.fieldOpacity.fieldIntensityWeight +
      base.brightnessBias * visualConfig.fieldOpacity.brightnessBiasWeight,
    particleOpacity:
      visualConfig.particleOpacity.base +
      base.glowStrength * visualConfig.particleOpacity.glowStrengthWeight +
      base.brightnessBias * visualConfig.particleOpacity.brightnessBiasWeight,
    auraRadius:
      visualConfig.auraRadius.base +
      base.lensing * visualConfig.auraRadius.lensingWeight +
      base.uncertaintyHalo * visualConfig.auraRadius.uncertaintyHaloWeight,
    nearParticleCount,
    farParticleCount,
    fieldLineCount,
    routeDensity: clamp(signals.routeDensity * qualityPreset.routeDensityMultiplier),
    biosphereIntensity: signals.biosphereIntensity,
    infrastructureIntensity: signals.infrastructureIntensity,
    stormIntensity: clamp(signals.stormIntensity * qualityPreset.stormOpacityMultiplier),
    riskScore: signals.riskScore,
  };
}

export function createParticlePositions(
  count: number,
  state: Pick<PhysicsVisualState, "orbitSpread" | "instability" | "uncertaintyHalo">,
  seedOffset = 0,
) {
  const particleLayout = physicsWorldTransitionConfig.particleLayout;
  const values = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const seed = seedOffset + index + 1;
    const radius =
      particleLayout.radius.base +
      seededUnit(seed * 0.71) *
        (
          particleLayout.radius.spreadBase +
          state.orbitSpread * particleLayout.radius.orbitSpreadWeight
        ) +
      state.uncertaintyHalo * particleLayout.radius.uncertaintyHaloWeight;
    const angle =
      (index / count) * Math.PI * 2 * (particleLayout.angleBase + state.orbitSpread);
    const vertical =
      (seededUnit(seed * 1.21) - 0.5) *
      (
        particleLayout.height.base +
        state.orbitSpread * particleLayout.height.orbitSpreadWeight +
        state.instability * particleLayout.height.instabilityWeight
      );

    values[index * 3] = Math.cos(angle) * radius;
    values[index * 3 + 1] = vertical;
    values[index * 3 + 2] = Math.sin(angle) * radius;
  }

  return values;
}

export function createFieldLineVertices(
  lineIndex: number,
  state: Pick<PhysicsVisualState, "fieldIntensity" | "lensing" | "orbitSpread" | "instability">,
) {
  const fieldConfig = physicsWorldTransitionConfig.fieldLines;
  const pointCount = PHYSICS_WORLD_FIELD.pointCount;
  const vertices = new Float32Array(pointCount * 3);
  const radius =
    fieldConfig.radius.base +
    lineIndex * fieldConfig.radius.step +
    state.lensing * fieldConfig.radius.lensingWeight;
  const wave =
    fieldConfig.wave.base +
    state.fieldIntensity * fieldConfig.wave.fieldIntensityWeight +
    lineIndex * fieldConfig.wave.step;
  const height =
    fieldConfig.height.base +
    state.orbitSpread * fieldConfig.height.orbitSpreadWeight +
    state.instability * fieldConfig.height.instabilityWeight;
  const phase = lineIndex * fieldConfig.phaseStep;

  for (let index = 0; index < pointCount; index += 1) {
    const t = (index / (pointCount - 1)) * Math.PI * 2;
    const x = Math.cos(t) * radius + Math.sin(t * 3 + phase) * wave;
    const y = Math.sin(t * 2 + phase) * height;
    const z = Math.sin(t) * radius + Math.cos(t * 4 - phase) * wave * 0.66;

    vertices[index * 3] = x;
    vertices[index * 3 + 1] = y;
    vertices[index * 3 + 2] = z;
  }

  return vertices;
}
