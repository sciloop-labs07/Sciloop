import type { Vec2 } from "@/src/semantic/SemanticTypes";
import { distance, normalize } from "@/src/utils/math";

export function attractionVector(from: Vec2, to: Vec2, strength: number): Vec2 {
  const d = Math.max(0.04, distance(from, to));
  const direction = normalize({ x: from.x - to.x, y: from.y - to.y });
  return { x: direction.x * strength / d, y: direction.y * strength / d };
}
