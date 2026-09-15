import "server-only";

import type { ForloopApiConfigStatus } from "./visualApi.types";

const DEFAULT_FORLOOP_BACKEND_URL = "http://localhost:3001";

export function getForloopBackendUrl() {
  return (process.env.FORLOOP_BACKEND_URL || DEFAULT_FORLOOP_BACKEND_URL).replace(/\/+$/, "");
}

export async function readForloopVisualApiStatus(): Promise<ForloopApiConfigStatus> {
  try {
    const response = await fetch(`${getForloopBackendUrl()}/api/admin/visual-engine/status`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3500),
    });
    if (!response.ok) {
      return {
        status: "error",
        providerName: "forloop-api",
        hasServerSideKey: false,
        message: `ForLoop status route returned ${response.status}.`,
      };
    }
    const payload = await response.json() as { data?: ForloopApiConfigStatus };
    return payload.data ?? {
      status: "error",
      providerName: "forloop-api",
      hasServerSideKey: false,
      message: "ForLoop status response was incomplete.",
    };
  } catch {
    return {
      status: "missing-config",
      providerName: "forloop-api",
      hasServerSideKey: false,
      message: "ForLoop backend is offline. Mock translator fallback remains active.",
    };
  }
}
