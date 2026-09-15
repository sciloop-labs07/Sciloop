"use client";

import { toPercent } from "@/lib/utils";

interface ControlSliderProps {
  label: string;
  value: number;
  description: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function ControlSlider({
  label,
  value,
  description,
  min,
  max,
  step,
  onChange,
}: ControlSliderProps) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="font-display text-lg font-medium text-white">{label}</div>
        <div className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-100">
          {toPercent(value)}
        </div>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      <input
        aria-label={label}
        className="mt-4 w-full accent-cyan-300"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
