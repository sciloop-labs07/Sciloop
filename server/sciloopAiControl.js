import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const DEFAULT_NEWS_BACKEND_PORT = 5050;
const DEFAULT_TIMEOUT_MS = 7000;
const MIN_READY_PROVIDERS_TO_START = 3;
const KEY_NAMES = [
  "GEMINI_API_KEY",
  "GROQ_API_KEY",
  "DEEPSEEK_API_KEY",
  "COHERE_API_KEY",
  "WIT_AI_TOKEN",
  "HUGGINGFACE_API_KEY",
  "STABILITY_API_KEY",
  "CLARIFAI_PAT",
  "ASSEMBLYAI_API_KEY",
  "GITHUB_TOKEN",
];

export const SCILOOP_AI_PROVIDERS = [
  {
    id: "gemini",
    name: "Google AI Studio Gemini",
    role: "Master planner, structure, explanation, final synthesis",
    keyName: "GEMINI_API_KEY",
    docsUrl: "https://ai.google.dev/",
    required: true,
  },
  {
    id: "groq",
    name: "GroqCloud",
    role: "Ultra-fast responses, formatting, quick summaries",
    keyName: "GROQ_API_KEY",
    docsUrl: "https://console.groq.com/",
    required: true,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    role: "Deep reasoning and step-by-step logic",
    keyName: "DEEPSEEK_API_KEY",
    docsUrl: "https://platform.deepseek.com/",
    required: true,
  },
  {
    id: "cohere",
    name: "Cohere",
    role: "Embeddings, semantic search, similarity memory",
    keyName: "COHERE_API_KEY",
    docsUrl: "https://cohere.com/",
    required: true,
  },
  {
    id: "witai",
    name: "Wit.ai",
    role: "Intent extraction from user text into structured commands",
    keyName: "WIT_AI_TOKEN",
    docsUrl: "https://wit.ai/",
    required: true,
  },
  {
    id: "huggingface",
    name: "Hugging Face Inference",
    role: "Entity extraction, classification, parser layer",
    keyName: "HUGGINGFACE_API_KEY",
    docsUrl: "https://huggingface.co/inference-api",
    required: true,
  },
  {
    id: "stability",
    name: "Stability AI",
    role: "Image generation for scenes and concepts",
    keyName: "STABILITY_API_KEY",
    docsUrl: "https://platform.stability.ai/",
    required: true,
  },
  {
    id: "clarifai",
    name: "Clarifai",
    role: "Image understanding and visual verification",
    keyName: "CLARIFAI_PAT",
    docsUrl: "https://www.clarifai.com/",
    required: true,
  },
  {
    id: "puter",
    name: "Puter.js",
    role: "Client-side AI offload to the user's device/session",
    keyName: null,
    docsUrl: "https://puter.com/",
    required: true,
  },
  {
    id: "assemblyai",
    name: "AssemblyAI",
    role: "Speech-to-text expansion for voice input",
    keyName: "ASSEMBLYAI_API_KEY",
    docsUrl: "https://www.assemblyai.com/",
    required: true,
  },
  {
    id: "githubModels",
    name: "GitHub Models",
    role: "Development experiments and model comparison",
    keyName: "GITHUB_TOKEN",
    docsUrl: "https://github.com/features/models",
    required: true,
  },
];

const lastChecks = new Map();

function nowIso() {
  return new Date().toISOString();
}

function backendDir(projectRoot) {
  return path.join(projectRoot, "sciloop-backend");
}

function envPath(projectRoot) {
  return path.join(backendDir(projectRoot), ".env");
}

function envExamplePath(projectRoot) {
  return path.join(backendDir(projectRoot), ".env.example");
}

function mask(value = "") {
  const clean = String(value || "").trim();
  if (!clean) return "";
  if (clean.length <= 8) return "********";
  return `${clean.slice(0, 4)}...${clean.slice(-4)}`;
}

function parseEnv(raw = "") {
  const entries = new Map();
  String(raw || "").split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match) entries.set(match[1], match[2]);
  });
  return entries;
}

