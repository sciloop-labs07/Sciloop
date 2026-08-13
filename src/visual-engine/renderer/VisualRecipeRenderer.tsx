import { validateVisualRecipe } from "@/src/visual-engine/foundation";

import { EdgeRenderer } from "./EdgeRenderer";
import { ExplanationPanel } from "./ExplanationPanel";
import { FeedbackLoopRenderer } from "./FeedbackLoopRenderer";
import { FlowRenderer } from "./FlowRenderer";
import { LayerRenderer } from "./LayerRenderer";
import { RendererFallback } from "./RendererFallback";
import { TimelineRenderer } from "./TimelineRenderer";
import { TransformationRenderer } from "./TransformationRenderer";
import type { VisualRecipeRendererProps } from "./renderer.types";
import { getObjectById, groupObjectsByLayer, labelForObject } from "./renderer.utils";

export function VisualRecipeRenderer({ recipe, mode = "full" }: VisualRecipeRendererProps) {
  const validation = validateVisualRecipe(recipe);

  if (!validation.ok) {
    return <RendererFallback recipe={recipe} errors={validation.errors} />;
  }

  const objectsByLayer = groupObjectsByLayer(recipe);
  const getObjectLabel = (id: string) => labelForObject(getObjectById(recipe, id), id);

  return (
    <section aria-label={`Visual recipe: ${recipe.title}`} className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/30">
      <header className="border-b border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/80">{recipe.visualType} / {recipe.pattern}</p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-white">{recipe.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{recipe.summary}</p>
          </div>
          <div className="rounded-md border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2 text-right">
            <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-100/75">Engine</p>
            <p className="mt-1 text-sm font-semibold text-white">{recipe.engineRecommendation.primary}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          {recipe.layers.map((layer) => (
            <LayerRenderer key={layer.id} layer={layer} objects={objectsByLayer.get(layer.id) ?? []} />
          ))}

          {recipe.relations.length > 0 ? (
            <section className="grid gap-3 md:grid-cols-2">
              {recipe.relations.map((relation) => (
                <EdgeRenderer
                  key={relation.id}
                  relation={relation}
                  from={getObjectById(recipe, relation.fromObjectId)}
                  to={getObjectById(recipe, relation.toObjectId)}
                />
              ))}
            </section>
          ) : null}

          {recipe.flows.length > 0 ? (
            <section className="grid gap-3 md:grid-cols-2">
              {recipe.flows.map((flow) => (
                <FlowRenderer key={flow.id} flow={flow} source={getObjectById(recipe, flow.source)} target={getObjectById(recipe, flow.target)} />
              ))}
            </section>
          ) : null}

          {mode === "full" ? (
            <>
              {recipe.transformations.map((transformation) => (
                <TransformationRenderer key={transformation.id} transformation={transformation} getObjectLabel={getObjectLabel} />
              ))}

              {recipe.feedbackLoops.map((feedbackLoop) => (
                <FeedbackLoopRenderer key={feedbackLoop.id} feedbackLoop={feedbackLoop} getObjectLabel={getObjectLabel} />
              ))}

              <TimelineRenderer recipe={recipe} />
            </>
          ) : null}
        </div>

        <ExplanationPanel recipe={recipe} />
      </div>
    </section>
  );
}
