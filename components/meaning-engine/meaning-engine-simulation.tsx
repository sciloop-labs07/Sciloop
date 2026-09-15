import type { MeaningConcept, MeaningEngineVisualMode } from "@/lib/types";

interface MeaningEngineSimulationProps {
  accent: string;
  concept: MeaningConcept;
}

function renderVisual(mode: MeaningEngineVisualMode, accent: string) {
  switch (mode) {
    case "derivative-slope":
      return (
        <>
          <path
            d="M120 390C210 360 260 292 336 286C422 280 462 178 540 170C648 160 718 220 826 124"
            stroke={accent}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M350 322L548 140"
            className="meaning-scan-trace"
            stroke="#f3c88d"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="430" cy="226" r="18" fill={accent} className="meaning-breathe" />
          <circle cx="430" cy="226" r="34" stroke={accent} strokeOpacity="0.35" />
          <path
            d="M116 420H850M120 106V418"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="2"
          />
        </>
      );
    case "probability-field":
      return (
        <>
          {Array.from({ length: 28 }).map((_, index) => {
            const x = 136 + (index % 7) * 96;
            const y = 132 + Math.floor(index / 7) * 78;
            const hot = index === 11 || index === 12 || index === 18 || index === 19;

            return (
              <circle
                key={`probability-${index}`}
                cx={x}
                cy={y}
                r={hot ? 18 : 10}
                fill={hot ? accent : "rgba(255,255,255,0.18)"}
                className={hot ? "meaning-breathe" : "meaning-float-soft"}
                style={{ animationDelay: `${index * 0.08}s` }}
              />
            );
          })}
          <path
            d="M220 110C340 66 520 68 738 190"
            className="meaning-scan-trace"
            stroke="#f3c88d"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      );
    case "gravity-orbit":
      return (
        <>
          <g className="meaning-rotate-slow" style={{ transformOrigin: "480px 250px" }}>
            <ellipse cx="480" cy="250" rx="264" ry="144" stroke={accent} strokeOpacity="0.34" strokeWidth="2" />
            <ellipse cx="480" cy="250" rx="196" ry="96" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
            <circle cx="744" cy="250" r="12" fill="#f3c88d" />
          </g>
          <circle cx="480" cy="250" r="58" fill={accent} className="meaning-breathe" />
          <circle cx="480" cy="250" r="102" stroke={accent} strokeOpacity="0.18" strokeWidth="20" />
          <circle cx="240" cy="112" r="14" fill="#ffffff" className="meaning-drop-loop" />
        </>
      );
    case "wave-motion":
      return (
        <>
          <path
            d="M108 262C156 190 214 190 262 262C310 334 368 334 416 262C464 190 522 190 570 262C618 334 676 334 724 262C772 190 820 190 852 262"
            stroke={accent}
            strokeWidth="6"
            strokeLinecap="round"
            className="meaning-wave-path"
          />
          <path
            d="M108 306C156 234 214 234 262 306C310 378 368 378 416 306C464 234 522 234 570 306C618 378 676 378 724 306C772 234 820 234 852 306"
            stroke="#f3c88d"
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.72"
            className="meaning-wave-path-reverse"
          />
        </>
      );
    case "equilibrium-shift":
      return (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <circle
              key={`eq-left-${index}`}
              cx={176 + index * 58}
              cy={188 + (index % 2) * 52}
              r="18"
              fill={accent}
              className="meaning-float-soft"
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          ))}
          {Array.from({ length: 5 }).map((_, index) => (
            <circle
              key={`eq-right-${index}`}
              cx={626 + index * 38}
              cy={186 + (index % 2) * 48}
              r="18"
              fill="#f3c88d"
              className="meaning-float-soft"
              style={{ animationDelay: `${index * 0.22}s` }}
            />
          ))}
          <path d="M356 194H606" stroke={accent} strokeWidth="4" className="meaning-scan-trace" />
          <path d="M356 282H606" stroke="#f3c88d" strokeWidth="4" className="meaning-scan-trace-reverse" />
          <path d="M578 176L606 194L578 212" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M384 264L356 282L384 300" stroke="#f3c88d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case "catalyst-energy":
      return (
        <>
          <path
            d="M120 360C242 358 258 150 480 148C698 146 716 356 842 360"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M120 360C252 358 280 230 480 228C680 226 710 356 842 360"
            stroke={accent}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="480" cy="228" r="18" fill={accent} className="meaning-breathe" />
          <circle cx="182" cy="360" r="16" fill="#f3c88d" className="meaning-float-soft" />
          <circle cx="778" cy="360" r="16" fill={accent} className="meaning-float-soft" />
        </>
      );
    case "cell-membrane":
      return (
        <>
          {Array.from({ length: 10 }).map((_, index) => (
            <circle
              key={`mem-top-${index}`}
              cx={146 + index * 72}
              cy="176"
              r="16"
              fill={accent}
              className="meaning-breathe"
              style={{ animationDelay: `${index * 0.12}s` }}
            />
          ))}
          {Array.from({ length: 10 }).map((_, index) => (
            <circle
              key={`mem-bottom-${index}`}
              cx={146 + index * 72}
              cy="318"
              r="16"
              fill={accent}
              className="meaning-breathe"
              style={{ animationDelay: `${index * 0.14}s` }}
            />
          ))}
          <rect x="432" y="148" width="86" height="198" rx="30" fill="rgba(255,255,255,0.08)" stroke="#f3c88d" strokeWidth="3" />
          <circle cx="474" cy="118" r="12" fill="#ffffff" className="meaning-drop-loop" />
          <circle cx="474" cy="378" r="12" fill="#f3c88d" className="meaning-rise-loop" />
        </>
      );
    case "dna-replication":
      return (
        <>
          <path
            d="M264 104C322 142 322 210 264 250C206 290 206 358 264 396"
            stroke={accent}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M696 104C638 142 638 210 696 250C754 290 754 358 696 396"
            stroke="#f3c88d"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {Array.from({ length: 8 }).map((_, index) => (
            <path
              key={`dna-rung-${index}`}
              d={`M${286 + index * 54} ${126 + index * 34}H${674 - index * 54}`}
              stroke="rgba(255,255,255,0.32)"
              strokeWidth="4"
              strokeLinecap="round"
              className="meaning-scan-trace"
              style={{ animationDelay: `${index * 0.16}s` }}
            />
          ))}
          <path d="M420 150L480 250L540 350" stroke={accent} strokeWidth="5" strokeDasharray="14 12" className="meaning-flow-dash" />
        </>
      );
    case "supply-demand":
      return (
        <>
          <path d="M178 108L786 380" stroke={accent} strokeWidth="6" strokeLinecap="round" />
          <path d="M178 378L786 112" stroke="#f3c88d" strokeWidth="6" strokeLinecap="round" />
          <circle cx="484" cy="244" r="16" fill="#ffffff" className="meaning-breathe" />
          <circle cx="484" cy="244" r="38" stroke={accent} strokeOpacity="0.28" />
          <path d="M140 404H820M170 92V404" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
        </>
      );
    case "inflation-cycle":
      return (
        <>
          {Array.from({ length: 4 }).map((_, index) => (
            <circle
              key={`inflation-ring-${index}`}
              cx="480"
              cy="250"
              r={54 + index * 36}
              stroke={index % 2 === 0 ? accent : "#f3c88d"}
              strokeOpacity={0.36 - index * 0.06}
              strokeWidth="12"
              className="meaning-breathe"
              style={{ animationDelay: `${index * 0.25}s` }}
            />
          ))}
          {Array.from({ length: 4 }).map((_, index) => (
            <rect
              key={`inflation-bar-${index}`}
              x={180 + index * 112}
              y={300 - index * 44}
              width="64"
              height={76 + index * 44}
              rx="18"
              fill={index < 2 ? "rgba(255,255,255,0.14)" : accent}
              className="meaning-rise-soft"
              style={{ animationDelay: `${index * 0.14}s` }}
            />
          ))}
        </>
      );
    case "plate-tectonics":
      return (
        <>
          <path d="M92 326H442L512 256L548 326H868" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)" strokeWidth="3" />
          <path d="M164 326L104 326L140 384" stroke={accent} strokeWidth="6" strokeLinecap="round" className="meaning-tectonic-push-left" />
          <path d="M792 326L852 326L820 384" stroke="#f3c88d" strokeWidth="6" strokeLinecap="round" className="meaning-tectonic-push-right" />
          <path d="M492 212L548 324" stroke={accent} strokeWidth="10" strokeLinecap="round" />
          <path d="M452 222L512 326" stroke="#f3c88d" strokeWidth="10" strokeLinecap="round" />
          {Array.from({ length: 3 }).map((_, index) => (
            <circle
              key={`quake-${index}`}
              cx="518"
              cy="280"
              r={22 + index * 28}
              stroke={accent}
              strokeOpacity={0.32 - index * 0.08}
              strokeWidth="3"
              className="meaning-breathe"
              style={{ animationDelay: `${index * 0.22}s` }}
            />
          ))}
        </>
      );
    case "water-cycle":
      return (
        <>
          <circle cx="188" cy="138" r="44" fill="#f3c88d" className="meaning-breathe" />
          <path d="M610 160C628 118 692 112 718 152C752 126 812 144 820 186C844 188 862 208 862 234C862 264 838 286 808 286H624C586 286 560 262 560 228C560 188 582 164 610 160Z" fill="rgba(255,255,255,0.18)" />
          <path d="M224 378H450L544 214L648 378H844" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)" strokeWidth="3" />
          <path d="M720 286L720 372" stroke={accent} strokeWidth="5" strokeDasharray="10 10" className="meaning-flow-dash" />
          <path d="M356 348C392 392 466 402 548 382" stroke={accent} strokeWidth="5" strokeLinecap="round" className="meaning-scan-trace" />
          <path d="M306 168C374 108 476 98 604 142" stroke="#f3c88d" strokeWidth="5" strokeLinecap="round" className="meaning-scan-trace-reverse" />
        </>
      );
  }
}

