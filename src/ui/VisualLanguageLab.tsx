"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { RuntimeLoop } from "@/src/engine/RuntimeLoop";
import { VisualLanguageEngine } from "@/src/engine/Engine";
import { demoDefinitions } from "@/src/examples";
import { semanticMappings } from "@/src/grammar/SemanticMappings";
import { CanvasRenderer } from "@/src/renderer/CanvasRenderer";
import { validateGraph } from "@/src/semantic/GraphValidator";
import type {
  SemanticEntity,
  SemanticEntityType,
  SemanticFlow,
  SemanticGraph,
  SemanticRelationType,
} from "@/src/semantic/SemanticTypes";
import { SimulationEngine, type SimulationSnapshot } from "@/src/simulation/SimulationEngine";
import { pointerToNormalized } from "@/src/simulation/InteractionController";

import { ControlsPanel } from "./ControlsPanel";
import { InspectorPanel } from "./InspectorPanel";
import { TimelineControls } from "./TimelineControls";

const testPhrases = [
  "energy flows from sun to plant",
  "signal propagates through neurons and updates weights",
  "mass attracts particles and bends trajectories",
  "money supply increases and purchasing power falls",
  "feedback loop amplifies growth",
  "entropy increases disorder",
  "constraint blocks motion",
];

const SCILOOP_AI_BACKEND_URL = process.env.NEXT_PUBLIC_SCILOOP_AI_API_BASE || "/api/sciloop-ai-proxy";

function buildSciloopAiClientUrl(endpointPath: string) {
  const base = SCILOOP_AI_BACKEND_URL.replace(/\/+$/, "");
  const path = endpointPath.replace(/^\/+/, "");
  return base.includes("/api/sciloop-ai-proxy")
    ? `${base}/${path}`
    : `${base}/api/sciloop-ai/${path}`;
}

type UnknownRecord = Record<string, unknown>;

interface NewsVisualHandoff {
  ok?: boolean;
  article?: UnknownRecord;
  visualPlan?: UnknownRecord;
  providerUsed?: string;
  cached?: boolean;
  fallback?: boolean;
  warnings?: string[];
}

interface HandoffStatus {
  label: string;
  detail: string;
  provider?: string;
  cached?: boolean;
  fallback?: boolean;
}

function createEngine() {
  const engine = new VisualLanguageEngine();
  demoDefinitions.forEach((demo) => engine.registerDemo(demo));
  return engine;
}

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberValue(value: unknown, fallback = 0.6) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function clamp01(value: unknown, fallback = 0.6) {
  return Math.max(0, Math.min(1, numberValue(value, fallback)));
}

function safeId(value: unknown, fallback: string) {
  const raw = stringValue(value, fallback).toLowerCase();
  return raw.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 42) || fallback;
}

function labelFromItem(item: unknown, fallback: string) {
  if (isRecord(item)) return stringValue(item.label, stringValue(item.name, stringValue(item.id, fallback)));
  return stringValue(item, fallback);
}

