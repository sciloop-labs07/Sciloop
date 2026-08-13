import { NodeRenderer } from "./NodeRenderer";
import type { LayerRendererProps } from "./renderer.types";
import { getLayerDepthStyle } from "./renderer.utils";

export function LayerRenderer({ layer, objects }: LayerRendererProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/70 p-4" style={getLayerDepthStyle(layer)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/80">Depth {layer.depth}</p>
          <h3 className="mt-1 text-base font-semibold text-white">{layer.title}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">{layer.description}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          {layer.atomsUsed.map((atom) => (
            <span key={atom} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-300">
              {atom}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {objects.map((object) => (
          <NodeRenderer key={object.id} object={object} />
        ))}
      </div>
    </section>
  );
}
