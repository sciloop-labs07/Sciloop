"use client";

import { BottleneckVisualizer } from "@/components/simulation-lab/bottleneck-visualizer";
import { LawCore } from "@/components/simulation-lab/law-core";
import { SignalRing } from "@/components/simulation-lab/signal-ring";
import { SandboxGlyph } from "@/components/simulation-lab/sandbox-glyph";
import { UniverseStateMeter } from "@/components/simulation-lab/universe-state-meter";
import type { SandboxVisualSignals } from "@/lib/reality-sandbox";
import type {
  SandboxBottleneck,
  SandboxConsequence,
  SandboxControlState,
  SandboxParameterDefinition,
  SandboxParameterKey,
  SimulationWarning,
  UniverseStateMetrics,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface SimulationStatusPanelProps {
  parameterDefinitions: SandboxParameterDefinition[];
  parameters: SandboxControlState;
  parameterNarrative: string;
  signals: SandboxVisualSignals;
  universeState: UniverseStateMetrics;
  bottleneck: SandboxBottleneck;
  consequences: SandboxConsequence[];
  warnings: SimulationWarning[];
  onParameterChange: (key: SandboxParameterKey, value: number) => void;
  onReset: () => void;
}

const statusToneClasses = {
  nominal: "border-emerald-300/18 bg-emerald-300/[0.05] text-emerald-100",
  watch: "border-amber-300/18 bg-amber-300/[0.05] text-amber-100",
  critical: "border-rose-300/18 bg-rose-300/[0.06] text-rose-100",
} as const;

const consequenceIcons = {
  "gravity-order": "gravityStrength",
  "energy-throughput": "energyAbundance",
  habitability: "biologicalResilience",
  coordination: "intelligenceAcceleration",
} as const;

const consequenceTones = {
  nominal: "emerald",
  watch: "gold",
  critical: "rose",
} as const;

const signalRings = [
  { id: "biosphere", code: "LF", label: "life", key: "biosphereIntensity", icon: "biologicalResilience", tone: "emerald" },
  { id: "routes", code: "RT", label: "routes", key: "routeDensity", icon: "travelEfficiency", tone: "cyan" },
  { id: "grid", code: "EN", label: "grid", key: "infrastructureIntensity", icon: "energyAbundance", tone: "gold" },
  { id: "risk", code: "RK", label: "risk", key: "riskScore", icon: "warning", tone: "rose" },
] as const;

export function SimulationStatusPanel({
  parameterDefinitions,
  parameters,
  parameterNarrative,
  signals,
  universeState,
  bottleneck,
  consequences,
  warnings,
  onParameterChange,
  onReset,
}: SimulationStatusPanelProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
      <div className="space-y-5 rounded-[32px] border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="eyebrow">Law Cores</div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 items-center rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-300 transition-colors duration-200 hover:border-cyan-200/20 hover:text-white"
          >
            Reset
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.04fr_0.96fr]">
          <UniverseStateMeter state={universeState} />

          <div className="space-y-4 rounded-[30px] border border-white/10 bg-slate-950/28 p-4">
            <div className="grid grid-cols-2 gap-3">
              {signalRings.map((signal) => (
                <SignalRing
                  key={signal.id}
                  value={signals[signal.key]}
                  tone={signal.tone}
                  code={signal.code}
                  label={signal.label}
                  size={72}
                  strokeWidth={6}
                >
                  <SandboxGlyph kind={signal.icon} className="h-6 w-6" />
                </SignalRing>
              ))}
            </div>

            <div className="rounded-[24px] border border-cyan-200/18 bg-cyan-200/[0.05] p-4 text-sm leading-6 text-slate-200">
              {parameterNarrative}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {parameterDefinitions.map((definition) => (
            <LawCore
              key={definition.key}
              definition={definition}
              value={parameters[definition.key]}
              onChange={(value) => onParameterChange(definition.key, value)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-5 rounded-[32px] border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <BottleneckVisualizer bottleneck={bottleneck} />

        <div className="grid gap-3">
          {consequences.map((consequence) => (
            <div
              key={consequence.id}
              className={cn(
                "rounded-[26px] border p-4",
                statusToneClasses[consequence.status],
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <SignalRing
                    value={consequence.status === "critical" ? 1 : consequence.status === "watch" ? 0.66 : 0.36}
                    tone={consequenceTones[consequence.status]}
                    size={58}
                    strokeWidth={5}
                  >
                    <SandboxGlyph
                      kind={consequenceIcons[consequence.id as keyof typeof consequenceIcons]}
                      className="h-5 w-5"
                    />
                  </SignalRing>
                  <div>
                    <div className="font-display text-xl font-semibold">
                      {consequence.label}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/70">
                      {consequence.status}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm leading-6">
                <div className="rounded-[18px] border border-white/10 bg-black/12 p-3 text-inherit">
                  {consequence.summary}
                </div>
                <div className="text-slate-300">{consequence.implication}</div>
                <div className="rounded-[18px] border border-white/10 bg-slate-950/34 p-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                  {consequence.unstableWhen}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
          <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
            alert feed
          </div>
          {warnings.length > 0 ? (
            warnings.map((warning) => (
              <div
                key={warning.id}
                className={cn(
                  "rounded-[20px] border p-4",
                  statusToneClasses[warning.severity],
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-white/10 bg-white/[0.04] p-2">
                    <SandboxGlyph kind="warning" className="h-5 w-5" />
                  </div>
                  <div className="font-display text-lg font-semibold">
                    {warning.title}
                  </div>
                </div>
                <div className="mt-3 text-sm leading-6 text-slate-300">
                  {warning.description}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-4 rounded-[20px] border border-emerald-300/16 bg-emerald-300/[0.05] p-4 text-emerald-100">
              <SignalRing value={0.86} tone="emerald" size={58} strokeWidth={5}>
                <SandboxGlyph kind="stable" className="h-5 w-5" />
              </SignalRing>
              <div className="text-sm leading-6">
                No active collapse alerts. The current universe is bending without obvious structural failure.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
