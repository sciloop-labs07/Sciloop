import { NextRequest, NextResponse } from "next/server";
import { innovations } from "@/data/innovations";

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
  const requestBody = ["GET", "HEAD"].includes(request.method) ? null : await request.text();

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        "content-type": request.headers.get("content-type") || "application/json",
      },
      body: requestBody || undefined,
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
    if (targetPath === "news" && request.method === "GET") {
      return NextResponse.json({
        ok: true,
        topic: request.nextUrl.searchParams.get("topic") || "science",
        count: innovations.length,
        articles: innovations.map((innovation) => ({
          title: innovation.title,
          summary: innovation.summary,
          source: innovation.source,
          subject: innovation.field,
          category: "Live innovation",
          slug: innovation.slug,
          publishedAt: innovation.date,
        })),
        cached: true,
        stale: false,
        fallback: true,
        providersUsed: ["SciLoop curated fallback"],
        warnings: ["Live AI/news backend is not configured; showing curated launch signals."],
      });
    }
    if (targetPath === "explain" && request.method === "POST") {
      let body: { news?: { title?: string; summary?: string; source?: string } } = {};
      try { body = requestBody ? JSON.parse(requestBody) : {}; } catch { body = {}; }
      const article = body.news || {};
      const title = article.title || "this innovation";
      const summary = article.summary || "The source describes a scientific or technical development.";
      return NextResponse.json({
        explanation: `SIMPLE MEANING\n${summary}\n\nSTORYLINE\nProblem: Researchers are trying to understand or improve ${title}.\nBreakthrough: The reported work adds evidence, a method, or a new capability.\nHow it works: The mechanism should be checked against the original source and research paper.\nImpact: If validated, it may change what is possible in its field.\n\nCORE SCIENCE\nThis is a local SciLoop explanation while the live provider is unavailable.\n\nFUTURE POSSIBILITY\nThe next useful step is to compare the claim with related work and explore a visual model.`,
        providerUsed: "SciLoop local fallback",
        fallback: true,
        cached: false,
        warnings: ["Live AI backend is not configured; this explanation is a transparent local fallback."],
      });
    }
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
