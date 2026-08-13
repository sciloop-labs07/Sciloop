import { getFeedbackByRecipeId, type VisualFeedback } from "@/src/visual-engine/feedback";
import type { VisualRecipe } from "@/src/visual-engine/foundation";

import type { VisualMemory, VisualMemoryHealth } from "./visualMemory.types";
import { createMemoryFromFeedback, isVisualMemory, visualMemoryStorageKey, visualMemoryUpdatedEvent } from "./visualMemoryUtils";

let memoryFallback: VisualMemory[] = [];
let storageUnavailable = false;

function canUseStorage() {
  try {
    return !storageUnavailable && typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    storageUnavailable = true;
    return false;
  }
}

function readMemories() {
  if (!canUseStorage()) return memoryFallback;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(visualMemoryStorageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isVisualMemory) : [];
  } catch {
    return [];
  }
}

function writeMemories(memories: VisualMemory[]) {
  if (canUseStorage()) {
    try {
      window.localStorage.setItem(visualMemoryStorageKey, JSON.stringify(memories));
      return;
    } catch {
      storageUnavailable = true;
    }
  }
  memoryFallback = memories;
}

function notify() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(visualMemoryUpdatedEvent));
}

export function saveMemory(memory: VisualMemory) {
  if (!isVisualMemory(memory)) throw new Error("Invalid visual memory.");
  const current = readMemories();
  const previous = current.find((item) => item.id === memory.id);
  writeMemories([{
    ...memory,
    createdAt: previous?.createdAt ?? memory.createdAt,
    updatedAt: new Date().toISOString(),
  }, ...current.filter((item) => item.id !== memory.id)]);
  notify();
  return memory;
}

export function getMemory(memoryId: string) {
  return readMemories().find((memory) => memory.id === memoryId);
}

export function getAllMemories() {
  return [...readMemories()];
}

export function deleteMemory(memoryId: string) {
  const current = readMemories();
  const next = current.filter((memory) => memory.id !== memoryId);
  if (next.length === current.length) return false;
  writeMemories(next);
  notify();
  return true;
}

export function clearVisualMemory() {
  memoryFallback = [];
  if (canUseStorage()) window.localStorage.removeItem(visualMemoryStorageKey);
  notify();
}

export function exportMemory() {
  return JSON.stringify(readMemories(), null, 2);
}

export function rememberSuccessfulFeedback(feedback: VisualFeedback, recipe?: VisualRecipe) {
  const related = getFeedbackByRecipeId(feedback.recipeId);
  const memory = createMemoryFromFeedback(related, recipe);
  return memory ? saveMemory(memory) : undefined;
}

export function getVisualMemoryHealth(): VisualMemoryHealth {
  const memories = readMemories();
  return {
    available: true,
    mode: canUseStorage() ? "local-storage" : "memory",
    memoryCount: memories.length,
    integrityValid: memories.every(isVisualMemory),
    evolutionAvailable: true,
    reason: canUseStorage() ? undefined : "localStorage unavailable; memory lasts for this session only.",
  };
}
