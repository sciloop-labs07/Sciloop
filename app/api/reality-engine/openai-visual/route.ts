import { NextRequest, NextResponse } from "next/server";

const DEFAULT_BACKEND_URL = process.env.SCILOOP_AI_BACKEND_URL || "http://localhost:5050";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${DEFAULT_BACKEND_URL.replace(/\/+$/, "")}/api/reality-engine/openai-visual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json().catch(() => ({
      ok: false,
      error: "SciLoop backend returned a non-JSON response."
    }));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: "SciLoop OpenAI visual proxy failed.",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
