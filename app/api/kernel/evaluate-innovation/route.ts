import { NextResponse } from "next/server";

import { evaluateInnovationSignal, type InnovationSignalInput } from "@/src/kernel";

export async function POST(request: Request) {
  try {
    const body = await request.json() as InnovationSignalInput;
    if (!body || typeof body.title !== "string") {
      return NextResponse.json({ ok: false, error: "title is required." }, { status: 400 });
    }
    return NextResponse.json({ ok: true, evaluation: evaluateInnovationSignal(body) });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Innovation evaluation failed." }, { status: 500 });
  }
}
