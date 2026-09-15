import { DatabaseFeedbackAdapter } from "./databaseFeedbackAdapter";
import { filterValidFeedback, parseFeedbackJson } from "./feedbackStorageAdapter";
import type { FeedbackImportResult, FeedbackStorageAdapter } from "./feedbackStorage.types";
import { LocalFeedbackAdapter, isLocalFeedbackStorageAvailable } from "./localFeedbackAdapter";
import { MemoryFeedbackAdapter } from "./memoryFeedbackAdapter";
import type { VisualFeedback } from "./feedback.types";

export class FeedbackStorageManager {
  private readonly localAdapter = new LocalFeedbackAdapter();
  private readonly memoryAdapter: MemoryFeedbackAdapter;
  private readonly databaseAdapter = new DatabaseFeedbackAdapter();
  private forceMemoryFallback = false;

  constructor(memoryAdapter = new MemoryFeedbackAdapter()) {
    this.memoryAdapter = memoryAdapter;
  }

  getActiveAdapter(): FeedbackStorageAdapter {
    return !this.forceMemoryFallback && isLocalFeedbackStorageAvailable() ? this.localAdapter : this.memoryAdapter;
  }

  getDatabaseAdapter() {
    return this.databaseAdapter;
  }

  saveFeedback(feedback: VisualFeedback) {
    try {
      return this.getActiveAdapter().saveFeedback(feedback);
    } catch {
      this.forceMemoryFallback = true;
      return this.memoryAdapter.saveFeedback(feedback);
    }
  }

  getAllFeedback() {
    return this.getActiveAdapter().getAllFeedback();
  }

  getFeedbackByRecipeId(recipeId: string) {
    return this.getActiveAdapter().getFeedbackByRecipeId(recipeId);
  }

  getFeedbackByPatternId(patternId: string) {
    return this.getActiveAdapter().getFeedbackByPatternId(patternId);
  }

  getFeedbackByEngineId(engineId: string) {
    return this.getActiveAdapter().getFeedbackByEngineId(engineId);
  }

  deleteFeedback(feedbackId: string) {
    return this.getActiveAdapter().deleteFeedback(feedbackId);
  }

  clearFeedback() {
    this.localAdapter.clearFeedback();
    this.memoryAdapter.clearFeedback();
  }

  exportFeedback() {
    return this.getActiveAdapter().exportFeedback();
  }

  importFeedback(json: string): FeedbackImportResult {
    try {
      const parsed = parseFeedbackJson(json);
      const { valid, errors } = filterValidFeedback(parsed);
      valid.slice().reverse().forEach((feedback) => this.saveFeedback(feedback));
      return { importedCount: valid.length, rejectedCount: errors.length, errors };
    } catch (error) {
      return {
        importedCount: 0,
        rejectedCount: 1,
        errors: [error instanceof Error ? error.message : "Feedback JSON could not be imported."],
      };
    }
  }

  getStorageHealth() {
    return this.getActiveAdapter().getStorageHealth();
  }

  getArchitectureHealth() {
    return {
      active: this.getStorageHealth(),
      local: this.localAdapter.getStorageHealth(),
      memory: this.memoryAdapter.getStorageHealth(),
      database: this.databaseAdapter.getStorageHealth(),
    };
  }
}

export const feedbackStorageManager = new FeedbackStorageManager();
