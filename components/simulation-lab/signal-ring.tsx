"use client";

import type { ReactNode } from "react";

import { cn, clamp, toPercent } from "@/lib/utils";

interface SignalRingProps {
  value: number;
  label?: string;
  code?: string;
  children?: ReactNode;
  className?: string;
  size?: number;
  strokeWidth?: number;
  tone?: "cyan" | "gold" | "emerald" | "rose" | "violet";
  showValue?: boolean;
}

const toneClasses = {
  cyan: {
    track: "stroke-white/10",
    stroke: "stroke-cyan-200",
    glow: "bg-cyan-200/12 text-cyan-100",
  },
  gold: {
    track: "stroke-white/10",
    stroke: "stroke-amber-200",
    glow: "bg-amber-200/12 text-amber-100",
  },
  emerald: {
    track: "stroke-white/10",
    stroke: "stroke-emerald-200",
    glow: "bg-emerald-200/12 text-emerald-100",
  },
  rose: {
    track: "stroke-white/10",
    stroke: "stroke-rose-200",
    glow: "bg-rose-200/12 text-rose-100",
  },
  violet: {
    track: "stroke-white/10",
    stroke: "stroke-violet-200",
    glow: "bg-violet-200/12 text-violet-100",
  },
} as const;

export function SignalRing({
  value,
  label,
  code,
  children,
  className,
  size = 88,
  strokeWidth = 6,
  tone = "cyan",
  showValue = false,
}: SignalRingProps) {
  const normalized = clamp(value);
  const radius = 50 - strokeWidth * 1.5;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - normalized);
  const theme = toneClasses[tone];

  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "signal-ring-shell relative flex items-center justify-center rounded-full border border-white/10",
          theme.glow,
        )}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className={theme.track}
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={theme.stroke}
          />
        </svg>
        <div className="signal-ring-orbit absolute inset-[12%] rounded-full border border-white/8" />
        <div className="absolute inset-[21%] rounded-full bg-slate-950/80" />
        <div className="relative z-10 flex flex-col items-center justify-center gap-1">
          {children}
          {showValue ? (
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/72">
              {toPercent(normalized)}
            </div>
          ) : null}
        </div>
      </div>
      {label || code ? (
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-slate-400">
          {code ? <span>{code}</span> : null}
          {label ? <span>{label}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
