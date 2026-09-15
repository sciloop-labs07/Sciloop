"use client";

import { useEffect, useRef, useState } from "react";

import { visualFeedbackUpdatedEvent } from "./feedback.constants";
import { getFeedbackStorageHealth, importVisualFeedbackJson } from "./feedbackStore";
import type { FeedbackStorageHealth } from "./feedbackStorage.types";

interface FeedbackStorageStatusPanelProps {
  feedbackCount: number;
  onImported?: () => void;
}

const initialHealth: FeedbackStorageHealth = {
  adapterId: "checking",
  mode: "memory",
  status: "degraded",
  available: true,
  persistent: false,
  feedbackCount: 0,
  exportAvailable: true,
  reason: "Checking browser storage availability.",
};

function modeLabel(health: FeedbackStorageHealth) {
  if (health.mode === "local-storage") return "Local";
  if (health.mode === "database") return health.available ? "Database connected" : "Database unavailable";
  return "Memory fallback";
}

export function FeedbackStorageStatusPanel({ feedbackCount, onImported }: FeedbackStorageStatusPanelProps) {
  const [activeHealth, setActiveHealth] = useState<FeedbackStorageHealth>(initialHealth);
  const [databaseHealth, setDatabaseHealth] = useState<FeedbackStorageHealth>({
    ...initialHealth,
    adapterId: "database",
    mode: "database",
    status: "unavailable",
    available: false,
    exportAvailable: false,
    reason: "No database configured yet",
    fallback: "local-storage",
  });
  const [importStatus, setImportStatus] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const refresh = () => {
      const health = getFeedbackStorageHealth();
      setActiveHealth(health.active);
      setDatabaseHealth(health.database);
    };
    const frame = window.requestAnimationFrame(refresh);
    window.addEventListener(visualFeedbackUpdatedEvent, refresh);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(visualFeedbackUpdatedEvent, refresh);
    };
  }, []);

  async function importFile(file?: File) {
    if (!file) return;
    if (file.size > 1_000_000) {
      setImportStatus("Import rejected: file is larger than 1 MB.");
      return;
    }
    try {
      const result = importVisualFeedbackJson(await file.text());
      setImportStatus(`Imported ${result.importedCount}; rejected ${result.rejectedCount}.`);
      if (inputRef.current) inputRef.current.value = "";
      onImported?.();
    } catch {
      setImportStatus("Import failed safely. No feedback was changed.");
    }
  }

  const cards = [
    ["Feedback Storage Mode", modeLabel(activeHealth)],
    ["Feedback count", feedbackCount.toString()],
    ["Export available", activeHealth.exportAvailable ? "Yes" : "No"],
    ["Storage health", activeHealth.status],
  ];

  return (
    <section className="rounded-xl border border-sky-300/20 bg-sky-300/[0.04] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-sky-200/80">Database-ready storage</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Feedback persistence status</h3>
          <p className="mt-2 text-sm text-slate-300">Local storage remains the default. The adapter boundary can accept a database implementation later.</p>
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs capitalize text-sky-100">{activeHealth.status}</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-md border border-white/10 bg-slate-950/70 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-2 text-sm font-semibold capitalize text-white">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-md border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
        <p><span className="font-semibold text-white">Database:</span> {databaseHealth.available ? "Connected" : "Unavailable"}</p>
        {databaseHealth.reason ? <p className="mt-1 text-xs text-slate-400">{databaseHealth.reason}. Fallback: {databaseHealth.fallback ?? "none"}.</p> : null}
        {activeHealth.reason ? <p className="mt-1 text-xs text-amber-100">{activeHealth.reason}</p> : null}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-200 transition hover:border-sky-300/40 focus-within:outline-2 focus-within:outline-sky-300">
          Import validated JSON
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(event) => void importFile(event.target.files?.[0])}
          />
        </label>
        <p className="text-xs text-slate-400">Imports are validated locally; invalid records are rejected.</p>
        {importStatus ? <p role="status" className="w-full text-sm text-sky-100">{importStatus}</p> : null}
      </div>
    </section>
  );
}
