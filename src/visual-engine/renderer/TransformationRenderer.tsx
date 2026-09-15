import type { TransformationRendererProps } from "./renderer.types";

export function TransformationRenderer({ transformation, getObjectLabel }: TransformationRendererProps) {
  const steps = [
    { label: "Before", value: getObjectLabel(transformation.before) },
    { label: "Process", value: getObjectLabel(transformation.process) },
    { label: "After", value: getObjectLabel(transformation.after) },
  ];

  return (
    <article className="rounded-lg border border-violet-300/20 bg-violet-300/[0.06] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white">{transformation.label ?? "Transformation"}</h3>
        <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-violet-100">
          {transformation.atom}
        </span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.label} className="rounded-md border border-white/10 bg-black/20 p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-violet-100/75">{step.label}</p>
            <p className="mt-1 text-sm font-medium text-white">{step.value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
