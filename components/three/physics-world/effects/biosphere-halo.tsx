"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { colorFromHsl } from "@/components/three/physics-world/shared";

interface BiosphereHaloProps {
  biosphereIntensity: number;
  stormIntensity: number;
  colorBias: number;
  brightnessBias: number;
  isPaused: boolean;
}

export function BiosphereHalo({
  biosphereIntensity,
  stormIntensity,
  colorBias,
  brightnessBias,
  isPaused,
}: BiosphereHaloProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shellColor = useMemo(
    () =>
      colorFromHsl(
        (colorBias + 0.25) % 1,
        0.56,
        0.24 + biosphereIntensity * 0.18 + brightnessBias * 0.08,
      ),
    [biosphereIntensity, brightnessBias, colorBias],
  );
  const ringColor = useMemo(
    () => colorFromHsl((colorBias + 0.18) % 1, 0.62, 0.44 + biosphereIntensity * 0.16),
    [biosphereIntensity, colorBias],
  );

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.scale.setScalar(1 + biosphereIntensity * 0.08);

    if (isPaused) {
      return;
    }

    groupRef.current.rotation.y += delta * (0.04 + biosphereIntensity * 0.08);
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.22) * 0.12;
  });

  if (biosphereIntensity <= 0.08) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <mesh scale={1.86 + biosphereIntensity * 0.26}>
        <sphereGeometry args={[1.8, 36, 36]} />
        <meshBasicMaterial
          color={shellColor}
          transparent
          opacity={0.04 + biosphereIntensity * 0.1 - stormIntensity * 0.02}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} scale={1 + biosphereIntensity * 0.08}>
        <torusGeometry args={[2.62, 0.032, 20, 132]} />
        <meshBasicMaterial
          color={ringColor}
          transparent
          opacity={0.1 + biosphereIntensity * 0.12}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
