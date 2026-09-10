import type { VisualMechanismRecipe } from "@/lib/visual-mechanism-recipes";

export function SignalMechanismVisual({ recipe, compact = false }: { recipe: VisualMechanismRecipe; compact?: boolean }) {
  const height = compact ? 122 : 220;
  const nodeRadius = compact ? 22 : 34;
  const positions = compact ? [55, 210, 365] : [78, 260, 442];
  const centerY = compact ? 61 : 108;

  return (
    <svg
      className={compact ? "signal-mechanism-svg signal-mechanism-svg-compact" : "signal-mechanism-svg"}
      viewBox={`0 0 ${compact ? 420 : 520} ${height}`}
      role="img"
      aria-label={recipe.accessibleDescription}
    >
      <defs>
        <linearGradient id={`mechanism-${recipe.slug}`} x1="0" x2="1">
          <stop stopColor={recipe.accent} stopOpacity=".2" />
          <stop offset=".5" stopColor={recipe.accent} />
          <stop offset="1" stopColor="#78a9ff" />
        </linearGradient>
      </defs>
      <path
        className="signal-mechanism-flow"
        d={`M ${positions[0] + nodeRadius} ${centerY} C ${positions[0] + 84} ${centerY - 42}, ${positions[1] - 84} ${centerY + 42}, ${positions[1] - nodeRadius} ${centerY} S ${positions[2] - 84} ${centerY - 42}, ${positions[2] - nodeRadius} ${centerY}`}
        fill="none"
        stroke={`url(#mechanism-${recipe.slug})`}
        strokeDasharray="5 8"
        strokeWidth={compact ? 2 : 3}
      />
      {positions.map((x, index) => (
        <g key={recipe.steps[index]}>
          <circle className={`signal-mechanism-node signal-mechanism-node-${recipe.kind}`} cx={x} cy={centerY} r={nodeRadius} />
          <text className="signal-mechanism-index" x={x} y={centerY - nodeRadius - 12} textAnchor="middle">0{index + 1}</text>
          <text className="signal-mechanism-label" x={x} y={centerY + nodeRadius + 22} textAnchor="middle">{recipe.steps[index]}</text>
        </g>
      ))}
      {!compact ? <text className="signal-mechanism-caption" x="260" y="202" textAnchor="middle">{recipe.summary}</text> : null}
    </svg>
  );
}
