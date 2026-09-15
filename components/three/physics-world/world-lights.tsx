"use client";

import { useMemo } from "react";

import { colorFromHsl } from "@/components/three/physics-world/shared";

interface WorldLightsProps {
  glowStrength: number;
  fieldIntensity: number;
  uncertaintyHalo: number;
  colorBias: number;
  brightnessBias: number;
  biosphereIntensity: number;
  infrastructureIntensity: number;
  stormIntensity: number;
}

export function WorldLights({
  glowStrength,
  fieldIntensity,
  uncertaintyHalo,
  colorBias,
  brightnessBias,
  biosphereIntensity,
  infrastructureIntensity,
  stormIntensity,
}: WorldLightsProps) {
  const keyColor = useMemo(
    () => colorFromHsl(colorBias, 0.78, 0.58 + brightnessBias * 0.2),
    [brightnessBias, colorBias],
  );
  const fillColor = useMemo(
    () => colorFromHsl((colorBias + 0.09) % 1, 0.64, 0.48 + brightnessBias * 0.16),
    [brightnessBias, colorBias],
  );
  const biosphereColor = useMemo(
    () => colorFromHsl((colorBias + 0.22) % 1, 0.48, 0.34 + biosphereIntensity * 0.18),
    [biosphereIntensity, colorBias],
  );

  return (
    <>
      <ambientLight
        intensity={
          0.18 +
          fieldIntensity * 0.2 +
          brightnessBias * 0.14 +
          biosphereIntensity * 0.06
        }
        color="#d7ebff"
      />
      <hemisphereLight
        args={[
          "#d6ecff",
          "#05070d",
          0.24 +
            glowStrength * 0.18 +
            brightnessBias * 0.1 +
            infrastructureIntensity * 0.06,
        ]}
      />
      <directionalLight
        position={[4.2, 5.4, 6.1]}
        intensity={
          0.72 +
          glowStrength * 0.54 +
          brightnessBias * 0.14 +
          infrastructureIntensity * 0.1
        }
        color="#f7fbff"
      />
      <pointLight
        position={[-0.25, 0.1, 0.2]}
        intensity={1.2 + glowStrength * 1.8 + brightnessBias * 0.6}
        distance={12}
        color={keyColor}
      />
      <pointLight
        position={[-3.8, -2.6, -4.4]}
        intensity={0.24 + uncertaintyHalo * 0.36}
        distance={14}
        color={fillColor}
      />
      <pointLight
        position={[2.6, 1.4, -2.4]}
        intensity={0.12 + biosphereIntensity * 0.52}
        distance={12}
        color={biosphereColor}
      />
      <pointLight
        position={[-2.4, 2.6, 2.8]}
        intensity={0.08 + stormIntensity * 0.42}
        distance={12}
        color="#ffb37d"
      />
    </>
  );
}
