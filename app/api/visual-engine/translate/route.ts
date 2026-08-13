import { NextResponse } from "next/server";

import { forloopVisualApiProvider } from "@/src/visual-engine/api/forloopApiAdapter";
import type { VisualApiInput } from "@/src/visual-engine/api/visualApi.types";

export async function GET() {
  const status = await forloopVisualApiProvider.available();
  return NextResponse.json({ ok: status.status === "available", status });
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as VisualApiInput;
    if (!body?.rawText || typeof body.rawText !== "string") {
      return NextResponse.json({ ok: false, error: "rawText is required." }, { status: 400 });
    }
    return NextResponse.json(await forloopVisualApiProvider.generateVisualRecipe(body));
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown visual translation error.",
    }, { status: 500 });
  }
}
