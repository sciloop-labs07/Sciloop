"use client";

import { SignalRing } from "@/components/simulation-lab/signal-ring";
import { SandboxGlyph } from "@/components/simulation-lab/sandbox-glyph";
import type { UniverseStateMetrics } from "@/lib/types";
import { cn } from "@/lib/utils";

interface UniverseStateMeterProps {
  state: UniverseStateMetrics;
  className?: string;
}

const toneClasses = {
  stable: "border-emerald-300/18 bg-emerald-300/[0.05] text-emerald-100",
  unstable: "border-amber-300/18 bg-amber-300/[0.05] text-amber-100",
  chaotic: "border-orange-300/18 bg-orange-300/[0.06] text-orange-100",
  lifeless: "border-slate-300/14 bg-slate-300/[0.04] text-slate-100",
  "hyper-productive": "border-cyan-300/18 bg-cyan-300/[0.06] text-cyan-100",
  broken: "border-rose-300/18 bg-rose-300/[0.06] text-rose-100",
} as const;

const ringTones = {
  stable: "emerald",
  unstable: "gold",
  chaotic: "rose",
  lifeless: "violet",
  "hyper-productive": "cyan",
  broken: "rose",
} as const;

const metricConfig = [
  { key: "stability", code: "ST", label: "stability" },
  { key: "viability", code: "LF", label: "life" },
  { key: "complexity", code: "CX", label: "complexity" },
  { key: "structureSurvival", code: "SV", label: "survival" },
] as const;

export function UniverseStateMeter({
  state,
  className,
}: UniverseStateMeterProps) {
  const tone = ringTones[state.status];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] border p-5",
        toneClasses[state.status],
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.16),transparent_38%)]" />
      <div className="relative z-10 grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="flex items-center justify-center">
          <SignalRing
            value={1 - state.fracture}
            tone={tone}
            size={132}
            strokeWidth={7}
          >
            <SandboxGlyph kind={state.status} className="h-12 w-12" />
          </SignalRing>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.26em] text-white/58">
                universe state
              </div>
              <div className="mt-2 font-display text-3xl font-semibold text-white">
                {state.label}
              </div>
              <div className="mt-1 text-sm text-white/72">{state.summary}</div>
            </div>

            <SignalRing
              value={state.productivity}
              tone={tone}
              size={70}
              strokeWidth={6}
              code="PR"
              label="surge"
            >
              <SandboxGlyph kind="hyper-productive" className="h-6 w-6" />
            </SignalRing>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {metricConfig.map((metric) => (
              <SignalRing
                key={metric.key}
                value={state[metric.key]}
                tone={tone}
                size={64}
                strokeWidth={5}
                code={metric.code}
                label={metric.label}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/82">
                  {metric.code}
                </span>
              </SignalRing>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
