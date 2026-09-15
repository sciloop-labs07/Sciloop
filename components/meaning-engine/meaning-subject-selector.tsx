import type { MeaningEngineSubject, MeaningEngineSubjectId } from "@/lib/types";

interface MeaningSubjectSelectorProps {
  conceptCount: Record<MeaningEngineSubjectId, number>;
  isPending: boolean;
  onSelect: (subjectId: MeaningEngineSubjectId) => void;
  selectedSubjectId: MeaningEngineSubjectId;
  subjects: MeaningEngineSubject[];
}

export function MeaningSubjectSelector({
  conceptCount,
  isPending,
  onSelect,
  selectedSubjectId,
  subjects,
}: MeaningSubjectSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {subjects.map((subject) => {
        const active = subject.id === selectedSubjectId;

        return (
          <button
            key={subject.id}
            type="button"
            onClick={() => onSelect(subject.id)}
            className="group rounded-[28px] border border-white/10 bg-white/[0.03] p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-white/20"
            style={{
              borderColor: active ? subject.glow : undefined,
              background: active
                ? `linear-gradient(180deg, ${subject.glow}, rgba(255,255,255,0.03))`
                : undefined,
              boxShadow: active ? `0 18px 54px ${subject.glow}` : undefined,
              opacity: isPending && !active ? 0.72 : 1,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className="grid h-11 w-11 place-items-center rounded-2xl border text-sm font-medium text-white"
                style={{
                  borderColor: subject.glow,
                  background: `linear-gradient(135deg, ${subject.glow}, rgba(255,255,255,0.05))`,
                }}
              >
                {subject.symbol}
              </div>
              <div className="text-right text-[10px] uppercase tracking-[0.22em] text-slate-500">
                {conceptCount[subject.id]} concepts
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="font-display text-xl font-semibold text-white">
                {subject.label}
              </div>
              <p className="max-w-xs text-sm leading-6 text-slate-300">
                {subject.tagline}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
