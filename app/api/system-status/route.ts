import { NextResponse } from "next/server";

const DEFAULT_AI_BACKEND_URL = "http://localhost:5050";
const DEFAULT_FORLOOP_BACKEND_URL = "http://localhost:3001";

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
  const forLoopBase = (process.env.FORLOOP_BACKEND_URL || DEFAULT_FORLOOP_BACKEND_URL).replace(/\/+$/, "");
  const [aiBackend, forLoopBackend] = await Promise.all([
    checkJson(`${aiBase}/health`),
    checkJson(`${forLoopBase}/api/health`),
  ]);

  const coreFallbackAvailable = !process.env.SCILOOP_AI_BACKEND_URL;
  const servicesOk = aiBackend.ok && forLoopBackend.ok;
  const coreExperienceReady = aiBackend.ok || coreFallbackAvailable;

  return NextResponse.json({
    ok: coreExperienceReady,
    servicesOk,
    degraded: !servicesOk,
    service: "SciLoop Launch Status",
    frontend: {
      ok: true,
      mode: process.env.NODE_ENV || "development",
    },
    aiBackend,
    forLoopBackend,
    launchRoutes: {
      sciloopLive: "/sciloop-live",
      visualLanguageLab: "/visual-language-lab",
      aiProxy: "/api/sciloop-ai-proxy",
      forLoopProxy: "/api/forloop-proxy",
    },
    checkedAt: new Date().toISOString(),
  }, {
    status: coreExperienceReady ? 200 : 503,
  });
}
