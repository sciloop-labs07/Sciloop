"use client";

import { useEffect, useRef, useState } from "react";

import {
  createInitialInductionState,
  resetInductionSimulation,
  setInductionInput,
  stepInductionSimulation,
  type InductionSimulationState,
} from "../simulations/induction-simulation";

const MAX_HISTORY = 120;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function InductionStaticFallback() {
  return (
    <section className="rounded-2xl border border-cyan-200/20 bg-slate-950/80 p-5 text-slate-100" aria-labelledby="induction-fallback-title">
      <h2 id="induction-fallback-title" className="text-lg font-semibold">Motion → changing flux → induced current</h2>
      <p id="induction-fallback-description" className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
        Magnet motion changes magnetic flux through the loop. The changing flux induces emf and current. When the magnet stops, induced emf returns toward zero.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3" aria-label="Induction cause mechanism effect">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><span className="block text-[10px] uppercase tracking-[0.18em] text-cyan-200">Cause</span><strong className="mt-1 block">Relative motion</strong><span className="mt-1 block text-xs text-slate-400">Moving magnet</span></div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><span className="block text-[10px] uppercase tracking-[0.18em] text-cyan-200">Mechanism</span><strong className="mt-1 block">Changing magnetic flux</strong><span className="mt-1 block text-xs text-slate-400">Flux through loop changes</span></div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><span className="block text-[10px] uppercase tracking-[0.18em] text-cyan-200">Effect</span><strong className="mt-1 block">Induced emf and current</strong><span className="mt-1 block text-xs text-slate-400">Direction follows emf sign</span></div>
      </div>
    </section>
  );
}

function drawArrow(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 2;
  context.beginPath(); context.moveTo(x1, y1); context.lineTo(x2, y2); context.stroke();
  context.beginPath(); context.moveTo(x2, y2); context.lineTo(x2 - 9 * Math.cos(angle - Math.PI / 6), y2 - 9 * Math.sin(angle - Math.PI / 6)); context.lineTo(x2 - 9 * Math.cos(angle + Math.PI / 6), y2 - 9 * Math.sin(angle + Math.PI / 6)); context.closePath(); context.fill();
}

function drawScene(context: CanvasRenderingContext2D, width: number, height: number, state: InductionSimulationState, history: number[]) {
  context.clearRect(0, 0, width, height);
  const scale = Math.min(width / 5.2, height / 3.4);
  const centerY = height * 0.43;
  const centerX = width * 0.5;
  const toX = (position: number) => centerX + position * scale;
  const magnetX = toX(state.magnetPosition);
  const loopX = toX(state.loopPosition);

  context.fillStyle = "#071226"; context.fillRect(0, 0, width, height);
  context.strokeStyle = "rgba(116, 215, 255, 0.16)"; context.lineWidth = 1;
  for (let y = 18; y < height; y += 24) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }

  context.strokeStyle = "rgba(113, 206, 255, 0.52)"; context.lineWidth = 1.5;
  for (let i = -2; i <= 2; i += 1) {
    context.beginPath(); context.arc(magnetX, centerY, (0.55 + Math.abs(i) * 0.18) * scale, Math.PI * (0.14 + i * 0.035), Math.PI * (1.86 - i * 0.035)); context.stroke();
  }
  context.fillStyle = "#f4b860"; context.fillRect(magnetX - 30, centerY - 22, 60, 44);
  context.fillStyle = "#d85d67"; context.fillRect(magnetX - 30, centerY - 22, 30, 44);
  context.fillStyle = "#fff1df"; context.font = "bold 12px system-ui"; context.textAlign = "center"; context.fillText("N", magnetX - 15, centerY + 4); context.fillText("S", magnetX + 15, centerY + 4);

  context.strokeStyle = "#69e4c5"; context.lineWidth = 5; context.beginPath(); context.ellipse(loopX, centerY, 34, 82, 0, 0, Math.PI * 2); context.stroke();
  context.strokeStyle = "rgba(105, 228, 197, 0.2)"; context.lineWidth = 1; context.beginPath(); context.ellipse(loopX, centerY, 52, 98, 0, 0, Math.PI * 2); context.stroke();
  const arrowDirection = state.currentDirection || (state.magnetVelocity >= 0 ? 1 : -1);
  drawArrow(context, loopX - 15, centerY - 90, loopX + arrowDirection * 24, centerY - 90, state.currentDirection === 0 ? "#64748b" : "#69e4c5");
  drawArrow(context, magnetX, centerY + 78, magnetX + Math.sign(state.magnetVelocity || 1) * 40, centerY + 78, "#f4b860");

  context.textAlign = "left"; context.font = "12px system-ui"; context.fillStyle = "#cbd5e1"; context.fillText("moving magnet", 16, 22); context.fillText("conducting loop", Math.max(16, loopX - 45), centerY + 116); context.fillStyle = "#69e4c5"; context.fillText(`current ${state.currentDirection > 0 ? "↻" : state.currentDirection < 0 ? "↺" : "—"}`, Math.max(16, loopX - 35), centerY - 108); context.fillStyle = "#f4b860"; context.fillText("relative motion", Math.max(16, magnetX - 44), centerY + 100);

  const graphTop = height * 0.72; const graphHeight = height * 0.2; const graphLeft = 16; const graphWidth = width - 32;
  context.strokeStyle = "rgba(255,255,255,0.16)"; context.lineWidth = 1; context.strokeRect(graphLeft, graphTop, graphWidth, graphHeight); context.fillStyle = "#94a3b8"; context.fillText("emf history", graphLeft, graphTop - 7);
  context.strokeStyle = "#73d6ff"; context.lineWidth = 2; context.beginPath();
  history.forEach((value, index) => { const x = graphLeft + (index / Math.max(1, MAX_HISTORY - 1)) * graphWidth; const y = graphTop + graphHeight / 2 - clamp(value, -4, 4) / 4 * (graphHeight / 2 - 4); if (index === 0) context.moveTo(x, y); else context.lineTo(x, y); }); context.stroke();
}

