import type { FlowRendererProps } from "./renderer.types";
import { getFlowVisualStyle, labelForObject } from "./renderer.utils";

export function FlowRenderer({ flow, source, target }: FlowRendererProps) {
  const style = getFlowVisualStyle(flow);
  const rate = Math.round(flow.rate * 100);

  return (
    <article className="rounded-md border border-cyan-300/20 bg-cyan-300/[0.06] p-3">
      <div className="flex items-center gap-3">
        <span className="min-w-0 flex-1 truncate text-xs font-medium text-cyan-50">{labelForObject(source, flow.source)}</span>
        <svg className="h-7 w-24 shrink-0" viewBox="0 0 96 28" role="img" aria-label={flow.label ?? flow.id}>
          <line x1="6" y1="14" x2="78" y2="14" stroke={style.color} strokeWidth={style.strokeWidth} strokeLinecap="round" opacity="0.85" />
          <circle className="animate-pulse motion-reduce:animate-none" cx="46" cy="14" r="4" fill={style.color} />
          <path d="M78 7 L92 14 L78 21 Z" fill={style.color} />
        </svg>
        <span className="min-w-0 flex-1 truncate text-right text-xs font-medium text-cyan-50">{labelForObject(target, flow.target)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-cyan-100/75">
        <span>{flow.label ?? flow.material}</span>
        <span>{flow.material} / {rate}%</span>
      </div>
    </article>
  );
}
