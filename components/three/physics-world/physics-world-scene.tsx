"use client";

import { useMemo } from "react";
import * as THREE from "three";

import {
  PHYSICS_WORLD_GEOMETRY,
  PHYSICS_WORLD_SCENE,
} from "@/components/three/physics-world/constants";
import { CameraRig } from "@/components/three/physics-world/camera-rig";
import { EnergyCore } from "@/components/three/physics-world/energy-core";
import { BiosphereHalo } from "@/components/three/physics-world/effects/biosphere-halo";
import { InstabilityShell } from "@/components/three/physics-world/effects/instability-shell";
import { RouteLattice } from "@/components/three/physics-world/effects/route-lattice";
import { FieldLines } from "@/components/three/physics-world/field-lines";
import { ParticleCloud } from "@/components/three/physics-world/particle-cloud";
import {
  buildPhysicsVisualState,
  colorFromHsl,
  type PhysicsWorldRenderProps,
} from "@/components/three/physics-world/shared";
import { WorldLights } from "@/components/three/physics-world/world-lights";

export function PhysicsWorldScene({
  discovery,
  progress,
  viewMode,
  cameraMode,
  sandboxParameters,
  quality,
  isPaused,
}: PhysicsWorldRenderProps) {
  const world = useMemo(
    () => buildPhysicsVisualState(discovery, progress, sandboxParameters, quality),
    [discovery, progress, quality, sandboxParameters],
  );
  const backgroundColor = useMemo(
    () =>
      `#${colorFromHsl(
        (world.colorBias + 0.52 + world.biosphereIntensity * 0.03) % 1,
        0.36,
        0.026 + world.brightnessBias * 0.08,
      ).getHexString()}`,
    [world.biosphereIntensity, world.brightnessBias, world.colorBias],
  );
  const fieldColor = useMemo(
    () =>
      colorFromHsl(
        world.colorBias,
        0.74,
        0.38 + world.brightnessBias * 0.24,
      ),
    [world.brightnessBias, world.colorBias],
  );

  return (
    <>
      <color attach="background" args={[backgroundColor]} />
      <fog attach="fog" args={[backgroundColor, 8, 18]} />

      <CameraRig
        viewMode={viewMode}
        cameraMode={cameraMode}
        lensing={world.lensing}
        isPaused={isPaused}
      />
      <WorldLights
        glowStrength={world.glowStrength}
        fieldIntensity={world.fieldIntensity}
        uncertaintyHalo={world.uncertaintyHalo}
        colorBias={world.colorBias}
        brightnessBias={world.brightnessBias}
        biosphereIntensity={world.biosphereIntensity}
        infrastructureIntensity={world.infrastructureIntensity}
        stormIntensity={world.stormIntensity}
      />

      <group position={[PHYSICS_WORLD_SCENE.sceneOffsetX, 0, 0]}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, PHYSICS_WORLD_SCENE.floorOffsetY, 0]}
          scale={1 + world.lensing * 0.24}
        >
          <circleGeometry
            args={[
              PHYSICS_WORLD_SCENE.floorRadius + world.lensing * 1.2,
              PHYSICS_WORLD_GEOMETRY.groundSegments,
            ]}
          />
          <meshBasicMaterial
            color={fieldColor}
            transparent
            opacity={world.fieldOpacity}
          />
        </mesh>

        <mesh
          rotation={[Math.PI / 2 + world.ringTilt * 0.4, 0, world.ringTilt * 0.14]}
          scale={[world.auraRadius, world.auraRadius, 1]}
        >
          <ringGeometry
            args={[
              PHYSICS_WORLD_SCENE.auraInnerRadius,
              PHYSICS_WORLD_SCENE.auraOuterRadius,
              PHYSICS_WORLD_GEOMETRY.auraSegments,
            ]}
          />
          <meshBasicMaterial
            color={fieldColor}
            transparent
            opacity={0.06 + world.uncertaintyHalo * 0.14}
            side={THREE.DoubleSide}
          />
        </mesh>

        <FieldLines
          fieldIntensity={world.fieldIntensity}
          lensing={world.lensing}
          orbitSpread={world.orbitSpread}
          instability={world.instability}
          lineCount={world.fieldLineCount}
          isPaused={isPaused}
        />

        <EnergyCore
          glowStrength={world.glowStrength}
          waveAmplitude={world.waveAmplitude}
          instability={world.instability}
          energyScale={world.energyScale}
          energyPulse={world.energyPulse}
          fieldIntensity={world.fieldIntensity}
          uncertaintyHalo={world.uncertaintyHalo}
          colorBias={world.colorBias}
          brightnessBias={world.brightnessBias}
          isPaused={isPaused}
        />

        <BiosphereHalo
          biosphereIntensity={world.biosphereIntensity}
          stormIntensity={world.stormIntensity}
          colorBias={world.colorBias}
          brightnessBias={world.brightnessBias}
          isPaused={isPaused}
        />

        <RouteLattice
          routeDensity={world.routeDensity}
          infrastructureIntensity={world.infrastructureIntensity}
          colorBias={world.colorBias}
          brightnessBias={world.brightnessBias}
          isPaused={isPaused}
        />

        <InstabilityShell
          stormIntensity={world.stormIntensity}
          riskScore={world.riskScore}
          isPaused={isPaused}
        />

        <ParticleCloud
          nearParticleCount={world.nearParticleCount}
          farParticleCount={world.farParticleCount}
          glowStrength={world.glowStrength}
          orbitSpread={world.orbitSpread}
          orbitSpeed={world.orbitSpeed}
          instability={world.instability}
          uncertaintyHalo={world.uncertaintyHalo}
          colorBias={world.colorBias}
          brightnessBias={world.brightnessBias}
          particleOpacity={world.particleOpacity}
          isPaused={isPaused}
        />
      </group>
    </>
  );
}
