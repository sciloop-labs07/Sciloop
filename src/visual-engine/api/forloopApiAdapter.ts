import "server-only";

import { buildForloopVisualSystemPrompt, buildForloopVisualUserPrompt } from "./visualApiPromptBuilder";
import { createVisualApiFallbackOutput } from "./visualApiFallback";
import { runVisualApiGuardrails } from "./visualApiGuardrails";
import { parseVisualApiRecipeResponse } from "./visualApiRecipeParser";
import { getForloopBackendUrl, readForloopVisualApiStatus } from "./visualApiStatus";
import type { VisualApiInput, VisualApiOutput, VisualRecipeApiProvider } from "./visualApi.types";

export const forloopVisualApiProvider: VisualRecipeApiProvider = {
  name: "forloop-api",

  available: readForloopVisualApiStatus,

  async generateVisualRecipe(input: VisualApiInput): Promise<VisualApiOutput> {
    const status = await readForloopVisualApiStatus();
    if (status.status !== "available") {
      return createVisualApiFallbackOutput(input, [status.message]);
    }
    try {
      const response = await fetch(`${getForloopBackendUrl()}/api/admin/visual-engine/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          systemPrompt: buildForloopVisualSystemPrompt(),
          userPrompt: buildForloopVisualUserPrompt(input),
          responseFormat: "json",
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) {
        return createVisualApiFallbackOutput(input, [`ForLoop API request failed with status ${response.status}.`]);
      }
      const payload = await response.json() as { data?: { content?: unknown; providerUsed?: string } };
      const parsed = parseVisualApiRecipeResponse(payload.data?.content, input);
      const guarded = runVisualApiGuardrails(parsed, input);
      return {
        ...guarded,
        reasoningSummary: guarded.fallbackUsed
          ? guarded.reasoningSummary
          : `${guarded.reasoningSummary} Provider: ${payload.data?.providerUsed ?? status.providerName ?? "ForLoop router"}.`,
      };
    } catch (error) {
      return createVisualApiFallbackOutput(input, [
        error instanceof Error ? error.message : "Unknown ForLoop API error.",
      ]);
    }
  },
};
