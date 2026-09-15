"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { MeaningConceptExplorer } from "@/components/meaning-engine/meaning-concept-explorer";
import { MeaningEngineSimulation } from "@/components/meaning-engine/meaning-engine-simulation";
import { MeaningRealityConstellation } from "@/components/meaning-engine/meaning-reality-constellation";
import { MeaningSubjectSelector } from "@/components/meaning-engine/meaning-subject-selector";
import { FadeIn } from "@/components/ui/fade-in";
import { Panel } from "@/components/ui/panel";
import {
  getMeaningConcept,
  getMeaningConceptsForSubject,
  getMeaningSubject,
  meaningEngineSubjects,
} from "@/data/meaning-engine";
import type { MeaningEngineSubjectId } from "@/lib/types";

interface MeaningEnginePortalProps {
  initialConceptId: string;
  initialSubjectId: MeaningEngineSubjectId;
}

export function MeaningEnginePortal({
  initialConceptId,
  initialSubjectId,
}: MeaningEnginePortalProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedSubjectId, setSelectedSubjectId] =
    useState<MeaningEngineSubjectId>(initialSubjectId);
  const [selectedConceptId, setSelectedConceptId] =
    useState<string>(initialConceptId);

  const selectedSubject = getMeaningSubject(selectedSubjectId);
  const subjectConcepts = getMeaningConceptsForSubject(selectedSubjectId);
  const selectedConcept = getMeaningConcept(selectedSubjectId, selectedConceptId);
  const conceptCount = meaningEngineSubjects.reduce(
    (countMap, subject) => {
      countMap[subject.id] = getMeaningConceptsForSubject(subject.id).length;
      return countMap;
    },
    {} as Record<MeaningEngineSubjectId, number>,
  );

  function updateUrl(subjectId: MeaningEngineSubjectId, conceptId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("subject", subjectId);
    params.set("concept", conceptId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleSubjectSelect(subjectId: MeaningEngineSubjectId) {
    if (subjectId === selectedSubjectId) {
      return;
    }

    const nextConcept = getMeaningConcept(subjectId);

    // Keep the UI responsive while syncing the selected state into the URL.
    startTransition(() => {
      setSelectedSubjectId(subjectId);
      setSelectedConceptId(nextConcept.id);
      updateUrl(subjectId, nextConcept.id);
    });
  }

  function handleConceptSelect(conceptId: string) {
    if (conceptId === selectedConceptId) {
      return;
    }

    startTransition(() => {
      setSelectedConceptId(conceptId);
      updateUrl(selectedSubjectId, conceptId);
    });
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <Panel className="rounded-[38px] px-6 py-8 md:px-8 md:py-10" glow>
            <div className="space-y-7">
              <div className="flex flex-wrap gap-2">
                <span className="chip rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]">
                  <span className="chip-dot" />
                  Survival portal
                </span>
                <span className="chip rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]">
                  <span className="chip-dot" />
                  Meaning engine
                </span>
                <span className="chip rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]">
                  <span className="chip-dot" />
                  6 subjects
                </span>
              </div>

              <div className="space-y-4">
                <div className="eyebrow">Exam fear to real meaning</div>
                <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">
                  Survival <span className="text-gradient">Meaning Engine</span>
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                  When study feels forced, this portal turns a concept into a
                  clear picture: what it is, why it exists, who built it, what
                  reality it explains, and what new things it can still unlock.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Start point
                  </div>
                  <div className="mt-2 font-display text-xl font-semibold text-white">
                    I only need marks
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Switch
                  </div>
                  <div className="mt-2 font-display text-xl font-semibold text-white">
                    Show the real thing
                  </div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    End point
                  </div>
                  <div className="mt-2 font-display text-xl font-semibold text-white">
                    I can use this
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#meaning-engine-subjects"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-200/30 bg-linear-to-r from-cyan-300/20 via-cyan-200/10 to-amber-200/12 px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Choose a subject
                </a>
                <a
                  href="#exam-switch"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-100 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Jump to exam switch
                </a>
              </div>
            </div>
          </Panel>

          <Panel className="meaning-hero-surface relative overflow-hidden rounded-[38px] px-6 py-8 md:px-8 md:py-10">
            <div
              className="meaning-hero-aura absolute -right-20 top-[-14%] h-72 w-72 rounded-full blur-3xl"
              style={{ background: selectedSubject.glow }}
            />
            <div className="relative space-y-8">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="eyebrow">Live concept</div>
                  <div className="font-display text-3xl font-semibold text-white">
                    {selectedConcept.conceptName}
                  </div>
                </div>
                <div
                  className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em] text-white"
                  style={{ borderColor: selectedSubject.accent }}
                >
                  {isPending ? "switching" : selectedSubject.shortLabel}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-slate-950/65 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  One-line essence
                </div>
                <p className="mt-3 text-lg leading-8 text-slate-100">
                  {selectedConcept.essence}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Reality translation
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {selectedConcept.symbolToReality}
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Innovation horizon
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {selectedConcept.futureInnovation[0].detail}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.025] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Builders
                  </div>
                  <div className="mt-2 font-display text-2xl font-semibold text-white">
                    {selectedConcept.discoveredBy.length}
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/[0.025] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Reality scenes
                  </div>
                  <div className="mt-2 font-display text-2xl font-semibold text-white">
                    {selectedConcept.realWorldExamples.length}
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/[0.025] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Timeline
                  </div>
                  <div className="mt-2 font-display text-2xl font-semibold text-white">
                    {selectedConcept.timeline[0]?.year}
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </section>
      </FadeIn>

      <FadeIn delay={0.06}>
        <section id="meaning-engine-subjects" className="scroll-mt-28">
          <Panel className="rounded-[34px] px-5 py-6 md:px-7 md:py-7">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <div className="eyebrow">Subject selector</div>
                <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
                  Start with the subject that currently feels most forced.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-300">
                Each card opens two seeded concepts now, but the structure is
                ready to expand into a wider concept library later.
              </p>
            </div>

            <MeaningSubjectSelector
              conceptCount={conceptCount}
              isPending={isPending}
              onSelect={handleSubjectSelect}
              selectedSubjectId={selectedSubjectId}
              subjects={meaningEngineSubjects}
            />
          </Panel>
        </section>
      </FadeIn>

      <section className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <FadeIn delay={0.1}>
          <Panel className="rounded-[34px] px-5 py-6 md:px-6">
            <MeaningConceptExplorer
              concepts={subjectConcepts}
              isPending={isPending}
              onSelect={handleConceptSelect}
              selectedConceptId={selectedConcept.id}
              subject={selectedSubject}
            />
          </Panel>
        </FadeIn>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedConcept.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Core concept surface: simulation first, then meaning layers. */}
            <Panel className="rounded-[36px] px-5 py-5 md:px-6 md:py-6">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-3">
                  <div className="eyebrow">What it really is</div>
                  <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
                    {selectedConcept.conceptName}
                  </h2>
                  <p className="max-w-2xl text-base leading-7 text-slate-300">
                    {selectedConcept.simpleMeaning}
                  </p>
                </div>
                <div
                  className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.22em] text-white"
                  style={{ borderColor: selectedSubject.accent }}
                >
                  {selectedSubject.label}
                </div>
              </div>

              <MeaningEngineSimulation
                accent={selectedSubject.accent}
                concept={selectedConcept}
              />

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Essence
                  </div>
                  <p className="mt-3 text-base leading-7 text-slate-200">
                    {selectedConcept.essence}
                  </p>
                  <div className="mt-5 text-xs uppercase tracking-[0.2em] text-slate-500">
                    Symbol to reality
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {selectedConcept.symbolToReality}
                  </p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Why it exists
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {selectedConcept.whyItExists}
                  </p>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Reality connection
                  </div>
                  <div className="mt-4 space-y-3">
                    {selectedConcept.realWorldExamples.map((example) => (
                      <div
                        key={example.label}
                        className="rounded-[18px] border border-white/10 bg-slate-950/65 px-3 py-3"
                      >
                        <div className="font-display text-lg font-semibold text-white">
                          {example.label}
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          {example.context}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>

            <div className="grid gap-6 2xl:grid-cols-[1.08fr_0.92fr]">
              <MeaningRealityConstellation
                accent={selectedSubject.accent}
                concept={selectedConcept}
              />

              <Panel className="rounded-[32px] px-5 py-5 md:px-6">
                <div className="space-y-4">
                  <div className="eyebrow">Timeline strip</div>
                  <h3 className="font-display text-2xl font-semibold text-white">
                    Discovery timeline
                  </h3>
                </div>
                <div className="quiet-scrollbar mt-5 overflow-x-auto pb-2">
                  <div className="flex min-w-max gap-4">
                    {selectedConcept.timeline.map((entry, index) => (
                      <div
                        key={entry.year + entry.label}
                        className="w-[240px] rounded-[24px] border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                            {entry.year}
                          </div>
                          <div
                            className="h-2.5 w-10 rounded-full"
                            style={{
                              background:
                                index % 2 === 0
                                  ? `linear-gradient(90deg, ${selectedSubject.accent}, rgba(255,255,255,0.12))`
                                  : "linear-gradient(90deg, rgba(243,200,141,0.92), rgba(255,255,255,0.12))",
                            }}
                          />
                        </div>
                        <div className="mt-4 font-display text-xl font-semibold text-white">
                          {entry.label}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {entry.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            </div>

            <Panel className="rounded-[32px] px-5 py-5 md:px-6">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-3">
                  <div className="eyebrow">Who built it</div>
                  <h3 className="font-display text-2xl font-semibold text-white">
                    Scientist and builder strip
                  </h3>
                </div>
                <p className="max-w-xl text-sm leading-7 text-slate-300">
                  Concepts become easier to care about when we can see the humans
                  and civilizations behind them.
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {selectedConcept.discoveredBy.map((builder) => (
                  <div
                    key={builder.name}
                    className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {builder.era}
                    </div>
                    <div className="mt-3 font-display text-2xl font-semibold text-white">
                      {builder.name}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {builder.role}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>

            <section className="grid gap-6 lg:grid-cols-2">
              <Panel className="rounded-[32px] px-5 py-5 md:px-6">
                <div className="space-y-3">
                  <div className="eyebrow">Impact layer</div>
                  <h3 className="font-display text-2xl font-semibold text-white">
                    What became possible
                  </h3>
                </div>
                <div className="mt-5 space-y-3">
                  {selectedConcept.impact.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="font-display text-lg font-semibold text-white">
                        {item.label}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel className="rounded-[32px] px-5 py-5 md:px-6">
                <div className="space-y-3">
                  <div className="eyebrow">Future innovation</div>
                  <h3 className="font-display text-2xl font-semibold text-white">
                    What deeper understanding can still unlock
                  </h3>
                </div>
                <div className="mt-5 space-y-3">
                  {selectedConcept.futureInnovation.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="font-display text-lg font-semibold text-white">
                        {item.label}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </Panel>
            </section>

            <Panel
              id="exam-switch"
              className="rounded-[36px] px-5 py-6 md:px-7 md:py-7"
            >
              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
                <div className="space-y-4">
                  <div className="eyebrow">Exam to meaning switch</div>
                  <h3 className="font-display text-3xl font-semibold text-white md:text-4xl">
                    From exam fear to real meaning
                  </h3>
                  <p className="max-w-xl text-base leading-7 text-slate-300">
                    The exam sentence stays short. The meaning sentence shows the
                    reality hiding underneath it.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                  <div className="rounded-[28px] border border-rose-200/12 bg-rose-200/[0.06] p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-rose-100/70">
                      For exam
                    </div>
                    <p className="mt-3 font-display text-2xl font-semibold text-white">
                      {selectedConcept.examTranslation.exam}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div
                      className="grid h-14 w-14 place-items-center rounded-full border text-xl text-white"
                      style={{
                        borderColor: selectedSubject.accent,
                        background: `linear-gradient(135deg, ${selectedSubject.glow}, rgba(255,255,255,0.05))`,
                      }}
                    >
                      →
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-cyan-200/12 bg-cyan-200/[0.06] p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">
                      Real meaning
                    </div>
                    <p className="mt-3 font-display text-2xl font-semibold text-white">
                      {selectedConcept.examTranslation.meaning}
                    </p>
                  </div>
                </div>
              </div>
            </Panel>
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
