import type { PrimitiveDefinition, PrimitiveKind } from "./PrimitiveTypes";

const registry = new Map<PrimitiveKind, PrimitiveDefinition>();

export function registerPrimitive(definition: PrimitiveDefinition) {
  registry.set(definition.id, definition);
}

export function getPrimitive(kind: PrimitiveKind) {
  return registry.get(kind) ?? registry.get("node");
}

export function listPrimitives() {
  return [...registry.values()];
}

export function clearPrimitiveRegistry() {
  registry.clear();
}
