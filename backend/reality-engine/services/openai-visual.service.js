const DEFAULT_MODEL = process.env.OPENAI_VISUAL_MODEL || "gpt-5-mini";
const DEFAULT_TIMEOUT_MS = Number(process.env.OPENAI_VISUAL_TIMEOUT_MS || 15000);

function controllerSignal(timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeout };
}

function localVisualScene(input = {}) {
  const title = input.title || input.prompt || "SciLoop visual scene";
  const field = input.field || "Applied Reality";

  return {
    ok: true,
    providerUsed: "local-fallback",
    fallback: true,
    visualScene: {
      title,
      field,
      intent: "Create a safe procedural visualization without external AI.",
      objects: [
        { id: "problem", type: "node", label: "Problem", color: "#64748b", position: [-3, 0, 0] },
        { id: "discovery", type: "energy_core", label: "Discovery", color: "#00ffe1", position: [0, 0, 0] },
        { id: "future", type: "node", label: "Future", color: "#ffd36d", position: [3, 0, 0] }
      ],
      effects: [
        { id: "flow-1", type: "energy_flow", from: "problem", to: "discovery", color: "#00ffe1" },
        { id: "flow-2", type: "energy_flow", from: "discovery", to: "future", color: "#ffd36d" }
      ],
      animationTimeline: [
        "Old limitation appears",
        "Discovery core lights up",
        "Future branches open"
      ],
      safetyNotes: ["Fallback scene. Add OPENAI_API_KEY on the backend for AI-generated visual planning."]
    }
  };
}

function extractOutputText(data = {}) {
  if (typeof data.output_text === "string") return data.output_text;
  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) parts.push(content.text);
    }
  }
  return parts.join("\n").trim();
}

function extractJson(text = "") {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function buildVisualPrompt(input = {}) {
  const title = input.title || "Untitled SciLoop concept";
  const summary = input.summary || input.prompt || "";
  const field = input.field || "Applied Reality";

  return `
You are SciLoop's Unity visual planner.
Create a compact JSON scene plan for Unity procedural visuals.
Do not output C# code. Do not use external assets. Return ONLY valid JSON.

Input:
Title: ${title}
Field: ${field}
Summary: ${summary}

JSON schema:
{
  "title": string,
  "field": string,
  "intent": string,
  "objects": [
    { "id": string, "type": "node|energy_core|particle_stream|field|boundary|world_panel", "label": string, "color": string, "position": [number, number, number], "scale": [number, number, number] }
  ],
  "effects": [
    { "id": string, "type": "energy_flow|glow|wave|field_lines|entropy_particles", "from": string, "to": string, "color": string, "intensity": number }
  ],
  "animationTimeline": [string],
  "camera": { "mode": "orbit|fixed", "distance": number },
  "safetyNotes": [string]
}

Rules:
- Keep under 12 objects.
- Make causality visible: before -> bottleneck -> discovery -> after -> future.
- Use cinematic colors but simple primitives.
- Never claim exact inventors or dates unless present in the input.
`;
}

export async function generateOpenAIUnityVisual(input = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return localVisualScene(input);
  }

  const { controller, timeout } = controllerSignal();

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_VISUAL_MODEL || DEFAULT_MODEL,
        input: buildVisualPrompt(input),
        max_output_tokens: Number(process.env.OPENAI_VISUAL_MAX_TOKENS || 1400)
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.warn("[openai-visual] provider error:", response.status, data?.error?.message || "unknown");
      return {
        ...localVisualScene(input),
        providerUsed: "local-fallback",
        warnings: [`OpenAI returned ${response.status}: ${data?.error?.message || "unknown error"}`]
      };
    }

    const text = extractOutputText(data);
    const visualScene = extractJson(text) || data.output_parsed || null;
    if (!visualScene || typeof visualScene !== "object") {
      return {
        ...localVisualScene(input),
        warnings: ["OpenAI response did not contain valid scene JSON."]
      };
    }

    return {
      ok: true,
      providerUsed: "openai",
      fallback: false,
      model: data.model || process.env.OPENAI_VISUAL_MODEL || DEFAULT_MODEL,
      visualScene
    };
  } catch (error) {
    console.warn("[openai-visual] failed:", error.message || error);
    return {
      ...localVisualScene(input),
      warnings: [`OpenAI visual generation failed: ${error.message || "unknown error"}`]
    };
  } finally {
    clearTimeout(timeout);
  }
}
