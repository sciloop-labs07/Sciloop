"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import { ConceptConstellation } from "@/components/simulation-lab/concept-constellation";
import { PresetWorldStrip } from "@/components/simulation-lab/preset-world-strip";
import { SandboxGlyph } from "@/components/simulation-lab/sandbox-glyph";
import { SignalRing } from "@/components/simulation-lab/signal-ring";
import { SimulationStatusPanel } from "@/components/simulation-lab/simulation-status-panel";
import {
  PHYSICS_WORLD_DEFAULTS,
  PHYSICS_WORLD_PARTICLES,
} from "@/components/three/physics-world/constants";
import { DiscoveryOverlay } from "@/components/three/discovery-overlay";
import { SimulationStateCard } from "@/components/three/simulation-state-card";
import { WorldLoadingCard } from "@/components/three/world-loading-card";
import { ButtonLink } from "@/components/ui/button-link";
import { FadeIn } from "@/components/ui/fade-in";
import { Panel } from "@/components/ui/panel";
import {
  simulationGraphicsModeLabels,
  simulationLabRuntimeConfig,
} from "@/config/simulation-lab";
import {
  physicsSandboxDefaults,
  physicsSandboxParameterDefinitions,
  physicsSandboxPresets,
  physicsWorldExperienceConfig,
} from "@/data/worlds/physics-world";
import {
  applySandboxToSimulationState,
  buildSandboxBottleneck,
  buildSandboxConsequences,
  buildSandboxVisualSignals,
  buildSandboxWarnings,
  buildUniverseStateMetrics,
  getSandboxModeHint,
  getSandboxParameterNarrative,
} from "@/lib/reality-sandbox";
import {
  getActiveSimulationPhase,
  getSimulationStage,
  interpolateSimulationState,
  normalizeParticleCount,
} from "@/lib/simulation";
import { useSimulationTransition } from "@/lib/use-simulation-transition";
import { cn, getDiscoveryBySlug } from "@/lib/utils";
import type {
  Discovery,
  PhysicsCameraMode,
  PhysicsWorldView,
  SandboxControlState,
  SandboxParameterKey,
  SandboxPresetDefinition,
  SimulationGraphicsMode,
  SimulationQuality,
  SimulationState,
} from "@/lib/types";

interface PhysicsWorldExperienceProps {
  discoveries: Discovery[];
  initialDiscoverySlug: string;
}

const PhysicsWorldCanvas = dynamic(
  () =>
    import("@/components/three/physics-world-canvas").then(
      (mod) => mod.PhysicsWorldCanvas,
    ),
  {
    ssr: false,
    loading: () => (
      <WorldLoadingCard detail="Preparing the energy core, field lines, particles, and atmosphere." />
    ),
  },
);

function getViewNarrative(discovery: Discovery, viewMode: PhysicsWorldView) {
  if (viewMode === "quick") {
    return discovery.quickView;
  }

  if (viewMode === "mechanism") {
    return discovery.mechanismView;
  }

  return discovery.cinematicView;
}

function getStateMetrics(state: SimulationState) {
  return [
    {
      label: "Particle density",
      value: normalizeParticleCount(
        state.particleCount,
        PHYSICS_WORLD_PARTICLES.minTotalCount,
        PHYSICS_WORLD_PARTICLES.maxTotalCount,
      ),
    },
    { label: "Orbit speed", value: state.orbitSpeed },
    { label: "Field intensity", value: state.fieldIntensity },
    { label: "Glow strength", value: state.glowStrength },
  ];
}

function findMatchingPresetId(parameters: SandboxControlState) {
  const tolerance = 0.011;

  return (
    physicsSandboxPresets.find((preset) =>
      (
        Object.keys(preset.parameters) as Array<keyof SandboxControlState>
      ).every(
        (key) => Math.abs(preset.parameters[key] - parameters[key]) <= tolerance,
      ),
    )?.id ?? null
  );
}

