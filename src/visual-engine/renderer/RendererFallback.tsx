import type { RendererFallbackProps } from "./renderer.types";

export function RendererFallback({ recipe, errors }: RendererFallbackProps) {
  return (
    <section className="rounded-lg border border-rose-300/30 bg-rose-950/30 p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-rose-100/80">Renderer fallback</p>
      <h2 className="mt-2 text-xl font-semibold text-white">{recipe?.fallback?.title ?? recipe?.title ?? "Visual recipe cannot render"}</h2>
      <p className="mt-2 text-sm leading-6 text-rose-50/75">
        {recipe?.fallback?.messageForUser ?? recipe?.fallback?.description ?? "The recipe is missing required fields or references."}
      </p>
      <ul className="mt-4 space-y-2">
        {errors.map((error) => (
          <li key={error} className="rounded-md border border-rose-200/20 bg-black/20 px-3 py-2 text-sm text-rose-50/85">
            {error}
          </li>
        ))}
      </ul>
    </section>
  );
}
