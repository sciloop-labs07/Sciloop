import { NextRequest, NextResponse } from "next/server";

const DEFAULT_AI_BACKEND_URL = "http://localhost:5050";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

function getAiBackendUrl() {
  return (process.env.SCILOOP_AI_BACKEND_URL || DEFAULT_AI_BACKEND_URL).replace(/\/+$/, "");
}

async function proxyToAiBackend(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const targetPath = path.join("/");
  const targetUrl = new URL(`${getAiBackendUrl()}/api/sciloop-ai/${targetPath}`);
  request.nextUrl.searchParams.forEach((value, key) => targetUrl.searchParams.set(key, value));

  try {
    const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
    const response = await fetch(targetUrl, {
      method: request.method,
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
        error: "SciLoop AI backend is not reachable from the shared frontend.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyToAiBackend(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyToAiBackend(request, context);
}

