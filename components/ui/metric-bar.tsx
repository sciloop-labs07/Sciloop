import { cn, toPercent } from "@/lib/utils";

interface MetricBarProps {
  label: string;
  value: number;
  className?: string;
}

export function MetricBar({ label, value, className }: MetricBarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.24em] text-slate-400">
        <span>{label}</span>
        <span>{toPercent(value)}</span>
      </div>
      <div className="metric-track">
        <div className="metric-fill" style={{ width: toPercent(value) }} />
      </div>
    </div>
  );
}
