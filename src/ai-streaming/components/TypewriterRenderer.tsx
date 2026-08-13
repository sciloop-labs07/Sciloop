"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

interface TypewriterRendererProps {
  text: string;
  isStreaming?: boolean;
  speed?: number;
  animateOnce?: boolean;
  revealMode?: "characters" | "words";
  intervalMs?: number;
  className?: string;
}

function TypewriterRendererBase({
  text,
  isStreaming = false,
  speed = 9,
  animateOnce = false,
  revealMode = "characters",
  intervalMs = 34,
  className = "",
}: TypewriterRendererProps) {
  const [visibleText, setVisibleText] = useState("");
  const targetRef = useRef(text);
  const frameRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    targetRef.current = text;
    if (!isStreaming && !animateOnce) {
      frameRef.current = window.requestAnimationFrame(() => {
        setVisibleText(text);
      });
      return () => {
        if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      };
    }

    if (isStreaming && !animateOnce) {
      const tick = () => {
        setVisibleText((current) => {
          const target = targetRef.current;
          if (current.length >= target.length) return current;
          const remaining = target.length - current.length;
          const take = Math.min(Math.max(1, speed), remaining);
          return target.slice(0, current.length + take);
        });
        frameRef.current = window.requestAnimationFrame(tick);
      };
      frameRef.current = window.requestAnimationFrame(tick);
      return () => {
        if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      };
    }

    setVisibleText("");
    const units = revealMode === "words"
      ? (text.match(/\S+\s*/g) ?? [])
      : Array.from(text);
    let index = 0;
    const revealNext = () => {
      index += revealMode === "words" ? 1 : Math.max(1, speed);
      setVisibleText(units.slice(0, index).join(""));
      if (index < units.length) {
        timerRef.current = window.setTimeout(revealNext, revealMode === "words" ? intervalMs : 0);
      }
    };
    timerRef.current = window.setTimeout(revealNext, 0);
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [animateOnce, intervalMs, isStreaming, revealMode, speed, text]);

  const rendered = useMemo(() => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        a: ({ children, ...props }) => (
          <a {...props} className="text-cyan-200 underline decoration-cyan-200/30 underline-offset-4" target="_blank" rel="noreferrer">
            {children}
          </a>
        ),
        code: ({ children, className: codeClassName, ...props }) => (
          <code {...props} className={`${codeClassName || ""} rounded-md bg-white/10 px-1.5 py-0.5 text-[0.92em] text-cyan-50`}>
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="quiet-scrollbar my-4 overflow-x-auto rounded-2xl border border-cyan-200/10 bg-slate-950/90 p-4 text-sm leading-6 shadow-2xl shadow-cyan-950/20">
            {children}
          </pre>
        ),
      }}
    >
      {visibleText || " "}
    </ReactMarkdown>
  ), [visibleText]);

  return (
    <div className={`sciloop-markdown max-w-none text-slate-100 ${className}`}>
      {rendered}
      {isStreaming ? <span className="ml-1 inline-block h-5 w-2 translate-y-1 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(125,245,255,0.75)] animate-pulse" /> : null}
    </div>
  );
}

export const TypewriterRenderer = memo(TypewriterRendererBase);
