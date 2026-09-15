"use client";

import { SandboxGlyph } from "@/components/simulation-lab/sandbox-glyph";
import type { SandboxPresetDefinition } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PresetWorldStripProps {
  presets: SandboxPresetDefinition[];
  activeId?: string | null;
  onApply: (preset: SandboxPresetDefinition) => void;
  className?: string;
}

export function PresetWorldStrip({
  presets,
  activeId,
  onApply,
  className,
}: PresetWorldStripProps) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {presets.map((preset) => {
        const active = preset.id === activeId;

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApply(preset)}
            className={cn(
              "group flex min-w-[5.6rem] flex-col items-center gap-2 rounded-[24px] border px-3 py-3 transition-all duration-200",
              active
                ? "border-cyan-200/30 bg-cyan-200/10 text-white shadow-[0_12px_36px_rgba(91,195,255,0.12)]"
                : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-200/18 hover:bg-white/[0.05] hover:text-white",
            )}
            title={preset.label}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-950/46">
              <SandboxGlyph kind={preset.iconKey} className="h-6 w-6" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.22em]">{preset.label}</span>
          </button>
        );
      })}
    </div>
  );
}