function serializeEnv(raw = "", updates = {}) {
  const seen = new Set();
  const lines = String(raw || "").split(/\r?\n/).map((line) => {
    const match = line.match(/^(\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*=\s*)(.*)$/);
    if (!match || !(match[2] in updates)) return line;
    seen.add(match[2]);
    return `${match[1]}${match[2]}${match[3]}${updates[match[2]]}`;
  });

  Object.entries(updates).forEach(([key, value]) => {
    if (!seen.has(key)) lines.push(`${key}=${value}`);
  });

  return `${lines.join("\n").replace(/\s+$/g, "")}\n`;
}

async function readEnv(projectRoot) {
  const file = envPath(projectRoot);
  if (!existsSync(file)) {
    const fallback = existsSync(envExamplePath(projectRoot))
      ? await readFile(envExamplePath(projectRoot), "utf8")
      : "";
    return fallback;
  }
  return readFile(file, "utf8");
}

async function getConfiguredKeys(projectRoot) {
  const parsed = parseEnv(await readEnv(projectRoot));
  return Object.fromEntries(KEY_NAMES.map((key) => [key, String(parsed.get(key) || "").trim()]));
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

async function probeJson(url, options = {}) {
  const startedAt = Date.now();
  try {
    const response = await fetchWithTimeout(url, options);
    const text = await response.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }
    return {
      ok: response.ok,
      statusCode: response.status,
      durationMs: Date.now() - startedAt,
      json,
      text: text.slice(0, 300),
    };
  } catch (error) {
    return {
      ok: false,
      statusCode: null,
      durationMs: Date.now() - startedAt,
      error: error?.name === "AbortError" ? "Request timed out." : error.message,
    };
  }
}

function resultFromProbe(provider, probe) {
  if (probe.ok) {
    return {
      id: provider.id,
      status: "ready",
      message: `${provider.name} accepted the key.`,
      statusCode: probe.statusCode,
      durationMs: probe.durationMs,
      checkedAt: nowIso(),
    };
  }

  const status = probe.statusCode;
  let message = probe.error || `${provider.name} key check failed.`;
  let mappedStatus = "error";

  if (status === 401 || status === 403) {
    mappedStatus = "missing_key";
    message = `${provider.name} rejected the key. Refresh or replace it.`;
  } else if (status === 402) {
    mappedStatus = "quota_limit";
    message = `${provider.name} account needs billing or credits.`;
  } else if (status === 429) {
    mappedStatus = "quota_limit";
    message = `${provider.name} rate limit reached. Refresh key or wait for quota reset.`;
  } else if (status >= 500) {
    mappedStatus = "warn";
    message = `${provider.name} server is temporarily unavailable.`;
  }

  return {
    id: provider.id,
    status: mappedStatus,
    message,
    statusCode: status,
    durationMs: probe.durationMs,
    checkedAt: nowIso(),
  };
}

