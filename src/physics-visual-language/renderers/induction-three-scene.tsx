"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { getRenderCapabilities } from "../../visual-engine/runtime/render-capabilities";
import { InductionCanvasRenderer } from "./induction-canvas-renderer";
import { createInitialInductionState, stepInductionSimulation } from "../simulations/induction-simulation";

function InductionObjects() {
  const magnet = useRef<THREE.Group>(null);
  const loop = useRef<THREE.Mesh>(null);
  const state = useRef(createInitialInductionState());
  const magnetMaterial = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    state.current = stepInductionSimulation(state.current, delta);
    if (magnet.current) magnet.current.position.x = state.current.magnetPosition;
    if (loop.current) loop.current.rotation.z = state.current.currentDirection * 0.04;
    if (magnetMaterial.current) magnetMaterial.current.emissiveIntensity = 0.2 + Math.abs(state.current.inducedEmf) * 0.12;
  });

  return <>
    <ambientLight intensity={1.6} />
    <directionalLight position={[2, 3, 4]} intensity={2} />
    <group ref={magnet}>
      <mesh position={[-0.3, 0, 0]}><boxGeometry args={[0.6, 0.55, 0.55]} /><meshStandardMaterial color="#dc6470" /></mesh>
      <mesh position={[0.3, 0, 0]}><boxGeometry args={[0.6, 0.55, 0.55]} /><meshStandardMaterial ref={magnetMaterial} color="#f4b860" emissive="#f4b860" /></mesh>
    </group>
    <mesh ref={loop} position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.9, 0.035, 12, 64]} /><meshStandardMaterial color="#69e4c5" emissive="#69e4c5" emissiveIntensity={0.25} /></mesh>
    {[0.55, 0.8, 1.05].map((radius) => <mesh key={radius} position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius, 0.008, 8, 48]} /><meshBasicMaterial color="#73d6ff" transparent opacity={0.35} /></mesh>)}
  </>;
}

export function InductionThreeScene() {
  const capabilities = getRenderCapabilities();
  if (!capabilities.webgl2) return <InductionCanvasRenderer />;
  return <div className="h-[22rem] w-full overflow-hidden rounded-xl border border-white/10" aria-label="Three.js induction workbench scene"><Canvas frameloop="always" dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}><InductionObjects /></Canvas></div>;
}
