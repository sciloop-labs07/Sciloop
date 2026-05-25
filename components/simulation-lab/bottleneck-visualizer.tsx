"use client";

import type { CSSProperties } from "react";

import { SignalRing } from "@/components/simulation-lab/signal-ring";
import { SandboxGlyph } from "@/components/simulation-lab/sandbox-glyph";
import type { SandboxBottleneck } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BottleneckVisualizerProps {
  bottleneck: SandboxBottleneck;
  className?: string;
}

const severityClasses = {
  nominal: "border-white/10 bg-white/[0.03] text-slate-100",
  watch: "border-amber-300/18 bg-amber-300/[0.05] text-amber-100",
  critical: "border-rose-300/18 bg-rose-300/[0.06] text-rose-100",
} as const;

const severityTones = {
  nominal: "cyan",
  watch: "gold",
  critical: "rose",
} as const;

export function BottleneckVisualizer({
  bottleneck,
  className,
}: BottleneckVisualizerProps) {
  const fractureWidth = 18 + bottleneck.pressure * 56;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[30px] border p-5",
        severityClasses[bottleneck.severity],
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-[48%] bg-[linear-gradient(90deg,rgba(255,255,255,0.08),transparent)]" />
        <div className="absolute inset-y-0 right-0 w-[42%] bg-[linear-gradient(270deg,rgba(255,255,255,0.04),transparent)]" />
        <div
          className="bottleneck-fracture absolute left-1/2 top-1/2 h-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-sm"
          style={
            {
              width: fractureWidth,
            } as CSSProperties
          }
        />
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full border border-white/10 bg-white/[0.04] p-2">
              <SandboxGlyph
                kind={bottleneck.source === "system" ? "warning" : bottleneck.source}
                className="h-7 w-7"
              />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/52">
                bottleneck
              </div>
              <div className="mt-2 font-display text-2xl font-semibold text-white">
                {bottleneck.label}
              </div>
            </div>
          </div>

          <SignalRing
            value={bottleneck.pressure}
            tone={severityTones[bottleneck.severity]}
            size={72}
            strokeWidth={6}
            code="P"
            label="pressure"
          >
            <SandboxGlyph kind="warning" className="h-6 w-6" />
          </SignalRing>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-slate-950/36 p-4 text-sm leading-6 text-white/72">
          {bottleneck.summary}
        </div>
      </div>
    </div>
  );
}
