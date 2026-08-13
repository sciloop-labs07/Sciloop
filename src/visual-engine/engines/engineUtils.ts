import {
  experimentalEngineIds,
  heavyDependencyEngineIds,
  safeDefaultEngineId,
} from "./engine.constants";
import { getVisualEngine } from "./engineCapabilities";
import type { VisualEngineId } from "./engine.types";

export function isEngineInstalled(engineId: VisualEngineId) {
  return getVisualEngine(engineId)?.installed ?? false;
}

export function isEngineExperimental(engineId: VisualEngineId) {
  return experimentalEngineIds.includes(engineId as (typeof experimentalEngineIds)[number]);
}

export function requiresHeavyDependency(engineId: VisualEngineId) {
  return heavyDependencyEngineIds.includes(engineId as (typeof heavyDependencyEngineIds)[number]);
}

export function getEngineCategory(engineId: VisualEngineId) {
  return getVisualEngine(engineId)?.category ?? "layout";
}

export function getEngineDisplayName(engineId: VisualEngineId) {
  return getVisualEngine(engineId)?.name ?? engineId;
}

export function getSafeDefaultEngine(): VisualEngineId {
  return safeDefaultEngineId;
}

export function getEngineWarning(engineId: VisualEngineId) {
  const engine = getVisualEngine(engineId);
  if (!engine) return `Unknown engine: ${engineId}.`;
  if (isEngineExperimental(engineId)) return `${engine.name} is experimental and must always have a fallback.`;
  if (!engine.installed) return `${engine.name} is not installed in the current project.`;
  if (requiresHeavyDependency(engineId) && engine.complexityLevel !== "low") {
    return `${engine.name} is available but should only be used when it improves understanding.`;
  }
  return undefined;
}
