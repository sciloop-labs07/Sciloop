import type { MeaningConcept } from "@/lib/types";

const nodePositions = [
  { top: "10%", left: "12%" },
  { top: "18%", left: "68%" },
  { top: "66%", left: "20%" },
];

const linePoints = [
  { x1: 180, y1: 84, x2: 420, y2: 180 },
  { x1: 676, y1: 118, x2: 420, y2: 180 },
  { x1: 196, y1: 306, x2: 420, y2: 180 },
];

interface MeaningRealityConstellationProps {
  accent: string;
  concept: MeaningConcept;
}

export function MeaningRealityConstellation({
  accent,
  concept,
}: MeaningRealityConstellationProps) {
  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-4 md:min-h-[340px] md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Reality map
          </div>
          <div className="mt-2 font-display text-2xl font-semibold text-white">
            Where it appears
          </div>
        </div>
        <div
          className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em] text-white"
          style={{ borderColor: accent }}
        >
          3 live scenes
        </div>
      </div>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 840 360"
        fill="none"
      >
        {linePoints.map((line, index) => (
          <line
            key={`${line.x1}-${line.y1}`}
            className="constellation-link"
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={accent}
            strokeOpacity="0.4"
            strokeWidth="1.5"
            style={{ animationDelay: `${index * 0.9}s` }}
          />
        ))}
      </svg>

      <div className="relative h-[220px] md:h-[250px]">
        <div className="absolute left-1/2 top-1/2 w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-[26px] border border-white/12 bg-slate-950/75 px-5 py-4 text-center shadow-[0_20px_50px_rgba(0,0,0,0.32)] backdrop-blur-xl">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Core idea
          </div>
          <div className="mt-2 font-display text-2xl font-semibold text-white">
            {concept.conceptName}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {concept.simpleMeaning}
          </p>
        </div>

        {concept.realWorldExamples.map((example, index) => {
          const position = nodePositions[index];

          return (
            <div
              key={example.label}
              className="absolute w-[180px] rounded-[22px] border border-white/10 bg-slate-950/68 p-4 shadow-[0_16px_38px_rgba(0,0,0,0.26)] backdrop-blur-xl"
              style={{ ...position }}
            >
              <div
                className="mb-3 h-2.5 w-10 rounded-full"
                style={{ background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.2))` }}
              />
              <div className="font-display text-lg font-semibold text-white">
                {example.label}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {example.context}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
