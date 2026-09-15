"use client";

import type { VisualTechDemo, VisualTechId } from "./techLab.types";
import { getTechStatusLabel } from "./techLab.utils";

interface TechDemoSelectorProps {
  demos: VisualTechDemo[];
  selectedTechId: VisualTechId;
  onSelect: (techId: VisualTechId) => void;
}

export function TechDemoSelector({ demos, selectedTechId, onSelect }: TechDemoSelectorProps) {
  return (
    <nav className="grid gap-2 md:grid-cols-2 xl:grid-cols-4" aria-label="Visual technology demos">
      {demos.map((demo) => {
        const active = demo.id === selectedTechId;
        return (
          <button
            key={demo.id}
            type="button"
            onClick={() => onSelect(demo.id)}
            className={`rounded-md border p-3 text-left transition ${
              active
                ? "border-cyan-300/50 bg-cyan-300/15 text-white"
                : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.07]"
            }`}
          >
            <span className="block text-sm font-semibold">{demo.name}</span>
            <span className="mt-1 block text-[11px] uppercase tracking-[0.16em] text-cyan-100/70">{getTechStatusLabel(demo)}</span>
          </button>
        );
      })}
    </nav>
  );
}
