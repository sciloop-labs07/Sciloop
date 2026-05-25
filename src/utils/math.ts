import type { Vec2 } from "@/src/semantic/SemanticTypes";

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

export function distance(a: Vec2, b: Vec2) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function normalize(vector: Vec2): Vec2 {
  const length = Math.max(0.0001, Math.sqrt(vector.x * vector.x + vector.y * vector.y));
  return { x: vector.x / length, y: vector.y / length };
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = (value - inMin) / Math.max(0.0001, inMax - inMin);
  return lerp(outMin, outMax, clamp(t, 0, 1));
}
