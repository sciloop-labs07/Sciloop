import * as THREE from "three";

import { physicsWorldExperienceConfig } from "@/data/worlds/physics-world";
import type {
  PhysicsCameraMode,
  PhysicsWorldView,
  SimulationQuality,
} from "@/lib/types";

export const PHYSICS_WORLD_DEFAULTS: {
  progress: number;
  viewMode: PhysicsWorldView;
  cameraMode: PhysicsCameraMode;
  transitionDurationMs: number;
} = {
  progress: physicsWorldExperienceConfig.defaultProgress,
  viewMode: physicsWorldExperienceConfig.defaultViewMode,
  cameraMode: physicsWorldExperienceConfig.defaultCameraMode,
  transitionDurationMs: physicsWorldExperienceConfig.transitionDurationMs,
};

export const PHYSICS_WORLD_CANVAS = {
  dpr: [1, 1.35] as [number, number],
  cameraPosition: [0.9, 0.8, 6.9] as [number, number, number],
  cameraFov: 34,
  toneMappingExposure: 1.02,
};

export const PHYSICS_WORLD_QUALITY_PRESETS: Record<
  SimulationQuality,
  {
    dpr: [number, number];
    particleMultiplier: number;
    fieldLineMultiplier: number;
    routeDensityMultiplier: number;
    stormOpacityMultiplier: number;
  }
> = {
  auto: {
    dpr: [1, 1.2],
    particleMultiplier: 0.94,
    fieldLineMultiplier: 1,
    routeDensityMultiplier: 1,
    stormOpacityMultiplier: 1,
  },
  low: {
    dpr: [1, 1.05],
    particleMultiplier: 0.78,
    fieldLineMultiplier: 0.8,
    routeDensityMultiplier: 0.82,
    stormOpacityMultiplier: 0.88,
  },
  medium: {
    dpr: [1, 1.18],
    particleMultiplier: 0.94,
    fieldLineMultiplier: 1,
    routeDensityMultiplier: 1,
    stormOpacityMultiplier: 1,
  },
  high: {
    dpr: [1, 1.35],
    particleMultiplier: 1.06,
    fieldLineMultiplier: 1.14,
    routeDensityMultiplier: 1.12,
    stormOpacityMultiplier: 1.08,
  },
};

export const PHYSICS_WORLD_PARTICLES = {
  minTotalCount: 72,
  maxTotalCount: 260,
  nearRatio: 0.64,
  minFarCount: 24,
  farSeedOffset: 240,
  nearBaseSize: 0.04,
  nearGlowFactor: 0.028,
  farBaseSize: 0.028,
  farUncertaintyFactor: 0.02,
};

export const PHYSICS_WORLD_FIELD = {
  lineCount: 5,
  pointCount: 120,
  baseLineWidth: 1.02,
  lineWidthStep: 0.08,
};

export const PHYSICS_WORLD_GEOMETRY = {
  groundSegments: 64,
  auraSegments: 84,
  coreRadius: 1.18,
  coreWidthSegments: 48,
  coreHeightSegments: 48,
  haloRadius: 1.18,
  haloWidthSegments: 24,
  haloHeightSegments: 24,
  shellRadius: 1.34,
  shellDetail: 1,
  torusRadialSegments: 16,
  torusTubularSegments: 128,
};

export const PHYSICS_WORLD_SCENE = {
  sceneOffsetX: -0.48,
  floorOffsetY: -2.45,
  floorRadius: 5.8,
  auraInnerRadius: 1.0,
  auraOuterRadius: 1.32,
};

export const PHYSICS_WORLD_CAMERA_TARGETS: Record<
  PhysicsWorldView | "demo",
  { position: THREE.Vector3; lookAt: THREE.Vector3 }
> = {
  quick: {
    position: new THREE.Vector3(1.1, 0.85, 7.1),
    lookAt: new THREE.Vector3(-0.1, 0.05, 0),
  },
  mechanism: {
    position: new THREE.Vector3(0.4, 0.45, 5.9),
    lookAt: new THREE.Vector3(-0.18, 0, 0),
  },
  cinematic: {
    position: new THREE.Vector3(-1.3, 1.2, 8.3),
    lookAt: new THREE.Vector3(-0.2, 0.12, 0),
  },
  demo: {
    position: new THREE.Vector3(-0.5, 1.08, 7.95),
    lookAt: new THREE.Vector3(-0.2, 0.08, 0),
  },
};

export const PHYSICS_WORLD_CAMERA_MOTION = {
  transitionDamping: 2.6,
  interactivePointerX: 0.55,
  interactivePointerY: 0.26,
  interactiveLookX: 0.22,
  interactiveLookY: 0.16,
  interactiveDriftX: 0.08,
  interactiveDriftY: 0.08,
  interactiveDriftZ: 0.06,
  cinematicOrbitSpeed: 0.18,
  cinematicOrbitAmplitude: 0.48,
  demoPointerX: 0.12,
  demoPointerY: 0.08,
  demoLookX: 0.06,
  demoLookY: 0.04,
  demoOrbitSpeed: 0.16,
  demoOrbitXAmplitude: 0.72,
  demoOrbitYAmplitude: 0.18,
  demoOrbitZAmplitude: 0.16,
  demoLookOrbitXAmplitude: 0.12,
  demoLookOrbitYAmplitude: 0.08,
};
