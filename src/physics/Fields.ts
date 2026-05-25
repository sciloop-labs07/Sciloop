export function fieldFalloff(distance: number, radius: number) {
  return Math.max(0, 1 - distance / Math.max(0.001, radius));
}