async function probeProvider(provider, key) {
  if (provider.id === "puter") {
    const probe = await probeJson("https://js.puter.com/v2/");
    return resultFromProbe(provider, probe);
  }

  if (!key) {
    return {
      id: provider.id,
      status: "missing_key",
      message: `${provider.name} key is missing.`,
      checkedAt: nowIso(),
    };
  }

  if (provider.id === "gemini") {
    return resultFromProbe(provider, await probeJson(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`));
  }

  if (provider.id === "groq") {
    return resultFromProbe(provider, await probeJson("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    }));
  }

  if (provider.id === "deepseek") {
    return resultFromProbe(provider, await probeJson("https://api.deepseek.com/models", {
      headers: { Authorization: `Bearer ${key}` },
    }));
  }

  if (provider.id === "cohere") {
    return resultFromProbe(provider, await probeJson("https://api.cohere.com/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    }));
  }

  if (provider.id === "witai") {
    return resultFromProbe(provider, await probeJson("https://api.wit.ai/message?v=20240503&q=hello", {
      headers: { Authorization: `Bearer ${key}` },
    }));
  }

  if (provider.id === "huggingface") {
    return resultFromProbe(provider, await probeJson("https://huggingface.co/api/whoami-v2", {
      headers: { Authorization: `Bearer ${key}` },
    }));
  }

  if (provider.id === "stability") {
    return resultFromProbe(provider, await probeJson("https://api.stability.ai/v1/user/account", {
      headers: { Authorization: `Bearer ${key}` },
    }));
  }

  if (provider.id === "clarifai") {
    return resultFromProbe(provider, await probeJson("https://api.clarifai.com/v2/users/me", {
      headers: { Authorization: `Key ${key}` },
    }));
  }

  if (provider.id === "assemblyai") {
    return resultFromProbe(provider, await probeJson("https://api.assemblyai.com/v2/transcript?limit=1", {
      headers: { Authorization: key },
    }));
  }

  if (provider.id === "githubModels") {
    return resultFromProbe(provider, await probeJson("https://api.github.com/catalog/models", {
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2026-03-10",
      },
    }));
  }

  return {
    id: provider.id,
    status: "unknown",
    message: "No checker is configured for this provider.",
    checkedAt: nowIso(),
  };
}

async function commandVersion(command, args) {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      timeout: 5000,
      windowsHide: true,
    });
    return {
      ok: true,
      value: String(stdout || stderr).trim(),
    };
  } catch (error) {
    return {
      ok: false,
      value: error.message,
    };
  }
}

function npmExecutable() {
  return process.platform === "win32" ? "cmd.exe" : "npm";
}

function npmVersionArgs() {
  return process.platform === "win32" ? ["/d", "/s", "/c", "npm", "--version"] : ["--version"];
}

async function probeLocalBackend(port = DEFAULT_NEWS_BACKEND_PORT) {
  const probe = await probeJson(`http://localhost:${port}/health`, {}, 2000);
  return {
    reachable: probe.ok,
    statusCode: probe.statusCode,
    message: probe.ok ? "SciLoop AI backend is reachable." : "SciLoop AI backend is not running yet.",
  };
}

export async function getSciloopAiStatus({ projectRoot, port = DEFAULT_NEWS_BACKEND_PORT }) {
  const keys = await getConfiguredKeys(projectRoot);
  const readiness = await getSciloopAiReadiness({ projectRoot, port });

  const providers = SCILOOP_AI_PROVIDERS.map((provider) => {
    const key = provider.keyName ? keys[provider.keyName] : "";
    const last = lastChecks.get(provider.id);
    return {
      ...provider,
      configured: provider.keyName ? Boolean(key) : true,
      maskedKey: provider.keyName ? mask(key) : "no key needed",
      check: last || {
        id: provider.id,
        status: provider.keyName && !key ? "missing_key" : "pending",
        message: provider.keyName && !key ? `${provider.name} key is missing.` : "Not checked yet.",
        checkedAt: null,
      },
    };
  });

  const readyCount = providers.filter((provider) => provider.check.status === "ready").length;
  const allProvidersReady = providers.every((provider) => provider.check.status === "ready");
  const enoughProvidersReady = readyCount >= MIN_READY_PROVIDERS_TO_START;
  const canStart = enoughProvidersReady && readiness.ready;

  return {
    providers,
    readiness,
    allProvidersReady,
    enoughProvidersReady,
    minReadyProvidersToStart: MIN_READY_PROVIDERS_TO_START,
    canStart,
    requiredCount: providers.length,
    readyCount,
    backendUrl: `http://localhost:${port}`,
    updatedAt: nowIso(),
  };
}

export async function getSciloopAiReadiness({ projectRoot, port = DEFAULT_NEWS_BACKEND_PORT }) {
  const dir = backendDir(projectRoot);
  const packagePath = path.join(dir, "package.json");
  const nodeModulesPath = path.join(dir, "node_modules");
  const serverPath = path.join(dir, "src", "server.js");
  const envFilePath = envPath(projectRoot);
  const node = await commandVersion("node", ["--version"]);
  const npm = await commandVersion(npmExecutable(), npmVersionArgs());
  const backend = await probeLocalBackend(port);

  const checks = [
    {
      id: "node",
      label: "Node.js",
      status: node.ok ? "ready" : "missing",
      message: node.ok ? `Detected ${node.value}.` : "Node.js is not available to the ForLoop control API.",
    },
    {
      id: "npm",
      label: "npm",
      status: npm.ok ? "ready" : "missing",
      message: npm.ok ? `Detected npm ${npm.value}.` : "npm is not available to the ForLoop control API.",
    },
    {
      id: "backend-folder",
      label: "Backend folder",
      status: existsSync(dir) && existsSync(packagePath) && existsSync(serverPath) ? "ready" : "missing",
      message: existsSync(dir) ? "sciloop-backend folder is present." : "sciloop-backend folder is missing.",
    },
    {
      id: "dependencies",
      label: "Dependencies",
      status: existsSync(nodeModulesPath) ? "ready" : "missing",
      message: existsSync(nodeModulesPath) ? "node_modules is installed." : "Run npm install inside sciloop-backend.",
    },
    {
      id: "env",
      label: "Local .env",
      status: existsSync(envFilePath) ? "ready" : "missing",
      message: existsSync(envFilePath) ? ".env exists for local API keys." : ".env will be created when keys are saved.",
    },
    {
      id: "port-5050",
      label: `Port ${port}`,
      status: backend.reachable ? "running" : "stopped",
      message: backend.message,
    },
  ];

  return {
    checks,
    ready: checks.every((check) => ["ready", "running", "stopped"].includes(check.status)) && existsSync(nodeModulesPath),
    backend,
    checkedAt: nowIso(),
  };
}

export async function saveSciloopAiKeys({ projectRoot, keys = {} }) {
  const file = envPath(projectRoot);
  await mkdir(path.dirname(file), { recursive: true });

  const current = existsSync(file)
    ? await readFile(file, "utf8")
    : (existsSync(envExamplePath(projectRoot)) ? await readFile(envExamplePath(projectRoot), "utf8") : "");

  const updates = {};
  SCILOOP_AI_PROVIDERS.forEach((provider) => {
    if (!provider.keyName) return;
    if (Object.prototype.hasOwnProperty.call(keys, provider.id)) {
      const value = String(keys[provider.id] || "").trim();
      if (value) updates[provider.keyName] = value;
    }
  });

  const defaults = {
    PORT: String(DEFAULT_NEWS_BACKEND_PORT),
    NODE_ENV: "development",
    FRONTEND_ORIGIN: "http://localhost:3000",
    DEEPSEEK_MODEL: "deepseek-chat",
    COHERE_EMBED_MODEL: "embed-v4.0",
    GITHUB_MODELS_BASE_URL: "https://models.github.ai/inference",
  };

  await writeFile(file, serializeEnv(current, { ...defaults, ...updates }), "utf8");

  return getSciloopAiStatus({ projectRoot });
}

export async function checkSciloopAiProvider({ projectRoot, providerId }) {
  const provider = SCILOOP_AI_PROVIDERS.find((item) => item.id === providerId);
  if (!provider) {
    throw new Error("Unknown SciLoop AI provider.");
  }

  const keys = await getConfiguredKeys(projectRoot);
  const result = await probeProvider(provider, provider.keyName ? keys[provider.keyName] : "");
  lastChecks.set(provider.id, result);
  return result;
}

export async function checkAllSciloopAiProviders({ projectRoot }) {
  const results = [];
  for (const provider of SCILOOP_AI_PROVIDERS) {
    results.push(await checkSciloopAiProvider({ projectRoot, providerId: provider.id }));
  }
  return {
    results,
    status: await getSciloopAiStatus({ projectRoot }),
  };
}

export async function assertSciloopAiStartReady({ projectRoot }) {
  const status = await getSciloopAiStatus({ projectRoot });
  if (!status.readiness.ready) {
    throw new Error("TR readiness is not complete yet.");
  }
  if (!status.enoughProvidersReady) {
    throw new Error(`At least ${MIN_READY_PROVIDERS_TO_START} SciLoop AI specialist checks must be green before starting the server.`);
  }
  return status;
}
