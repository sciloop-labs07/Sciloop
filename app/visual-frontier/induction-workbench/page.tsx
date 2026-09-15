import { InductionCanvasRenderer, InductionStaticFallback } from "@/src/physics-visual-language/renderers";

export const metadata = {
  title: "Induction Renderer Workbench | SciLoop",
  description: "Workbench-only deterministic renderer foundation for electromagnetic induction.",
};

export default function InductionWorkbenchPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <header><p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Physics Visual Language / Workbench</p><h1 className="mt-2 text-3xl font-semibold">Induction renderer foundation</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">A deterministic renderer test surface. It is intentionally outside public navigation and does not change the public SciLoop route.</p></header>
        <InductionCanvasRenderer />
        <InductionStaticFallback />
      </div>
    </main>
  );
}
