"use client";

import { SignalRing } from "@/components/simulation-lab/signal-ring";
import { SandboxGlyph } from "@/components/simulation-lab/sandbox-glyph";
import {
  simulationGraphicsModeLabels,
  simulationQualityLabels,
} from "@/config/simulation-lab";
import { cn, toPercent } from "@/lib/utils";
import type {
  Discovery,
  PhysicsCameraMode,
  PhysicsWorldView,
  SimulationGraphicsMode,
  SimulationQuality,
} from "@/lib/types";

interface DiscoveryOverlayProps {
  className?: string;
  discovery: Discovery;
  progress: number;
  stageLabel: string;
  stageSummary: string;
  isPaused: boolean;
  viewMode: PhysicsWorldView;
  cameraMode: PhysicsCameraMode;
  graphicsMode: SimulationGraphicsMode;
  effectiveMode: "browser";
  quality: SimulationQuality;
  modeHint: string;
  onProgressScrub: (value: number) => void;
  onSetBefore: () => void;
  onSetAfter: () => void;
  onPlayTransition: () => void;
  onPauseToggle: () => void;
  onViewModeChange: (value: PhysicsWorldView) => void;
  onCameraModeChange: (value: PhysicsCameraMode) => void;
  onGraphicsModeChange: (value: SimulationGraphicsMode) => void;
  onQualityChange: (value: SimulationQuality) => void;
}

interface SymbolOption<TValue extends string> {
  value: TValue;
  icon?: string;
  code: string;
  title: string;
}

const viewOptions: SymbolOption<PhysicsWorldView>[] = [
  { value: "quick", icon: "observe", code: "Q", title: "Observe" },
  { value: "mechanism", icon: "mechanism", code: "M", title: "Mechanism" },
  { value: "cinematic", icon: "cinematic", code: "C", title: "Cinematic" },
];

const cameraOptions: SymbolOption<PhysicsCameraMode>[] = [
  { value: "interactive", icon: "interactive", code: "I", title: "Interactive" },
  { value: "demo", icon: "demo", code: "D", title: "Demo" },
];

const graphicsOptions: SymbolOption<SimulationGraphicsMode>[] = [
  { value: "auto", icon: "auto", code: "A", title: "Auto" },
  { value: "browser", icon: "browser", code: "B", title: "Browser" },
];

const qualityOptions: SymbolOption<SimulationQuality>[] = [
  { value: "auto", code: "A", title: "Auto" },
  { value: "low", code: "L", title: "Low" },
  { value: "medium", code: "M", title: "Medium" },
  { value: "high", code: "H", title: "High" },
];

