import type { FeedbackLoopRendererProps } from "./renderer.types";

export function FeedbackLoopRenderer({ feedbackLoop, getObjectLabel }: FeedbackLoopRendererProps) {
  return (
    <article className="rounded-lg border border-amber-300/20 bg-amber-300/[0.06] p-4">
      <div className="flex items-start gap-4">
        <svg className="mt-1 size-14 shrink-0 text-amber-200" viewBox="0 0 56 56" role="img" aria-label={feedbackLoop.label ?? feedbackLoop.id}>
          <path d="M40 16 A18 18 0 1 0 45 34" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path d="M39 8 L51 15 L38 21 Z" fill="currentColor" />
        </svg>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-white">{feedbackLoop.label ?? "Feedback loop"}</h3>
            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-amber-100">
              {feedbackLoop.polarity}
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-amber-50/75">
            {feedbackLoop.nodes.map((nodeId) => getObjectLabel(nodeId)).join(" -> ")}
          </p>
          <p className="mt-2 text-[11px] text-amber-100/70">Strength {Math.round(feedbackLoop.strength * 100)}%</p>
        </div>
      </div>
    </article>
  );
}
