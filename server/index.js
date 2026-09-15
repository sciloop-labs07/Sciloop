import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createRuleBasedFallback, explainNewsWithAI } from "./aiProviders.js";
import {
  createMockAIExplanation,
  createNewsDryRun,
  createParsedNewsText,
  createSimulationPlan,
  createStoryPreview,
  validateInputText,
  validateTopic,
} from "./forloopAdmin.js";
import {
  getRuntimeLogs,
  getRuntimeStatus,
  restartRuntimeTarget,
  startRuntimeTarget,
  stopRuntimeTarget,
} from "./forloopRuntime.js";
import {
  assertSciloopAiStartReady,
  checkAllSciloopAiProviders,
  checkSciloopAiProvider,
  getSciloopAiReadiness,
  getSciloopAiStatus,
  saveSciloopAiKeys,
} from "./sciloopAiControl.js";
import {
  getQuantumPossibilitiesStatus,
  runQuantumPossibilitiesWorkflow,
} from "./forloopQuantumWorkflow.js";
import { generateRealityEngine } from "../backend/reality-engine/services/sciloop-analysis.service.js";
import { getUnityBridgeInstructions } from "../backend/reality-engine/unity-bridge/websocket-bridge.service.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || process.env.SCILOOP_BACKEND_PORT || 3001);
const CACHE_DIR = path.join(__dirname, "cache");
const CACHE_FILE = path.join(CACHE_DIR, "news-explanations.json");
const LOG_LIMIT = 200;
const SERVER_STARTED_AT = Date.now();
const DEFAULT_FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const DEFAULT_FORLOOP_ORIGIN = process.env.FORLOOP_ALLOWED_ORIGIN || "http://localhost:3000";
const DEFAULT_FORLOOP_ACCESS_CODE = process.env.FORLOOP_DEV_ACCESS_CODE || "123456";
const DEFAULT_TIMEOUT_MS = Number(process.env.DEFAULT_TIMEOUT_MS || 5000);
const ALLOW_ADMIN_AI_TEST = String(process.env.ALLOW_ADMIN_AI_TEST || "").toLowerCase() === "true";
const ALLOW_ADMIN_NEWS_FETCH = String(process.env.ALLOW_ADMIN_NEWS_FETCH || "").toLowerCase() === "true";
const ALLOW_ADMIN_SIMULATION_AI = String(process.env.ALLOW_ADMIN_SIMULATION_AI || "").toLowerCase() === "true";

const app = express();
const adminLogs = [];
const unityAiScenes = [];
const latestChecks = {
  frontend: null,
  backend: null,
  ai: null,
  news: null,
  simulation: null,
  unityAi: null,
  feedback: null,
};

function nowIso() {
  return new Date().toISOString();
}

function pushAdminLog(level, source, message) {
  adminLogs.unshift({
    level,
    source,
    message,
    timestamp: nowIso(),
  });
  if (adminLogs.length > LOG_LIMIT) {
    adminLogs.length = LOG_LIMIT;
  }
}

function markCheck(key, status, details = {}) {
  latestChecks[key] = {
    status,
    timestamp: nowIso(),
    ...details,
  };
}

function safeJson(res, statusCode, payload) {
  return res.status(statusCode).json(payload);
}

function respondOk(res, data, statusCode = 200) {
  return safeJson(res, statusCode, {
    ok: true,
    data,
    error: null,
  });
}

function respondError(res, statusCode, error) {
  return safeJson(res, statusCode, {
    ok: false,
    data: null,
    error,
  });
}

function normalizeErrorMessage(error) {
  if (!error) return "Unknown error";
  if (typeof error.message === "string" && error.message.trim()) return error.message;
  return String(error);
}

function runtimeConfig() {
  return {
    projectRoot: PROJECT_ROOT,
    backendPort: PORT,
  };
}

function hasRuntimeAccess(req) {
  const code = typeof req.get("X-ForLoop-Access-Code") === "string" ? req.get("X-ForLoop-Access-Code").trim() : "";
  return Boolean(code) && code === DEFAULT_FORLOOP_ACCESS_CODE;
}

function sciloopAiBackendBase() {
  return (process.env.SCILOOP_AI_BACKEND_URL || "http://localhost:5050").replace(/\/+$/, "");
}

