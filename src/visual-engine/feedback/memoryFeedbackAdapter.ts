import { createAdapterQueryHelpers, isVisualFeedbackRecord } from "./feedbackStorageAdapter";
import type { FeedbackStorageAdapter } from "./feedbackStorage.types";
import type { VisualFeedback } from "./feedback.types";

export class MemoryFeedbackAdapter implements FeedbackStorageAdapter {
  readonly id = "sciloop-memory-feedback";
  readonly mode = "memory" as const;
  private feedback: VisualFeedback[];

  constructor(initialFeedback: VisualFeedback[] = []) {
    this.feedback = initialFeedback.filter(isVisualFeedbackRecord);
  }

  saveFeedback(feedback: VisualFeedback) {
    if (!isVisualFeedbackRecord(feedback)) throw new Error("Invalid feedback record.");
    this.feedback = [feedback, ...this.feedback.filter((item) => item.id !== feedback.id)];
    return feedback;
  }

  getAllFeedback() {
    return [...this.feedback];
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
    const before = this.feedback.length;
    this.feedback = this.feedback.filter((feedback) => feedback.id !== feedbackId);
    return this.feedback.length < before;
  }

  clearFeedback() {
    this.feedback = [];
  }

  exportFeedback() {
    return JSON.stringify(this.feedback, null, 2);
  }

  getStorageHealth() {
    return {
      adapterId: this.id,
      mode: this.mode,
      status: "degraded" as const,
      available: true,
      persistent: false,
      feedbackCount: this.feedback.length,
      exportAvailable: true,
      reason: "Browser persistence is unavailable; feedback lasts for this page session only.",
    };
  }
}
