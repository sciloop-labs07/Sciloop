import { NextRequest, NextResponse } from "next/server";

const DEFAULT_FORLOOP_BACKEND_URL = "http://localhost:3001";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

function getForLoopBackendUrl() {
  return (process.env.FORLOOP_BACKEND_URL || DEFAULT_FORLOOP_BACKEND_URL).replace(/\/+$/, "");
}

function getForLoopWorkflowAccessCode() {
  if (process.env.FORLOOP_WORKFLOW_ACCESS_CODE) return process.env.FORLOOP_WORKFLOW_ACCESS_CODE.trim();
  if (process.env.FORLOOP_DEV_ACCESS_CODE) return process.env.FORLOOP_DEV_ACCESS_CODE.trim();
  return process.env.NODE_ENV === "production" ? "" : "123456";
}

async function proxyToForLoop(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const targetPath = path.join("/");
  const targetUrl = new URL(`${getForLoopBackendUrl()}/api/admin/${targetPath}`);
  request.nextUrl.searchParams.forEach((value, key) => targetUrl.searchParams.set(key, value));

  try {
    const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
    const accessCode = getForLoopWorkflowAccessCode();
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        "content-type": request.headers.get("content-type") || "application/json",
        ...(accessCode ? { "X-ForLoop-Access-Code": accessCode } : {}),
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
        error: "ForLoop backend is not reachable from the shared frontend.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyToForLoop(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyToForLoop(request, context);
}