function SymbolCluster<TValue extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: TValue;
  options: SymbolOption<TValue>[];
  onChange: (value: TValue) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
        {label}
      </div>
      <div className="grid gap-2 rounded-[22px] border border-white/10 bg-white/[0.03] p-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "symbol-toggle flex items-center gap-3 rounded-[18px] border px-3 py-3 transition-all duration-200",
              option.value === value
                ? "border-cyan-200/24 bg-cyan-200/10 text-white"
                : "border-transparent text-slate-300 hover:border-white/8 hover:bg-white/[0.04] hover:text-white",
            )}
            title={option.title}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-950/44">
              {option.icon ? (
                <SandboxGlyph kind={option.icon} className="h-5 w-5" />
              ) : (
                <span className="font-mono text-xs uppercase tracking-[0.22em]">
                  {option.code}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em]">
                {option.code}
              </div>
              <div className="mt-1 text-xs text-slate-400">{option.title}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function DiscoveryOverlay({
  className,
  discovery,
  progress,
  stageLabel,
  stageSummary,
  isPaused,
  viewMode,
  cameraMode,
  graphicsMode,
  effectiveMode,
  quality,
  modeHint,
  onProgressScrub,
  onSetBefore,
  onSetAfter,
  onPlayTransition,
  onPauseToggle,
  onViewModeChange,
  onCameraModeChange,
  onGraphicsModeChange,
  onQualityChange,
}: DiscoveryOverlayProps) {
  return (
    <aside
      className={cn(
        "panel-surface rounded-[30px] border border-white/10 p-5 md:p-6",
        className,
      )}
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-3">
            <div className="eyebrow">World HUD</div>
            <div>
              <h2 className="font-display text-3xl font-semibold text-white">
                {discovery.shortTitle}
              </h2>
              <div className="mt-2 text-sm leading-6 text-slate-300">
                {discovery.tagline}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onPauseToggle}
            aria-label={isPaused ? "Resume simulation" : "Pause simulation"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-sm uppercase tracking-[0.22em] text-slate-200 transition-colors duration-200 hover:border-cyan-200/20 hover:text-white"
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? ">" : "||"}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <SignalRing
            value={discovery.confidence}
            tone="violet"
            code={discovery.year}
            label="year"
            size={74}
            strokeWidth={6}
          >
            <SandboxGlyph kind="confidence" className="h-6 w-6" />
          </SignalRing>
          <SignalRing
            value={progress}
            tone="cyan"
            code="XR"
            label="shift"
            size={74}
            strokeWidth={6}
          >
            <SandboxGlyph kind="shift" className="h-6 w-6" />
          </SignalRing>
          <SignalRing
            value={1}
            tone="cyan"
            code={simulationGraphicsModeLabels[effectiveMode]}
            label="runtime"
            size={74}
            strokeWidth={6}
          >
            <SandboxGlyph
              kind="browser"
              className="h-6 w-6"
            />
          </SignalRing>
        </div>

        <div className="grid gap-4">
          <SymbolCluster
            label="View"
            value={viewMode}
            options={viewOptions}
            onChange={onViewModeChange}
          />
          <SymbolCluster
            label="Camera"
            value={cameraMode}
            options={cameraOptions}
            onChange={onCameraModeChange}
          />
          <SymbolCluster
            label="Runtime"
            value={graphicsMode}
            options={graphicsOptions}
            onChange={onGraphicsModeChange}
          />
          <SymbolCluster
            label="Quality"
            value={quality}
            options={qualityOptions}
            onChange={onQualityChange}
          />
        </div>

        <div className="space-y-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                Shift control
              </div>
              <div className="mt-2 font-display text-2xl font-semibold text-white">
                {stageLabel}
              </div>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-100">
              {toPercent(progress)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={onSetBefore}
              className="symbol-toggle rounded-[18px] border border-white/10 bg-white/[0.02] px-3 py-3 text-slate-300 transition-colors duration-200 hover:border-cyan-200/20 hover:text-white"
              title="Before"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/44">
                <SandboxGlyph kind="before" className="h-5 w-5" />
              </div>
            </button>
            <button
              type="button"
              onClick={onPlayTransition}
              className="symbol-toggle rounded-[18px] border border-cyan-200/24 bg-cyan-200/10 px-3 py-3 text-white transition-colors duration-200 hover:border-cyan-200/36 hover:bg-cyan-200/14"
              title="Animate"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/44">
                <SandboxGlyph kind="shift" className="h-5 w-5" />
              </div>
            </button>
            <button
              type="button"
              onClick={onSetAfter}
              className="symbol-toggle rounded-[18px] border border-white/10 bg-white/[0.02] px-3 py-3 text-slate-300 transition-colors duration-200 hover:border-cyan-200/20 hover:text-white"
              title="After"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/44">
                <SandboxGlyph kind="after" className="h-5 w-5" />
              </div>
            </button>
          </div>

          <div className="flex items-end gap-2">
            <div
              className="w-full rounded-full bg-white/10"
              style={{ height: `${18 + (1 - progress) * 42}px` }}
            />
            <div
              className="w-full rounded-full bg-cyan-200/70 shadow-[0_0_18px_rgba(143,233,255,0.3)]"
              style={{ height: `${18 + Math.abs(0.5 - progress) * -64 + 32}px` }}
            />
            <div
              className="w-full rounded-full bg-amber-200/70 shadow-[0_0_18px_rgba(245,194,104,0.24)]"
              style={{ height: `${18 + progress * 42}px` }}
            />
          </div>

          <input
            aria-label="Discovery transition scrubber"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={progress}
            onChange={(event) => onProgressScrub(Number(event.target.value))}
            className="sandbox-law-slider h-10 w-full"
          />

          <div className="rounded-[20px] border border-white/10 bg-slate-950/40 p-3 text-sm leading-6 text-slate-300">
            {stageSummary}
          </div>
        </div>

        <div
          className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"
          title={modeHint}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
              Runtime state
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-100">
              Browser
            </div>
          </div>
          <div className="mt-3 text-sm leading-6 text-slate-300">
            {simulationGraphicsModeLabels[effectiveMode]} / {simulationQualityLabels[quality]}
          </div>
          <div className="mt-3 text-xs leading-5 text-slate-400">{modeHint}</div>
        </div>
      </div>
    </aside>
  );
}
