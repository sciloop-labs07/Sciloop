import { NextRequest, NextResponse } from "next/server";

const DEFAULT_AI_BACKEND_URL = "http://localhost:5050";

function getAiBackendUrl() {
  return (process.env.SCILOOP_AI_BACKEND_URL || DEFAULT_AI_BACKEND_URL).replace(/\/+$/, "");
}

async function proxyRealityEngineGenerate(request: NextRequest) {
  const targetUrl = new URL(`${getAiBackendUrl()}/api/reality-engine/generate`);

  try {
    const body = await request.text();
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "content-type": request.headers.get("content-type") || "application/json",
      },
      body,
      cache: "no-store",
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "SciLoop Reality Engine backend is not reachable.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  return proxyRealityEngineGenerate(request);
}
