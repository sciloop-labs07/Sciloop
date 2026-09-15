import type { Renderer, RenderSize } from "./RenderTypes";
import type { SimulationSnapshot } from "@/src/simulation/SimulationEngine";
import { getCappedDpr } from "@/src/utils/perf";
import { semanticColors, withAlpha } from "@/src/utils/color";
import { distance } from "@/src/utils/math";

import { drawArrow, drawFlowParticles, drawNode, entityPoint } from "./DrawPrimitives";

export class CanvasRenderer implements Renderer {
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private host?: HTMLElement;
  private size: RenderSize = { width: 1, height: 1, dpr: 1 };
  private backgroundCache?: HTMLCanvasElement;
  private backgroundCacheKey = "";

  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas ?? document.createElement("canvas");
    const ctx = this.canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) throw new Error("Canvas 2D context unavailable.");
    this.ctx = ctx;
  }

  mount(target: HTMLElement) {
    this.host = target;
    if (!this.canvas.parentElement) target.appendChild(this.canvas);
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.touchAction = "none";
    this.resize();
  }

  resize() {
    const rect = this.host?.getBoundingClientRect() ?? this.canvas.getBoundingClientRect();
    const dpr = getCappedDpr(2);
    this.size = {
      width: Math.max(320, rect.width),
      height: Math.max(360, rect.height),
      dpr,
    };
    this.canvas.width = Math.floor(this.size.width * dpr);
    this.canvas.height = Math.floor(this.size.height * dpr);
    this.canvas.style.width = `${this.size.width}px`;
    this.canvas.style.height = `${this.size.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.backgroundCache = undefined;
    this.backgroundCacheKey = "";
  }

  render(snapshot: SimulationSnapshot) {
    const { width, height } = this.size;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(this.getBackground(width, height), 0, 0, width, height);
    drawSemanticScene(ctx, snapshot, width, height);
  }

  destroy() {
    this.canvas.remove();
  }

  private getBackground(width: number, height: number) {
    const key = `${Math.round(width)}x${Math.round(height)}`;
    if (this.backgroundCache && this.backgroundCacheKey === key) return this.backgroundCache;
    const cache = document.createElement("canvas");
    cache.width = Math.max(1, Math.round(width));
    cache.height = Math.max(1, Math.round(height));
    const cacheCtx = cache.getContext("2d");
    if (cacheCtx) drawBackground(cacheCtx, width, height);
    this.backgroundCache = cache;
    this.backgroundCacheKey = key;
    return cache;
  }
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#040916");
  gradient.addColorStop(0.55, "#071322");
  gradient.addColorStop(1, "#03050b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.strokeStyle = "rgba(143,233,255,0.045)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 44) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSemanticScene(ctx: CanvasRenderingContext2D, snapshot: SimulationSnapshot, width: number, height: number) {
  const { graph, timeline, hoveredId, selectedId } = snapshot;
  const entities = new Map(graph.entities.map((entity) => [entity.id, entity]));
  const demoId = graph.meta?.demoId;
  if (demoId === "gravity-well" || demoId === "parsed-gravity") drawGravityField(ctx, snapshot, width, height);
  if (demoId === "photosynthesis" || demoId === "parsed-energy-flow") drawConverterAura(ctx, snapshot, width, height);
  if (demoId === "neural-learning" || demoId === "parsed-learning") drawLearningWeights(ctx, snapshot, width, height);
  if (demoId === "economic-inflation" || demoId === "parsed-money") drawValuePressure(ctx, snapshot, width, height);

  for (const relation of graph.relations) {
    const a = entities.get(relation.from);
    const b = entities.get(relation.to);
    if (!a || !b) continue;
    const from = entityPoint(a, width, height);
    const to = entityPoint(b, width, height);
    const color =
      relation.type === "feedback" ? semanticColors.feedback :
      relation.type === "signal_flow" ? semanticColors.signal :
      relation.type === "decay" ? semanticColors.decay :
      relation.type === "growth" ? semanticColors.growth :
      relation.type === "constraint" ? semanticColors.constraint :
      semanticColors.force;
    drawArrow(ctx, from, to, color, relation.label, 1 + relation.strength * 3);
  }

  drawFlowParticles(ctx, graph, width, height, timeline);

  for (const constraint of graph.constraints) {
    ctx.save();
    ctx.strokeStyle = semanticColors.constraint;
    ctx.setLineDash([8, 7]);
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.72;
    ctx.beginPath();
    ctx.moveTo(width * 0.46, height * 0.18);
    ctx.lineTo(width * 0.46, height * 0.84);
    ctx.stroke();
    ctx.fillStyle = withAlpha(semanticColors.constraint, 0.86);
    ctx.font = "12px IBM Plex Mono, monospace";
    ctx.fillText(constraint.label, width * 0.48, height * 0.22);
    ctx.restore();
  }

  for (const entity of graph.entities) {
    drawNode(ctx, entity, width, height, selectedId === entity.id, hoveredId === entity.id);
  }

  drawCausalRibbon(ctx, snapshot, width, height);
}

function drawGravityField(ctx: CanvasRenderingContext2D, snapshot: SimulationSnapshot, width: number, height: number) {
  const mass = snapshot.graph.entities.find((entity) => entity.type === "mass");
  if (!mass) return;
  const center = entityPoint(mass, width, height);
  const massStrength = snapshot.graph.variables.find((variable) => variable.id.includes("mass") || variable.id.includes("field"))?.value ?? 0.65;
  ctx.save();
  for (let ring = 1; ring <= 7; ring += 1) {
    const radius = ring * (30 + massStrength * 12);
    ctx.strokeStyle = withAlpha(semanticColors.force, 0.18 - ring * 0.012);
    ctx.lineWidth = Math.max(1, 5 - ring * 0.5);
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, radius * (1 + massStrength * 0.25), radius * (0.55 + massStrength * 0.12), snapshot.timeline * 2 + ring * 0.12, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = withAlpha("#ffffff", 0.13);
  for (let x = 40; x < width; x += 42) {
    ctx.beginPath();
    for (let y = 30; y < height; y += 18) {
      const d = Math.max(24, distance({ x, y }, center));
      const bend = (massStrength * 1400) / (d * d);
      const px = x + (center.x - x) * bend;
      const py = y + (center.y - y) * bend;
      if (y === 30) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawConverterAura(ctx: CanvasRenderingContext2D, snapshot: SimulationSnapshot, width: number, height: number) {
  const leaf = snapshot.graph.entities.find((entity) => entity.id.includes("leaf") || entity.id.includes("converter"));
  if (!leaf) return;
  const point = entityPoint(leaf, width, height);
  const variables = snapshot.graph.variables.map((variable) => variable.value);
  const bottleneck = Math.min(...variables);
  ctx.save();
  const gradient = ctx.createRadialGradient(point.x, point.y, 8, point.x, point.y, 130);
  gradient.addColorStop(0, withAlpha(semanticColors.growth, 0.35 + bottleneck * 0.32));
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 132, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = withAlpha(semanticColors.growth, 0.85);
  ctx.font = "12px IBM Plex Mono, monospace";
  ctx.fillText(`conversion rate ${Math.round(bottleneck * 100)}%`, point.x - 58, point.y - 62);
  ctx.restore();
}

function drawLearningWeights(ctx: CanvasRenderingContext2D, snapshot: SimulationSnapshot, width: number, height: number) {
  const rate = snapshot.graph.variables.find((variable) => variable.id === "learning_rate")?.value ?? 0.5;
  ctx.save();
  ctx.fillStyle = withAlpha(semanticColors.signal, 0.9);
  ctx.font = "12px IBM Plex Mono, monospace";
  ctx.fillText(`weight update rate ${Math.round(rate * 100)}%`, width * 0.54, height * 0.14);
  ctx.strokeStyle = withAlpha(semanticColors.feedback, 0.45);
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 10]);
  ctx.strokeRect(width * 0.1, height * 0.18, width * 0.84, height * 0.64);
  ctx.restore();
}

function drawValuePressure(ctx: CanvasRenderingContext2D, snapshot: SimulationSnapshot, width: number, height: number) {
  const money = snapshot.graph.variables.find((variable) => variable.id.includes("money"))?.value ?? 0.6;
  const goods = snapshot.graph.variables.find((variable) => variable.id.includes("goods"))?.value ?? 0.4;
  const pressure = Math.max(0, money - goods);
  ctx.save();
  ctx.fillStyle = withAlpha(semanticColors.money, 0.08 + pressure * 0.18);
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = withAlpha(semanticColors.decay, 0.9);
  ctx.font = "12px IBM Plex Mono, monospace";
  ctx.fillText(`price pressure ${Math.round(pressure * 100)}%`, width * 0.62, height * 0.16);
  ctx.restore();
}

function drawCausalRibbon(ctx: CanvasRenderingContext2D, snapshot: SimulationSnapshot, width: number, height: number) {
  const chain = snapshot.causalChain.slice(0, 4);
  if (!chain.length) return;
  ctx.save();
  ctx.fillStyle = "rgba(2,6,14,0.72)";
  ctx.strokeStyle = "rgba(143,233,255,0.16)";
  ctx.lineWidth = 1;
  roundRect(ctx, 18, height - 70, width - 36, 50, 18);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(237,248,255,0.86)";
  ctx.font = "12px IBM Plex Mono, monospace";
  ctx.textAlign = "left";
  ctx.fillText(chain.map((step, index) => `${index + 1}. ${step}`).join("  →  "), 34, height - 40);
  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}
