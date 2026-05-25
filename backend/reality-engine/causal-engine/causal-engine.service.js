const STOP = new Set(["the", "and", "for", "with", "from", "into", "that", "this", "have", "has", "new", "using", "will", "may"]);

export function keywordsFromText(text = "") {
  return [...new Set(String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP.has(word)))]
    .slice(0, 14);
}

export function inferField(text = "") {
  const t = text.toLowerCase();
  if (/battery|solar|energy|grid|fusion|power/.test(t)) return "Energy";
  if (/ai|model|robot|algorithm|computer|chip|data/.test(t)) return "Artificial Intelligence";
  if (/medicine|drug|cancer|gene|cell|health|vaccine/.test(t)) return "Biomedicine";
  if (/space|rocket|planet|galaxy|satellite|mars/.test(t)) return "Space";
  if (/climate|carbon|water|pollution|crop|agriculture/.test(t)) return "Planetary Systems";
  if (/material|graphene|crystal|polymer|semiconductor/.test(t)) return "Materials Science";
  return "Applied Reality";
}

export function buildCausalGraph(analysis = {}) {
  const nodes = [
    { id: "before", label: "Before World", type: "world-state" },
    { id: "bottleneck", label: "Bottleneck", type: "constraint" },
    { id: "discovery", label: "Discovery Event", type: "transition" },
    { id: "mechanism", label: "Mechanism", type: "causal-mechanism" },
    { id: "after", label: "After World", type: "world-state" },
    { id: "future", label: "Future Branches", type: "possibility-space" }
  ];
  const edges = [
    { from: "before", to: "bottleneck", label: "creates pressure" },
    { from: "bottleneck", to: "discovery", label: "forces invention" },
    { from: "discovery", to: "mechanism", label: "reveals method" },
    { from: "mechanism", to: "after", label: "changes behavior" },
    { from: "after", to: "future", label: "opens branches" }
  ];
  return {
    nodes,
    edges,
    keyForces: [
      ...(analysis.human_intention || []).slice(0, 3),
      ...(analysis.system_bottlenecks || []).slice(0, 3)
    ]
  };
}
