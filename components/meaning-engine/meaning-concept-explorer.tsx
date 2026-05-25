import type { MeaningConcept, MeaningEngineSubject } from "@/lib/types";

interface MeaningConceptExplorerProps {
  concepts: MeaningConcept[];
  isPending: boolean;
  onSelect: (conceptId: string) => void;
  selectedConceptId: string;
  subject: MeaningEngineSubject;
}

export function MeaningConceptExplorer({
  concepts,
  isPending,
  onSelect,
  selectedConceptId,
  subject,
}: MeaningConceptExplorerProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="eyebrow">Concept explorer</div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">
            {subject.label}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Pick one concept and switch from exam wording to real-world meaning.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {concepts.map((concept, index) => {
          const active = concept.id === selectedConceptId;

          return (
            <button
              key={concept.id}
              type="button"
              onClick={() => onSelect(concept.id)}
              className="w-full rounded-[24px] border border-white/10 bg-white/[0.025] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/18"
              style={{
                borderColor: active ? subject.glow : undefined,
                background: active
                  ? `linear-gradient(180deg, rgba(255,255,255,0.08), ${subject.glow})`
                  : undefined,
                boxShadow: active ? `0 14px 38px ${subject.glow}` : undefined,
                opacity: isPending && !active ? 0.7 : 1,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-display text-lg font-semibold text-white">
                  {concept.conceptName}
                </div>
                <div className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                  0{index + 1}
                </div>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {concept.essence}
              </p>
            </button>
          );
        })}
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Fear switch
        </div>
        <div className="mt-4 grid gap-3">
          <div className="rounded-[18px] border border-rose-200/12 bg-rose-200/[0.05] px-3 py-2 text-sm text-rose-100">
            Memorize for marks
          </div>
          <div className="rounded-[18px] border border-cyan-200/12 bg-cyan-200/[0.05] px-3 py-2 text-sm text-cyan-100">
            Understand for reality
          </div>
          <div className="rounded-[18px] border border-amber-200/12 bg-amber-200/[0.05] px-3 py-2 text-sm text-amber-100">
            Use it to build new things
          </div>
        </div>
      </div>
    </div>
  );
}
