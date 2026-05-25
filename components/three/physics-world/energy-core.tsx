"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { PHYSICS_WORLD_GEOMETRY } from "@/components/three/physics-world/constants";
import { colorFromHsl } from "@/components/three/physics-world/shared";

interface EnergyCoreProps {
  glowStrength: number;
  waveAmplitude: number;
  instability: number;
  energyScale: number;
  energyPulse: number;
  fieldIntensity: number;
  uncertaintyHalo: number;
  colorBias: number;
  brightnessBias: number;
  isPaused: boolean;
}

interface EnergyCoreUniforms {
  [key: string]: THREE.IUniform<number | THREE.Color>;
  uTime: THREE.IUniform<number>;
  uAmplitude: THREE.IUniform<number>;
  uGlow: THREE.IUniform<number>;
  uColorA: THREE.IUniform<THREE.Color>;
  uColorB: THREE.IUniform<THREE.Color>;
}

type EnergyCoreMaterial = THREE.ShaderMaterial & {
  uniforms: EnergyCoreUniforms;
};

const vertexShader = `
  uniform float uTime;
  uniform float uAmplitude;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying float vPulse;

  void main() {
    vec3 transformed = position;
    float wave = sin((position.y * 4.0) + uTime * 1.4) * 0.55;
    wave += sin((position.x * 3.0) - uTime * 1.1) * 0.45;
    transformed += normal * wave * uAmplitude;

    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vWorldPosition = worldPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    vPulse = 0.5 + 0.5 * sin(uTime * 1.7 + length(position) * 6.0);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uGlow;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying float vPulse;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), 2.2);
    vec3 color = mix(uColorA, uColorB, vPulse);
    float alpha = 0.56 + fresnel * 0.36;
    vec3 finalColor = color * (0.55 + uGlow * 0.55 + fresnel * 0.8);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function EnergyCore({
  glowStrength,
  waveAmplitude,
  instability,
  energyScale,
  energyPulse,
  fieldIntensity,
  uncertaintyHalo,
  colorBias,
  brightnessBias,
  isPaused,
}: EnergyCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<EnergyCoreMaterial>(null);
  const uniforms = useMemo<EnergyCoreUniforms>(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 0.12 },
      uGlow: { value: 0.5 },
      uColorA: { value: new THREE.Color("#8fe9ff") },
      uColorB: { value: new THREE.Color("#f3c88d") },
    }),
    [],
  );
  const shellColor = useMemo(
    () => colorFromHsl(colorBias, 0.76, 0.5 + brightnessBias * 0.24),
    [brightnessBias, colorBias],
  );
  const haloColor = useMemo(
    () => colorFromHsl((colorBias + 0.08) % 1, 0.72, 0.5 + uncertaintyHalo * 0.22),
    [colorBias, uncertaintyHalo],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uAmplitude.value = 0.08 + waveAmplitude * 0.16 + instability * 0.06;
    material.uniforms.uGlow.value = glowStrength;
    material.uniforms.uColorA.value.copy(shellColor);
    material.uniforms.uColorB.value.copy(haloColor);

    if (!isPaused) {
      material.uniforms.uTime.value += delta * (0.8 + energyPulse * 0.7);
    }

    if (!groupRef.current) return;

    groupRef.current.scale.setScalar(energyScale + Math.sin(state.clock.elapsedTime * 1.3) * 0.02);

    if (!isPaused) {
      groupRef.current.rotation.y += delta * (0.14 + fieldIntensity * 0.16);
      groupRef.current.rotation.z += delta * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry
          args={[
            PHYSICS_WORLD_GEOMETRY.coreRadius,
            PHYSICS_WORLD_GEOMETRY.coreWidthSegments,
            PHYSICS_WORLD_GEOMETRY.coreHeightSegments,
          ]}
        />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh scale={1.24}>
        <icosahedronGeometry
          args={[
            PHYSICS_WORLD_GEOMETRY.shellRadius,
            PHYSICS_WORLD_GEOMETRY.shellDetail,
          ]}
        />
        <meshBasicMaterial
          color={shellColor}
          wireframe
          transparent
          opacity={0.14 + fieldIntensity * 0.16}
        />
      </mesh>

      <mesh scale={1.54}>
        <sphereGeometry
          args={[
            PHYSICS_WORLD_GEOMETRY.haloRadius,
            PHYSICS_WORLD_GEOMETRY.haloWidthSegments,
            PHYSICS_WORLD_GEOMETRY.haloHeightSegments,
          ]}
        />
        <meshBasicMaterial
          color={haloColor}
          transparent
          opacity={0.08 + glowStrength * 0.16 + uncertaintyHalo * 0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh
        rotation={[Math.PI / 2.1, 0, 0]}
        scale={1 + fieldIntensity * 0.12 + uncertaintyHalo * 0.08}
      >
        <torusGeometry
          args={[
            1.94,
            0.024 + uncertaintyHalo * 0.018,
            PHYSICS_WORLD_GEOMETRY.torusRadialSegments,
            PHYSICS_WORLD_GEOMETRY.torusTubularSegments,
          ]}
        />
        <meshStandardMaterial
          color="#8fe9ff"
          emissive="#8fe9ff"
          emissiveIntensity={0.14 + fieldIntensity * 0.28 + brightnessBias * 0.12}
          transparent
          opacity={0.18 + glowStrength * 0.14}
        />
      </mesh>
    </group>
  );
}
