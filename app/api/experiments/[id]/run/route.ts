import { NextResponse } from "next/server";
import { evaluateExperimentRun } from "@/src/kernel/cognitive-experiment";
import { runExperiment } from "@/src/kernel/experiments";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const run = runExperiment(id, body?.variables ?? body);
  if (!run) return NextResponse.json({ error: "Experiment not found." }, { status: 404 });
  return NextResponse.json({ run, cognitive: evaluateExperimentRun(run) });
}
