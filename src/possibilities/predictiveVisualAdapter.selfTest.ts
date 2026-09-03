import { getInnovation } from "@/data/innovations";
import { compilePredictiveVisualPackage, validatePredictiveVisualPackage, validateVisualRecipe } from "@/src/visual-engine/foundation";

import { evidenceBriefFromInnovation } from "./innovationAdapter";
import { runPossibilityPipeline } from "./pipeline";
import { predictiveVisualPackageFromPossibilityResult } from "./predictiveVisualAdapter";

/** Internal contract checks for projects that do not yet have a test runner. */
export function runPredictiveVisualAdapterSelfTest() {
  const innovation = getInnovation("google-quantum-chip");
  if (!innovation) return { ok: false, checks: [{ name: "quantum fixture", passed: false, message: "Quantum canary fixture is missing." }] };
  const result = runPossibilityPipeline(evidenceBriefFromInnovation(innovation), { includeVisual: true });
  if (!result.ok) return { ok: false, checks: [{ name: "deterministic pipeline", passed: false, message: "Quantum canary pipeline did not return a validated result." }] };

  const pkg = predictiveVisualPackageFromPossibilityResult(result, "2026-01-01T00:00:00.000Z");
  const recipe = compilePredictiveVisualPackage(pkg);
  const brokenEvidence = { ...pkg, nodes: [{ ...pkg.nodes[0], certainty: "known" as const, evidenceIds: ["missing-evidence"] }, ...pkg.nodes.slice(1)] };
  const brokenEdge = { ...pkg, edges: [{ ...pkg.edges[0], from: "missing-node" }, ...pkg.edges.slice(1)] };
  const invalidUnknown = { ...pkg, nodes: [...pkg.nodes, { id: "invalid-unknown", label: "Invalid", description: "Invalid unknown test node.", kind: "unknown" as const, certainty: "known" as const, evidenceIds: [] }] };
  const checks = [
    { name: "package validates", passed: validatePredictiveVisualPackage(pkg).ok, message: "Quantum package preserves valid evidence and graph references." },
    { name: "recipe validates", passed: validateVisualRecipe(recipe).ok, message: "The deterministic compiler emits a renderable VisualRecipe." },
    { name: "dangling evidence rejected", passed: !validatePredictiveVisualPackage(brokenEvidence).ok, message: "Unknown evidence IDs are rejected." },
    { name: "missing node rejected", passed: !validatePredictiveVisualPackage(brokenEdge).ok, message: "Edges cannot target missing nodes." },
    { name: "invalid unknown rejected", passed: !validatePredictiveVisualPackage(invalidUnknown).ok, message: "Unknown nodes cannot be rendered as known facts." },
  ];
  return { ok: checks.every((check) => check.passed), checks };
}
