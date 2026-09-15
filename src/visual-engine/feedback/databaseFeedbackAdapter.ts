import type { FeedbackStorageAdapter } from "./feedbackStorage.types";
import type { VisualFeedback } from "./feedback.types";

const unavailableMessage = "No database configured yet";

/**
 * Explicit placeholder only. The repository contains PostgreSQL schema
 * artifacts for another backend, but no configured Visual Engine database
 * client or runtime connection.
 */
export class DatabaseFeedbackAdapter implements FeedbackStorageAdapter {
  readonly id = "sciloop-database-feedback";
  readonly mode = "database" as const;

  private unavailable(): never {
    throw new Error(`${unavailableMessage}. Use the local feedback adapter.`);
  }

  saveFeedback(): VisualFeedback {
    return this.unavailable();
  }
  getAllFeedback(): VisualFeedback[] {
    return [];
  }
  getFeedbackByRecipeId(): VisualFeedback[] {
    return [];
  }
  getFeedbackByPatternId(): VisualFeedback[] {
    return [];
  }
  getFeedbackByEngineId(): VisualFeedback[] {
    return [];
  }
  deleteFeedback(): boolean {
    return false;
  }
  clearFeedback(): void {
    // Disabled until a database client is configured.
  }
  exportFeedback(): string {
    return "[]";
  }
  getStorageHealth() {
    return {
      adapterId: this.id,
      mode: this.mode,
      status: "unavailable" as const,
      available: false,
      persistent: false,
      feedbackCount: 0,
      exportAvailable: false,
      reason: unavailableMessage,
      fallback: "local-storage" as const,
    };
  }
}
