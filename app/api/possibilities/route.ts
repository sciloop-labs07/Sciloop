import { NextResponse } from "next/server";

import { runPossibilityAiPipeline, type PossibilityLens } from "@/src/possibilities";

const LENSES = new Set<PossibilityLens>([
  "scientific",
  "technical",
  "economic",
  "social",
  "environmental",
  "governance",
]);

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { brief?: unknown; lens?: unknown; includeVisual?: unknown; requireAiPreparation?: unknown };
    const lens = typeof body.lens === "string" && LENSES.has(body.lens as PossibilityLens)
      ? body.lens as PossibilityLens
      : "scientific";
    const result = await runPossibilityAiPipeline(body.brief, {
      lens,
      includeVisual: body.includeVisual !== false,
      requireAiPreparation: body.requireAiPreparation !== false,
    });
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Possibility pipeline failed.",
    }, { status: 400 });
  }
}
