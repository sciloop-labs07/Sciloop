"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { PHYSICS_WORLD_FIELD } from "@/components/three/physics-world/constants";
import {
  colorFromHsl,
  createFieldLineVertices,
} from "@/components/three/physics-world/shared";

interface FieldLinesProps {
  fieldIntensity: number;
  lensing: number;
  orbitSpread: number;
  instability: number;
  lineCount: number;
  isPaused: boolean;
}

export function FieldLines({
  fieldIntensity,
  lensing,
  orbitSpread,
  instability,
  lineCount,
  isPaused,
}: FieldLinesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lines = useMemo(
    () =>
      Array.from({ length: lineCount }, (_, index) => ({
        rotation: [
          index * 0.3,
          index * 0.5,
          index % 2 === 0 ? 0 : Math.PI / 2.9,
        ] as [number, number, number],
        points: Array.from(
          createFieldLineVertices(index, {
            fieldIntensity,
            lensing,
            orbitSpread,
            instability,
          }),
        ).reduce<[number, number, number][]>((accumulator, _, vertexIndex, vertices) => {
          if (vertexIndex % 3 === 0) {
            accumulator.push([
              vertices[vertexIndex] ?? 0,
              vertices[vertexIndex + 1] ?? 0,
              vertices[vertexIndex + 2] ?? 0,
            ]);
          }

          return accumulator;
        }, []),
      })),
    [fieldIntensity, lensing, orbitSpread, instability, lineCount],
  );
  const primaryColor = useMemo(
    () => colorFromHsl(0.57 + lensing * 0.12, 0.74, 0.66),
    [lensing],
  );

  useFrame((state, delta) => {
    if (!groupRef.current || isPaused) return;
    groupRef.current.rotation.y += delta * (0.05 + fieldIntensity * 0.08);
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.24) * 0.12;
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, index) => (
        <Line
          key={index}
          points={line.points}
          rotation={line.rotation}
          lineWidth={
            PHYSICS_WORLD_FIELD.baseLineWidth - index * PHYSICS_WORLD_FIELD.lineWidthStep
          }
        >
          <lineBasicMaterial
            color={index % 2 === 0 ? primaryColor : "#f3c88d"}
            transparent
            opacity={0.08 + fieldIntensity * 0.18 + index * 0.01}
          />
        </Line>
      ))}
    </group>
  );
}