async function probeRealityEngine(timeoutMs = 2500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${sciloopAiBackendBase()}/api/reality-engine/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        title: "ForLoop Unity AI bridge probe",
        summary: "A short local readiness probe for SciLoop quantum possibility simulations.",
        field: "Applied Reality",
      }),
    });
    const data = await response.json().catch(() => null);
    return {
      reachable: response.ok,
      statusCode: response.status,
      ok: response.ok && data?.ok === true,
      engineVersion: data?.engineVersion || null,
      timelineCount: Array.isArray(data?.timeline) ? data.timeline.length : 0,
      branchCount: Array.isArray(data?.analysis?.future_branches) ? data.analysis.future_branches.length : 0,
      error: response.ok ? null : data?.error || response.statusText,
    };
  } catch (error) {
    return {
      reachable: false,
      statusCode: null,
      ok: false,
      engineVersion: null,
      timelineCount: 0,
      branchCount: 0,
      error: error?.name === "AbortError" ? "timeout" : normalizeErrorMessage(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function buildUnityAiStatus() {
  const unityProjectPath = path.join(PROJECT_ROOT, "SciLoopQuantumPossibilities");
  const scriptsPath = path.join(unityProjectPath, "Assets", "Scripts", "RealityEngine");
  const probe = await probeRealityEngine();
  const status = probe.ok ? "ready" : "offline";
  markCheck("unityAi", status, { probe });
  return {
    status,
    message: probe.ok
      ? "Reality Engine is reachable. News cards can generate Unity-ready possibility bundles."
      : `Reality Engine is not reachable yet: ${probe.error || "unknown error"}.`,
    sciloopAiBackendUrl: sciloopAiBackendBase(),
    endpoint: `${sciloopAiBackendBase()}/api/reality-engine/generate`,
    unityProject: {
      path: unityProjectPath,
      exists: existsSync(unityProjectPath),
      scriptsExist: existsSync(scriptsPath),
      webglBuildExpected: "SciLoopQuantumPossibilities/Build",
    },
    bridge: getUnityBridgeInstructions(),
    latestScene: unityAiScenes[0] || null,
    recentScenes: unityAiScenes.slice(0, 8),
    probe,
    lastChecked: nowIso(),
  };
}

function parseAllowedOrigins() {
  const configured = [DEFAULT_FRONTEND_ORIGIN, DEFAULT_FORLOOP_ORIGIN]
    .flatMap((value) => String(value || "").split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  const localDefaults = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "null",
  ];

  return Array.from(new Set([...configured, ...localDefaults]));
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const allowedOrigins = parseAllowedOrigins();
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by local admin CORS policy"));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use("/forloop-control-panel", express.static(path.join(PROJECT_ROOT, "public", "forloop-control-panel")));
app.get("/forloop-control-panel.html", (_req, res) => {
  res.sendFile(path.join(PROJECT_ROOT, "public", "forloop-control-panel.html"));
});
app.get("/sciloop-live-file", (_req, res) => {
  res.sendFile(path.join(PROJECT_ROOT, "SciLoop - Live Scientific Discoveries 80.html"));
});
app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError) {
    return respondError(res, 400, "invalid JSON body");
  }
  return next(error);
});

async function ensureCacheFile() {
  await mkdir(CACHE_DIR, { recursive: true });
  if (!existsSync(CACHE_FILE)) {
    await writeFile(CACHE_FILE, "{}\n", "utf8");
  }
}

async function readCache() {
  await ensureCacheFile();
  try {
    const raw = await readFile(CACHE_FILE, "utf8");
    return raw.trim() ? JSON.parse(raw) : {};
  } catch (error) {
    console.log(`[cache] reset invalid cache: ${error.message}`);
    await writeFile(CACHE_FILE, "{}\n", "utf8");
    return {};
  }
}

async function writeCache(cache) {
  await ensureCacheFile();
  await writeFile(CACHE_FILE, `${JSON.stringify(cache, null, 2)}\n`, "utf8");
}

function hashNews(news = {}) {
  const seed = `${news.title || ""}|${news.summary || ""}|${news.url || ""}`.toLowerCase();
  return crypto.createHash("sha256").update(seed).digest("hex");
}

function normalizeNewsInput(input = {}) {
  return {
    title: typeof input.title === "string" ? input.title.trim() : "",
    summary: typeof input.summary === "string" ? input.summary.trim() : "",
    url: typeof input.url === "string" ? input.url.trim() : "",
    source: typeof input.source === "string" ? input.source.trim() : "",
    publishedAt: typeof input.publishedAt === "string" ? input.publishedAt.trim() : "",
  };
}

async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function getProviderConfiguration() {
  const provider = String(process.env.AI_PROVIDER || "auto").trim().toLowerCase();

  if (provider === "openrouter") {
    return {
      provider: "openrouter",
      configured: Boolean(process.env.OPENROUTER_API_KEY?.trim()),
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      missingKeyName: "OPENROUTER_API_KEY",
    };
  }

  if (provider === "groq") {
    return {
      provider: "groq",
      configured: Boolean(process.env.GROQ_API_KEY?.trim()),
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      missingKeyName: "GROQ_API_KEY",
    };
  }

  if (provider === "huggingface") {
    return {
      provider: "huggingface",
      configured: Boolean(process.env.HUGGINGFACE_API_KEY?.trim()),
      model: process.env.HUGGINGFACE_MODEL || "not configured",
      missingKeyName: "HUGGINGFACE_API_KEY",
    };
  }

  if (provider === "gemini") {
    return {
      provider: "gemini",
      configured: Boolean(process.env.GEMINI_API_KEY?.trim()),
      model: process.env.GEMINI_MODEL || "gemini-flash-latest",
      missingKeyName: "GEMINI_API_KEY",
    };
  }

  if (provider === "ollama") {
    return {
      provider: "ollama",
      configured: true,
      model: process.env.OLLAMA_MODEL || "llama3.1",
      missingKeyName: null,
    };
  }

  const autoProviders = [
    {
      provider: "openrouter",
      configured: Boolean(process.env.OPENROUTER_API_KEY?.trim()),
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      missingKeyName: "OPENROUTER_API_KEY",
    },
    {
      provider: "groq",
      configured: Boolean(process.env.GROQ_API_KEY?.trim()),
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      missingKeyName: "GROQ_API_KEY",
    },
    {
      provider: "ollama",
      configured: true,
      model: process.env.OLLAMA_MODEL || "llama3.1",
      missingKeyName: null,
    },
  ];

  const active = autoProviders.find((item) => item.configured) || autoProviders[0];
  return {
    ...active,
    provider: `auto:${active.provider}`,
  };
}

function buildAIStatus() {
  const config = getProviderConfiguration();
  const configured = Boolean(config.configured);
  const status = configured ? "ready" : "missing_key";
  const message = configured
    ? "Provider configuration detected. No external AI test call was made."
    : `${config.missingKeyName} is not configured.`;

  return {
    provider: config.provider,
    configured,
    status,
    model: config.model,
    testMode: ALLOW_ADMIN_AI_TEST ? "manual_only_enabled" : "manual_only_disabled",
    message,
    lastChecked: nowIso(),
  };
}

async function buildFrontendStatus() {
  const frontendUrl = DEFAULT_FRONTEND_ORIGIN;
  try {
    const response = await fetchWithTimeout(frontendUrl, { method: "GET" }, 2500);
    const status = response.ok ? "online" : "offline";
    markCheck("frontend", status, { target: frontendUrl });
    return {
      id: "frontend",
      name: "SciLoop Frontend",
      status,
      purpose: "User-facing portal interface",
      lastChecked: latestChecks.frontend?.timestamp || nowIso(),
      risk: "low",
      target: frontendUrl,
    };
  } catch (error) {
    markCheck("frontend", "offline", { target: frontendUrl });
    return {
      id: "frontend",
      name: "SciLoop Frontend",
      status: "offline",
      purpose: "User-facing portal interface",
      lastChecked: latestChecks.frontend?.timestamp || nowIso(),
      risk: "low",
      target: frontendUrl,
      note: normalizeErrorMessage(error),
    };
  }
}

function buildBackendHealthPayload() {
  const aiStatus = buildAIStatus();
  const newsMode = String(process.env.NEWS_ENGINE_MODE || "manual").toLowerCase();
  const simulationMode = String(process.env.SIMULATION_ENGINE_MODE || "local").toLowerCase();

  return {
    status: "ok",
    service: "sciloop-backend",
    mode: process.env.FORLOOP_ADMIN_MODE || "local",
    timestamp: nowIso(),
    uptimeSeconds: Math.floor((Date.now() - SERVER_STARTED_AT) / 1000),
    version: process.env.npm_package_version || "dev",
    checks: {
      server: "ok",
      environment: "ok",
      aiProvider: aiStatus.status === "ready" ? "ready" : "standby",
      newsEngine: newsMode === "live" || newsMode === "scheduled" ? "ready" : "standby",
      simulationEngine: simulationMode === "local" ? "local" : "standby",
      visualLanguageEngine: "local",
      feedbackStore: "local",
    },
  };
}

function buildNewsStatus() {
  const mode = String(process.env.NEWS_ENGINE_MODE || "manual").toLowerCase();
  const sources = [
    process.env.NEWSAPI_KEY,
    process.env.GNEWS_API_KEY,
    process.env.GUARDIAN_API_KEY,
    process.env.NYT_API_KEY,
    process.env.MEDIASTACK_API_KEY,
    process.env.NASA_API_KEY,
  ].filter((value) => typeof value === "string" && value.trim()).length;

  return {
    status: sources > 0 ? "ready" : "standby",
    mode,
    sourcesConfigured: sources,
    lastFetch: null,
    queueSize: 0,
    message: "News engine status only. No fetch performed.",
    lastChecked: nowIso(),
  };
}

function buildSimulationStatus() {
  return {
    status: String(process.env.SIMULATION_ENGINE_MODE || "local").toLowerCase() === "local" ? "local" : "standby",
    mode: String(process.env.SIMULATION_ENGINE_MODE || "local").toLowerCase(),
    templates: ["physics", "biology", "chemistry", "cosmic", "mini-experiment"],
    queueSize: 0,
    message: "Simulation control is in local template mode.",
    lastChecked: nowIso(),
  };
}

function detectVisualLanguageDemo(input) {
  const text = String(input || "").toLowerCase();
  if (/gravity|mass|attract|trajectory|orbit|spacetime|bend/.test(text)) return "gravity-well";
  if (/sun|plant|photo|leaf|glucose|oxygen|water|co2|energy flows/.test(text)) return "photosynthesis";
  if (/neuron|signal|learn|weight|prediction|error|backprop|network/.test(text)) return "neural-learning";
  if (/money|inflation|price|purchasing|goods|economic|supply/.test(text)) return "economic-inflation";
  if (/feedback/.test(text)) return "feedback-loop";
  if (/entropy|disorder/.test(text)) return "entropy-spread";
  if (/constraint|block|barrier/.test(text)) return "constraint-flow";
  return "generic-node-flow";
}

function buildVisualLanguageStatus() {
  return {
    status: "local",
    mode: "browser-native-semantic-simulation",
    version: "0.1",
    backendRole: "status, planning, and ForLoop control bridge",
    frontendRole: "canvas runtime, semantic parser, variables, hover, drag, and animation",
    demos: ["gravity-well", "photosynthesis", "neural-learning", "economic-inflation"],
    primitives: [
      "node",
      "edge",
      "field",
      "flow",
      "particle_stream",
      "pulse",
      "constraint",
      "feedback",
      "state_morph",
    ],
    message: "Visual Language Engine runs locally in the browser. ForLoop backend receives compact visual plans and returns admin planning metadata.",
    lastChecked: nowIso(),
  };
}

function buildFeedbackStatus() {
  return {
    status: "local_only",
    message: "Feedback is currently stored client-side. Backend feedback store not connected yet.",
    knownCount: 0,
    lastChecked: nowIso(),
  };
}

async function buildServicesStatus() {
  const frontendService = await buildFrontendStatus();
  const aiStatus = buildAIStatus();
  const newsStatus = buildNewsStatus();
  const simulationStatus = buildSimulationStatus();
  const visualLanguageStatus = buildVisualLanguageStatus();

  return [
    frontendService,
    {
      id: "backend",
      name: "Backend API",
      status: "online",
      purpose: "API layer for AI/news/simulation/feedback",
      lastChecked: nowIso(),
      risk: "medium",
    },
    {
      id: "ai",
      name: "AI Story Engine",
      status: aiStatus.status,
      purpose: "Convert complex discovery news into simple explanation",
      lastChecked: aiStatus.lastChecked,
      risk: "medium",
    },
    {
      id: "news",
      name: "News Engine",
      status: newsStatus.status,
      purpose: "Fetch and prepare live science or innovation signals",
      lastChecked: newsStatus.lastChecked,
      risk: "medium",
    },
    {
      id: "simulation",
      name: "Simulation Engine",
      status: simulationStatus.status,
      purpose: "Prepare visual simulation prompts and templates",
      lastChecked: simulationStatus.lastChecked,
      risk: "high",
    },
    {
      id: "visual-language",
      name: "Visual Language Engine",
      status: visualLanguageStatus.status,
      purpose: "Convert concepts into browser-native causal semantic simulations",
      lastChecked: visualLanguageStatus.lastChecked,
      risk: "medium",
    },
    {
      id: "feedback",
      name: "Feedback Collector",
      status: "local_only",
      purpose: "Track user feedback readiness and future backend storage",
      lastChecked: nowIso(),
      risk: "medium",
    },
  ];
}

function mapExplanationToTestResult({ input, style, provider, explanation, mode }) {
  return {
    mode,
    provider,
    style,
    inputChars: input.length,
    output: {
      title: `${style.replace(/_/g, " ")} explanation`.replace(/\b\w/g, (char) => char.toUpperCase()),
      summary: explanation.simpleExplanation,
      keyPoints: [
        explanation.storyline.problem,
        explanation.storyline.breakthrough,
        explanation.storyline.impact,
      ],
      whyItMatters: explanation.oneLineForStudent,
      limitations: mode === "live"
        ? "Manual developer test only. No automatic publishing was performed."
        : "Mock mode only. No real AI call was made.",
    },
    timestamp: nowIso(),
  };
}

function mapExplanationToStoryPreview({ explanation, format, mode }) {
  return {
    mode,
    story: {
      title: "Discovery Story Preview",
      hook: explanation.simpleExplanation,
      timeline: explanation.timeline.map((item) => ({
        step: item.year,
        text: item.event,
      })),
      formatLabel: format,
      peopleOrTeams: explanation.peopleOrLabs,
      breakthroughMechanism: explanation.storyline.howItWorks,
      impact: explanation.storyline.impact,
      visualSimulationIdea: `Visualize ${explanation.field} using ${explanation.visualSymbols.join(" ")}.`,
      emojiLine: explanation.visualSymbols.join(" -> "),
    },
  };
}

async function createLiveExplanationPayload({ input, style }) {
  const explanation = await explainNewsWithAI({
    title: input.slice(0, 160),
    summary: input,
    source: "ForLoop Developer Test",
    publishedAt: nowIso(),
    url: "",
  });
  return mapExplanationToTestResult({
    input,
    style,
    provider: explanation.providerUsed,
    explanation: explanation.data,
    mode: explanation.providerUsed === "fallback" ? "fallback" : "live",
  });
}

async function createLiveStoryPayload({ input, format }) {
  const explanation = await explainNewsWithAI({
    title: input.slice(0, 160),
    summary: input,
    source: "ForLoop Story Preview",
    publishedAt: nowIso(),
    url: "",
  });
  return mapExplanationToStoryPreview({
    explanation: explanation.data,
    format,
    mode: explanation.providerUsed === "fallback" ? "fallback" : "live",
  });
}

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "SciLoop News Explanation API",
    endpoint: "/api/explain-news",
  });
});

