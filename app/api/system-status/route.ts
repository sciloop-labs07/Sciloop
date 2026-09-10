import { NextResponse } from "next/server";

const DEFAULT_AI_BACKEND_URL = "http://localhost:5050";

async function checkJson(url: string, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
    const text = await response.text();
    let body: unknown = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text.slice(0, 240);
    }
    return {
      ok: response.ok,
      status: response.status,
      body,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const aiBase = (process.env.SCILOOP_AI_BACKEND_URL || DEFAULT_AI_BACKEND_URL).replace(/\/+$/, "");
  const aiBackend = await checkJson(`${aiBase}/health`);

  const coreFallbackAvailable = !process.env.SCILOOP_AI_BACKEND_URL;
  const coreExperienceReady = aiBackend.ok || coreFallbackAvailable;

  return NextResponse.json({
    ok: coreExperienceReady,
    servicesOk: aiBackend.ok,
    degraded: !aiBackend.ok,
    service: "SciLoop Launch Status",
    frontend: {
      ok: true,
      mode: process.env.NODE_ENV || "development",
    },
    aiBackend,
    legacyAdmin: {
      exposed: false,
      status: "quarantined",
      message: "ForLoop is local/admin migration tooling and is not required by the public product.",
    },
    launchRoutes: {
      overview: "/",
      liveSignals: "/sciloop/live",
      legacyFallback: "/sciloop-live",
      visualLanguageLab: "/visual-language-lab",
      aiProxy: "/api/sciloop-ai-proxy",
    },
    checkedAt: new Date().toISOString(),
  }, {
    status: coreExperienceReady ? 200 : 503,
  });
}
