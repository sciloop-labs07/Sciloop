import { randomUUID } from "node:crypto";
import type { PhysicsRecipeCandidate, PhysicsRecipeCandidateStatus, PhysicsVisualSubject } from "./candidates";
import { validatePhysicsRecipeCandidate, type CandidateValidationResult } from "./candidate-validator";

export interface DraftCandidateInput {
  recipeId: string;
  subject: PhysicsVisualSubject;
  hypothesis: string;
  sourceRefs: string[];
  sourceNotes: string[];
  proposedChanges?: string[];
  generatedBy: PhysicsRecipeCandidate["generatedBy"];
}

const candidates = new Map<string, PhysicsRecipeCandidate>();
const now = () => new Date().toISOString();
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function audit(event: string, candidate: PhysicsRecipeCandidate) {
  console.info(JSON.stringify({ event, candidateId: candidate.id, status: candidate.status, generatedBy: candidate.generatedBy, timestamp: candidate.updatedAt }));
}

export function createDraftCandidate(input: DraftCandidateInput): PhysicsRecipeCandidate {
  const timestamp = now();
  const candidate: PhysicsRecipeCandidate = {
    id: `candidate-${randomUUID()}`,
    recipeId: input.recipeId,
    status: "draft",
    subject: input.subject,
    hypothesis: input.hypothesis.trim(),
    sourceRefs: [...input.sourceRefs],
    sourceNotes: [...input.sourceNotes],
    proposedChanges: [...(input.proposedChanges ?? [])],
    generatedBy: input.generatedBy,
    createdAt: timestamp,
    updatedAt: timestamp,
    validationErrors: [],
    reviewerNotes: [],
    publicEligible: false,
  };
  candidates.set(candidate.id, candidate);
  audit("physics_candidate_created", candidate);
  return clone(candidate);
}

export function getCandidate(id: string): PhysicsRecipeCandidate | undefined {
  const candidate = candidates.get(id);
  return candidate ? clone(candidate) : undefined;
}

export function listCandidates(): PhysicsRecipeCandidate[] {
  return [...candidates.values()].map(clone);
}

export function validateCandidate(candidateOrId: PhysicsRecipeCandidate | string): CandidateValidationResult {
  const candidate = typeof candidateOrId === "string" ? candidates.get(candidateOrId) : candidateOrId;
  if (!candidate) return { ok: false, errors: ["Candidate not found."], warnings: [] };
  const result = validatePhysicsRecipeCandidate(candidate);
  if (typeof candidateOrId === "string") {
    const stored = candidates.get(candidate.id)!;
    stored.validationErrors = [...result.errors];
    stored.updatedAt = now();
    if (result.ok && stored.status === "draft") stored.status = "validated";
    audit(result.ok ? "physics_candidate_validated" : "physics_candidate_validation_failed", stored);
  }
  return result;
}

function transition(id: string, expected: PhysicsRecipeCandidateStatus, next: PhysicsRecipeCandidateStatus, reviewer: string, notes: string[] = []) {
  const candidate = candidates.get(id);
  if (!candidate) throw new Error("Candidate not found.");
  if (candidate.status !== expected) throw new Error(`Candidate must be ${expected} before it can become ${next}.`);
  if (!reviewer.trim()) throw new Error("A reviewer is required.");
  const configuredReviewer = process.env.SCILOOP_RELEASE_REVIEWER?.trim() || "Shahzeb";
  if (next === "approved" && reviewer.toLowerCase() !== configuredReviewer.toLowerCase()) throw new Error("Only the configured release reviewer may approve candidates.");
  candidate.reviewerNotes.push(...notes.filter(Boolean));
  candidate.status = next;
  candidate.publicEligible = next === "approved";
  candidate.updatedAt = now();
  audit(`physics_candidate_${next.replace("-", "_")}`, candidate);
  return clone(candidate);
}

export function markCandidateForReview(id: string, reviewer: string, notes: string[] = []) {
  const result = validateCandidate(id);
  if (!result.ok) throw new Error("Candidate must pass validation before review.");
  return transition(id, "validated", "review-required", reviewer, notes);
}

export function approveCandidate(id: string, reviewer: string, notes: string[] = []) {
  return transition(id, "review-required", "approved", reviewer, notes);
}

export function rejectCandidate(id: string, reviewer: string, notes: string[] = []) {
  return transition(id, "review-required", "rejected", reviewer, notes);
}

export function getCandidatePublicEligibility(id: string): boolean {
  const candidate = candidates.get(id);
  return Boolean(candidate?.status === "approved" && candidate.publicEligible);
}

export function clearCandidateStoreForTests() {
  candidates.clear();
}