export function InductionCanvasRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(createInitialInductionState());
  const historyRef = useRef<number[]>([0]);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const [liveState, setLiveState] = useState(createInitialInductionState);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const context = canvas.getContext("2d");
    if (!parent || !context) return;
    const resize = () => { const rect = parent.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2); canvas.width = Math.max(1, Math.round(rect.width * dpr)); canvas.height = Math.max(1, Math.round(rect.height * dpr)); canvas.style.width = `${rect.width}px`; canvas.style.height = `${rect.height}px`; context.setTransform(dpr, 0, 0, dpr, 0, 0); drawScene(context, rect.width, rect.height, stateRef.current, historyRef.current); };
    const observer = new ResizeObserver(resize); observer.observe(parent); resize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener("change", update);
    const onVisibility = () => { if (document.hidden) lastTimeRef.current = null; };
    document.addEventListener("visibilitychange", onVisibility);
    return () => { media.removeEventListener("change", update); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; const parent = canvas?.parentElement; if (!canvas || !parent) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { threshold: 0.05 }); observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const animate = (now: number) => {
      if (visible && !document.hidden && !reducedMotion) {
        const previous = lastTimeRef.current ?? now; const delta = Math.min((now - previous) / 1000, 0.05); lastTimeRef.current = now;
        stateRef.current = stepInductionSimulation(stateRef.current, delta); historyRef.current = [...historyRef.current, stateRef.current.inducedEmf].slice(-MAX_HISTORY);
        const canvas = canvasRef.current; const context = canvas?.getContext("2d"); const rect = canvas?.getBoundingClientRect(); if (context && rect) drawScene(context, rect.width, rect.height, stateRef.current, historyRef.current);
        if (Math.floor(stateRef.current.time * 10) !== Math.floor((stateRef.current.time - delta) * 10)) setLiveState({ ...stateRef.current });
      } else { lastTimeRef.current = null; }
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); frameRef.current = null; };
  }, [reducedMotion, visible]);

  const updateInput = (input: Parameters<typeof setInductionInput>[1]) => { stateRef.current = setInductionInput(stateRef.current, input); setLiveState({ ...stateRef.current }); };
  const reset = () => { stateRef.current = resetInductionSimulation(); historyRef.current = [0]; setLiveState({ ...stateRef.current }); };
  const stateLabel = Math.abs(liveState.magnetVelocity) < 0.001 ? "stationary" : "moving";
  return (
    <section className="rounded-2xl border border-cyan-200/20 bg-slate-950/70 p-4" aria-labelledby="induction-canvas-title">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/80">Workbench renderer foundation</p><h2 id="induction-canvas-title" className="mt-1 text-xl font-semibold text-white">Electromagnetic induction</h2><p className="mt-1 text-sm text-slate-400">Relative motion → changing magnetic flux → induced emf → current direction</p></div><span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Canvas 2D</span></div>
      <div className="mt-4 h-[22rem] w-full overflow-hidden rounded-xl border border-white/10"><canvas ref={canvasRef} className="block h-full w-full" role="img" aria-label="Animated induction diagram with a moving magnet, magnetic field lines, conducting loop, current arrow, and emf graph" /><noscript><InductionStaticFallback /></noscript></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite"><div><span className="block text-xs text-slate-500">Flux change</span><strong className="text-sm text-white">{liveState.fluxChangeRate.toFixed(3)} Wb/s</strong></div><div><span className="block text-xs text-slate-500">Induced emf</span><strong className="text-sm text-white">{liveState.inducedEmf.toFixed(3)} V</strong></div><div><span className="block text-xs text-slate-500">Current direction</span><strong className="text-sm text-white">{liveState.currentDirection > 0 ? "clockwise" : liveState.currentDirection < 0 ? "counter-clockwise" : "none"}</strong></div><div><span className="block text-xs text-slate-500">State</span><strong className="text-sm text-white">{liveState.paused ? "paused" : stateLabel}</strong></div></div>
      <div className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 md:grid-cols-2"><div className="flex flex-wrap gap-2"><button type="button" className="rounded-lg bg-cyan-300 px-3 py-2 text-sm font-semibold text-slate-950" onClick={() => updateInput({ paused: !stateRef.current.paused })}>{liveState.paused ? "Play" : "Pause"}</button><button type="button" className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white" onClick={reset}>Reset</button><button type="button" className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white" onClick={() => updateInput({ magnetDirection: stateRef.current.magnetDirection === 1 ? -1 : 1 })}>Reverse direction</button></div><div className="grid gap-2 sm:grid-cols-2"><label className="text-xs text-slate-400">Speed <input aria-label="Simulation speed" className="mt-1 w-full accent-cyan-300" type="range" min="0.25" max="2" step="0.25" value={liveState.speedMultiplier} onChange={(event) => updateInput({ speedMultiplier: Number(event.target.value) })} /></label><label className="text-xs text-slate-400">Motion amount <input aria-label="Magnet motion amount" className="mt-1 w-full accent-cyan-300" type="range" min="0" max="1" step="0.05" value={liveState.motionAmount} onChange={(event) => updateInput({ motionAmount: Number(event.target.value) })} /></label></div></div>
      {reducedMotion ? <p className="mt-3 text-xs text-amber-200">Reduced motion is enabled; the diagram is paused while measurements remain available.</p> : null}
    </section>
  );
}
