import { NextResponse } from "next/server";

import {
  createWorkflowPlan,
  evaluateWorkflowPlan,
  interpretRequirement,
  kernelCapabilities,
  proposeKernelEvolution,
  type KernelPlanResponse,
} from "@/src/kernel";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, capabilities: kernelCapabilities });
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { input?: unknown };
    if (typeof body.input !== "string" || body.input.trim().length < 3) {
      return NextResponse.json({ ok: false, error: "input must be a meaningful string." }, { status: 400 });
    }
    const requirement = interpretRequirement(body.input);
    const plan = createWorkflowPlan(requirement);
    const evaluation = evaluateWorkflowPlan(requirement, plan);
    const response: KernelPlanResponse = {
      ok: true,
      requirement,
      plan,
      evaluation,
      evolution: proposeKernelEvolution(requirement, plan, evaluation),
      availableCapabilities: kernelCapabilities,
    };
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Kernel planning failed.",
    }, { status: 500 });
  }
}
