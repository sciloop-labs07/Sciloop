import type { SciLoopStreamEvent, SciLoopStreamRequest } from "@/src/ai-streaming/types/streaming";

export interface StreamSciLoopResponseOptions {
  payload: SciLoopStreamRequest;
  signal?: AbortSignal;
  onEvent: (event: SciLoopStreamEvent) => void;
}

export async function streamSciLoopResponse({ payload, signal, onEvent }: StreamSciLoopResponseOptions) {
  const response = await fetch("/api/sciloop-ai/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok || !response.body) {
    let message = `SciLoop stream failed with status ${response.status}`;
    try {
      const data = await response.json() as { error?: string };
      if (data.error) message = data.error;
    } catch {}
    throw new Error(message);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const packets = buffer.split("\n\n");
    buffer = packets.pop() || "";

    for (const packet of packets) {
      const line = packet
        .split("\n")
        .find((entry) => entry.startsWith("data:"));
      if (!line) continue;
      const raw = line.slice(5).trim();
      if (!raw || raw === "[DONE]") continue;
      try {
        onEvent(JSON.parse(raw) as SciLoopStreamEvent);
      } catch {
        onEvent({
          type: "error",
          message: "Received an invalid stream packet.",
          retryable: true,
          at: Date.now(),
        });
      }
    }
  }
}

