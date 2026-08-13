"use client";

import { useEffect, useState } from "react";

import { getForloopVisualApiStatus } from "./visualApiClient";
import type { ForloopApiConfigStatus, VisualApiMode } from "./visualApi.types";

export function ForloopApiStatusPanel({ mode, fallbackActive }: { mode: VisualApiMode; fallbackActive: boolean }) {
  const [status, setStatus] = useState<ForloopApiConfigStatus>({
    status: "disabled",
    providerName: "forloop-api",
    hasServerSideKey: false,
    message: "Checking server-side ForLoop configuration…",
  });

  useEffect(() => {
    let active = true;
    getForloopVisualApiStatus()
      .then((result) => { if (active) setStatus(result.status); })
      .catch(() => {
        if (active) setStatus({ status: "error", providerName: "forloop-api", hasServerSideKey: false, message: "Status route unavailable. Mock fallback remains active." });
      });
    return () => { active = false; };
  }, []);

  return (
    <aside className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.05] p-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-100/75">ForLoop API status</p>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <p><span className="text-slate-400">Mode:</span> <strong className="text-white">{mode}</strong></p>
        <p><span className="text-slate-400">Status:</span> <strong className="text-white">{status.status}</strong></p>
        <p><span className="text-slate-400">Provider:</span> <strong className="text-white">{status.providerName ?? "ForLoop router"}</strong></p>
        <p><span className="text-slate-400">Model:</span> <strong className="text-white">{status.modelName ?? "provider controlled"}</strong></p>
        <p><span className="text-slate-400">Server-side config:</span> <strong className="text-white">{status.hasServerSideKey ? "available" : "not detected"}</strong></p>
        <p><span className="text-slate-400">AI backend:</span> <strong className="text-white">{status.backendReachable ? "online" : "offline"}</strong></p>
        <p><span className="text-slate-400">Configured providers:</span> <strong className="text-white">{status.configuredProviderCount ?? 0}</strong></p>
        <p><span className="text-slate-400">Fallback:</span> <strong className="text-white">{fallbackActive ? "active" : "standby"}</strong></p>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-300">{status.message}</p>
      <p className="mt-2 text-xs font-semibold text-emerald-200">API keys are never exposed to frontend.</p>
    </aside>
  );
}
