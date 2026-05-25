import type { SciLoopChatMessage, SciLoopStreamingMode, SciLoopStreamRequest } from "@/src/ai-streaming/types/streaming";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = process.env.OPENAI_STREAM_MODEL || "gpt-5";
const supportsTemperature = !/^gpt-5/i.test(DEFAULT_MODEL);

const thinkingPhases = [
  "Analyzing",
  "Building abstraction graph",
  "Detecting invariants",
  "Generating solution",
];

function sanitizeMessages(messages: unknown): SciLoopChatMessage[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .map((message) => {
      if (!message || typeof message !== "object") return null;
      const item = message as Partial<SciLoopChatMessage>;
      const role = item.role === "assistant" || item.role === "system" || item.role === "developer" ? item.role : "user";
      const content = typeof item.content === "string" ? item.content.slice(0, 16000) : "";
      return content.trim() ? { role, content } : null;
    })
    .filter((message): message is SciLoopChatMessage => Boolean(message));
}

function modeInstructions(mode: SciLoopStreamingMode, responseFormat: SciLoopStreamRequest["responseFormat"]) {
  const base = [
    "You are SciLoop AI.",
    "Explain with simple English, causal structure, visual reasoning, and practical usefulness.",
    "Use markdown with clear headings, short bullets, and compact code blocks when needed.",
    "Do not reveal provider, model, keys, or internal routing details.",
  ];

  if (mode === "reasoning") {
    base.push(
      "Use a concise reasoning style visible to the user as structured steps, not hidden chain of thought.",
      "Prefer: observation -> invariant -> mechanism -> implication -> next action.",
    );
  }

  if (mode === "code") {
    base.push(
      "When generating code, include file names when useful, fenced code blocks with language tags, and short implementation notes.",
      "Prefer complete, copy-ready snippets over vague descriptions.",
    );
  }

  if (responseFormat === "partial-json") {
    base.push(
      "Return JSON only. Keep it valid when complete. Use simple fields: title, summary, steps, risks, nextActions.",
    );
  }

  return base.join("\n");
}

function toOpenAIInput(messages: SciLoopChatMessage[]) {
  return messages.map((message) => ({
    role: message.role === "developer" ? "system" : message.role,
    content: message.content,
  }));
}

function sse(data: unknown) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

async function delay(ms: number, signal: AbortSignal) {
  await new Promise<void>((resolve) => {
    const id = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(id);
      resolve();
    }, { once: true });
  });
}

export async function POST(request: Request) {
  let payload: SciLoopStreamRequest;
  try {
    payload = await request.json() as SciLoopStreamRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = sanitizeMessages(payload.messages);
  if (!messages.length) {
    return Response.json({ error: "At least one message is required." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({
      error: "OPENAI_API_KEY is missing. Add it to .env.local or your deployment environment.",
    }, { status: 503 });
  }

  const mode: SciLoopStreamingMode = payload.mode === "reasoning" || payload.mode === "code" ? payload.mode : "chat";
  const encoder = new TextEncoder();
  const abortController = new AbortController();
  request.signal.addEventListener("abort", () => abortController.abort(), { once: true });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: unknown) => {
        controller.enqueue(encoder.encode(sse(event)));
      };

      try {
        for (const phase of thinkingPhases) {
          if (abortController.signal.aborted) return;
          send({ type: "phase", phase, at: Date.now() });
          await delay(180, abortController.signal);
        }

        const openAIResponse = await fetch(OPENAI_RESPONSES_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: DEFAULT_MODEL,
            instructions: modeInstructions(mode, payload.responseFormat || "markdown"),
            input: toOpenAIInput(messages),
            stream: true,
            stream_options: { include_obfuscation: false },
            max_output_tokens: payload.maxOutputTokens || (mode === "code" ? 1800 : 1100),
            ...(mode === "reasoning" ? { reasoning: { effort: "medium" } } : {}),
            ...(supportsTemperature ? { temperature: typeof payload.temperature === "number" ? payload.temperature : 0.6 } : {}),
            metadata: payload.metadata || {},
          }),
          signal: abortController.signal,
        });

        if (!openAIResponse.ok || !openAIResponse.body) {
          const message = await openAIResponse.text().catch(() => "");
          send({
            type: "error",
            message: message || `OpenAI request failed with status ${openAIResponse.status}.`,
            retryable: openAIResponse.status >= 500 || openAIResponse.status === 429,
            at: Date.now(),
          });
          controller.close();
          return;
        }

        const reader = openAIResponse.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const packets = buffer.split("\n\n");
          buffer = packets.pop() || "";

          for (const packet of packets) {
            const line = packet.split("\n").find((entry) => entry.startsWith("data:"));
            if (!line) continue;
            const raw = line.slice(5).trim();
            if (!raw || raw === "[DONE]") continue;

            let event: { type?: string; delta?: string; response?: unknown; error?: { message?: string } };
            try {
              event = JSON.parse(raw);
            } catch {
              continue;
            }

            if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
              accumulated += event.delta;
              send({ type: "delta", delta: event.delta, at: Date.now() });
              if (payload.responseFormat === "partial-json") {
                try {
                  send({ type: "partial_json", value: JSON.parse(accumulated), at: Date.now() });
                } catch {}
              }
            }

            if (event.type === "response.completed") {
              send({ type: "done", usage: event.response, at: Date.now() });
            }

            if (event.type === "error") {
              send({
                type: "error",
                message: event.error?.message || "OpenAI streaming error.",
                retryable: true,
                at: Date.now(),
              });
            }
          }
        }

        send({ type: "done", at: Date.now() });
        controller.close();
      } catch (error) {
        if (!abortController.signal.aborted) {
          send({
            type: "error",
            message: error instanceof Error ? error.message : "Unknown streaming error.",
            retryable: true,
            at: Date.now(),
          });
        }
        controller.close();
      }
    },
    cancel() {
      abortController.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
