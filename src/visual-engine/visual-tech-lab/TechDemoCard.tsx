"use client";

import { useEffect, useRef } from "react";

import type { VisualTechDemo } from "./techLab.types";
import { getRecommendedUsageLabel, getTechStatusLabel } from "./techLab.utils";

interface TechDemoCardProps {
  demo: VisualTechDemo;
}

function ReactTailwindDemo() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {["Raw Information", "Layered Reality", "Human Understanding"].map((label, index) => (
        <div key={label} className="rounded-md border border-white/10 bg-slate-950/70 p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/70">Layer {index + 1}</p>
          <h4 className="mt-2 text-base font-semibold text-white">{label}</h4>
          <p className="mt-2 text-xs leading-5 text-slate-300">
            {index === 0 ? "Fragments arrive without structure." : index === 1 ? "Hidden structure is separated into layers." : "The learner gets a usable mental model."}
          </p>
        </div>
      ))}
    </div>
  );
}

function SvgDemo() {
  return (
    <svg className="h-56 w-full rounded-md border border-white/10 bg-slate-950/70" viewBox="0 0 760 220" role="img" aria-label="Noise to signal to understanding SVG demo">
      {[
        { x: 120, label: "Noise", fill: "#f97316" },
        { x: 380, label: "Signal", fill: "#22d3ee" },
        { x: 640, label: "Understanding", fill: "#a7f3d0" },
      ].map((node) => (
        <g key={node.label}>
          <circle cx={node.x} cy="96" r="42" fill={node.fill} opacity="0.18" stroke={node.fill} strokeWidth="2" />
          <text x={node.x} y="104" textAnchor="middle" fill="white" fontSize="16" fontWeight="600">{node.label}</text>
        </g>
      ))}
      <path d="M165 96 H330" stroke="#94a3b8" strokeWidth="3" markerEnd="url(#arrow)" />
      <path d="M425 96 H590" stroke="#94a3b8" strokeWidth="3" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
        </marker>
      </defs>
      <text x="380" y="168" textAnchor="middle" fill="#cbd5e1" fontSize="13">Same concept, expressed as semantic nodes and arrows.</text>
    </svg>
  );
}

function SvgMotionDemo() {
  return (
    <svg className="h-56 w-full rounded-md border border-white/10 bg-slate-950/70" viewBox="0 0 760 220" role="img" aria-label="Animated SVG information flow">
      <style>{`
        @keyframes sciloopFlow { 0% { transform: translateX(0); opacity: .35; } 50% { opacity: 1; } 100% { transform: translateX(520px); opacity: .35; } }
        .sciloop-flow-dot { animation: sciloopFlow 3s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
      `}</style>
      <path d="M120 108 C240 40, 520 176, 640 108" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
      <circle className="sciloop-flow-dot" cx="120" cy="108" r="10" fill="#67e8f9" />
      {["Raw", "Layered", "Understood"].map((label, index) => (
        <g key={label}>
          <rect x={70 + index * 260} y="62" width="100" height="92" rx="8" fill="#0f172a" stroke="#334155" />
          <text x={120 + index * 260} y="114" textAnchor="middle" fill="white" fontSize="15" fontWeight="600">{label}</text>
        </g>
      ))}
    </svg>
  );
}

