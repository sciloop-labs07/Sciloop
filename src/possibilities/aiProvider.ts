export type ProviderName =
  | "forloop"
  | "openai"
  | "openrouter"
  | "groq"
  | "gemini"
  | "deepseek"
  | "together"
  | "huggingface"
  | "cohere"
  | "ollama";

export type ProviderAttemptStatus = "accepted" | "failed" | "invalid";

export interface PossibilityProviderAttempt {
  provider: ProviderName;
  model: string;
  status: ProviderAttemptStatus;
  reason?: string;
}

export interface PossibilityProviderResult {
  provider: ProviderName;
  content: string;
  attempts: PossibilityProviderAttempt[];
}

export interface PossibilityProviderStatus {
  provider: ProviderName;
  configured: boolean;
  model: string;
}

export interface GeneratePossibilityOptions {
  accept?: (content: string) => boolean;
  providers?: ProviderName[];
}

type JsonObject = Record<string, unknown>;

const ALL_PROVIDERS: ProviderName[] = [
  "forloop",
  "gemini",
  "openai",
  "groq",
  "openrouter",
  "huggingface",
  "cohere",
  "deepseek",
  "together",
  "ollama",
];

const MODELS: Record<ProviderName, string> = {
  forloop: "sciloop-ai-provider-router",
  openai: process.env.OPENAI_POSSIBILITY_MODEL || process.env.OPENAI_STREAM_MODEL || "gpt-4o-mini",
  openrouter: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
  groq: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
  gemini: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  deepseek: process.env.DEEPSEEK_MODEL || "deepseek-chat",
  together: process.env.TOGETHER_MODEL || "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  huggingface: process.env.HUGGINGFACE_MODEL || "Qwen/Qwen2.5-72B-Instruct",
  cohere: process.env.COHERE_MODEL || "command-r-plus-08-2024",
  ollama: process.env.OLLAMA_MODEL || "llama3.1",
};

function configured(provider: ProviderName) {
  switch (provider) {
    case "forloop": return String(process.env.POSSIBILITY_ENABLE_FORLOOP_BACKEND || "true").toLowerCase() !== "false" && Boolean((process.env.SCILOOP_AI_BACKEND_URL || "http://localhost:5050").trim());
    case "openai": return Boolean(process.env.OPENAI_API_KEY?.trim());
    case "openrouter": return Boolean(process.env.OPENROUTER_API_KEY?.trim());
    case "groq": return Boolean(process.env.GROQ_API_KEY?.trim());
    case "gemini": return Boolean(process.env.GEMINI_API_KEY?.trim());
    case "deepseek": return Boolean(process.env.DEEPSEEK_API_KEY?.trim());
    case "together": return Boolean(process.env.TOGETHER_API_KEY?.trim());
    case "huggingface": return Boolean(process.env.HUGGINGFACE_API_KEY?.trim());
    case "cohere": return Boolean(process.env.COHERE_API_KEY?.trim());
    case "ollama": return process.env.POSSIBILITY_ENABLE_OLLAMA === "true";
  }
}

function providerOrder(): ProviderName[] {
  const selected = (process.env.POSSIBILITY_PROVIDER_ORDER || process.env.AI_PROVIDER || "auto")
    .trim()
    .toLowerCase();
  if (selected !== "auto") {
    const requested = selected.split(",").map((item) => item.trim()).filter((item): item is ProviderName => ALL_PROVIDERS.includes(item as ProviderName));
    return requested.length ? requested : ALL_PROVIDERS.filter(configured);
  }
  return ALL_PROVIDERS.filter(configured);
}

export function possibilityProviderStatus(): PossibilityProviderStatus[] {
  return ALL_PROVIDERS.map((provider) => ({ provider, configured: configured(provider), model: MODELS[provider] }));
}

function timeoutMs() {
  const value = Number(process.env.POSSIBILITY_AI_TIMEOUT_MS || 12000);
  return Number.isFinite(value) ? Math.max(3000, Math.min(30000, value)) : 12000;
}

async function fetchWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function asJsonObject(value: unknown): JsonObject | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : null;
}

function textFromParts(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value.map((part) => {
    const item = asJsonObject(part);
    return typeof item?.text === "string" ? item.text : "";
  }).join("");
}

async function readProviderPayload(response: Response): Promise<JsonObject> {
  const payload = asJsonObject(await response.json().catch(() => null));
  if (!response.ok) {
    const error = asJsonObject(payload?.error);
    const code = error?.code || error?.type || error?.status || `http-${response.status}`;
    throw new Error(String(code));
  }
  return payload || {};
}

function chatContent(payload: JsonObject) {
  const firstChoice = Array.isArray(payload.choices) ? asJsonObject(payload.choices[0]) : null;
  const message = asJsonObject(firstChoice?.message);
  const content = message?.content;
  if (Array.isArray(content)) return textFromParts(content);
  return typeof content === "string" ? content : "";
}

async function callOpenAiCompatible(
  provider: ProviderName,
  url: string,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  extraHeaders: Record<string, string> = {},
) {
  const response = await fetchWithTimeout(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", ...extraHeaders },
    body: JSON.stringify({
      model: MODELS[provider],
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      temperature: 0.15,
      response_format: { type: "json_object" },
      ...(provider === "openai" ? { max_completion_tokens: 2600 } : { max_tokens: 2600 }),
    }),
  });
  return chatContent(await readProviderPayload(response));
}

async function callOpenAi(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error("not-configured");
  return callOpenAiCompatible("openai", "https://api.openai.com/v1/chat/completions", apiKey, systemPrompt, userPrompt);
}