export function PhysicsWorldExperience({
  discoveries,
  initialDiscoverySlug,
}: PhysicsWorldExperienceProps) {
  const [selectedSlug, setSelectedSlug] = useState(initialDiscoverySlug);
  const [viewMode, setViewMode] = useState<PhysicsWorldView>(
    PHYSICS_WORLD_DEFAULTS.viewMode,
  );
  const [cameraMode, setCameraMode] = useState<PhysicsCameraMode>(
    PHYSICS_WORLD_DEFAULTS.cameraMode,
  );
  const [graphicsMode, setGraphicsMode] = useState<SimulationGraphicsMode>(
    simulationLabRuntimeConfig.defaultGraphicsMode,
  );
  const [quality, setQuality] = useState<SimulationQuality>(
    simulationLabRuntimeConfig.defaultQuality,
  );
  const [sandboxParameters, setSandboxParameters] = useState<SandboxControlState>(() => ({
    ...physicsSandboxDefaults,
  }));
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPending, startTransition] = useTransition();
  const queuedTransitionRef = useRef<number | null>(null);

  const deferredSlug = useDeferredValue(selectedSlug);
  const discovery = useMemo(
    () => getDiscoveryBySlug(discoveries, deferredSlug),
    [deferredSlug, discoveries],
  );
  const {
    progress,
    animateToProgress,
    setProgressImmediate,
  } = useSimulationTransition({
    durationMs: PHYSICS_WORLD_DEFAULTS.transitionDurationMs,
    initialProgress: PHYSICS_WORLD_DEFAULTS.progress,
    reducedMotion,
  });

  const currentState = useMemo(() => {
    const interpolated = interpolateSimulationState(
      discovery.simulation.before.state,
      discovery.simulation.after.state,
      progress,
    );

    return applySandboxToSimulationState(interpolated, sandboxParameters);
  }, [discovery, progress, sandboxParameters]);
  const currentStage = useMemo(() => getSimulationStage(progress), [progress]);
  const currentPhase = useMemo(
    () => getActiveSimulationPhase(discovery.simulation, progress),
    [discovery.simulation, progress],
  );
  const currentNarrative = useMemo(
    () => getViewNarrative(discovery, viewMode),
    [discovery, viewMode],
  );
  const sandboxSignals = useMemo(
    () => buildSandboxVisualSignals(sandboxParameters),
    [sandboxParameters],
  );
  const sandboxConsequences = useMemo(
    () => buildSandboxConsequences(sandboxParameters, sandboxSignals),
    [sandboxParameters, sandboxSignals],
  );
  const sandboxWarnings = useMemo(
    () => buildSandboxWarnings(sandboxParameters, sandboxSignals),
    [sandboxParameters, sandboxSignals],
  );
  const parameterNarrative = useMemo(
    () => getSandboxParameterNarrative(sandboxParameters),
    [sandboxParameters],
  );
  const universeState = useMemo(
    () => buildUniverseStateMetrics(sandboxParameters, sandboxSignals),
    [sandboxParameters, sandboxSignals],
  );
  const bottleneck = useMemo(
    () => buildSandboxBottleneck(sandboxParameters, sandboxSignals),
    [sandboxParameters, sandboxSignals],
  );
  const effectiveMode = "browser" as const;
  const combinedWarnings = useMemo(() => {
    const map = new Map<string, (typeof sandboxWarnings)[number]>();

    sandboxWarnings.forEach((warning) => {
      map.set(warning.id, warning);
    });

    return [...map.values()];
  }, [sandboxWarnings]);
  const stageLabel =
    currentStage === "before"
      ? discovery.simulation.before.label
      : currentStage === "after"
        ? discovery.simulation.after.label
        : "Discovery transition";
  const stageSummary =
    currentStage === "transition" ? discovery.worldChange : currentPhase.summary;
  const modeHint = useMemo(() => {
    if (graphicsMode === "browser") {
      return "Browser mode renders locally with the full fallback scene and is optimized for reliable laptop development.";
    }

    return getSandboxModeHint();
  }, [graphicsMode]);
  const activePresetId = useMemo(
    () => findMatchingPresetId(sandboxParameters),
    [sandboxParameters],
  );
  const currentMetricRings = useMemo(
    () => [
      {
        id: "field",
        code: "FD",
        label: "field",
        value: currentState.fieldIntensity,
        icon: "field",
        tone: "cyan" as const,
      },
      {
        id: "orbit",
        code: "OR",
        label: "orbit",
        value: currentState.orbitSpeed,
        icon: "travelEfficiency",
        tone: "violet" as const,
      },
      {
        id: "glow",
        code: "GL",
        label: "glow",
        value: currentState.glowStrength,
        icon: "energyAbundance",
        tone: "gold" as const,
      },
      {
        id: "risk",
        code: "RK",
        label: "risk",
        value: sandboxSignals.riskScore,
        icon: "warning",
        tone: "rose" as const,
      },
    ],
    [
      currentState.fieldIntensity,
      currentState.glowStrength,
      currentState.orbitSpeed,
      sandboxSignals.riskScore,
    ],
  );

  const clearQueuedTransition = useCallback(() => {
    if (queuedTransitionRef.current !== null) {
      window.clearTimeout(queuedTransitionRef.current);
      queuedTransitionRef.current = null;
    }
  }, []);

  const playDiscoveryTransition = useCallback(() => {
    clearQueuedTransition();
    setProgressImmediate(0);

    if (reducedMotion) {
      setProgressImmediate(1);
      return;
    }

    queuedTransitionRef.current = window.setTimeout(() => {
      animateToProgress(1);
      queuedTransitionRef.current = null;
    }, 80);
  }, [
    animateToProgress,
    clearQueuedTransition,
    reducedMotion,
    setProgressImmediate,
  ]);

  const handleParameterChange = useCallback(
    (key: SandboxParameterKey, value: number) => {
      setSandboxParameters((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );

  const handlePresetApply = useCallback((preset: SandboxPresetDefinition) => {
    setSandboxParameters({ ...preset.parameters });
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMotionPreference);

      return () => {
        mediaQuery.removeEventListener("change", updateMotionPreference);
      };
    }

    mediaQuery.addListener(updateMotionPreference);

    return () => {
      mediaQuery.removeListener(updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (physicsWorldExperienceConfig.autoplayTransitionOnLoad) {
      playDiscoveryTransition();
      return;
    }

    setProgressImmediate(physicsWorldExperienceConfig.defaultProgress);
  }, [discovery.slug, playDiscoveryTransition, setProgressImmediate]);

  useEffect(() => {
    return () => {
      clearQueuedTransition();
    };
  }, [clearQueuedTransition]);

  function handleDiscoverySelect(slug: string) {
    setIsPaused(false);
    setViewMode(PHYSICS_WORLD_DEFAULTS.viewMode);

    startTransition(() => {
      setSelectedSlug(slug);
    });
  }

  return (
    <div className="space-y-8 pb-12">
      <FadeIn>
        <Panel className="rounded-[36px] px-5 py-5 md:px-6 md:py-6" glow>
          <div className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="eyebrow">Portal 3 / Reality Sandbox</div>
                {isPending ? (
                  <div className="rounded-full border border-cyan-200/24 bg-cyan-200/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-cyan-100">
                    shifting
                  </div>
                ) : null}
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {discoveries.map((item) => {
                  const active = item.slug === selectedSlug;
                  const tileValue =
                    (
                      item.simulation.after.state.fieldIntensity +
                      item.simulation.after.state.glowStrength +
                      item.confidence
                    ) / 3;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      disabled={isPending}
                      onClick={() => handleDiscoverySelect(item.slug)}
                      className={cn(
                        "group rounded-[28px] border p-4 text-left transition-all duration-200",
                        active
                          ? "border-cyan-200/34 bg-cyan-200/10 shadow-[0_18px_44px_rgba(74,183,255,0.12)]"
                          : "border-white/10 bg-white/[0.03] hover:border-cyan-200/16 hover:bg-white/[0.05]",
                        isPending && "cursor-wait",
                      )}
                      title={item.title}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                          {item.year}
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-300">
                          {item.shortTitle}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-4">
                        <SignalRing
                          value={tileValue}
                          tone={active ? "cyan" : "violet"}
                          size={76}
                          strokeWidth={6}
                        >
                          <SandboxGlyph kind="field" className="h-7 w-7" />
                        </SignalRing>

                        <div className="flex-1">
                          <div className="font-display text-xl font-semibold text-white">
                            {item.shortTitle}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <div
                              className="h-1.5 rounded-full bg-cyan-200/80"
                              style={{
                                width: `${Math.round(item.simulation.after.state.fieldIntensity * 72)}px`,
                              }}
                            />
                            <div
                              className="h-1.5 rounded-full bg-amber-200/80"
                              style={{
                                width: `${Math.round(item.simulation.after.state.glowStrength * 56)}px`,
                              }}
                            />
                            <div
                              className="h-1.5 rounded-full bg-emerald-200/80"
                              style={{
                                width: `${Math.round(item.confidence * 44)}px`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 rounded-[30px] border border-white/10 bg-white/[0.03] p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <SignalRing value={progress} tone="cyan" code="SH" label="shift" size={78}>
                  <SandboxGlyph kind="shift" className="h-7 w-7" />
                </SignalRing>
                <SignalRing
                  value={discovery.confidence}
                  tone="violet"
                  code="CF"
                  label="confidence"
                  size={78}
                >
                  <SandboxGlyph kind="confidence" className="h-7 w-7" />
                </SignalRing>
                <SignalRing
                  value={1 - sandboxSignals.riskScore}
                  tone={universeState.status === "stable" ? "emerald" : "rose"}
                  code="ST"
                  label={universeState.label.toLowerCase()}
                  size={78}
                >
                  <SandboxGlyph kind={universeState.status} className="h-7 w-7" />
                </SignalRing>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                      Active world
                    </div>
                    <div className="mt-2 font-display text-2xl font-semibold text-white">
                      {discovery.shortTitle}
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-slate-300">
                    {stageLabel}
                  </div>
                </div>
                <div className="mt-3 text-sm leading-6 text-slate-300">{currentNarrative}</div>
              </div>

              <div className="space-y-3">
                <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                  Preset worlds
                </div>
                <PresetWorldStrip
                  presets={physicsSandboxPresets}
                  activeId={activePresetId}
                  onApply={handlePresetApply}
                />
              </div>

              <div className="rounded-[24px] border border-cyan-200/18 bg-cyan-200/[0.05] p-4 text-sm leading-6 text-slate-200">
                {parameterNarrative}
              </div>
            </div>
          </div>
        </Panel>
      </FadeIn>

      <FadeIn delay={0.08}>
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20.5rem]">
          <div className="space-y-4">
            <Panel className="rounded-[32px] p-4 md:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-3">
                  <span className="chip rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]">
                    <span className="chip-dot" />
                    {discovery.shortTitle}
                  </span>
                  <span className="chip rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]">
                    <span className="chip-dot" />
                    {universeState.label}
                  </span>
                  <span className="chip rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]">
                    <span className="chip-dot" />
                    {simulationGraphicsModeLabels[effectiveMode]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {currentMetricRings.map((metric) => (
                    <SignalRing
                      key={metric.id}
                      value={metric.value}
                      tone={metric.tone}
                      code={metric.code}
                      label={metric.label}
                      size={60}
                      strokeWidth={5}
                    >
                      <SandboxGlyph kind={metric.icon} className="h-5 w-5" />
                    </SignalRing>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <PhysicsWorldCanvas
                  discovery={discovery}
                  progress={progress}
                  viewMode={viewMode}
                  cameraMode={cameraMode}
                  sandboxParameters={sandboxParameters}
                  quality={quality}
                  isPaused={isPaused}
                />
              </div>
            </Panel>
          </div>

          <DiscoveryOverlay
            discovery={discovery}
            progress={progress}
            stageLabel={stageLabel}
            stageSummary={stageSummary}
            isPaused={isPaused}
            viewMode={viewMode}
            cameraMode={cameraMode}
            graphicsMode={graphicsMode}
            effectiveMode={effectiveMode}
            quality={quality}
            modeHint={modeHint}
            onProgressScrub={setProgressImmediate}
            onSetBefore={() => animateToProgress(0)}
            onSetAfter={() => animateToProgress(1)}
            onPlayTransition={playDiscoveryTransition}
            onPauseToggle={() => setIsPaused((value) => !value)}
            onViewModeChange={setViewMode}
            onCameraModeChange={setCameraMode}
            onGraphicsModeChange={setGraphicsMode}
            onQualityChange={setQuality}
          />
        </section>
      </FadeIn>

      <FadeIn delay={0.16}>
        <SimulationStatusPanel
          parameterDefinitions={physicsSandboxParameterDefinitions}
          parameters={sandboxParameters}
          parameterNarrative={parameterNarrative}
          signals={sandboxSignals}
          universeState={universeState}
          bottleneck={bottleneck}
          consequences={sandboxConsequences}
          warnings={combinedWarnings}
          onParameterChange={handleParameterChange}
          onReset={() => setSandboxParameters({ ...physicsSandboxDefaults })}
        />
      </FadeIn>

      <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <FadeIn delay={0.2}>
          <Panel className="rounded-[32px] p-4 md:p-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)] lg:items-center">
              <SimulationStateCard
                label={discovery.simulation.before.label}
                summary={discovery.simulation.before.summary}
                annotations={discovery.simulation.before.state.annotations}
                metrics={getStateMetrics(discovery.simulation.before.state)}
                accent="before"
              />

              <div className="relative flex min-h-[18rem] flex-col items-center justify-center gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-4">
                <div className="absolute inset-y-5 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgba(143,233,255,0.55),transparent)]" />
                <SignalRing value={progress} tone="cyan" code="XR" label="shift" size={96}>
                  <SandboxGlyph kind="shift" className="h-8 w-8" />
                </SignalRing>
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    active read
                  </div>
                  <div className="mt-2 font-display text-xl font-semibold text-white">
                    {stageLabel}
                  </div>
                  <div className="mt-2 text-xs leading-5 text-slate-400">
                    {stageSummary}
                  </div>
                </div>
              </div>

              <SimulationStateCard
                label={discovery.simulation.after.label}
                summary={discovery.simulation.after.summary}
                annotations={discovery.simulation.after.state.annotations}
                metrics={getStateMetrics(discovery.simulation.after.state)}
                accent="after"
              />
            </div>
          </Panel>
        </FadeIn>

        <FadeIn delay={0.24}>
          <Panel className="rounded-[32px] p-4 md:p-5">
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-4">
                {currentMetricRings.map((metric) => (
                  <SignalRing
                    key={metric.id}
                    value={metric.value}
                    tone={metric.tone}
                    code={metric.code}
                    label={metric.label}
                    size={72}
                    strokeWidth={6}
                  >
                    <SandboxGlyph kind={metric.icon} className="h-6 w-6" />
                  </SignalRing>
                ))}
              </div>

              <ConceptConstellation nodes={discovery.conceptNodes} />

              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/discoveries" variant="secondary">
                  Browse discoveries
                </ButtonLink>
                <Link
                  href="/about"
                  className="inline-flex min-h-11 items-center rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-300 transition-colors duration-200 hover:border-cyan-200/20 hover:text-white"
                >
                  About SciLoop
                </Link>
              </div>
            </div>
          </Panel>
        </FadeIn>
      </div>
    </div>
  );
}
