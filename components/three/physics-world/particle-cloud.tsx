"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { PHYSICS_WORLD_PARTICLES } from "@/components/three/physics-world/constants";
import {
  colorFromHsl,
  createParticlePositions,
} from "@/components/three/physics-world/shared";

interface ParticleCloudProps {
  nearParticleCount: number;
  farParticleCount: number;
  glowStrength: number;
  orbitSpread: number;
  orbitSpeed: number;
  instability: number;
  uncertaintyHalo: number;
  colorBias: number;
  brightnessBias: number;
  particleOpacity: number;
  isPaused: boolean;
}

export function ParticleCloud({
  nearParticleCount,
  farParticleCount,
  glowStrength,
  orbitSpread,
  orbitSpeed,
  instability,
  uncertaintyHalo,
  colorBias,
  brightnessBias,
  particleOpacity,
  isPaused,
}: ParticleCloudProps) {
  const nearRef = useRef<THREE.Points>(null);
  const farRef = useRef<THREE.Points>(null);
  const nearPositions = useMemo(
    () =>
      createParticlePositions(nearParticleCount, {
        orbitSpread,
        instability,
        uncertaintyHalo,
      }),
    [nearParticleCount, orbitSpread, instability, uncertaintyHalo],
  );
  const farPositions = useMemo(
    () =>
      createParticlePositions(
        farParticleCount,
        {
          orbitSpread: orbitSpread * 0.8 + 0.12,
          instability: instability * 0.9,
          uncertaintyHalo: uncertaintyHalo * 0.92,
        },
        PHYSICS_WORLD_PARTICLES.farSeedOffset,
      ),
    [farParticleCount, orbitSpread, instability, uncertaintyHalo],
  );
  const primaryColor = useMemo(
    () => colorFromHsl(colorBias, 0.78, 0.52 + brightnessBias * 0.28),
    [brightnessBias, colorBias],
  );
  const secondaryColor = useMemo(
    () => colorFromHsl((colorBias + 0.08) % 1, 0.68, 0.4 + brightnessBias * 0.24),
    [brightnessBias, colorBias],
  );

  useFrame((state, delta) => {
    if (nearRef.current) {
      if (!isPaused) {
        nearRef.current.rotation.y += delta * (0.08 + orbitSpeed * 0.24);
        nearRef.current.rotation.z += delta * 0.04;
      }
      nearRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.08;
    }

    if (farRef.current) {
      if (!isPaused) {
        farRef.current.rotation.y -= delta * (0.04 + orbitSpeed * 0.16);
        farRef.current.rotation.x += delta * 0.025;
      }
      farRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.16) * 0.08;
    }
  });

  return (
    <>
      <points ref={farRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={farPositions.length / 3}
            array={farPositions}
            itemSize={3}
            args={[farPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={secondaryColor}
          size={
            PHYSICS_WORLD_PARTICLES.farBaseSize +
            uncertaintyHalo * PHYSICS_WORLD_PARTICLES.farUncertaintyFactor
          }
          transparent
          opacity={particleOpacity * 0.54}
          depthWrite={false}
        />
      </points>

      <points ref={nearRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nearPositions.length / 3}
            array={nearPositions}
            itemSize={3}
            args={[nearPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={primaryColor}
          size={
            PHYSICS_WORLD_PARTICLES.nearBaseSize +
            glowStrength * PHYSICS_WORLD_PARTICLES.nearGlowFactor
          }
          transparent
          opacity={particleOpacity}
          depthWrite={false}
        />
      </points>
    </>
  );
}
