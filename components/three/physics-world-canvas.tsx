"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";

import {
  PHYSICS_WORLD_CANVAS,
  PHYSICS_WORLD_QUALITY_PRESETS,
} from "@/components/three/physics-world/constants";
import { PhysicsWorldScene } from "@/components/three/physics-world/physics-world-scene";
import { type PhysicsWorldRenderProps } from "@/components/three/physics-world/shared";
import { WorldFallbackMessage } from "@/components/three/world-fallback-message";
import { WorldLoadingCard } from "@/components/three/world-loading-card";
import { WebGLGuard } from "@/components/three/webgl-guard";
import { ErrorBoundary } from "@/components/ui/error-boundary";

type PhysicsWorldCanvasProps = PhysicsWorldRenderProps;

export function PhysicsWorldCanvas(props: PhysicsWorldCanvasProps) {
  const qualityPreset = PHYSICS_WORLD_QUALITY_PRESETS[props.quality];
  const fallbackSections = [
    { label: "Old state", value: props.discovery.simulation.before.summary },
    { label: "New state", value: props.discovery.simulation.after.summary },
    { label: "Mechanism", value: props.discovery.simulation.mechanism },
  ];

  const unsupportedFallback = (
    <WorldFallbackMessage
      worldName="Physics World"
      title="This browser cannot open the 3D Physics scene."
      copy="WebGL or hardware acceleration is unavailable, so SciLoop switches to a readable fallback instead of leaving the world blank."
      statusLabel="Graphics unsupported"
      detailSections={fallbackSections}
    />
  );
  const failedFallback = (
    <WorldFallbackMessage
      worldName="Physics World"
      title="The 3D canvas could not finish rendering."
      copy="SciLoop recovered into a fallback panel so you can still understand the selected discovery and continue exploring the route."
      statusLabel="Render fallback"
      detailSections={fallbackSections}
    />
  );

  return (
    <WebGLGuard fallback={unsupportedFallback}>
      <ErrorBoundary fallback={failedFallback}>
        <div className="panel-surface world-frame relative h-[30rem] overflow-hidden rounded-[30px] border border-white/10 md:h-[42rem]">
          <div className="world-grid absolute inset-0" />
          <Suspense fallback={<WorldLoadingCard />}>
            <Canvas
              dpr={qualityPreset.dpr ?? PHYSICS_WORLD_CANVAS.dpr}
              camera={{
                position: PHYSICS_WORLD_CANVAS.cameraPosition,
                fov: PHYSICS_WORLD_CANVAS.cameraFov,
              }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
              }}
              onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = PHYSICS_WORLD_CANVAS.toneMappingExposure;
              }}
            >
              <PhysicsWorldScene {...props} />
            </Canvas>
          </Suspense>
        </div>
      </ErrorBoundary>
    </WebGLGuard>
  );
}