app.get("/api/health", (_req, res) => {
  pushAdminLog("info", "system", "Backend health requested.");
  markCheck("backend", "online");
  return respondOk(res, buildBackendHealthPayload());
});

app.get("/api/admin/status", (_req, res) => {
  pushAdminLog("info", "system", "Admin status requested.");
  return respondOk(res, buildBackendHealthPayload());
});

app.get("/api/admin/access-config", (_req, res) => {
  pushAdminLog("info", "system", "Access config requested.");
  return respondOk(res, {
    gateEnabled: true,
    mode: process.env.FORLOOP_ADMIN_MODE || "local",
    message: "Developer access gate enabled.",
  });
});

app.post("/api/admin/verify-access", (req, res) => {
  try {
    const code = typeof req.body?.code === "string" ? req.body.code.trim() : "";
    if (!code) {
      return respondError(res, 400, "Access code is required.");
    }
    return respondOk(res, {
      authorized: code === DEFAULT_FORLOOP_ACCESS_CODE,
    });
  } catch (error) {
    pushAdminLog("error", "system", `Access verification failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Access verification failed safely.");
  }
});

app.get("/api/admin/runtime/status", async (_req, res) => {
  pushAdminLog("info", "runtime", "Runtime status requested.");
  try {
    return respondOk(res, await getRuntimeStatus(runtimeConfig()));
  } catch (error) {
    pushAdminLog("error", "runtime", `Runtime status failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Could not read runtime status.");
  }
});

app.get("/api/admin/runtime/logs", (req, res) => {
  pushAdminLog("info", "runtime", "Runtime logs requested.");
  try {
    const targetId = typeof req.query?.target === "string" && req.query.target.trim() ? req.query.target.trim() : "all";
    return respondOk(res, getRuntimeLogs(targetId));
  } catch (error) {
    pushAdminLog("error", "runtime", `Runtime logs failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Could not read runtime logs.");
  }
});

app.post("/api/admin/runtime/start", async (req, res) => {
  try {
    if (!hasRuntimeAccess(req)) {
      return respondError(res, 403, "Runtime action requires a valid local ForLoop access code.");
    }
    const targetId = typeof req.body?.targetId === "string" ? req.body.targetId.trim() : "";
    if (!targetId) {
      return respondError(res, 400, "targetId is required.");
    }
    pushAdminLog("action", "runtime", `Start requested for ${targetId}.`);
    return respondOk(res, await startRuntimeTarget(runtimeConfig(), targetId));
  } catch (error) {
    pushAdminLog("error", "runtime", `Runtime start failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 400, normalizeErrorMessage(error));
  }
});

app.post("/api/admin/runtime/stop", async (req, res) => {
  try {
    if (!hasRuntimeAccess(req)) {
      return respondError(res, 403, "Runtime action requires a valid local ForLoop access code.");
    }
    const targetId = typeof req.body?.targetId === "string" ? req.body.targetId.trim() : "";
    if (!targetId) {
      return respondError(res, 400, "targetId is required.");
    }
    pushAdminLog("action", "runtime", `Stop requested for ${targetId}.`);
    return respondOk(res, await stopRuntimeTarget(runtimeConfig(), targetId));
  } catch (error) {
    pushAdminLog("error", "runtime", `Runtime stop failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 400, normalizeErrorMessage(error));
  }
});

app.post("/api/admin/runtime/restart", async (req, res) => {
  try {
    if (!hasRuntimeAccess(req)) {
      return respondError(res, 403, "Runtime action requires a valid local ForLoop access code.");
    }
    const targetId = typeof req.body?.targetId === "string" ? req.body.targetId.trim() : "";
    if (!targetId) {
      return respondError(res, 400, "targetId is required.");
    }
    pushAdminLog("action", "runtime", `Restart requested for ${targetId}.`);
    return respondOk(res, await restartRuntimeTarget(runtimeConfig(), targetId));
  } catch (error) {
    pushAdminLog("error", "runtime", `Runtime restart failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 400, normalizeErrorMessage(error));
  }
});

app.get("/api/admin/sciloop-ai/status", async (_req, res) => {
  pushAdminLog("info", "sciloop-ai", "SciLoop AI panel status requested.");
  try {
    return respondOk(res, await getSciloopAiStatus({ projectRoot: PROJECT_ROOT }));
  } catch (error) {
    pushAdminLog("error", "sciloop-ai", `SciLoop AI status failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Could not read SciLoop AI status.");
  }
});

app.get("/api/admin/sciloop-ai/readiness", async (_req, res) => {
  pushAdminLog("info", "sciloop-ai", "SciLoop AI TR readiness requested.");
  try {
    return respondOk(res, await getSciloopAiReadiness({ projectRoot: PROJECT_ROOT }));
  } catch (error) {
    pushAdminLog("error", "sciloop-ai", `SciLoop AI readiness failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Could not read SciLoop AI readiness.");
  }
});

app.post("/api/admin/sciloop-ai/keys", async (req, res) => {
  try {
    if (!hasRuntimeAccess(req)) {
      return respondError(res, 403, "Saving SciLoop AI keys requires a valid local ForLoop access code.");
    }
    pushAdminLog("action", "sciloop-ai", "SciLoop AI keys saved to local backend env.");
    return respondOk(res, await saveSciloopAiKeys({ projectRoot: PROJECT_ROOT, keys: req.body?.keys || {} }));
  } catch (error) {
    pushAdminLog("error", "sciloop-ai", `Saving SciLoop AI keys failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Could not save SciLoop AI keys.");
  }
});

app.post("/api/admin/sciloop-ai/check-provider", async (req, res) => {
  try {
    if (!hasRuntimeAccess(req)) {
      return respondError(res, 403, "Checking SciLoop AI keys requires a valid local ForLoop access code.");
    }
    const providerId = typeof req.body?.providerId === "string" ? req.body.providerId.trim() : "";
    const result = await checkSciloopAiProvider({ projectRoot: PROJECT_ROOT, providerId });
    pushAdminLog("action", "sciloop-ai", `${providerId} check returned ${result.status}.`);
    return respondOk(res, result);
  } catch (error) {
    pushAdminLog("error", "sciloop-ai", `SciLoop AI provider check failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 400, normalizeErrorMessage(error));
  }
});

app.post("/api/admin/sciloop-ai/check-all", async (req, res) => {
  try {
    if (!hasRuntimeAccess(req)) {
      return respondError(res, 403, "Checking SciLoop AI keys requires a valid local ForLoop access code.");
    }
    const result = await checkAllSciloopAiProviders({ projectRoot: PROJECT_ROOT });
    pushAdminLog("action", "sciloop-ai", `SciLoop AI full provider check completed: ${result.status.readyCount}/${result.status.requiredCount}.`);
    return respondOk(res, result);
  } catch (error) {
    pushAdminLog("error", "sciloop-ai", `SciLoop AI full check failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Could not complete SciLoop AI provider checks.");
  }
});

app.get("/api/admin/quantum-possibilities/status", async (_req, res) => {
  pushAdminLog("info", "quantum-possibilities", "Quantum Possibilities ForLoop workflow status requested.");
  try {
    return respondOk(res, await getQuantumPossibilitiesStatus());
  } catch (error) {
    pushAdminLog("error", "quantum-possibilities", `Quantum Possibilities status failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 502, "Could not read Quantum Possibilities workflow status.");
  }
});

app.post("/api/admin/quantum-possibilities/run", async (req, res) => {
  try {
    if (!hasRuntimeAccess(req)) {
      return respondError(res, 403, "Running Quantum Possibilities requires a valid local ForLoop access code.");
    }
    if (!req.body?.brief || typeof req.body.brief !== "object") {
      return respondError(res, 400, "A structured brief is required for the Quantum Possibilities workflow.");
    }

    pushAdminLog("action", "quantum-possibilities", "ForLoop QP workflow started: AI1 preparation, validation, then QP reasoning.");
    const result = await runQuantumPossibilitiesWorkflow(req.body);
    const statusCode = Number(result.statusCode || (result.ok ? 200 : 400));
    pushAdminLog(
      result.ok ? "info" : "warn",
      "quantum-possibilities",
      result.ok
        ? `ForLoop QP workflow completed through ${result.workflow?.mainOriginAttempts?.at(-1)?.origin || "main product"}.`
        : `ForLoop QP workflow stopped safely: ${result.error || "validated result unavailable"}.`,
    );
    return safeJson(res, statusCode, result);
  } catch (error) {
    pushAdminLog("error", "quantum-possibilities", `ForLoop QP workflow failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 502, "ForLoop Quantum Possibilities workflow failed safely.");
  }
});

app.post("/api/admin/sciloop-ai/start-server", async (req, res) => {
  try {
    if (!hasRuntimeAccess(req)) {
      return respondError(res, 403, "Starting SciLoop AI server requires a valid local ForLoop access code.");
    }
    await checkAllSciloopAiProviders({ projectRoot: PROJECT_ROOT });
    await assertSciloopAiStartReady({ projectRoot: PROJECT_ROOT });
    const target = await startRuntimeTarget(runtimeConfig(), "sciloop-ai-backend");
    pushAdminLog("action", "sciloop-ai", "SciLoop AI backend start requested from SciLoop AI Panel.");
    return respondOk(res, {
      target,
      status: await getSciloopAiStatus({ projectRoot: PROJECT_ROOT }),
    });
  } catch (error) {
    pushAdminLog("error", "sciloop-ai", `SciLoop AI backend start failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 400, normalizeErrorMessage(error));
  }
});

app.post("/api/admin/sciloop-ai/start-all", async (req, res) => {
  try {
    if (!hasRuntimeAccess(req)) {
      return respondError(res, 403, "Starting SciLoop requires a valid local ForLoop access code.");
    }
    await checkAllSciloopAiProviders({ projectRoot: PROJECT_ROOT });
    await assertSciloopAiStartReady({ projectRoot: PROJECT_ROOT });
    const target = await startRuntimeTarget(runtimeConfig(), "sciloop-ai-backend");
    pushAdminLog("action", "sciloop-ai", "SciLoop one-click start requested from ForLoop.");

    return respondOk(res, {
      target,
      status: await getSciloopAiStatus({ projectRoot: PROJECT_ROOT }),
      handoff: {
        mode: "live-local",
        frontend: {
          type: "standalone-file",
          file: path.join(PROJECT_ROOT, "SciLoop - Live Scientific Discoveries 80.html"),
        },
        backendUrl: sciloopAiBackendBase(),
        forloopUrl: `http://localhost:${PORT}`,
      },
    });
  } catch (error) {
    pushAdminLog("error", "sciloop-ai", `SciLoop one-click start failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 400, normalizeErrorMessage(error));
  }
});

app.get("/api/admin/unity-ai/status", async (_req, res) => {
  pushAdminLog("info", "unity-ai", "Unity AI bridge status requested.");
  try {
    return respondOk(res, await buildUnityAiStatus());
  } catch (error) {
    pushAdminLog("error", "unity-ai", `Unity AI status failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Could not read Unity AI bridge status.");
  }
});

app.post("/api/admin/unity-ai/generate-test", async (req, res) => {
  pushAdminLog("action", "unity-ai", "Unity AI possibility test requested.");
  try {
    const payload = await generateRealityEngine({
      title: req.body?.title || "ForLoop demo: battery material changes the future",
      summary: req.body?.summary || "A new material may improve energy storage and reduce infrastructure friction.",
      field: req.body?.field || "Energy",
      fullText: req.body?.fullText || "",
    });
    const scene = {
      id: crypto.randomUUID(),
      source: "ForLoop Control Panel",
      article: {
        title: payload.analysis.innovation_name,
        summary: req.body?.summary || "",
        field: payload.analysis.field,
      },
      engineVersion: payload.engineVersion,
      timelineCount: payload.timeline.length,
      branchCount: payload.analysis.future_branches.length,
      unityPromptPreview: payload.unity.before_world_prompt,
      createdAt: nowIso(),
    };
    unityAiScenes.unshift(scene);
    if (unityAiScenes.length > 20) unityAiScenes.length = 20;
    pushAdminLog("info", "unity-ai", `Unity AI test generated: ${scene.article.title}`);
    return respondOk(res, { scene, result: payload, status: await buildUnityAiStatus() });
  } catch (error) {
    pushAdminLog("error", "unity-ai", `Unity AI test failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Unity AI possibility test failed.");
  }
});

app.post("/api/admin/unity-ai/scene", async (req, res) => {
  try {
    const article = req.body?.article || {};
    const result = req.body?.result || req.body?.scene || {};
    const scene = {
      id: crypto.randomUUID(),
      source: req.body?.source || "SciLoop News Portal",
      article: {
        title: String(article.title || result?.analysis?.innovation_name || "Untitled possibility scene").slice(0, 220),
        summary: String(article.summary || "").slice(0, 600),
        field: String(article.subject || article.field || result?.analysis?.field || "Applied Reality").slice(0, 120),
        url: String(article.url || "").slice(0, 500),
      },
      engineVersion: result?.engineVersion || "unknown",
      timelineCount: Array.isArray(result?.timeline) ? result.timeline.length : 0,
      branchCount: Array.isArray(result?.analysis?.future_branches) ? result.analysis.future_branches.length : 0,
      unityPromptPreview: String(result?.unity?.before_world_prompt || "").slice(0, 900),
      hasUnityBundle: Boolean(result?.unity),
      createdAt: nowIso(),
    };
    unityAiScenes.unshift(scene);
    if (unityAiScenes.length > 20) unityAiScenes.length = 20;
    pushAdminLog("action", "unity-ai", `News Portal sent Unity AI scene: ${scene.article.title}`);
    return respondOk(res, { scene, accepted: true });
  } catch (error) {
    pushAdminLog("error", "unity-ai", `Unity AI scene intake failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Could not store Unity AI scene bundle.");
  }
});

app.get("/api/admin/services", async (_req, res) => {
  pushAdminLog("info", "system", "Service registry requested.");
  try {
    return respondOk(res, await buildServicesStatus());
  } catch (error) {
    pushAdminLog("error", "system", `Service registry failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Could not build service registry.");
  }
});

app.get("/api/admin/ai-status", (_req, res) => {
  pushAdminLog("info", "ai", "AI status requested.");
  try {
    const payload = buildAIStatus();
    markCheck("ai", payload.status);
    return respondOk(res, payload);
  } catch (error) {
    pushAdminLog("error", "ai", `AI status failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Could not read AI status.");
  }
});

app.post("/api/admin/ai-test", async (req, res) => {
  pushAdminLog("action", "ai", "Manual AI test requested.");
  if (!ALLOW_ADMIN_AI_TEST) {
    return respondError(res, 403, "AI test disabled. Set ALLOW_ADMIN_AI_TEST=true in local dev only.");
  }

  try {
    const prompt = typeof req.body?.prompt === "string" && req.body.prompt.trim()
      ? req.body.prompt.trim()
      : "Explain gravity in one sentence.";
    const explanation = await explainNewsWithAI({
      title: prompt,
      summary: "Manual ForLoop admin dry-run.",
      source: "ForLoop Control Panel",
      publishedAt: nowIso(),
      url: "",
    });
    pushAdminLog("info", "ai", `Manual AI test completed with ${explanation.providerUsed}.`);
    return respondOk(res, {
      providerUsed: explanation.providerUsed,
      prompt,
      result: explanation.data.oneLineForStudent || explanation.data.simpleExplanation,
    });
  } catch (error) {
    pushAdminLog("error", "ai", `Manual AI test failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "AI test failed safely.");
  }
});

app.post("/api/admin/ai-explain-test", async (req, res) => {
  pushAdminLog("action", "ai", "AI explanation test requested.");
  try {
    const input = typeof req.body?.input === "string" ? req.body.input.trim() : "";
    const style = typeof req.body?.style === "string" ? req.body.style.trim() : "simple";
    const provider = typeof req.body?.provider === "string" ? req.body.provider.trim() : "env";
    const validationError = validateInputText(input);
    if (validationError) {
      return respondError(res, 400, validationError);
    }

    if (!ALLOW_ADMIN_AI_TEST || provider === "mock") {
      const payload = createMockAIExplanation({
        input,
        style,
        provider: provider === "mock" ? "mock" : getProviderConfiguration().provider,
      });
      pushAdminLog("info", "ai", "AI explanation test returned mock output.");
      return respondOk(res, {
        ...payload,
        timestamp: nowIso(),
      });
    }

    const payload = await createLiveExplanationPayload({ input, style });
    pushAdminLog("info", "ai", `AI explanation test completed in ${payload.mode} mode.`);
    return respondOk(res, payload);
  } catch (error) {
    pushAdminLog("error", "ai", `AI explanation test failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "AI explanation test failed safely.");
  }
});

app.post("/api/admin/story-preview", async (req, res) => {
  pushAdminLog("action", "ai", "Story preview requested.");
  try {
    const input = typeof req.body?.input === "string" ? req.body.input.trim() : "";
    const format = typeof req.body?.format === "string" ? req.body.format.trim() : "emoji_timeline";
    const validationError = validateInputText(input);
    if (validationError) {
      return respondError(res, 400, validationError);
    }

    if (!ALLOW_ADMIN_AI_TEST) {
      const payload = createStoryPreview({ input, format, mode: "mock" });
      pushAdminLog("info", "ai", "Story preview returned mock output.");
      return respondOk(res, payload);
    }

    const payload = await createLiveStoryPayload({ input, format });
    pushAdminLog("info", "ai", `Story preview completed in ${payload.mode} mode.`);
    return respondOk(res, payload);
  } catch (error) {
    pushAdminLog("error", "ai", `Story preview failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Story preview failed safely.");
  }
});

app.get("/api/admin/news-status", (_req, res) => {
  pushAdminLog("info", "news", "News status requested.");
  try {
    const payload = buildNewsStatus();
    markCheck("news", payload.status);
    return respondOk(res, payload);
  } catch (error) {
    pushAdminLog("error", "news", `News status failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Could not read news status.");
  }
});

app.post("/api/admin/news-dry-run", (req, res) => {
  pushAdminLog("action", "news", "News dry-run requested.");
  try {
    const sourceMode = typeof req.body?.sourceMode === "string" ? req.body.sourceMode.trim() : "mock";
    const category = typeof req.body?.category === "string" ? req.body.category.trim() : "Physics";
    const input = typeof req.body?.input === "string" ? req.body.input.trim() : "";

    if (sourceMode === "existing" && !ALLOW_ADMIN_NEWS_FETCH) {
      const payload = createNewsDryRun({ sourceMode: "mock", category, input });
      return respondOk(res, payload);
    }

    return respondOk(res, createNewsDryRun({ sourceMode, category, input }));
  } catch (error) {
    pushAdminLog("error", "news", `News dry-run failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "News dry-run failed safely.");
  }
});

app.post("/api/admin/news-parse-text", (req, res) => {
  pushAdminLog("action", "news", "Manual news text parse requested.");
  try {
    const input = typeof req.body?.input === "string" ? req.body.input.trim() : "";
    const category = typeof req.body?.category === "string" ? req.body.category.trim() : "Physics";
    const validationError = validateInputText(input);
    if (validationError) {
      return respondError(res, 400, validationError);
    }
    return respondOk(res, createParsedNewsText({ input, category }));
  } catch (error) {
    pushAdminLog("error", "news", `Manual news parse failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Manual news parse failed safely.");
  }
});

app.get("/api/admin/simulation-status", (_req, res) => {
  pushAdminLog("info", "simulation", "Simulation status requested.");
  try {
    const payload = buildSimulationStatus();
    markCheck("simulation", payload.status);
    return respondOk(res, payload);
  } catch (error) {
    pushAdminLog("error", "simulation", `Simulation status failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Could not read simulation status.");
  }
});

app.get("/api/admin/visual-language/status", (_req, res) => {
  pushAdminLog("info", "visual-language", "Visual Language Engine status requested.");
  try {
    const payload = buildVisualLanguageStatus();
    markCheck("visual-language", payload.status);
    return respondOk(res, payload);
  } catch (error) {
    pushAdminLog("error", "visual-language", `Visual Language status failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Could not read Visual Language Engine status.");
  }
});

app.get("/api/admin/visual-engine/status", async (_req, res) => {
  try {
    const status = await getSciloopAiStatus({ projectRoot: PROJECT_ROOT });
    const configuredProviders = status.providers.filter((provider) => provider.configured && provider.keyName);
    const readyProvider = status.providers.find((provider) => provider.check.status === "ready" && provider.keyName)
      || configuredProviders[0];
    const available = configuredProviders.length > 0 && status.readiness.backend.reachable;
    return respondOk(res, {
      status: available ? "available" : "missing-config",
      providerName: readyProvider?.name || "ForLoop provider router",
      modelName: "managed by SciLoop AI backend",
      hasServerSideKey: Boolean(readyProvider),
      backendReachable: status.readiness.backend.reachable,
      readyProviderCount: status.readyCount,
      configuredProviderCount: configuredProviders.length,
      message: available
        ? `${configuredProviders.length} ForLoop providers are configured; SciLoop AI backend is online.`
        : configuredProviders.length > 0
          ? `${configuredProviders.length} ForLoop providers are configured, but SciLoop AI backend on port 5050 is offline.`
          : "No configured ForLoop text provider was found.",
    });
  } catch (error) {
    return respondError(res, 500, normalizeErrorMessage(error));
  }
});

app.post("/api/admin/visual-engine/translate", async (req, res) => {
  pushAdminLog("action", "visual-engine", "Controlled visual recipe translation requested.");
  try {
    const systemPrompt = typeof req.body?.systemPrompt === "string" ? req.body.systemPrompt.trim() : "";
    const userPrompt = typeof req.body?.userPrompt === "string" ? req.body.userPrompt.trim() : "";
    if (!systemPrompt || !userPrompt) {
      return respondError(res, 400, "systemPrompt and userPrompt are required.");
    }
    const input = req.body?.input && typeof req.body.input === "object" ? req.body.input : {};
    const response = await fetchWithTimeout(`${sciloopAiBackendBase()}/api/sciloop-ai/universal-visual-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: input.topic || input.rawText,
        summary: input.rawText,
        fullText: userPrompt,
        sourceType: input.sourceType || "concept",
        subject: input.topic || "auto",
        preferredProvider: "auto",
        mode: "visual-recipe-translation",
        renderMode: "sciloop-visual-recipe",
        constraints: input.constraints || [],
        systemPrompt,
      }),
    }, 30000);
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok || !result?.visualPlan) {
      throw new Error(result?.error || `SciLoop AI backend returned ${response.status}.`);
    }
    return respondOk(res, {
      providerUsed: result.providerUsed,
      content: result.visualPlan,
      cached: Boolean(result.cached),
      warnings: Array.isArray(result.warnings) ? result.warnings : [],
    });
  } catch (error) {
    pushAdminLog("error", "visual-engine", `Visual recipe translation failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 502, "ForLoop visual recipe translation failed safely.");
  }
});

app.post("/api/admin/visual-language/plan", async (req, res) => {
  pushAdminLog("action", "visual-language", "Visual Language semantic plan requested.");
  try {
    const input = typeof req.body?.input === "string" && req.body.input.trim()
      ? req.body.input.trim()
      : typeof req.body?.topic === "string"
        ? req.body.topic.trim()
        : "";
    const validationError = validateTopic(input);
    if (validationError) {
      return respondError(res, 400, validationError);
    }

    const subject = typeof req.body?.subject === "string" && req.body.subject.trim()
      ? req.body.subject.trim()
      : "semantic";
    const demoId = typeof req.body?.demoId === "string" && req.body.demoId.trim()
      ? req.body.demoId.trim()
      : detectVisualLanguageDemo(input);
    const compactVisualPlan = req.body?.visualPlan && typeof req.body.visualPlan === "object"
      ? {
          id: req.body.visualPlan.id || `vl-${demoId}`,
          subject: req.body.visualPlan.subject || subject,
          title: req.body.visualPlan.title || input.slice(0, 80),
          chosenTemplate: req.body.visualPlan.chosenTemplate || demoId,
          renderMode: req.body.visualPlan.renderMode || "local-canvas",
        }
      : null;

    const simulationPlan = createSimulationPlan({
      topic: input,
      domain: subject,
      level: "semantic-visual-language",
      mode: "forloop-bridge",
    });

    return respondOk(res, {
      status: "planned",
      engine: "sciloop-visual-language-v0.1",
      recommendedDemo: demoId,
      input,
      subject,
      compactVisualPlan,
      forloopPlan: simulationPlan,
      guidance: [
        "Keep runtime animation local in the browser for performance.",
        "Use backend only for status, admin visibility, and future AI refinement.",
        "Every primitive must encode cause, flow, constraint, feedback, or state change.",
      ],
      receivedAt: nowIso(),
    });
  } catch (error) {
    pushAdminLog("error", "visual-language", `Visual Language plan failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Visual Language plan failed safely.");
  }
});

app.post("/api/admin/simulation-dry-run", (req, res) => {
  pushAdminLog("action", "simulation", "Simulation dry-run requested.");
  try {
    const topic = typeof req.body?.topic === "string" && req.body.topic.trim() ? req.body.topic.trim() : "gravity";
    const mode = typeof req.body?.mode === "string" && req.body.mode.trim() ? req.body.mode.trim() : "template";
    return respondOk(res, createSimulationPlan({ topic, level: mode, domain: "physics", mode: "template" }));
  } catch (error) {
    pushAdminLog("error", "simulation", `Simulation dry-run failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Simulation dry-run failed safely.");
  }
});

app.post("/api/admin/simulation-plan", async (req, res) => {
  pushAdminLog("action", "simulation", "Simulation plan requested.");
  try {
    const topic = typeof req.body?.topic === "string" ? req.body.topic.trim() : "";
    const domain = typeof req.body?.domain === "string" ? req.body.domain.trim() : "physics";
    const level = typeof req.body?.level === "string" ? req.body.level.trim() : "text";
    const validationError = validateTopic(topic);
    if (validationError) {
      return respondError(res, 400, validationError);
    }

    const mode = ALLOW_ADMIN_SIMULATION_AI ? "ai_assisted_preview" : "template";
    return respondOk(res, createSimulationPlan({ topic, domain, level, mode }));
  } catch (error) {
    pushAdminLog("error", "simulation", `Simulation plan failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Simulation plan failed safely.");
  }
});

app.get("/api/admin/feedback-status", (_req, res) => {
  pushAdminLog("info", "feedback", "Feedback status requested.");
  try {
    const payload = buildFeedbackStatus();
    markCheck("feedback", payload.status);
    return respondOk(res, payload);
  } catch (error) {
    pushAdminLog("error", "feedback", `Feedback status failed: ${normalizeErrorMessage(error)}`);
    return respondError(res, 500, "Could not read feedback status.");
  }
});

app.get("/api/admin/feedback-list", (_req, res) => {
  pushAdminLog("info", "feedback", "Feedback list requested.");
  return respondOk(res, {
    status: "local_only",
    source: "backend_not_connected",
    entries: [],
    message: "No backend feedback store is connected yet.",
  });
});

app.get("/api/admin/logs", (_req, res) => {
  pushAdminLog("info", "system", "Admin logs requested.");
  return respondOk(res, adminLogs);
});

app.get("/api/admin/action-history", (_req, res) => {
  pushAdminLog("info", "system", "Action history requested.");
  return respondOk(res, adminLogs);
});

app.post("/api/explain-news", async (req, res) => {
  try {
    const news = normalizeNewsInput(req.body || {});
    if (!news.title) {
      return respondError(res, 400, "title is required");
    }

    const cacheKey = hashNews(news);
    const cache = await readCache();
    if (cache[cacheKey]?.data) {
      return safeJson(res, 200, {
        ok: true,
        providerUsed: cache[cacheKey].providerUsed || "fallback",
        cached: true,
        data: cache[cacheKey].data,
      });
    }

    const explanation = await explainNewsWithAI(news);
    const response = {
      ok: true,
      providerUsed: explanation.providerUsed,
      cached: false,
      data: explanation.data,
    };

    cache[cacheKey] = {
      providerUsed: response.providerUsed,
      data: response.data,
      savedAt: nowIso(),
    };
    await writeCache(cache);

    return safeJson(res, 200, response);
  } catch (error) {
    console.log(`[api] fallback after unexpected error: ${error.message}`);
    const news = normalizeNewsInput(req.body || {});
    return safeJson(res, 200, {
      ok: true,
      providerUsed: "fallback",
      cached: false,
      data: createRuleBasedFallback(news),
    });
  }
});

app.use((_req, res) => {
  respondError(res, 404, "route not found");
});

app.listen(PORT, async () => {
  await ensureCacheFile();
  pushAdminLog("info", "system", "Backend health endpoint initialized.");
  console.log(`[server] SciLoop News Explanation API running at http://localhost:${PORT}`);
  console.log("[server] POST /api/explain-news ready");
  console.log("[server] GET /api/health ready");
  console.log("[server] GET/POST /api/admin/* ready");
  console.log(`[server] ForLoop panel available at http://localhost:${PORT}/forloop-control-panel/`);
  console.log(`[server] AI_PROVIDER=${process.env.AI_PROVIDER || "auto"}`);
});
