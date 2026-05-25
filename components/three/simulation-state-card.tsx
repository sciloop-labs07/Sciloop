import { SignalRing } from "@/components/simulation-lab/signal-ring";
import { SandboxGlyph } from "@/components/simulation-lab/sandbox-glyph";
import { cn } from "@/lib/utils";

interface SimulationStateCardProps {
  label: string;
  summary: string;
  annotations: string[];
  metrics: Array<{
    label: string;
    value: number;
  }>;
  accent: "before" | "after";
}

const accentMap = {
  before: {
    card: "border-white/10 bg-white/[0.03]",
    tone: "violet",
    icon: "before",
    code: "B",
  },
  after: {
    card: "border-cyan-200/20 bg-cyan-200/[0.05]",
    tone: "cyan",
    icon: "after",
    code: "A",
  },
} as const;

function getMetricCode(label: string) {
  return label
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function SimulationStateCard({
  label,
  summary,
  annotations,
  metrics,
  accent,
}: SimulationStateCardProps) {
  const theme = accentMap[accent];
  const averageValue =
    metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;

  return (
    <div className={cn("rounded-[28px] border p-5", theme.card)}>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
              {accent}
            </div>
            <div className="mt-2 font-display text-2xl font-semibold text-white">
              {label}
            </div>
          </div>
          <SignalRing
            value={averageValue}
            tone={theme.tone}
            code={theme.code}
            label="state"
            size={78}
            strokeWidth={6}
          >
            <SandboxGlyph kind={theme.icon} className="h-6 w-6" />
          </SignalRing>
        </div>

        <div className="text-sm leading-6 text-slate-300">{summary}</div>

        <div className="flex flex-wrap gap-2">
          {annotations.map((annotation) => (
            <div
              key={annotation}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300"
            >
              {annotation}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <SignalRing
              key={metric.label}
              value={metric.value}
              tone={theme.tone}
              code={getMetricCode(metric.label)}
              label={metric.label}
              size={68}
              strokeWidth={5}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
                {getMetricCode(metric.label)}
              </span>
            </SignalRing>
          ))}
        </div>
      </div>
    </div>
  );
}
