function promptList(items = []) {
  return items.filter(Boolean).slice(0, 5).join("; ");
}

export function convertAnalysisToUnityPrompts(analysis = {}) {
  const innovation = analysis.innovation_name || "Unknown innovation";
  const field = analysis.field || "Applied Reality";
  const bottlenecks = promptList(analysis.system_bottlenecks);
  const mechanisms = promptList(analysis.mechanism_of_change);
  const impacts = promptList(analysis.civilization_impact?.changes || []);

  return {
    before_world_prompt: `Cinematic ${field} before-world for ${innovation}: show everyday life constrained by ${bottlenecks || "slow, costly, fragile systems"}. Darker mood, slower motion, visible friction, scarce information/energy flow.`,
    after_world_prompt: `Cinematic after-world for ${innovation}: show the same environment after ${mechanisms || "the discovered mechanism"} changes behavior. Brighter energy paths, faster coordination, better tools, reduced friction.`,
    future_branch_prompts: (analysis.future_branches || []).map((branch) =>
      `Future branch ${branch.title}: ${branch.description} Visualize opportunity: ${branch.opportunity}. Risk layer: ${branch.risk}.`
    ),
    npc_behaviors: [
      "Before: NPCs wait, repeat manual tasks, move through bottlenecks, and show uncertainty.",
      "Discovery: NPC attention shifts toward the prototype or mechanism.",
      "After: NPCs coordinate faster, use upgraded tools, and exchange energy/information efficiently.",
      "Future: NPC groups split into branches based on access, safety, and social incentives."
    ],
    timeline_events: analysis.timeline || [],
    environment_assets: [
      "Before/after split world",
      "Discovery energy core",
      "Holographic causal graph",
      "Scale slider markers: Atom, Cell, Human, City, Planet, Space Civilization",
      "Entropy particles and order-grid overlay"
    ],
    atmosphere_settings: {
      before: { lighting: "low contrast dusk", fog: "mild uncertainty haze", color: "blue-gray" },
      discovery: { lighting: "white-cyan burst", particles: "causal sparks", color: "cyan-gold" },
      after: { lighting: "high clarity cinematic", fog: "minimal", color: "cyan-green-gold" },
      future: { lighting: "branching neon horizon", particles: "timeline trails", color: "violet-cyan" }
    },
    webglBuild: {
      expectedFolder: "/unity/SciLoopQuantumPossibilities/Build",
      loaderFile: "SciLoopQuantumPossibilities.loader.js",
      status: "protocol-ready"
    }
  };
}