function uniqueVisualItems(items: UnknownRecord[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = safeId(item.id ?? item.label, "item");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function enrichSparseVisualNodes({
  nodesFromScene,
  detected,
  visualScene,
  plan,
  article,
}: {
  nodesFromScene: unknown[];
  detected: UnknownRecord;
  visualScene: UnknownRecord;
  plan: UnknownRecord;
  article?: UnknownRecord;
}) {
  if (nodesFromScene.length >= 3) return nodesFromScene;

  const detectedEntities = asArray(detected.entities).map((item, index) => ({
    id: `entity_${index + 1}`,
    label: labelFromItem(item, `Entity ${index + 1}`),
    type: "entity",
  }));
  const detectedProcesses = asArray(detected.processes).map((item, index) => ({
    id: `process_${index + 1}`,
    label: labelFromItem(item, `Process ${index + 1}`),
    type: "process",
  }));
  const detectedOutcomes = asArray(detected.outcomes).map((item, index) => ({
    id: `outcome_${index + 1}`,
    label: labelFromItem(item, `Outcome ${index + 1}`),
    type: "outcome",
  }));
  const sceneNodes = nodesFromScene.map((node, index) => {
    const record = isRecord(node) ? node : {};
    return {
      id: record.id ?? `scene_${index + 1}`,
      label: labelFromItem(node, `Scene Node ${index + 1}`),
      type: record.type ?? "scene",
    };
  });

  const title = stringValue(plan.title, stringValue(article?.title, "News idea"));
  const template = stringValue(plan.chosenTemplate, "Mechanism");
  const subject = stringValue(plan.subject, stringValue(article?.subject, "Reality system"));

  return uniqueVisualItems([
    ...sceneNodes,
    ...detectedEntities,
    ...detectedProcesses,
    ...detectedOutcomes,
    { id: "article_input", label: title, type: "source" },
    { id: "domain_context", label: subject, type: "system" },
    { id: "mechanism_core", label: template, type: "mechanism" },
    { id: "visible_outcome", label: stringValue(asArray(visualScene.labels)[0], "Visible outcome"), type: "outcome" },
  ]).slice(0, 7);
}

function entityTypeFromLabel(label: string, rawType?: unknown): SemanticEntityType {
  const text = `${label} ${stringValue(rawType)}`.toLowerCase();
  if (/sun|source|input|origin|idea/.test(text)) return "energy_source";
  if (/process|mechanism|converter|reaction|algorithm|engine/.test(text)) return "converter";
  if (/storage|memory|store|stock|battery/.test(text)) return "storage";
  if (/output|outcome|impact|result|future/.test(text)) return "output";
  if (/mass|planet|star|black hole|gravity|galaxy/.test(text)) return "mass";
  if (/particle|electron|photon|atom|molecule/.test(text)) return "particle";
  if (/neuron|brain|synapse/.test(text)) return "neuron";
  if (/price|value|market|power|demand|supply/.test(text)) return "value";
  if (/system|network|field|environment/.test(text)) return "system";
  return "generic";
}

function relationTypeFromLabel(label: string): SemanticRelationType {
  const text = label.toLowerCase();
  if (/energy|heat|power|light/.test(text)) return "energy_flow";
  if (/signal|information|message|token/.test(text)) return "signal_flow";
  if (/force|gravity|attract|pull|push|bend/.test(text)) return "force";
  if (/convert|transform|reaction|change/.test(text)) return "conversion";
  if (/feedback|loop|cycle/.test(text)) return "feedback";
  if (/constraint|limit|barrier|block/.test(text)) return "constraint";
  if (/decay|loss|fall|reduce|decrease/.test(text)) return "decay";
  if (/grow|increase|amplify|rise/.test(text)) return "growth";
  return "generic";
}

function entityPosition(index: number, total: number) {
  if (total <= 1) return { x: 0.5, y: 0.5 };
  const x = 0.16 + (0.68 * index) / Math.max(1, total - 1);
  const y = 0.5 + Math.sin(index * 1.7) * 0.12;
  return { x, y };
}

function visualPlanToGraph(plan: UnknownRecord, article?: UnknownRecord): SemanticGraph {
  const visualScene = isRecord(plan.visualScene) ? plan.visualScene : {};
  const explanation = isRecord(plan.explanation) ? plan.explanation : {};
  const detected = isRecord(plan.detected) ? plan.detected : {};
  const title = stringValue(plan.title, stringValue(article?.title, "News Portal visual plan"));
  const subject = stringValue(plan.subject, stringValue(article?.subject, "Applied Reality"));
  const nodesFromScene = asArray(visualScene.nodes);
  const nodeInputs = enrichSparseVisualNodes({
    nodesFromScene,
    detected,
    visualScene,
    plan,
    article,
  });

  const entities: SemanticEntity[] = nodeInputs.slice(0, 8).map((node, index) => {
    const nodeRecord = isRecord(node) ? node : {};
    const label = labelFromItem(node, `Node ${index + 1}`);
    const id = safeId(nodeRecord.id, safeId(label, `node_${index + 1}`));
    return {
      id,
      label,
      type: entityTypeFromLabel(label, nodeRecord.type),
      position: isRecord(nodeRecord.position)
        ? {
            x: clamp01(nodeRecord.position.x, entityPosition(index, nodeInputs.length).x),
            y: clamp01(nodeRecord.position.y, entityPosition(index, nodeInputs.length).y),
          }
        : entityPosition(index, nodeInputs.length),
      radius: index === 1 ? 30 : 24,
      state: {
        source: "news-visual-plan",
        subject,
      },
    };
  });

  const entityIds = new Set(entities.map((entity) => entity.id));
  const connections = asArray(visualScene.connections);
  const relations = connections.flatMap((connection, index) => {
    if (!isRecord(connection)) return [];
    const from = safeId(connection.from ?? connection.source, "");
    const to = safeId(connection.to ?? connection.target, "");
    if (!entityIds.has(from) || !entityIds.has(to)) return [];
    const label = stringValue(connection.label, "changes");
    return [{
      id: safeId(connection.id, `relation_${index + 1}`),
      from,
      to,
      type: relationTypeFromLabel(label),
      strength: clamp01(connection.strength, 0.62),
      label,
    }];
  });

  if (!relations.length && entities.length > 1) {
    for (let index = 0; index < entities.length - 1; index += 1) {
      relations.push({
        id: `relation_${index + 1}`,
        from: entities[index].id,
        to: entities[index + 1].id,
        type: "generic",
        strength: 0.62,
        label: index === 0 ? "causes" : "changes",
      });
    }
  }

  const flows: SemanticFlow[] = asArray(visualScene.flows).flatMap((flow, index) => {
    if (!isRecord(flow)) return [];
    const source = safeId(flow.from ?? flow.source, "");
    const target = safeId(flow.to ?? flow.target, "");
    if (!entityIds.has(source) || !entityIds.has(target)) return [];
    const label = stringValue(flow.label, "meaning flow");
    return [{
      id: safeId(flow.id, `flow_${index + 1}`),
      source,
      target,
      type: /money|market|price/i.test(label) ? "money" as const : (/signal|information/i.test(label) ? "signal" as const : "generic" as const),
      rate: clamp01(flow.rate ?? flow.strength, 0.58),
      label,
    }];
  });

  if (!flows.length && entities.length > 1) {
    flows.push({
      id: "news_visual_flow",
      source: entities[0].id,
      target: entities[entities.length - 1].id,
      type: "information",
      rate: clamp01(plan.confidence, 0.58),
      label: "news to meaning",
    });
  }

  const template = stringValue(plan.chosenTemplate, "News Causal Visual");
  const causalChain = [
    ...asArray(visualScene.stages).map((stage, index) => isRecord(stage)
      ? stringValue(stage.description, stringValue(stage.label, `Stage ${index + 1}`))
      : stringValue(stage, `Stage ${index + 1}`)),
    ...asArray(plan.animationPlan).map((step, index) => stringValue(step, `Animation step ${index + 1}`)),
  ].filter(Boolean).slice(0, 7);

  const isFieldLike = /field|gravity|spacetime|relativity|force/i.test(`${template} ${title}`);

  return {
    id: safeId(plan.id, `news_visual_${Date.now()}`),
    title,
    explanation: stringValue(
      explanation.simple,
      stringValue(plan.rawText, stringValue(article?.summary, "This scene turns the news into a cause-and-effect visual."))
    ),
    warning: [...asArray(explanation.warnings), ...asArray(plan.warnings)].map((warning) => stringValue(warning)).filter(Boolean).join(" "),
    entities,
    variables: [
      { id: "confidence", label: "Plan Confidence", value: clamp01(plan.confidence, 0.58), min: 0, max: 1, step: 0.01 },
      { id: "effect_strength", label: "Effect Strength", value: 0.68, min: 0, max: 1, step: 0.01 },
      { id: "flow_rate", label: "Flow Rate", value: 0.56, min: 0, max: 1, step: 0.01 },
    ],
    relations,
    flows,
    forces: isFieldLike && entities.length > 1 ? [{
      id: "news_visual_field",
      source: entities[0].id,
      target: entities[1].id,
      type: "field",
      strength: 0.7,
      radius: 0.7,
    }] : [],
    constraints: [],
    transitions: causalChain.map((step, index) => ({
      id: `stage_${index + 1}`,
      label: step,
      fromState: index === 0 ? "article" : `stage_${index}`,
      toState: `stage_${index + 1}`,
      trigger: "visual timeline",
    })),
    feedbackLoops: /feedback|cycle|loop/i.test(template) && entities.length > 2 ? [{
      id: "news_visual_feedback",
      label: "Feedback loop",
      nodes: entities.slice(0, 3).map((entity) => entity.id),
      polarity: "amplifying",
      strength: 0.62,
    }] : [],
    meta: {
      demoId: "news-handoff",
      parserConfidence: clamp01(plan.confidence, 0.58),
      causalChain: causalChain.length ? causalChain : ["News enters", "Mechanism is detected", "Visual outcome appears"],
    },
  };
}

export function VisualLanguageLab() {
  const engine = useMemo(createEngine, []);
  const initialGraph = useMemo(() => engine.createDemoGraph("gravity-well"), [engine]);
  const simRef = useRef(new SimulationEngine(initialGraph));
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const loopRef = useRef<RuntimeLoop | null>(null);
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const conceptInputRef = useRef<HTMLTextAreaElement | null>(null);
  const dragEntityRef = useRef<string | null>(null);

  const [graph, setGraph] = useState<SemanticGraph>(initialGraph);
  const [snapshot, setSnapshot] = useState<SimulationSnapshot>(() => simRef.current.snapshot());
  const [selectedDemo, setSelectedDemo] = useState("gravity-well");
  const [conceptText, setConceptText] = useState(testPhrases[0]);
  const [playing, setPlaying] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [perf, setPerf] = useState({ fps: 60, primitives: 0 });
  const [handoffStatus, setHandoffStatus] = useState<HandoffStatus>({
    label: "Local concept",
    detail: "Demo mode",
  });
  const handoffLoadedRef = useRef(false);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;
    const renderer = new CanvasRenderer();
    renderer.mount(host);
    rendererRef.current = renderer;

    let frameCount = 0;
    let perfTime = performance.now();
    const loop = new RuntimeLoop({
      onFrame: (dt) => {
        simRef.current.update(dt);
        const nextSnapshot = simRef.current.snapshot();
        renderer.render(nextSnapshot);
        setSnapshot(nextSnapshot);
        frameCount += 1;
        const now = performance.now();
        if (now - perfTime > 700) {
          setPerf({ fps: Math.round((frameCount * 1000) / (now - perfTime)), primitives: nextSnapshot.primitives.length });
          frameCount = 0;
          perfTime = now;
        }
      },
    });
    loopRef.current = loop;
    loop.start();

    const resizeObserver = new ResizeObserver(() => {
      renderer.resize();
      renderer.render(simRef.current.snapshot());
    });
    resizeObserver.observe(host);

    const canvas = renderer.canvas;
    const findEntity = (event: PointerEvent) => hitTestEntity(canvas, event, simRef.current.graph.entities);
    const onPointerMove = (event: PointerEvent) => {
      if (dragEntityRef.current) {
        simRef.current.moveEntity(dragEntityRef.current, pointerToNormalized(canvas, event));
      }
      simRef.current.setHovered(findEntity(event)?.id);
    };
    const onPointerDown = (event: PointerEvent) => {
      const entity = findEntity(event);
      simRef.current.setSelected(entity?.id);
      if (entity?.state?.draggable) dragEntityRef.current = entity.id;
    };
    const onPointerUp = () => {
      dragEntityRef.current = null;
    };
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      loop.destroy();
      renderer.destroy();
    };
  }, []);

  const loadGraph = useCallback((nextGraph: SemanticGraph) => {
    simRef.current.loadGraph(nextGraph);
    setGraph(nextGraph);
    setSnapshot(simRef.current.snapshot());
    rendererRef.current?.render(simRef.current.snapshot());
  }, []);

  function handleDemoChange(id: string) {
    setSelectedDemo(id);
    loadGraph(engine.createDemoGraph(id));
  }

  function handleCompile() {
    const currentText = conceptInputRef.current?.value ?? conceptText;
    setConceptText(currentText);
    const compiled = engine.compileConcept(currentText);
    setSelectedDemo("custom");
    loadGraph(compiled);
  }

  function handleVariableChange(id: string, value: number) {
    simRef.current.setVariable(id, value);
    setGraph({ ...simRef.current.graph });
    setSnapshot(simRef.current.snapshot());
  }

  function handlePlayPause() {
    if (loopRef.current?.isRunning) {
      loopRef.current.pause();
      setPlaying(false);
    } else {
      loopRef.current?.start();
      setPlaying(true);
    }
  }

  function handleReset() {
    simRef.current.reset();
    setSnapshot(simRef.current.snapshot());
  }

  function handleScrub(value: number) {
    simRef.current.timeline.scrub(value);
    setSnapshot(simRef.current.snapshot());
    rendererRef.current?.render(simRef.current.snapshot());
  }

  useEffect(() => {
    if (handoffLoadedRef.current || typeof window === "undefined") return;
    handoffLoadedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const handoffId = params.get("handoffId");
    const fallbackTitle = params.get("title") || "";
    const fallbackSummary = params.get("summary") || "";
    const fallbackSource = params.get("source") || "News Portal";
    const fallbackSubject = params.get("subject") || "auto";

    if (!handoffId && !fallbackTitle && !fallbackSummary) return;

    const controller = new AbortController();

    async function loadNewsHandoff() {
      if (handoffId) {
        setHandoffStatus({
          label: "Loading News Portal handoff",
          detail: handoffId,
        });

        try {
          const response = await fetch(buildSciloopAiClientUrl(`news-visualize/${encodeURIComponent(handoffId)}`), {
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
          }

          const data = await response.json() as NewsVisualHandoff;
          const visualPlan = isRecord(data.visualPlan) ? data.visualPlan : {};
          const article = isRecord(data.article) ? data.article : {};
          const nextGraph = visualPlanToGraph(visualPlan, article);
          const articleText = `${stringValue(article.title, nextGraph.title)}\n${stringValue(article.summary)}`.trim();

          setSelectedDemo("news-handoff");
          setConceptText(articleText || nextGraph.title);
          loadGraph(nextGraph);
          setHandoffStatus({
            label: "From News Portal",
            detail: stringValue(article.source, "SciLoop AI Backend"),
            provider: data.providerUsed || "unknown",
            cached: Boolean(data.cached),
            fallback: Boolean(data.fallback),
          });
          return;
        } catch (error) {
          if (!controller.signal.aborted) {
            setHandoffStatus({
              label: "Handoff fallback",
              detail: error instanceof Error ? error.message : "Backend handoff unavailable",
              fallback: true,
            });
          }
        }
      }

      const fallbackText = `${fallbackTitle}\n${fallbackSummary}`.trim();
      if (fallbackText) {
        const nextGraph = engine.compileConcept(fallbackText);
        setSelectedDemo("news-fallback");
        setConceptText(fallbackText);
        loadGraph({
          ...nextGraph,
          title: fallbackTitle || nextGraph.title,
          meta: {
            ...nextGraph.meta,
            demoId: "news-fallback",
          },
        });
        setHandoffStatus({
          label: "From News Portal",
          detail: `${fallbackSource} / local URL fallback / ${fallbackSubject}`,
          fallback: true,
        });
      }
    }

    loadNewsHandoff();

    return () => controller.abort();
  }, [engine, loadGraph]);

  const validation = validateGraph(graph);

  return (
    <div className="page-shell space-y-6 pb-12">
      <section className="panel-surface rounded-[38px] p-6 md:p-9">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-4">
            <div className="eyebrow">Visual reasoning v0.1</div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Sciloop Visual Language Engine
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              Semantic simulations, not images. The engine converts concepts into causal graphs,
              maps them to primitives, and lets users change variables to see what causes what.
            </p>
          </div>
          <div className="space-y-3">
            <div className="rounded-3xl border border-cyan-200/20 bg-cyan-200/5 p-4 text-sm text-cyan-100">
              {perf.fps} FPS target / {perf.primitives} primitives / local canvas
            </div>
            <div className="rounded-3xl border border-amber-200/20 bg-amber-200/5 p-4 text-sm text-amber-100">
              <div className="font-medium">{handoffStatus.label}</div>
              <div className="mt-1 text-xs leading-5 text-amber-100/75">
                {handoffStatus.detail}
                {handoffStatus.cached ? " / Cached" : ""}
                {handoffStatus.fallback ? " / Fallback" : ""}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_340px]">
        <aside className="panel-surface space-y-5 rounded-[32px] p-5">
          <div>
            <div className="eyebrow">Input</div>
            <label className="mt-4 block text-sm text-slate-300">
              Demo selector
              <select
                className="sciloop-smooth-card mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 p-3 text-white"
                value={selectedDemo}
                onChange={(event) => handleDemoChange(event.target.value)}
              >
                {selectedDemo === "news-handoff" ? <option value="news-handoff">News Portal handoff</option> : null}
                {selectedDemo === "news-fallback" ? <option value="news-fallback">News Portal fallback</option> : null}
                {engine.getDemos().map((demo) => (
                  <option key={demo.id} value={demo.id}>{demo.title}</option>
                ))}
                <option value="custom">Custom concept</option>
              </select>
            </label>
          </div>

          <div>
            <label className="block text-sm text-slate-300">
              Concept text
              <textarea
                ref={conceptInputRef}
                className="sciloop-smooth-card mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/80 p-3 text-sm text-white outline-none focus:border-cyan-200/40"
                value={conceptText}
                onChange={(event) => setConceptText(event.target.value)}
              />
            </label>
            <button
              className="sciloop-smooth-button mt-3 w-full rounded-full border border-cyan-200/30 bg-cyan-200/10 px-4 py-3 text-sm font-medium text-white"
              type="button"
              onClick={handleCompile}
            >
              Compile Semantic Visual
            </button>
          </div>

          <div>
            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">Test phrases</div>
            <div className="space-y-2">
              {testPhrases.map((phrase) => (
                <button
                  key={phrase}
                  className="sciloop-smooth-button block w-full rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs leading-5 text-slate-300 hover:border-cyan-200/30"
                  type="button"
                  onClick={() => {
                    setConceptText(phrase);
                    loadGraph(engine.compileConcept(phrase));
                    setSelectedDemo("custom");
                  }}
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">Variables</div>
            <ControlsPanel variables={graph.variables} onChange={handleVariableChange} />
          </div>
        </aside>

        <main className="space-y-4">
          <div className="panel-surface overflow-hidden rounded-[34px] p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="eyebrow">Simulation canvas</div>
                <h2 className="mt-2 font-display text-2xl font-semibold text-white">{graph.title}</h2>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                Hover inspect / drag mass / change sliders
              </div>
            </div>
            <div ref={canvasHostRef} className="sciloop-stage-shell h-[520px] min-h-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 md:h-[620px]" />
          </div>
          <TimelineControls
            playing={playing}
            timeline={snapshot.timeline}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            onScrub={handleScrub}
          />
          <div className="panel-surface rounded-[28px] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="eyebrow">Primitive legend</div>
              <button className="text-xs text-cyan-100" type="button" onClick={() => setShowDebug((value) => !value)}>
                {showDebug ? "Hide debug" : "Show debug"}
              </button>
            </div>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {semanticMappings.slice(0, 8).map((mapping) => (
                <div key={mapping.semantic} className="sciloop-smooth-card rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-slate-300">
                  <div className="mb-1 font-mono uppercase tracking-[0.16em]" style={{ color: mapping.color }}>{mapping.semantic}</div>
                  <div>{mapping.explanation}</div>
                </div>
              ))}
            </div>
            {showDebug ? (
              <pre className="quiet-scrollbar mt-4 max-h-80 overflow-auto rounded-2xl bg-black/40 p-4 text-xs leading-5 text-slate-300">
                {JSON.stringify(snapshot.graph, null, 2)}
              </pre>
            ) : null}
          </div>
        </main>

        <aside className="panel-surface rounded-[32px] p-5">
          <InspectorPanel graph={graph} validation={validation} selectedId={snapshot.selectedId} hoveredId={snapshot.hoveredId} />
        </aside>
      </section>
    </div>
  );
}

function hitTestEntity(canvas: HTMLCanvasElement, event: PointerEvent, entities: SemanticEntity[]) {
  const rect = canvas.getBoundingClientRect();
  const point = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
  return entities.find((entity) => {
    const x = entity.position.x * rect.width;
    const y = entity.position.y * rect.height;
    const radius = (entity.radius ?? 22) + 14;
    const dx = x - point.x;
    const dy = y - point.y;
    return Math.sqrt(dx * dx + dy * dy) <= radius;
  });
}
