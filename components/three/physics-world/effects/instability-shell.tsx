"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface InstabilityShellProps {
  stormIntensity: number;
  riskScore: number;
  isPaused: boolean;
}

export function InstabilityShell({
  stormIntensity,
  riskScore,
  isPaused,
}: InstabilityShellProps) {
  const groupRef = useRef<THREE.Group>(null);
  const color = useMemo(() => {
    const hue = 0.07 - stormIntensity * 0.03;
    const tone = new THREE.Color();
    tone.setHSL(hue, 0.82, 0.52 + stormIntensity * 0.08);
    return tone;
  }, [stormIntensity]);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.scale.setScalar(1 + stormIntensity * 0.06);

    if (isPaused) {
      return;
    }

    groupRef.current.rotation.y += delta * (0.04 + stormIntensity * 0.16);
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.18;
  });

  if (stormIntensity <= 0.1) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <mesh scale={2.5 + stormIntensity * 0.18}>
        <icosahedronGeometry args={[1.34, 1]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.04 + stormIntensity * 0.12}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.3, 0, Math.PI / 6]} scale={1 + stormIntensity * 0.12}>
        <torusGeometry args={[3.08, 0.04 + stormIntensity * 0.03, 14, 96]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.02 + riskScore * 0.14}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
