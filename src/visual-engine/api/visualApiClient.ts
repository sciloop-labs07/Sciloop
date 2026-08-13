"use client";

import type { ForloopApiConfigStatus, VisualApiInput, VisualApiOutput } from "./visualApi.types";

export async function translateWithForloopApiClient(input: VisualApiInput): Promise<VisualApiOutput> {
  try {
    const response = await fetch("/api/visual-engine/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = await response.json() as VisualApiOutput;
    if (response.ok) return result;
    return {
      ok: false,
      mode: "mock",
      warnings: [`API route failed with status ${response.status}.`],
      validationErrors: [],
      fallbackUsed: true,
      error: result.error ?? "Visual API route failed.",
    };
  } catch (error) {
    return {
      ok: false,
      mode: "mock",
      warnings: ["Visual API route was unreachable."],
      validationErrors: [],
      fallbackUsed: true,
      error: error instanceof Error ? error.message : "Visual API route failed.",
    };
  }
}

export async function getForloopVisualApiStatus(): Promise<{ ok: boolean; status: ForloopApiConfigStatus }> {
  const response = await fetch("/api/visual-engine/translate", { cache: "no-store" });
  return response.json();
}
