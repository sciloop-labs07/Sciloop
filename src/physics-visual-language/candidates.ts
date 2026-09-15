export type PhysicsRecipeCandidateStatus =
  | "draft"
  | "validated"
  | "review-required"
  | "approved"
  | "rejected";

export type PhysicsVisualSubject =
  | "electromagnetic-induction"
  | "general-relativity"
  | "higgs-field";

export interface PhysicsRecipeCandidate {
  id: string;
  recipeId: string;
  status: PhysicsRecipeCandidateStatus;
  subject: PhysicsVisualSubject;
  hypothesis: string;
  sourceRefs: string[];
  sourceNotes: string[];
  proposedChanges: string[];
  generatedBy: "human" | "agi-os" | "sciloop-ai";
  createdAt: string;
  updatedAt: string;
  validationErrors: string[];
  reviewerNotes: string[];
  publicEligible: boolean;
}
