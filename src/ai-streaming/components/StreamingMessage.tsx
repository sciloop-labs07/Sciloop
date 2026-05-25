"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";

import { streamSciLoopResponse } from "@/src/ai-streaming/lib/streaming-client";
import type { SciLoopChatMessage, SciLoopStreamingMode } from "@/src/ai-streaming/types/streaming";

import { TypewriterRenderer } from "./TypewriterRenderer";

interface StreamingMessageProps {
  initialPrompt?: string;
  mode?: SciLoopStreamingMode;
  className?: string;
}

const phaseCopy = {
  Analyzing: "Reading the request and extracting the core problem.",
  "Building abstraction graph": "Mapping entities, forces, constraints, and causal links.",
  "Detecting invariants": "Finding what stays true while details change.",
  "Generating solution": "Writing the final response progressively.",
};

export function StreamingMessage({
  initialPrompt = "Explain gravity as a visual language scene for a 12-year-old.",
  mode: initialMode = "chat",
  className = "",
}: StreamingMessageProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [mode, setMode] = useState<SciLoopStreamingMode>(initialMode);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState("Ready");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [partialJson, setPartialJson] = useState<unknown>(null);
  const [isPending, startTransition] = useTransition();
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bufferedTextRef = useRef("");
  const flushFrameRef = useRef<number | null>(null);

  const messages = useMemo<SciLoopChatMessage[]>(() => [
    {
      role: "user",
      content: prompt,
    },
  ], [prompt]);

  const flushBufferedText = useCallback(() => {
    flushFrameRef.current = null;
    const next = bufferedTextRef.current;
    startTransition(() => setText(next));
  }, []);

  const appendDelta = useCallback((delta: string) => {
    bufferedTextRef.current += delta;
    if (flushFrameRef.current) return;
    flushFrameRef.current = window.requestAnimationFrame(flushBufferedText);
  }, [flushBufferedText]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsGenerating(false);
    setPhase("Cancelled");
  }, []);

  const run = useCallback(async () => {
    cancel();
    const controller = new AbortController();
    abortRef.current = controller;
    bufferedTextRef.current = "";
    setText("");
    setError("");
    setPartialJson(null);
    setPhase("Analyzing");
    setIsGenerating(true);

    try {
      await streamSciLoopResponse({
        payload: {
          messages,
          mode,
          responseFormat: mode === "code" ? "markdown" : "markdown",
          maxOutputTokens: mode === "code" ? 1800 : 1100,
          metadata: {
            surface: "sciloop-streaming-message",
            mode,
          },
        },
        signal: controller.signal,
        onEvent: (event) => {
          if (event.type === "phase") setPhase(event.phase);
          if (event.type === "delta") appendDelta(event.delta);
          if (event.type === "partial_json") setPartialJson(event.value);
          if (event.type === "error") {
            setError(event.message);
            setIsGenerating(false);
          }
          if (event.type === "done") {
            if (flushFrameRef.current) {
              window.cancelAnimationFrame(flushFrameRef.current);
              flushFrameRef.current = null;
            }
            setText(bufferedTextRef.current);
            setPhase("Complete");
            setIsGenerating(false);
          }
        },
      });
    } catch (streamError) {
      if (!controller.signal.aborted) {
        setError(streamError instanceof Error ? streamError.message : "Streaming failed.");
        setIsGenerating(false);
      }
    }
  }, [appendDelta, cancel, messages, mode]);

  useEffect(() => {
    if (!isGenerating) return;
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isGenerating, text, phase]);

  useEffect(() => () => {
    abortRef.current?.abort();
    if (flushFrameRef.current) window.cancelAnimationFrame(flushFrameRef.current);
  }, []);

  return (
    <section className={`panel-surface overflow-hidden rounded-[36px] border border-cyan-200/10 bg-slate-950/55 p-5 shadow-2xl shadow-cyan-950/20 md:p-7 ${className}`}>
      <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div>
            <div className="eyebrow">SciLoop AI streaming</div>
            <h2 className="mt-2 font-display text-3xl font-semibold text-white">
              Live Response Engine
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Real token streaming, smooth batching, markdown, code blocks, cancel, retry, and future multimodal-ready request shape.
            </p>
          </div>

          <label className="block text-sm text-slate-300">
            Prompt
            <textarea
              className="mt-2 min-h-40 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white outline-none transition-colors focus:border-cyan-200/40"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
          </label>

          <label className="block text-sm text-slate-300">
            Mode
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 p-3 text-white outline-none"
              value={mode}
              onChange={(event) => setMode(event.target.value as SciLoopStreamingMode)}
            >
              <option value="chat">Normal chat</option>
              <option value="reasoning">Reasoning mode</option>
              <option value="code">Code generation</option>
            </select>
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              className="sciloop-smooth-button rounded-full border border-cyan-200/30 bg-cyan-200/10 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={isGenerating || !prompt.trim()}
              onClick={run}
            >
              {isGenerating ? "Generating..." : "Stream Response"}
            </button>
            <button
              className="sciloop-smooth-button rounded-full border border-rose-200/25 bg-rose-200/10 px-5 py-3 text-sm font-semibold text-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={!isGenerating}
              onClick={cancel}
            >
              Cancel
            </button>
            <button
              className="sciloop-smooth-button rounded-full border border-amber-200/25 bg-amber-200/10 px-5 py-3 text-sm font-semibold text-amber-50"
              type="button"
              onClick={run}
            >
              Retry
            </button>
          </div>
        </div>

        <div className="relative min-h-[560px] overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_34%),rgba(2,6,23,0.78)] p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-100">
                {mode}
              </span>
              <span className="rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-100">
                {isGenerating ? "Streaming" : "Idle"}
              </span>
              {isPending ? (
                <span className="rounded-full border border-violet-200/20 bg-violet-200/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-violet-100">
                  batching
                </span>
              ) : null}
            </div>
            <div className="text-xs text-slate-400">
              {text.length.toLocaleString()} chars
            </div>
          </div>

          <div className="mb-4 grid gap-2 md:grid-cols-4">
            {Object.entries(phaseCopy).map(([name, copy]) => (
              <motion.div
                key={name}
                animate={{ opacity: phase === name ? 1 : 0.48, y: phase === name ? -2 : 0 }}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-3"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">{name}</div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{copy}</p>
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-100"
              >
                {error}
              </motion.div>
            ) : !text && isGenerating ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="h-5 animate-pulse rounded-full bg-white/10" style={{ width: `${92 - item * 13}%` }} />
                ))}
                <div className="mt-5 flex items-center gap-2 text-sm text-cyan-100">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-200" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-amber-200 [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-violet-200 [animation-delay:240ms]" />
                  <span>Model is starting the stream...</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="answer"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-[24px] border border-cyan-200/10 bg-black/24 p-4"
              >
                <TypewriterRenderer text={text} isStreaming={isGenerating} speed={12} />
              </motion.div>
            )}
          </AnimatePresence>

          {partialJson ? (
            <pre className="quiet-scrollbar mt-4 max-h-52 overflow-auto rounded-2xl border border-emerald-200/10 bg-emerald-400/5 p-4 text-xs text-emerald-100">
              {JSON.stringify(partialJson, null, 2)}
            </pre>
          ) : null}

          <div ref={scrollRef} />
        </div>
      </div>
    </section>
  );
}