function CssAnimationDemo() {
  return (
    <div className="relative overflow-hidden rounded-md border border-white/10 bg-slate-950/70 p-6">
      <style>{`
        @keyframes sciloopPulsePath { 0% { left: 8%; } 50% { left: 48%; } 100% { left: 88%; } }
        .sciloop-pulse { animation: sciloopPulsePath 2.8s ease-in-out infinite; }
      `}</style>
      <div className="absolute left-[10%] right-[10%] top-1/2 h-1 rounded-full bg-white/10" />
      <div className="sciloop-pulse absolute top-[calc(50%-8px)] size-4 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/40" />
      <div className="relative grid gap-4 md:grid-cols-3">
        {["Raw Information", "Layered Reality", "Human Understanding"].map((label) => (
          <div key={label} className="rounded-md border border-white/10 bg-black/30 p-4 text-center">
            <p className="text-sm font-semibold text-white">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CanvasDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let animationId = 0;
    const particles = Array.from({ length: 52 }, (_, index) => ({
      phase: index / 52,
      offset: Math.sin(index * 2.17) * 54,
      drift: Math.cos(index * 1.31) * 34,
    }));

    function draw() {
      if (!context || !canvas) return;
      frame += 0.012;
      const width = canvas.width;
      const height = canvas.height;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#020617";
      context.fillRect(0, 0, width, height);
      context.strokeStyle = "rgba(34, 211, 238, 0.25)";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(width * 0.12, height * 0.55);
      context.lineTo(width * 0.88, height * 0.45);
      context.stroke();

      const organize = (Math.sin(frame) + 1) / 2;
      particles.forEach((particle) => {
        const randomX = width * (0.12 + particle.phase * 0.76) + particle.drift;
        const randomY = height * 0.5 + particle.offset;
        const lineX = width * (0.12 + particle.phase * 0.76);
        const lineY = height * (0.58 - particle.phase * 0.16);
        const x = randomX * (1 - organize) + lineX * organize;
        const y = randomY * (1 - organize) + lineY * organize;

        context.beginPath();
        context.fillStyle = `rgba(103, 232, 249, ${0.45 + organize * 0.45})`;
        context.arc(x, y, 3.2, 0, Math.PI * 2);
        context.fill();
      });

      animationId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return <canvas ref={canvasRef} width={760} height={220} className="h-56 w-full rounded-md border border-white/10 bg-slate-950" aria-label="Canvas particles organizing into signal" />;
}

function PlaceholderDemo({ demo }: TechDemoCardProps) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/70 p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-amber-100/75">Placeholder capability card</p>
      <h4 className="mt-2 text-lg font-semibold text-white">{demo.primaryUseCase.label}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-300">{demo.primaryUseCase.description}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-400">SciLoop gains</p>
          <p className="mt-1 text-sm text-white">{demo.learningValue}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-400">Why not yet</p>
          <p className="mt-1 text-sm text-white">{demo.notes}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-400">Fallback now</p>
          <p className="mt-1 text-sm text-white">{demo.fallbackTech.join(", ") || "none"}</p>
        </div>
      </div>
    </div>
  );
}

function DemoSurface({ demo }: TechDemoCardProps) {
  if (demo.demoMode === "placeholder") return <PlaceholderDemo demo={demo} />;
  if (demo.id === "react-tailwind") return <ReactTailwindDemo />;
  if (demo.id === "svg") return <SvgDemo />;
  if (demo.id === "svg-motion") return <SvgMotionDemo />;
  if (demo.id === "css-animation") return <CssAnimationDemo />;
  if (demo.id === "canvas-2d") return <CanvasDemo />;
  return <PlaceholderDemo demo={demo} />;
}

export function TechDemoCard({ demo }: TechDemoCardProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">{getTechStatusLabel(demo)}</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{demo.name}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{demo.description}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-right">
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Usage</p>
          <p className="mt-1 text-sm font-semibold text-white">{getRecommendedUsageLabel(demo)}</p>
        </div>
      </div>

      <div className="mt-5">
        <DemoSurface demo={demo} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-md border border-white/10 bg-slate-950/60 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Best for</p>
          <p className="mt-2 text-sm text-white">{demo.bestFor.join(", ")}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-slate-950/60 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Not best for</p>
          <p className="mt-2 text-sm text-white">{demo.notBestFor.join(", ")}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-slate-950/60 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Dependency</p>
          <p className="mt-2 text-sm text-white">{demo.dependencyName ?? demo.installStatus}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-slate-950/60 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Performance / complexity</p>
          <p className="mt-2 text-sm text-white">{demo.performanceLevel} / {demo.comparison.complexity}/10</p>
        </div>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-white/10 bg-slate-950/60 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Fallback</p>
          <p className="mt-2 text-sm text-white">{demo.fallbackTech.join(", ") || "Base UI is already the fallback"}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-slate-950/60 p-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Future upgrade note</p>
          <p className="mt-2 text-sm text-white">{demo.notes}</p>
        </div>
      </div>
    </section>
  );
}
