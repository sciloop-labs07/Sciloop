import assert from "node:assert/strict";
import { approveCandidate, clearCandidateStoreForTests, createDraftCandidate, getCandidatePublicEligibility, markCandidateForReview, rejectCandidate, validateCandidate } from "../src/physics-visual-language/candidate-pipeline";
import { containsSecret, validatePhysicsRecipeCandidate } from "../src/physics-visual-language/candidate-validator";
import { handoffToDraftCandidate, serializeAgiOsPhysicsHandoff, validateAgiOsPhysicsHandoff } from "../src/physics-visual-language/agi-os-handoff";
import { validateResearchSource } from "../src/physics-visual-language/research-sources";

const recipeId = "recipe-fourier-transform";
const base = () => createDraftCandidate({ recipeId, subject: "electromagnetic-induction", hypothesis: "A changing magnetic flux induces an electric response.", sourceRefs: ["https://example.org/physics"], sourceNotes: ["Institutional source; interpretation remains provisional."], generatedBy: "agi-os" });

clearCandidateStoreForTests();
const draft = base();
assert.equal(draft.status, "draft");
assert.equal(draft.publicEligible, false);
assert.equal(validateCandidate(draft.id).ok, true);
assert.equal(validateCandidate(draft.id).ok, true);
assert.equal(getCandidatePublicEligibility(draft.id), false);
assert.throws(() => approveCandidate(draft.id, "Shahzeb"));
const review = markCandidateForReview(draft.id, "Shahzeb");
assert.equal(review.status, "review-required");
const approved = approveCandidate(draft.id, "Shahzeb", ["Human reviewer checked the evidence boundary."]);
assert.equal(approved.status, "approved");
assert.equal(getCandidatePublicEligibility(draft.id), true);

const invalid = { ...draft, id: "bad", subject: "invalid", sourceRefs: [], publicEligible: true } as never;
const invalidResult = validatePhysicsRecipeCandidate(invalid);
assert.equal(invalidResult.ok, false);
assert.equal(containsSecret({ note: "OPENAI_API_KEY=secret" }), true);
assert.ok(validateResearchSource({ id: "s", title: "Source", url: "https://example.org", publisher: "Institution", sourceType: "institution", accessedAt: new Date().toISOString(), claims: ["Claim"], limitations: ["Limitation"] }).length === 0);

const rejected = base();
assert.equal(validateCandidate(rejected.id).ok, true);
markCandidateForReview(rejected.id, "Shahzeb");
assert.equal(rejectCandidate(rejected.id, "Shahzeb", ["Needs more primary evidence."]).status, "rejected");
assert.equal(getCandidatePublicEligibility(rejected.id), false);

const handoff = { handoffVersion: "1.0" as const, researchQuestion: "How does flux change affect induced voltage?", subject: "electromagnetic-induction" as const, proposedMechanism: "Faraday's law", sourceRefs: ["https://example.org/physics"], uncertaintyNotes: ["Idealized model."], misconceptionRisks: ["Flux is not the same as field strength."], candidate: { ...base(), status: "draft" as const, publicEligible: false } };
assert.equal(validateAgiOsPhysicsHandoff(handoff).ok, true);
assert.equal(handoffToDraftCandidate(handoff).status, "draft");
assert.equal(validateAgiOsPhysicsHandoff({ ...handoff, candidate: { ...handoff.candidate, publicEligible: true } }).ok, false);
assert.equal(serializeAgiOsPhysicsHandoff(handoff), serializeAgiOsPhysicsHandoff({ ...handoff, candidate: { ...handoff.candidate } }));
console.log("Research pipeline tests passed.");
