const DEFAULT_MAIN_ORIGINS = ["http://localhost:3010", "http://localhost:3000"];
const DEFAULT_TIMEOUT_MS = 30000;

function normalizeOrigin(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function mainOrigins() {
  const configured = normalizeOrigin(process.env.SCILOOP_MAIN_URL);
  return Array.from(new Set([configured, ...DEFAULT_MAIN_ORIGINS].filter(Boolean)));
}

function timeoutMs() {
  const value = Number(process.env.FORLOOP_QP_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  return Number.isFinite(value) ? Math.max(5000, Math.min(60000, value)) : DEFAULT_TIMEOUT_MS;
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const payload = await response.json().catch(() => null);
    return { response, payload };
  } finally {
    clearTimeout(timer);
  }
}

function summarizeError(error) {
  if (error?.name === "AbortError") return "timeout";
  const message = String(error?.message || error || "unreachable").toLowerCase();
  if (message.includes("fetch") || message.includes("connect") || message.includes("network")) return "unreachable";
  return message.slice(0, 180) || "unreachable";
}

function workflowMeta(origins, attempts) {
  return {
    orchestrator: "forloop-control-panel",
    route: "validated-main-possibilities-api",
    attemptedMainOrigins: origins,
    mainOriginAttempts: attempts,
    providerSelection: "delegated-to-main-qp-provider-router",
    validatedHandoff: true,
  };
}

export async function getQuantumPossibilitiesStatus() {
  const origins = mainOrigins();
  const attempts = [];

  for (const origin of origins) {
    try {
      const { response, payload } = await fetchJson(`${origin}/api/possibilities/status`, { method: "GET" });
      attempts.push({ origin, status: response.status, reachable: response.ok });
      if (response.ok && payload?.ok !== false) {
        return {
          status: "ready",
          message: "ForLoop can reach the main product QP router.",
          mainOrigin: origin,
          providerStatuses: payload?.providers || [],
          workflow: workflowMeta(origins, attempts),
          checkedAt: new Date().toISOString(),
        };
      }
    } catch (error) {
      attempts.push({ origin, reachable: false, reason: summarizeError(error) });
    }
  }

  return {
    status: "offline",
    message: "ForLoop could not reach the main product QP router.",
    mainOrigin: null,
    providerStatuses: [],
    workflow: workflowMeta(origins, attempts),
    checkedAt: new Date().toISOString(),
  };
}

export async function runQuantumPossibilitiesWorkflow(payload = {}) {
  const origins = mainOrigins();
  const attempts = [];
  let lastResponse = null;
  let lastPayload = null;

  for (const origin of origins) {
    try {
      const result = await fetchJson(`${origin}/api/possibilities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief: payload.brief,
          lens: payload.lens || "scientific",
          includeVisual: payload.includeVisual !== false,
          requireAiPreparation: payload.requireAiPreparation !== false,
        }),
      });
      lastResponse = result.response;
      lastPayload = result.payload;
      attempts.push({ origin, status: result.response.status, reachable: true });

      // A 4xx response is a deliberate validation/safe-stop result from the
      // canonical QP route. Do not hide it by trying a second origin.
      if (result.response.status >= 400 && result.response.status < 500) {
        return {
          ...(result.payload || { ok: false, error: `QP request rejected with ${result.response.status}.` }),
          workflow: workflowMeta(origins, attempts),
          statusCode: result.response.status,
        };
      }

      if (result.response.ok && result.payload) {
        return {
          ...result.payload,
          workflow: workflowMeta(origins, attempts),
        };
      }
    } catch (error) {
      attempts.push({ origin, reachable: false, reason: summarizeError(error) });
    }
  }

  return {
    ...(lastPayload || { ok: false }),
    ok: false,
    error: "ForLoop could not reach the main product QP router.",
    workflow: workflowMeta(origins, attempts),
    statusCode: lastResponse?.status || 502,
  };
}

