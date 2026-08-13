import { techCapabilityCategories } from "./techLab.constants";
import type { VisualTechDemo, VisualTechCapability } from "./techLab.types";

interface TechCapabilityMatrixProps {
  demos: VisualTechDemo[];
}

function capabilityClass(value: VisualTechCapability) {
  switch (value) {
    case "excellent":
      return "border-emerald-300/30 bg-emerald-300/15 text-emerald-50";
    case "good":
      return "border-cyan-300/30 bg-cyan-300/15 text-cyan-50";
    case "possible":
      return "border-slate-300/20 bg-slate-300/10 text-slate-200";
    case "future-only":
      return "border-amber-300/30 bg-amber-300/15 text-amber-50";
    case "not-ideal":
      return "border-white/10 bg-white/[0.03] text-slate-500";
  }
}

export function TechCapabilityMatrix({ demos }: TechCapabilityMatrixProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">Capability Matrix</p>
      <h2 className="mt-2 text-xl font-semibold text-white">Technology fit by category</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[960px] border-separate border-spacing-2 text-left text-xs">
          <thead>
            <tr>
              <th className="rounded-md border border-white/10 bg-slate-950/70 p-2 text-slate-300">Technology</th>
              {techCapabilityCategories.map((category) => (
                <th key={category} className="rounded-md border border-white/10 bg-slate-950/70 p-2 text-slate-300">{category}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {demos.map((demo) => (
              <tr key={demo.id}>
                <td className="rounded-md border border-white/10 bg-slate-950/70 p-2 font-semibold text-white">{demo.name}</td>
                {techCapabilityCategories.map((category) => {
                  const value = demo.capabilityScores[category] ?? "not-ideal";
                  return (
                    <td key={category} className={`rounded-md border p-2 ${capabilityClass(value)}`}>
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
