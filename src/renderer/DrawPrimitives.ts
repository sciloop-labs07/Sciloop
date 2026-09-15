import type { SemanticEntity, SemanticGraph } from "@/src/semantic/SemanticTypes";
import { semanticColors, withAlpha } from "@/src/utils/color";

export function entityPoint(entity: SemanticEntity, width: number, height: number) {
  return {
    x: entity.position.x * width,
    y: entity.position.y * height,
    r: entity.radius ?? 22,
  };
}

export function drawArrow(ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }, color: string, label?: string, width = 2) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const end = { x: to.x - Math.cos(angle) * 22, y: to.y - Math.sin(angle) * 22 };
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(end.x - Math.cos(angle - 0.5) * 10, end.y - Math.sin(angle - 0.5) * 10);
  ctx.lineTo(end.x - Math.cos(angle + 0.5) * 10, end.y - Math.sin(angle + 0.5) * 10);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  if (label) {
    ctx.shadowBlur = 0;
    ctx.fillStyle = withAlpha("#ffffff", 0.82);
    ctx.font = "12px IBM Plex Mono, monospace";
    ctx.fillText(label, (from.x + to.x) / 2 + 8, (from.y + to.y) / 2 - 8);
  }
  ctx.restore();
}

export function drawNode(ctx: CanvasRenderingContext2D, entity: SemanticEntity, width: number, height: number, selected = false, hovered = false) {
  const point = entityPoint(entity, width, height);
  const color =
    entity.type === "energy_source" ? semanticColors.energy :
    entity.type === "converter" ? semanticColors.growth :
    entity.type === "mass" ? semanticColors.force :
    entity.type === "neuron" ? semanticColors.signal :
    entity.type === "value" ? semanticColors.money :
    entity.type === "output" ? semanticColors.decay :
    semanticColors.neutral;
  const gradient = ctx.createRadialGradient(point.x - point.r * 0.28, point.y - point.r * 0.35, 2, point.x, point.y, point.r * 1.35);
  gradient.addColorStop(0, withAlpha("#ffffff", 0.86));
  gradient.addColorStop(0.28, withAlpha(color, 0.82));
  gradient.addColorStop(1, withAlpha(color, 0.14));
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = hovered || selected ? 26 : 14;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(point.x, point.y, point.r * (hovered ? 1.08 : 1), 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = selected ? 3 : 1.5;
  ctx.strokeStyle = selected ? "#ffffff" : withAlpha(color, 0.72);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#f5fbff";
  ctx.font = "600 12px IBM Plex Sans, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(entity.label, point.x, point.y + point.r + 18);
  ctx.restore();
}

export function drawFlowParticles(ctx: CanvasRenderingContext2D, graph: SemanticGraph, width: number, height: number, phase: number) {
  const entities = new Map(graph.entities.map((entity) => [entity.id, entity]));
  for (const flow of graph.flows) {
    const source = entities.get(flow.source);
    const target = entities.get(flow.target);
    if (!source || !target) continue;
    const a = entityPoint(source, width, height);
    const b = entityPoint(target, width, height);
    const color = flow.type === "money" ? semanticColors.money : flow.type === "signal" ? semanticColors.signal : flow.type === "matter" ? "#8fe9ff" : semanticColors.energy;
    const count = Math.max(3, Math.round(flow.rate * 14));
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    for (let index = 0; index < count; index += 1) {
      const t = (phase * (0.25 + flow.rate) + index / count) % 1;
      const wobble = Math.sin((t + index) * Math.PI * 2) * 10;
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t + wobble;
      ctx.globalAlpha = 0.35 + flow.rate * 0.55;
      ctx.beginPath();
      ctx.arc(x, y, 2.4 + flow.rate * 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
