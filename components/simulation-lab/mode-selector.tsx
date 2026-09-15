"use client";

import { cn } from "@/lib/utils";

interface ModeSelectorOption<TValue extends string> {
  value: TValue;
  label: string;
}

interface ModeSelectorProps<TValue extends string> {
  label: string;
  value: TValue;
  options: ModeSelectorOption<TValue>[];
  onChange: (value: TValue) => void;
}

export function ModeSelector<TValue extends string>({
  label,
  value,
  options,
  onChange,
}: ModeSelectorProps<TValue>) {
  return (
    <div className="space-y-3">
      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
        {label}
      </div>
      <div className="grid gap-2 rounded-[22px] border border-white/10 bg-white/[0.03] p-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-[18px] px-4 py-3 text-left text-sm transition-colors duration-200",
              option.value === value
                ? "bg-cyan-200/12 text-white"
                : "text-slate-300 hover:bg-white/[0.04] hover:text-white",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
