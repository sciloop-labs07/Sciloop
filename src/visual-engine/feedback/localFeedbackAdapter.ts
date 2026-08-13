import { visualFeedbackStorageKey } from "./feedback.constants";
import { createAdapterQueryHelpers, filterValidFeedback, isVisualFeedbackRecord } from "./feedbackStorageAdapter";
import type { FeedbackStorageAdapter } from "./feedbackStorage.types";
import type { VisualFeedback } from "./feedback.types";

export function isLocalFeedbackStorageAvailable() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const probe = `${visualFeedbackStorageKey}.probe`;
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export class LocalFeedbackAdapter implements FeedbackStorageAdapter {
  readonly id = "sciloop-local-feedback";
  readonly mode = "local-storage" as const;

  private read() {
    if (!isLocalFeedbackStorageAvailable()) return [];
    try {
      const raw = window.localStorage.getItem(visualFeedbackStorageKey);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? filterValidFeedback(parsed).valid : [];
    } catch {
      return [];
    }
  }

  private write(feedback: VisualFeedback[]) {
    if (!isLocalFeedbackStorageAvailable()) throw new Error("Local storage is unavailable.");
    window.localStorage.setItem(visualFeedbackStorageKey, JSON.stringify(feedback));
  }

  saveFeedback(feedback: VisualFeedback) {
    if (!isVisualFeedbackRecord(feedback)) throw new Error("Invalid feedback record.");
    this.write([feedback, ...this.read().filter((item) => item.id !== feedback.id)]);
    return feedback;
  }

  getAllFeedback() {
    return this.read();
  }

  getFeedbackByRecipeId(recipeId: string) {
    return createAdapterQueryHelpers(this).byRecipe(recipeId);
  }

  getFeedbackByPatternId(patternId: string) {
    return createAdapterQueryHelpers(this).byPattern(patternId);
  }

  getFeedbackByEngineId(engineId: string) {
    return createAdapterQueryHelpers(this).byEngine(engineId);
  }

  deleteFeedback(feedbackId: string) {
    const current = this.read();
    const next = current.filter((feedback) => feedback.id !== feedbackId);
    if (next.length === current.length) return false;
    this.write(next);
    return true;
  }

  clearFeedback() {
    if (!isLocalFeedbackStorageAvailable()) return;
    window.localStorage.removeItem(visualFeedbackStorageKey);
  }

  exportFeedback() {
    return JSON.stringify(this.read(), null, 2);
  }

  getStorageHealth() {
    const available = isLocalFeedbackStorageAvailable();
    return {
      adapterId: this.id,
      mode: this.mode,
      status: available ? "healthy" as const : "unavailable" as const,
      available,
      persistent: available,
      feedbackCount: available ? this.read().length : 0,
      exportAvailable: available,
      reason: available ? undefined : "localStorage is unavailable in this environment.",
      fallback: available ? undefined : "memory" as const,
    };
  }
}
