"use client";

import type { CSSProperties } from "react";

import { SignalRing } from "@/components/simulation-lab/signal-ring";
import { SandboxGlyph } from "@/components/simulation-lab/sandbox-glyph";
import type { SandboxParameterDefinition, SandboxParameterKey } from "@/lib/types";
import { cn, toPercent } from "@/lib/utils";

interface LawCoreProps {
  definition: SandboxParameterDefinition;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const lawThemes: Record<
  SandboxParameterKey,
  {
    accent: string;
    glow: string;
    tone: "cyan" | "gold" | "emerald" | "rose" | "violet";
    code: string;
  }
> = {
  gravityStrength: {
    accent: "#8fb2ff",
    glow: "rgba(125, 177, 255, 0.18)",
    tone: "violet",
    code: "G",
  },
  energyAbundance: {
    accent: "#ffd38b",
    glow: "rgba(245, 194, 104, 0.18)",
    tone: "gold",
    code: "E",
  },
  biologicalResilience: {
    accent: "#7ff0c7",
    glow: "rgba(82, 224, 180, 0.16)",
    tone: "emerald",
    code: "B",
  },
  travelEfficiency: {
    accent: "#7be3ff",
    glow: "rgba(84, 207, 255, 0.18)",
    tone: "cyan",
    code: "T",
  },
  intelligenceAcceleration: {
    accent: "#d29dff",
    glow: "rgba(189, 126, 255, 0.18)",
    tone: "violet",
    code: "I",
  },
  environmentStability: {
    accent: "#7effd6",
    glow: "rgba(117, 255, 214, 0.16)",
    tone: "emerald",
    code: "S",
  },
};

export function LawCore({
  definition,
  value,
  onChange,
  className,
}: LawCoreProps) {
  const theme = lawThemes[definition.key];
  const distortionStyle = {
    width: `${36 + value * 64}%`,
    background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
    transform: `translateY(-50%) rotate(${value * 150 - 75}deg)`,
    opacity: 0.24 + value * 0.48,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "law-core-surface relative overflow-hidden rounded-[28px] border border-white/10 p-4",
        className,
      )}
      style={
        {
          background: `radial-gradient(circle at 22% 18%, ${theme.glow}, transparent 48%), linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018)), rgba(7, 13, 24, 0.84)`,
        } as CSSProperties
      }
      title={`${definition.label}: ${definition.description}`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-px rounded-full blur-sm"
          style={distortionStyle}
        />
        <div
          className="absolute inset-[14%] rounded-full border border-white/6"
          style={{ boxShadow: `0 0 44px ${theme.glow}` }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-300">
            {theme.code}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/72">
            {toPercent(value)}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <SignalRing
            value={value}
            tone={theme.tone}
            size={94}
            strokeWidth={6}
            showValue
          >
            <SandboxGlyph kind={definition.key} className="h-8 w-8" />
          </SignalRing>

          <div className="min-w-0 space-y-2">
            <div className="font-display text-xl font-semibold text-white">
              {definition.shortLabel}
            </div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              law core
            </div>
            <div className="text-xs leading-5 text-slate-400">
              {definition.description}
            </div>
          </div>
        </div>

        <div className="relative mt-5">
          <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/10" />
          <div
            className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full"
            style={{
              width: toPercent(value),
              background: `linear-gradient(90deg, ${theme.accent}, rgba(255,255,255,0.85))`,
              boxShadow: `0 0 20px ${theme.glow}`,
            }}
          />
          <input
            aria-label={definition.label}
            className="sandbox-law-slider relative z-10 h-10 w-full"
            type="range"
            min={definition.min}
            max={definition.max}
            step={definition.step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-slate-500">
          <span>min</span>
          <span>live distortion</span>
          <span>max</span>
        </div>
      </div>
    </div>
  );
}
