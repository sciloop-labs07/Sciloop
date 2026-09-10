import type { PhysicsVisualRecipe } from "@/lib/physics-visual-language";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function PhysicsMechanismVisual({ recipe }: { recipe: PhysicsVisualRecipe }) {
  const field = clamp(recipe.after.fieldIntensity, 0.2, 1);
  const lensing = clamp(recipe.after.lensing, 0.15, 1);
  const motion = clamp(recipe.after.orbitSpeed, 0.18, 1);
  const density = clamp(recipe.after.particleCount / 250, 0.35, 1);

  return (
    <svg
      className={`physics-language-visual physics-language-visual-${recipe.kind}`}
      viewBox="0 0 760 280"
      role="img"
      aria-label={`${recipe.title}: ${recipe.visualLabels.join(" to ")}`}
    >
      <defs>
        <linearGradient id={`physics-line-${recipe.slug}`} x1="0" x2="1">
          <stop stopColor={recipe.accent} stopOpacity="0.18" />
          <stop offset="0.5" stopColor={recipe.accent} />
          <stop offset="1" stopColor="#f8fafc" stopOpacity="0.58" />
        </linearGradient>
        <radialGradient id={`physics-core-${recipe.slug}`}>
          <stop stopColor={recipe.accent} stopOpacity="0.95" />
          <stop offset="1" stopColor={recipe.accent} stopOpacity="0.05" />
        </radialGradient>
      </defs>

      <path
        className="physics-language-flow"
        d="M 112 140 C 220 42, 278 238, 380 140 S 540 42, 648 140"
        fill="none"
        stroke={`url(#physics-line-${recipe.slug})`}
        strokeDasharray="6 12"
        strokeWidth="3"
      />

      {recipe.kind === "relativity" ? (
        <g className="physics-language-curvature" opacity={0.28 + lensing * 0.42}>
          <ellipse cx="380" cy="140" rx="270" ry="82" />
          <ellipse cx="380" cy="140" rx="205" ry="61" />
          <ellipse cx="380" cy="140" rx="132" ry="38" />
        </g>
      ) : null}

      {recipe.kind === "induction" ? (
        <g className="physics-language-field" opacity={0.3 + field * 0.55}>
          <circle cx="380" cy="140" r="48" />
          <circle cx="380" cy="140" r="78" />
          <circle cx="380" cy="140" r="108" />
        </g>
      ) : null}

      {recipe.kind === "higgs" ? (
        <g className="physics-language-lattice" opacity={0.3 + density * 0.45}>
          {Array.from({ length: 7 }, (_, index) => (
            <path key={index} d={`M ${150 + index * 78} 76 V 204`} />
          ))}
          {Array.from({ length: 3 }, (_, index) => (
            <path key={index} d={`M 120 ${104 + index * 36} H 640`} />
          ))}
        </g>
      ) : null}

      <circle className="physics-language-core" cx="380" cy="140" r={26 + field * 18} fill={`url(#physics-core-${recipe.slug})`} />
      {[
        [160, 140, 9],
        [380, 140, 12],
        [600, 140, 9],
      ].map(([cx, cy, radius], index) => (
        <g key={index}>
          <circle className="physics-language-node" cx={cx} cy={cy} r={radius} fill={recipe.accent} />
          <text className="physics-language-index" x={cx} y={cy - 24} textAnchor="middle">0{index + 1}</text>
          <text className="physics-language-label" x={cx} y="238" textAnchor="middle">{recipe.visualLabels[index]}</text>
        </g>
      ))}

      <text className="physics-language-caption" x="380" y="30" textAnchor="middle">
        {recipe.metrics[0]} · {recipe.metrics[1]} · {recipe.metrics[2]}
      </text>
      <title>{`${recipe.title}: ${recipe.mechanism}`}</title>
      <desc>Three stages show {recipe.visualLabels.join(", then ")}.</desc>
      <circle className="physics-language-motion" cx={380 - motion * 120} cy="140" r="4" fill="#fff" />
    </svg>
  );
}
