import { NextResponse } from "next/server";
import { getExperimentDefinition } from "@/src/kernel/experiments";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const experiment = getExperimentDefinition(id);
  if (!experiment) return NextResponse.json({ error: "Experiment not found." }, { status: 404 });
  return NextResponse.json({ experiment });
}
