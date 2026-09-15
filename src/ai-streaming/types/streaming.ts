export type SciLoopStreamingMode = "chat" | "reasoning" | "code";

export type SciLoopStreamEvent =
  | { type: "phase"; phase: string; at: number }
  | { type: "delta"; delta: string; at: number }
  | { type: "partial_json"; value: unknown; at: number }
  | { type: "done"; usage?: unknown; at: number }
  | { type: "error"; message: string; retryable?: boolean; at: number };

export interface SciLoopChatMessage {
  role: "user" | "assistant" | "system" | "developer";
  content: string;
}

export interface SciLoopStreamRequest {
  messages: SciLoopChatMessage[];
  mode?: SciLoopStreamingMode;
  responseFormat?: "markdown" | "partial-json";
  temperature?: number;
  maxOutputTokens?: number;
  metadata?: Record<string, string>;
}

