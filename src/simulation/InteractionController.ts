import type { Vec2 } from "@/src/semantic/SemanticTypes";

export function pointerToNormalized(canvas: HTMLCanvasElement, event: PointerEvent): Vec2 {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / Math.max(1, rect.width),
    y: (event.clientY - rect.top) / Math.max(1, rect.height),
  };
}
