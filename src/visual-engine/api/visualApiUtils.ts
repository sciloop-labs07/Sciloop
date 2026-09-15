import { visualEngineIds, type VisualEngineId } from "../engines";
import type { VisualRecipeEngine } from "../foundation";
import { allVisualPatterns, type VisualPatternId } from "../patterns";

export function normalizeVisualApiKey(value: unknown) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function resolveVisualApiPattern(value: unknown): VisualPatternId {
  const key = normalizeVisualApiKey(value);
  const direct = allVisualPatterns.find((pattern) => pattern.id === key);
  if (direct) return direct.id;
  const byName = allVisualPatterns.find((pattern) => normalizeVisualApiKey(pattern.name) === key);
  return byName?.id ?? "compression-of-complexity";
}

export function resolveVisualApiEngine(value: unknown): VisualEngineId {
  const key = normalizeVisualApiKey(value);
  return visualEngineIds.includes(key as VisualEngineId) ? key as VisualEngineId : "svg-motion";
}

export function resolveVisualRecipeEngine(value: unknown): VisualRecipeEngine {
  const engine = resolveVisualApiEngine(value);
  if (engine === "lottie" || engine === "rive" || engine === "webgl" || engine === "deckgl") {
    return engine === "deckgl" ? "maplibre" : "svg-motion";
  }
  return engine;
}

export function safeApiMessage(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 500) : fallback;
}