export function MeaningEngineSimulation({
  accent,
  concept,
}: MeaningEngineSimulationProps) {
  return (
    <div className="meaning-simulation-shell relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/78">
      <div className="meaning-simulation-grid absolute inset-0" />
      <div className="meaning-simulation-scan absolute inset-y-0 left-0 w-28" />

      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
        <span className="chip rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]">
          <span className="chip-dot" />
          Visual simulation
        </span>
        <span className="chip rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]">
          <span className="chip-dot" />
          {concept.visualMode.replace("-", " ")}
        </span>
      </div>

      <svg
        aria-hidden="true"
        className="relative z-[1] h-[320px] w-full md:h-[400px]"
        viewBox="0 0 960 520"
        fill="none"
      >
        <defs>
          <radialGradient id="meaningCoreGlow" cx="0" cy="0" r="1" gradientTransform="translate(480 250) rotate(90) scale(220 320)" gradientUnits="userSpaceOnUse">
            <stop stopColor={accent} stopOpacity="0.28" />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="960" height="520" fill="url(#meaningCoreGlow)" />

        {Array.from({ length: 20 }).map((_, index) => (
          <circle
            key={`particle-${index}`}
            cx={80 + (index % 5) * 180}
            cy={74 + Math.floor(index / 5) * 102}
            r={index % 4 === 0 ? 3.8 : 2.4}
            fill={index % 3 === 0 ? accent : "rgba(255,255,255,0.22)"}
            className="meaning-float-soft"
            style={{ animationDelay: `${index * 0.11}s` }}
          />
        ))}

        {renderVisual(concept.visualMode, accent)}
      </svg>
    </div>
  );
}
