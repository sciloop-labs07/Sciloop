import { NextResponse } from "next/server";

import { getInnovation } from "@/data/innovations";
import { compilePredictiveVisualPackage, validatePredictiveVisualPackage, validateVisualRecipe } from "@/src/visual-engine/foundation";
import { evidenceBriefFromInnovation, predictiveVisualPackageFromPossibilityResult, runPossibilityPipeline } from "@/src/possibilities";

export const dynamic = "force-dynamic";

/**
 * Controlled canary endpoint. It accepts a curated local slug only and uses
 * the deterministic pipeline, never an external model provider or AGI OS.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json() as { slug?: unknown };
    if (typeof body.slug !== "string" || !body.slug.trim()) {
      return NextResponse.json({ ok: false, error: "A curated innovation slug is required." }, { status: 400 });
    }

    const innovation = getInnovation(body.slug);
    if (!innovation) {
      return NextResponse.json({ ok: false, error: "Innovation not found." }, { status: 404 });
    }

    const result = runPossibilityPipeline(evidenceBriefFromInnovation(innovation), {
      lens: "scientific",
      includeVisual: true,
    });
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: "The deterministic possibility pipeline did not return a valid result.", issues: result.issues }, { status: 422 });
    }

    const packageResult = predictiveVisualPackageFromPossibilityResult(result);
    const packageValidation = validatePredictiveVisualPackage(packageResult);
    if (!packageValidation.ok) {
      return NextResponse.json({ ok: false, error: "The predictive visual package failed validation.", issues: packageValidation.issues }, { status: 422 });
    }

    const recipe = compilePredictiveVisualPackage(packageResult);
    const recipeValidation = validateVisualRecipe(recipe);
    if (!recipeValidation.ok) {
      return NextResponse.json({ ok: false, error: "The visual recipe failed validation.", issues: recipeValidation.errors }, { status: 422 });
    }

    return NextResponse.json({
      ok: true,
      package: packageResult,
      recipe,
      warnings: ["Deterministic, evidence-linked model. Conditional scenarios are not guaranteed predictions."],
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Predictive visual generation failed.",
    }, { status: 400 });
  }
}
