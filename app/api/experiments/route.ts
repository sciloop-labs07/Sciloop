import { NextResponse } from "next/server";
import { listExperimentDefinitions } from "@/src/kernel/experiments";

export async function GET() {
  return NextResponse.json({ experiments: listExperimentDefinitions() });
}
