export function getCappedDpr(max = 2) {
  if (typeof window === "undefined") return 1;
  return Math.min(max, Math.max(1, window.devicePixelRatio || 1));
}

export function shouldReduceMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
