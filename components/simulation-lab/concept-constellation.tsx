"use client";

import type { ConceptNode } from "@/lib/types";

import { SignalRing } from "@/components/simulation-lab/signal-ring";
import { SandboxGlyph } from "@/components/simulation-lab/sandbox-glyph";

interface ConceptConstellationProps {
  nodes: ConceptNode[];
}

const positions = [
  { x: 18, y: 68 },
  { x: 50, y: 24 },
  { x: 80, y: 64 },
  { x: 28, y: 34 },
  { x: 72, y: 34 },
];

const kindToGlyph = {
  law: "field",
  experiment: "observe",
  effect: "shift",
  technology: "energyAbundance",
} as const;

const kindToTone = {
  law: "cyan",
  experiment: "gold",
  effect: "emerald",
  technology: "violet",
} as const;

export function ConceptConstellation({ nodes }: ConceptConstellationProps) {
  const nodeIndex = new Map(nodes.map((node, index) => [node.id, index]));
  const links = nodes.flatMap((node, index) =>
    node.links
      .map((targetId) => {
        const targetIndex = nodeIndex.get(targetId);

        if (targetIndex === undefined || targetIndex <= index) {
          return null;
        }

        return {
          from: positions[index % positions.length],
          to: positions[targetIndex % positions.length],
          id: `${node.id}-${targetId}`,
        };
      })
      .filter(Boolean),
  ) as Array<{ from: { x: number; y: number }; to: { x: number; y: number }; id: string }>;

  return (
    <div className="relative h-[24rem] overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(143,233,255,0.12),transparent_38%)]" />
      <svg className="absolute inset-0 h-full w-full">
        {links.map((link) => (
          <line
            key={link.id}
            x1={`${link.from.x}%`}
            y1={`${link.from.y}%`}
            x2={`${link.to.x}%`}
            y2={`${link.to.y}%`}
            className="constellation-link stroke-cyan-200/30"
            strokeWidth="1.2"
          />
        ))}
      </svg>

      {nodes.map((node, index) => {
        const position = positions[index % positions.length];

        return (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            title={`${node.label} (${node.kind})`}
          >
            <div className="flex flex-col items-center gap-2">
              <SignalRing
                value={node.weight}
                tone={kindToTone[node.kind]}
                size={74}
                strokeWidth={6}
              >
                <SandboxGlyph kind={kindToGlyph[node.kind]} className="h-7 w-7" />
              </SignalRing>
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  {node.kind}
                </div>
                <div className="mt-1 text-xs text-white">{node.label}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
