import { NextRequest, NextResponse } from "next/server";
import { innovations } from "@/data/innovations";

const DEFAULT_AI_BACKEND_URL = "http://localhost:5050";
const PUBLIC_BACKEND_TIMEOUT_MS = 6000;

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
  const backendPath = targetPath === "health"
    ? "/health"
    : targetPath === "providers"
      ? "/api/providers"
      : `/api/sciloop-ai/${targetPath}`;
  const targetUrl = new URL(`${getAiBackendUrl()}${backendPath}`);
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
      signal: AbortSignal.timeout(PUBLIC_BACKEND_TIMEOUT_MS),
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
    if (targetPath === "simulate" && request.method === "POST") {
      let body: { article?: { title?: string; summary?: string } } = {};
      try { body = requestBody ? JSON.parse(requestBody) : {}; } catch { body = {}; }
      const article = body.article || {};
      const title = article.title || "this innovation";
      const summary = article.summary || "The source describes a scientific or technical development.";
      return NextResponse.json({
        ok: true,
        simulationTitle: `Local possibility model: ${title}`,
        whyHumansNeededThis: `People needed a clearer way to understand the problem behind ${title}.`,
        evolutionStoryline: [
          "Problem: A real constraint or unanswered question appears.",
          "Observation: Researchers collect evidence about how the system behaves.",
          "Experiment: A new method tests the most useful mechanism.",
          "Breakthrough: The mechanism becomes easier to inspect and compare.",
          "Application: The result can guide the next validated experiment."
        ],
        humanPossibility: `A cautious next possibility is to test the mechanism described by ${title}.`,
        realWorldImpact: summary,
        futurePossibility: "Possible future only: further evidence could turn this mechanism into a practical tool.",
        visualSimulationBlueprint: {
          scene: "problem -> evidence -> mechanism -> possible application",
          objects: ["problem", "evidence", "mechanism", "application"],
          motion: "A muted pulse moves from the observed problem toward the tested mechanism.",
          labels: ["Problem", "Evidence", "Experiment", "Future"],
          interaction: "Inspect one stage at a time.",
          colorEffectIdea: "Use the existing SciLoop accent palette with one active stage at a time."
        },
        providerUsed: "SciLoop local fallback",
        fallback: true,
        cached: false,
        warnings: ["The live AI provider exceeded the public response budget; this transparent local model is shown instead."]
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
