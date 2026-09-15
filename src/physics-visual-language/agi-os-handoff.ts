import type { PhysicsRecipeCandidate, PhysicsVisualSubject } from "./candidates";
import { createDraftCandidate } from "./candidate-pipeline";
import { validatePhysicsRecipeCandidate, type CandidateValidationResult } from "./candidate-validator";

export interface AgiOsPhysicsHandoff {
  handoffVersion: "1.0";
  researchQuestion: string;
  subject: PhysicsVisualSubject;
  proposedMechanism: string;
  controlledVariable?: string;
  predictedOutput?: string;
  sourceRefs: string[];
  uncertaintyNotes: string[];
  misconceptionRisks: string[];
  candidate: PhysicsRecipeCandidate;
}

export function validateAgiOsPhysicsHandoff(handoff: AgiOsPhysicsHandoff): CandidateValidationResult {
  const errors: string[] = [];
  if (handoff.handoffVersion !== "1.0") errors.push("Unsupported AGI OS handoff version.");
  if (!handoff.researchQuestion?.trim()) errors.push("Research question is required.");
  if (!handoff.proposedMechanism?.trim()) errors.push("Proposed mechanism is required.");
  if (!Array.isArray(handoff.sourceRefs) || handoff.sourceRefs.length === 0) errors.push("Handoff must include source references.");
  if (!Array.isArray(handoff.uncertaintyNotes) || handoff.uncertaintyNotes.length === 0) errors.push("Handoff must include uncertainty notes.");
  if (!Array.isArray(handoff.misconceptionRisks) || handoff.misconceptionRisks.length === 0) errors.push("Handoff must include misconception risks.");
  if (!handoff.candidate || handoff.candidate.status !== "draft" || handoff.candidate.publicEligible) errors.push("AGI OS handoffs must contain a non-public draft candidate.");
  if (handoff.candidate && handoff.candidate.subject !== handoff.subject) errors.push("Handoff subject does not match candidate subject.");
  const candidateResult = handoff.candidate ? validatePhysicsRecipeCandidate(handoff.candidate) : { ok: false, errors: [], warnings: [] };
  return { ok: errors.length === 0 && candidateResult.ok, errors: [...errors, ...candidateResult.errors], warnings: candidateResult.warnings };
}

export function handoffToDraftCandidate(handoff: AgiOsPhysicsHandoff): PhysicsRecipeCandidate {
  const validation = validateAgiOsPhysicsHandoff(handoff);
  if (!validation.ok) throw new Error("AGI OS handoff rejected.");
  return createDraftCandidate({
    recipeId: handoff.candidate.recipeId,
    subject: handoff.subject,
    hypothesis: handoff.researchQuestion,
    sourceRefs: handoff.sourceRefs,
    sourceNotes: [...handoff.uncertaintyNotes, ...handoff.misconceptionRisks],
    proposedChanges: handoff.candidate.proposedChanges,
    generatedBy: "agi-os",
  });
}

export function serializeAgiOsPhysicsHandoff(handoff: AgiOsPhysicsHandoff): string {
  const sortKeys = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(sortKeys);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, sortKeys(item)]));
    }
    return value;
  };
  return JSON.stringify(sortKeys(handoff), null, 2);
}
