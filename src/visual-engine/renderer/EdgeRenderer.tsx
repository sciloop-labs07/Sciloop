import type { EdgeRendererProps } from "./renderer.types";
import { getEdgeVisualStyle, labelForObject } from "./renderer.utils";

export function EdgeRenderer({ relation, from, to }: EdgeRendererProps) {
  const style = getEdgeVisualStyle(relation);

  return (
    <article className="rounded-md border border-white/10 bg-white/[0.04] p-3">
      <div className="flex items-center gap-3">
        <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-200">{labelForObject(from, relation.fromObjectId)}</span>
        <svg className="h-6 w-20 shrink-0" viewBox="0 0 80 24" role="img" aria-label={relation.label}>
          <line
            x1="4"
            y1="12"
            x2="68"
            y2="12"
            stroke="currentColor"
            strokeDasharray={style.strokeDasharray}
            strokeWidth={style.strokeWidth}
            opacity={style.opacity}
          />
          <path d="M68 6 L78 12 L68 18 Z" fill="currentColor" opacity={style.opacity} />
        </svg>
        <span className="min-w-0 flex-1 truncate text-right text-xs font-medium text-slate-200">{labelForObject(to, relation.toObjectId)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-slate-400">
        <span>{relation.label}</span>
        <span>{relation.atom} / {relation.certainty ?? "unknown"}</span>
      </div>
      {relation.description ? <p className="mt-2 text-xs leading-5 text-slate-400">{relation.description}</p> : null}
    </article>
  );
}
