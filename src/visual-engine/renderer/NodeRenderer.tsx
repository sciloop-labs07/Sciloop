import type { NodeRendererProps } from "./renderer.types";
import { getNodeVisualState } from "./renderer.utils";

export function NodeRenderer({ object }: NodeRendererProps) {
  const visualState = getNodeVisualState(object);
  const importance = Math.round((object.importance ?? 0.5) * 100);

  return (
    <article className={`rounded-md border p-3 ${visualState.className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-white">{object.label}</h4>
          <p className="mt-1 text-xs leading-5 text-slate-300">{object.description}</p>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300">
          {object.atom}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-cyan-300" style={{ width: `${importance}%` }} />
        </div>
        <span className="text-[11px] text-slate-400">{object.certainty ?? "unknown"}</span>
      </div>
    </article>
  );
}
