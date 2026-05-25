"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import {
  PHYSICS_WORLD_CAMERA_MOTION,
  PHYSICS_WORLD_CAMERA_TARGETS,
} from "@/components/three/physics-world/constants";
import type { PhysicsCameraMode, PhysicsWorldView } from "@/lib/types";

interface CameraRigProps {
  viewMode: PhysicsWorldView;
  cameraMode: PhysicsCameraMode;
  lensing: number;
  isPaused: boolean;
}

export function CameraRig({
  viewMode,
  cameraMode,
  lensing,
  isPaused,
}: CameraRigProps) {
  const nextPositionRef = useRef(new THREE.Vector3());
  const nextLookAtRef = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const target =
      cameraMode === "demo"
        ? PHYSICS_WORLD_CAMERA_TARGETS.demo
        : PHYSICS_WORLD_CAMERA_TARGETS[viewMode];
    const time = state.clock.elapsedTime;
    const cinematicOrbit =
      viewMode === "cinematic"
        ? time * PHYSICS_WORLD_CAMERA_MOTION.cinematicOrbitSpeed
        : 0;
    const demoOrbit = time * PHYSICS_WORLD_CAMERA_MOTION.demoOrbitSpeed;
    const nextPosition = nextPositionRef.current;
    const nextLookAt = nextLookAtRef.current;
    const pointerXInfluence =
      cameraMode === "demo"
        ? PHYSICS_WORLD_CAMERA_MOTION.demoPointerX
        : PHYSICS_WORLD_CAMERA_MOTION.interactivePointerX;
    const pointerYInfluence =
      cameraMode === "demo"
        ? PHYSICS_WORLD_CAMERA_MOTION.demoPointerY
        : PHYSICS_WORLD_CAMERA_MOTION.interactivePointerY;
    const lookXInfluence =
      cameraMode === "demo"
        ? PHYSICS_WORLD_CAMERA_MOTION.demoLookX
        : PHYSICS_WORLD_CAMERA_MOTION.interactiveLookX;
    const lookYInfluence =
      cameraMode === "demo"
        ? PHYSICS_WORLD_CAMERA_MOTION.demoLookY
        : PHYSICS_WORLD_CAMERA_MOTION.interactiveLookY;

    nextPosition.copy(target.position);
    nextPosition.x += state.pointer.x * pointerXInfluence;
    nextPosition.y += state.pointer.y * pointerYInfluence;
    nextPosition.z += lensing * 0.65;

    if (!isPaused) {
      if (cameraMode === "demo") {
        nextPosition.x += Math.cos(demoOrbit) * PHYSICS_WORLD_CAMERA_MOTION.demoOrbitXAmplitude;
        nextPosition.y +=
          Math.sin(demoOrbit * 0.72) * PHYSICS_WORLD_CAMERA_MOTION.demoOrbitYAmplitude;
        nextPosition.z +=
          Math.sin(demoOrbit * 0.56) * PHYSICS_WORLD_CAMERA_MOTION.demoOrbitZAmplitude;
      } else {
        nextPosition.x +=
          Math.cos(cinematicOrbit) *
          (viewMode === "cinematic"
            ? PHYSICS_WORLD_CAMERA_MOTION.cinematicOrbitAmplitude
            : PHYSICS_WORLD_CAMERA_MOTION.interactiveDriftX);
        nextPosition.y +=
          Math.sin(time * 0.22) * PHYSICS_WORLD_CAMERA_MOTION.interactiveDriftY;
        nextPosition.z +=
          Math.sin(time * 0.18) * PHYSICS_WORLD_CAMERA_MOTION.interactiveDriftZ;
      }
    }

    state.camera.position.lerp(
      nextPosition,
      1 - Math.exp(-delta * PHYSICS_WORLD_CAMERA_MOTION.transitionDamping),
    );

    nextLookAt.copy(target.lookAt);
    nextLookAt.x += state.pointer.x * lookXInfluence;
    nextLookAt.y += state.pointer.y * lookYInfluence;

    if (cameraMode === "demo" && !isPaused) {
      nextLookAt.x +=
        Math.sin(demoOrbit * 0.46) * PHYSICS_WORLD_CAMERA_MOTION.demoLookOrbitXAmplitude;
      nextLookAt.y +=
        Math.cos(demoOrbit * 0.38) * PHYSICS_WORLD_CAMERA_MOTION.demoLookOrbitYAmplitude;
    }

    state.camera.lookAt(nextLookAt);
  });

  return null;
}
