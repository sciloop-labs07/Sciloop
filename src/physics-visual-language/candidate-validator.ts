import { visualRecipeExamples, validateVisualRecipe } from "@/src/visual-engine/foundation";
import type { VisualRecipe } from "@/src/visual-engine/foundation";
import type { PhysicsRecipeCandidate, PhysicsRecipeCandidateStatus, PhysicsVisualSubject } from "./candidates";

export interface CandidateValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

const subjects: PhysicsVisualSubject[] = ["electromagnetic-induction", "general-relativity", "higgs-field"];
const statuses: PhysicsRecipeCandidateStatus[] = ["draft", "validated", "review-required", "approved", "rejected"];
const generators = ["human", "agi-os", "sciloop-ai"] as const;
const secretPatterns = [
  /(?:api[_-]?key|secret|access[_-]?token|private[_-]?key|authorization)\s*[:=]/i,
  /(?:sk|rk|ghp|xoxb|xoxp)-[a-z0-9_-]{12,}/i,
  /-----BEGIN [A-Z ]+ PRIVATE KEY-----/i,
  /bearer\s+[a-z0-9._-]{16,}/i,
];

function containsSecret(value: unknown): boolean {
  return secretPatterns.some((pattern) => pattern.test(JSON.stringify(value)));
}

export function findCanonicalRecipe(recipeId: string): VisualRecipe | undefined {
  return visualRecipeExamples.find((recipe) => recipe.id === recipeId);
}

export function validatePhysicsRecipeCandidate(candidate: PhysicsRecipeCandidate): CandidateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!/^candidate-[a-z0-9][a-z0-9-]{2,80}$/.test(candidate.id)) errors.push("Candidate id is invalid.");
  if (!subjects.includes(candidate.subject)) errors.push("Candidate subject is invalid.");
  if (!statuses.includes(candidate.status)) errors.push("Candidate status is invalid.");
  if (!candidate.hypothesis?.trim()) errors.push("Candidate hypothesis is required.");
  if (!Array.isArray(candidate.sourceRefs) || candidate.sourceRefs.length === 0 || candidate.sourceRefs.some((ref) => !ref.trim())) {
    errors.push("Candidate must include at least one source reference.");
  }
  if (!Array.isArray(candidate.sourceNotes) || candidate.sourceNotes.length === 0 || candidate.sourceNotes.some((note) => !note.trim())) {
    errors.push("Candidate must include non-empty source notes.");
  }
  if (!generators.includes(candidate.generatedBy)) errors.push("Candidate generatedBy value is invalid.");
  if (!findCanonicalRecipe(candidate.recipeId)) errors.push("Candidate references an unknown canonical recipe.");
  const recipe = findCanonicalRecipe(candidate.recipeId);
  if (recipe) {
    const validation = validateVisualRecipe(recipe);
    if (!validation.ok) errors.push(...validation.errors.map((error) => `Canonical recipe: ${error}`));
  }
  if (candidate.status !== "approved" && candidate.publicEligible) errors.push("Only approved candidates may be public eligible.");
  if (!Array.isArray(candidate.validationErrors) || !Array.isArray(candidate.reviewerNotes)) errors.push("Candidate audit fields must be arrays.");
  if (candidate.proposedChanges?.length > 0 && candidate.reviewerNotes?.length === 0) {
    errors.push("Proposed changes to canonical meaning require reviewer notes.");
  }
  if (containsSecret(candidate)) errors.push("Candidate contains a possible secret or provider credential.");
  if (!candidate.createdAt?.trim() || !candidate.updatedAt?.trim()) errors.push("Candidate timestamps are required.");
  if (candidate.generatedBy !== "human" && candidate.status === "approved") {
    warnings.push("AI-originated candidates require explicit human approval; AI output is not approval.");
  }
  return { ok: errors.length === 0, errors, warnings };
}

export { containsSecret };