async function callForLoopBackend(systemPrompt: string, userPrompt: string) {
  const baseUrl = (process.env.SCILOOP_AI_BACKEND_URL || "http://localhost:5050").replace(/\/+$/, "");
  const response = await fetchWithTimeout(`${baseUrl}/api/sciloop-ai/structured-json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemPrompt, userPrompt, preferredProvider: "auto" }),
  });
  const payload = await readProviderPayload(response);
  const content = typeof payload?.content === "string" ? payload.content : "";
  if (!content.trim()) throw new Error("provider-router-empty-response");
  return content;
}

async function callOpenRouter(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) throw new Error("not-configured");
  return callOpenAiCompatible("openrouter", "https://openrouter.ai/api/v1/chat/completions", apiKey, systemPrompt, userPrompt, {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": "SciLoop Quantum Possibilities Engine",
  });
}

async function callGroq(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) throw new Error("not-configured");
  return callOpenAiCompatible("groq", "https://api.groq.com/openai/v1/chat/completions", apiKey, systemPrompt, userPrompt);
}

async function callDeepSeek(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) throw new Error("not-configured");
  return callOpenAiCompatible("deepseek", "https://api.deepseek.com/chat/completions", apiKey, systemPrompt, userPrompt);
}

async function callTogether(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.TOGETHER_API_KEY?.trim();
  if (!apiKey) throw new Error("not-configured");
  return callOpenAiCompatible("together", "https://api.together.xyz/v1/chat/completions", apiKey, systemPrompt, userPrompt);
}

async function callHuggingFace(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.HUGGINGFACE_API_KEY?.trim();
  if (!apiKey) throw new Error("not-configured");
  return callOpenAiCompatible("huggingface", "https://router.huggingface.co/v1/chat/completions", apiKey, systemPrompt, userPrompt);
}

async function callCohere(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.COHERE_API_KEY?.trim();
  if (!apiKey) throw new Error("not-configured");
  const response = await fetchWithTimeout("https://api.cohere.com/v2/chat", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODELS.cohere,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      temperature: 0.15,
    }),
  });
  const payload = await readProviderPayload(response);
  const content = asJsonObject(payload.message)?.content;
  if (Array.isArray(content)) return textFromParts(content);
  return typeof content === "string" ? content : "";
}

async function callGemini(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("not-configured");
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODELS.gemini)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetchWithTimeout(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { temperature: 0.15, responseMimeType: "application/json", maxOutputTokens: 2600 },
    }),
  });
  const payload = await readProviderPayload(response);
  const candidate = Array.isArray(payload.candidates) ? asJsonObject(payload.candidates[0]) : null;
  const content = asJsonObject(candidate?.content);
  return textFromParts(content?.parts);
}

async function callOllama(systemPrompt: string, userPrompt: string) {
  const baseUrl = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/$/, "");
  const response = await fetchWithTimeout(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODELS.ollama,
      stream: false,
      format: "json",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    }),
  });
  const payload = await readProviderPayload(response);
  const content = asJsonObject(payload.message)?.content;
  return typeof content === "string" ? content : "";
}

function reasonFor(error: unknown) {
  const message = String(error instanceof Error ? error.message : error || "unknown").toLowerCase();
  if (message.includes("quota") || message.includes("insufficient") || message.includes("billing")) return "quota-exhausted";
  if (message.includes("401") || message.includes("403") || message.includes("unauthorized") || message.includes("invalid_api_key")) return "unauthorized";
  if (message.includes("429") || message.includes("rate")) return "rate-limited";
  if (message.includes("abort") || message.includes("timeout")) return "timeout";
  if (message.includes("fetch") || message.includes("connect") || message.includes("network")) return "unreachable";
  if (message.includes("500") || message.includes("502") || message.includes("503") || message.includes("504")) return "provider-unavailable";
  return "provider-error";
}

export async function generatePossibilityJson(
  systemPrompt: string,
  userPrompt: string,
  options: GeneratePossibilityOptions = {},
): Promise<PossibilityProviderResult | null> {
  const calls: Record<ProviderName, (system: string, user: string) => Promise<string>> = {
    forloop: callForLoopBackend,
    openai: callOpenAi,
    openrouter: callOpenRouter,
    groq: callGroq,
    gemini: callGemini,
    deepseek: callDeepSeek,
    together: callTogether,
    huggingface: callHuggingFace,
    cohere: callCohere,
    ollama: callOllama,
  };
  const attempts: PossibilityProviderAttempt[] = [];
  const order = options.providers?.length ? options.providers : providerOrder();
  for (const provider of order) {
    try {
      const content = await calls[provider](systemPrompt, userPrompt);
      if (!content.trim()) {
        attempts.push({ provider, model: MODELS[provider], status: "failed", reason: "empty-response" });
        continue;
      }
      if (options.accept && !options.accept(content)) {
        attempts.push({ provider, model: MODELS[provider], status: "invalid", reason: "invalid-structured-output" });
        continue;
      }
      attempts.push({ provider, model: MODELS[provider], status: "accepted" });
      return { provider, content, attempts };
    } catch (error) {
      attempts.push({ provider, model: MODELS[provider], status: "failed", reason: reasonFor(error) });
    }
  }
  if (!attempts.length) return null;
  const lastAttempt = attempts[attempts.length - 1];
  return {
    provider: lastAttempt.provider,
    content: "",
    attempts,
  };
}

export function configuredPossibilityProviders() {
  return providerOrder();
}
