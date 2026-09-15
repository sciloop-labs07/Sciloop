import { visualFeedbackUpdatedEvent } from "./feedback.constants";
import { feedbackStorageManager } from "./feedbackStorageManager";
import type { FeedbackStorageMode, VisualFeedback } from "./feedback.types";

function notifyFeedbackChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(visualFeedbackUpdatedEvent));
  }
}

/**
 * Compatibility facade used by the existing feedback UI. Persistence now
 * flows through the storage manager and adapter interface.
 */
export function saveVisualFeedback(feedback: VisualFeedback) {
  const saved = feedbackStorageManager.saveFeedback(feedback);
  notifyFeedbackChanged();
  return saved;
}

export function getAllVisualFeedback() {
  return feedbackStorageManager.getAllFeedback();
}

export function getFeedbackByRecipeId(recipeId: string) {
  return feedbackStorageManager.getFeedbackByRecipeId(recipeId);
}

export function getFeedbackByPatternId(patternId: string) {
  return feedbackStorageManager.getFeedbackByPatternId(patternId);
}

export function getFeedbackByEngineId(engineId: string) {
  return feedbackStorageManager.getFeedbackByEngineId(engineId);
}

export function deleteVisualFeedback(feedbackId: string) {
  const deleted = feedbackStorageManager.deleteFeedback(feedbackId);
  if (deleted) notifyFeedbackChanged();
  return deleted;
}

export function clearVisualFeedback() {
  feedbackStorageManager.clearFeedback();
  notifyFeedbackChanged();
}

export function exportVisualFeedbackJson() {
  return feedbackStorageManager.exportFeedback();
}

export function importVisualFeedbackJson(json: string) {
  const result = feedbackStorageManager.importFeedback(json);
  if (result.importedCount > 0) notifyFeedbackChanged();
  return result;
}

export function getFeedbackStorageMode(): FeedbackStorageMode {
  return feedbackStorageManager.getStorageHealth().mode === "local-storage" ? "local-storage" : "memory";
}

export function getFeedbackStorageHealth() {
  return feedbackStorageManager.getArchitectureHealth();
}
