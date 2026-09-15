"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { routeSciLoopIntent, sciloopPortals } from "@/lib/sciloop-os";
import {
  advanceSciLoopProject,
  createSciLoopProject,
  loadSciLoopProject,
  saveSciLoopProject,
  workflowStages,
  type SciLoopProject,
} from "@/lib/sciloop-project";
import type { KernelPlanResponse } from "@/src/kernel";

const starterIntents = [
  "Explain how a black hole bends light visually",
  "Simulate what happens when energy abundance increases",
  "Find the frontier questions around human intelligence",
  "Turn a local water problem into an impact plan",
];

export function SciLoopWorkbench() {
  const [input, setInput] = useState("");
  const [hasRouted, setHasRouted] = useState(false);
  const [project, setProject] = useState<SciLoopProject | null>(null);
  const [kernelPlan, setKernelPlan] = useState<KernelPlanResponse | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const recommended = useMemo(() => routeSciLoopIntent(input), [input]);

  function persist(nextProject: SciLoopProject) {
    setProject(nextProject);
    saveSciLoopProject(nextProject);
  }

  async function startProject(nextInput = input) {
    const nextProject = createSciLoopProject(nextInput);
    persist(nextProject);
    setInput(nextProject.intent);
    setHasRouted(true);
    setIsPlanning(true);
    try {
      const response = await fetch("/api/kernel/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ input: nextProject.intent }),
      });
      if (response.ok) setKernelPlan(await response.json() as KernelPlanResponse);
    } catch {
      setKernelPlan(null);
    } finally {
      setIsPlanning(false);
    }
  }

  function advanceProject() {
    if (!project) return startProject();
    persist(advanceSciLoopProject(project));
  }

  async function routeIntent(nextInput = input) {
    await startProject(nextInput);
  }

  useEffect(() => {
    const saved = loadSciLoopProject();
    if (saved) {
      const frame = window.requestAnimationFrame(() => {
        setProject(saved);
        setInput(saved.intent);
        setHasRouted(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  return (
    <div className="space-y-8">
      <section className="panel-surface grid gap-8 rounded-[38px] border border-cyan-200/15 bg-cyan-200/[0.035] px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="space-y-6">
          <div className="eyebrow">SciLoop OS · unified workbench</div>
          <div className="space-y-4">
            <h1 className="font-display text-5xl font-semibold tracking-tight text-white md:text-7xl">
              Give science a place to think.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              Ask a question, bring a discovery, or name a problem. SciLoop routes your intent to the right scientific capability, then turns the result into evidence, visuals, experiments, and action.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/20 p-3">
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  setHasRouted(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") routeIntent();
                }}
                placeholder="What do you want to understand, test, or solve?"
                className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/40"
              />
              <button
                type="button"
                onClick={() => routeIntent()}
                className="min-h-12 rounded-2xl bg-cyan-100 px-5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
              >
                Route my intent
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {starterIntents.map((intent) => (
              <button
                key={intent}
                type="button"
                onClick={() => routeIntent(intent)}
                className="rounded-full border border-white/10 px-3 py-2 text-left text-xs text-slate-300 transition-colors hover:border-cyan-200/30 hover:text-white"
              >
                {intent}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-black/20 p-5">
          <div className="eyebrow">Intent router</div>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-cyan-200/20 bg-cyan-200/[0.06] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">Recommended capability</div>
              <div className="mt-2 font-display text-2xl font-semibold text-white">{recommended.name}</div>
              <p className="mt-2 text-sm leading-6 text-slate-300">{recommended.promise}</p>
              <Link
                href={recommended.href}
                onClick={() => setHasRouted(true)}
                className="mt-4 inline-flex rounded-full border border-cyan-200/30 px-4 py-2 text-sm text-white hover:border-cyan-200/60"
              >
                Open capability
              </Link>
            </div>

            <div className="space-y-3">
              {[
                ["01", "Interpret", "Understand the question, goal, and domain."],
                ["02", "Model", "Build a semantic graph and choose the right lens."],
                ["03", "Make visible", "Explain with evidence, visuals, or simulation."],
                ["04", "Loop", "Capture feedback and improve the next explanation."],
              ].map(([number, title, description]) => (
                <div key={number} className="flex gap-3">
                  <span className="font-mono text-xs text-cyan-200/60">{number}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">{title}</div>
                    <div className="text-xs leading-5 text-slate-400">{description}</div>
                  </div>
                </div>
              ))}
            </div>
            {hasRouted ? (
              <div className="rounded-2xl border border-emerald-200/20 bg-emerald-200/[0.05] p-3 text-xs leading-5 text-emerald-100">
                Intent classified. SciLoop is ready to continue in {recommended.name}.
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="panel-surface rounded-[32px] border border-white/10 bg-white/[0.03] p-5 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Active scientific project</div>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white">{project?.title ?? "Start a project from any question"}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{project?.nextAction ?? "SciLoop will connect evidence, explanation, experiments, and action into one persistent workflow."}</p>
          </div>
          <button type="button" onClick={advanceProject} className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-100">
            {project ? "Advance workflow" : "Create project"}
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {workflowStages.map((stage, index) => {
            const currentIndex = project ? workflowStages.findIndex((item) => item.id === project.currentStage) : -1;
            const active = project?.currentStage === stage.id;
            const complete = currentIndex > index;
            return (
              <div key={stage.id} className={`rounded-2xl border p-4 ${active ? "border-cyan-200/40 bg-cyan-200/[0.08]" : complete ? "border-emerald-200/25 bg-emerald-200/[0.05]" : "border-white/10 bg-black/10"}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-slate-500">0{index + 1}</span>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{complete ? "complete" : active ? "active" : "queued"}</span>
                </div>
                <div className="mt-3 font-display text-xl font-semibold text-white">{stage.label}</div>
                <p className="mt-1 text-xs leading-5 text-slate-400">{stage.description}</p>
              </div>
            );
          })}
        </div>

        {project ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.artifacts.map((artifact) => (
              <span key={artifact.id} className="chip rounded-full px-3 py-1.5 text-xs"><span className="chip-dot" />{artifact.title}</span>
            ))}
          </div>
        ) : null}

        {isPlanning ? <p className="mt-5 text-sm text-cyan-100">Kernel is interpreting the requirement and optimizing the workflow…</p> : null}
        {kernelPlan ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_20rem]">
            <div>
              <div className="eyebrow">Kernel execution plan</div>
              <div className="mt-3 space-y-2">
                {kernelPlan.plan.steps.map((step) => (
                  <div key={step.id} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-3">
                    <span className="font-mono text-xs text-cyan-200/70">0{step.order}</span>
                    <div>
                      <div className="text-sm font-semibold text-white">{step.label}</div>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{step.purpose}</p>
                    </div>
                    {step.requiresApproval ? <span className="ml-auto rounded-full border border-amber-200/25 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-amber-100">approval</span> : null}
                  </div>
                ))}
              </div>
            </div>
            <aside className="rounded-2xl border border-cyan-200/20 bg-cyan-200/[0.05] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">Plan health</div>
              <div className="mt-2 font-display text-3xl font-semibold text-white">{kernelPlan.evaluation.score}%</div>
              <p className="mt-2 text-xs leading-5 text-slate-300">{kernelPlan.evaluation.status === "ready" ? "Ready for execution." : "Needs review before execution."}</p>
              <div className="mt-4 space-y-2">
                {kernelPlan.evolution.slice(0, 3).map((proposal) => <div key={proposal.id} className="rounded-xl border border-white/10 bg-black/15 p-3 text-xs leading-5 text-slate-300"><span className="font-semibold text-white">Evolution signal:</span> {proposal.title}</div>)}
              </div>
            </aside>
          </div>
        ) : null}
      </section>

      <section className="space-y-5">
        <div>
          <div className="eyebrow">The SciLoop intelligence layer</div>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-5xl">Every portal has a job.</h2>
          <p className="mt-3 max-w-3xl text-slate-300">These are not disconnected destinations. They are specialized capabilities in one scientific workflow.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sciloopPortals.map((portal) => (
            <article key={portal.id} className="panel-surface flex h-full flex-col rounded-[30px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow">{portal.eyebrow}</span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">{portal.id}</span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold text-white">{portal.name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{portal.description}</p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/15 p-3 text-sm leading-6 text-slate-300">{portal.promise}</div>
              <div className="mt-5 flex flex-wrap gap-2">
                {portal.outputs.map((output) => <span key={output} className="chip rounded-full px-2.5 py-1 text-xs"><span className="chip-dot" />{output}</span>)}
              </div>
              <Link href={portal.href} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-200/25 px-4 py-2.5 text-sm text-white hover:border-cyan-200/50">Enter {portal.name}</Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
