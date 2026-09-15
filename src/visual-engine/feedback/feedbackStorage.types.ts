import type { VisualFeedback } from "./feedback.types";

export type FeedbackStorageAdapterMode = "local-storage" | "memory" | "database";
export type FeedbackStorageHealthStatus = "healthy" | "degraded" | "unavailable";

export interface FeedbackStorageHealth {
  adapterId: string;
  mode: FeedbackStorageAdapterMode;
  status: FeedbackStorageHealthStatus;
  available: boolean;
  persistent: boolean;
  feedbackCount: number;
  exportAvailable: boolean;
  reason?: string;
  fallback?: FeedbackStorageAdapterMode;
}

export interface FeedbackImportResult {
  importedCount: number;
  rejectedCount: number;
  errors: string[];
}

export interface FeedbackStorageAdapter {
  readonly id: string;
  readonly mode: FeedbackStorageAdapterMode;
  saveFeedback(feedback: VisualFeedback): VisualFeedback;
  getAllFeedback(): VisualFeedback[];
  getFeedbackByRecipeId(recipeId: string): VisualFeedback[];
  getFeedbackByPatternId(patternId: string): VisualFeedback[];
  getFeedbackByEngineId(engineId: string): VisualFeedback[];
  deleteFeedback(feedbackId: string): boolean;
  clearFeedback(): void;
  exportFeedback(): string;
  getStorageHealth(): FeedbackStorageHealth;
}
