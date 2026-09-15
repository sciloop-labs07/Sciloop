"use client";

import type { SemanticVariable } from "@/src/semantic/SemanticTypes";

interface ControlsPanelProps {
  variables: SemanticVariable[];
  onChange: (id: string, value: number) => void;
}

export function ControlsPanel({ variables, onChange }: ControlsPanelProps) {
  return (
    <div className="space-y-3">
      {variables.map((variable) => (
        <label key={variable.id} className="block rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-mono uppercase tracking-[0.18em] text-slate-400">{variable.label}</span>
            <span className="text-cyan-100">{Math.round(variable.value * 100)}%</span>
          </div>
          <input
            className="w-full accent-cyan-200"
            type="range"
            min={variable.min}
            max={variable.max}
            step={variable.step ?? 0.01}
            value={variable.value}
            onChange={(event) => onChange(variable.id, Number(event.target.value))}
          />
        </label>
      ))}
    </div>
  );
}
