"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { colorFromHsl } from "@/components/three/physics-world/shared";

interface RouteLatticeProps {
  routeDensity: number;
  infrastructureIntensity: number;
  colorBias: number;
  brightnessBias: number;
  isPaused: boolean;
}

function buildArcPoints(index: number, density: number) {
  const points: [number, number, number][] = [];
  const radius = 2.18 + density * 1.08 + index * 0.04;
  const arcHeight = 0.32 + density * 0.46 + (index % 3) * 0.06;
  const phase = index * 0.62;
  const pointCount = 28;

  for (let pointIndex = 0; pointIndex < pointCount; pointIndex += 1) {
    const t = pointIndex / (pointCount - 1);
    const angle = phase + t * Math.PI * 1.24;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(t * Math.PI) * arcHeight - 0.24 + Math.sin(angle * 0.7) * 0.12;
    const z = Math.sin(angle) * radius;
    points.push([x, y, z]);
  }

  return points;
}

export function RouteLattice({
  routeDensity,
  infrastructureIntensity,
  colorBias,
  brightnessBias,
  isPaused,
}: RouteLatticeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const count = Math.max(3, Math.round(3 + routeDensity * 6));
  const arcs = useMemo(
    () => Array.from({ length: count }, (_, index) => buildArcPoints(index, routeDensity)),
    [count, routeDensity],
  );
  const primaryColor = useMemo(
    () => colorFromHsl((colorBias + 0.03) % 1, 0.68, 0.52 + brightnessBias * 0.16),
    [brightnessBias, colorBias],
  );
  const secondaryColor = useMemo(
    () => colorFromHsl((colorBias + 0.12) % 1, 0.58, 0.4 + infrastructureIntensity * 0.18),
    [colorBias, infrastructureIntensity],
  );

  useFrame((_, delta) => {
    if (!groupRef.current || isPaused) {
      return;
    }

    groupRef.current.rotation.y += delta * (0.03 + routeDensity * 0.09);
    groupRef.current.rotation.x += delta * 0.015;
  });

  if (routeDensity <= 0.06) {
    return null;
  }

  return (
    <group ref={groupRef}>
      {arcs.map((points, index) => (
        <Line
          key={index}
          points={points}
          rotation={[
            index * 0.18,
            index * 0.38,
            index % 2 === 0 ? 0 : Math.PI / 2.2,
          ]}
          lineWidth={0.84 + infrastructureIntensity * 0.34}
        >
          <lineBasicMaterial
            color={index % 2 === 0 ? primaryColor : secondaryColor}
            transparent
            opacity={0.06 + routeDensity * 0.14 + infrastructureIntensity * 0.08}
          />
        </Line>
      ))}
    </group>
  );
}
