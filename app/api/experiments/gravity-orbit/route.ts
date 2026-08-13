import { NextResponse } from "next/server";
import { evaluateGravityRun } from "@/src/kernel/cognitive-experiment";
import { getExperimentDefinition, runGravityOrbitExperiment } from "@/src/kernel/experiments";

export async function GET() {
  return NextResponse.json({ experiment: getExperimentDefinition() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const run = runGravityOrbitExperiment(body?.variables ?? body);
    return NextResponse.json({ run, cognitive: evaluateGravityRun(run) });
  } catch {
    return NextResponse.json({ error: "Unable to run gravity experiment." }, { status: 400 });
  }
}
