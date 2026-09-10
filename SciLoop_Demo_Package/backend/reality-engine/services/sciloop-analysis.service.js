import { keywordsFromText, inferField, buildCausalGraph } from "../causal-engine/causal-engine.service.js";
import { buildFutureBranches } from "../future-engine/future-engine.service.js";
import { buildTimeline } from "../timeline-engine/timeline-engine.service.js";
import { convertAnalysisToUnityPrompts } from "../unity-bridge/unity-bridge.service.js";

function sentence(text = "", fallback = "") {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return fallback;
  return clean.length > 170 ? `${clean.slice(0, 167)}...` : clean;
}

function deriveProblemSpace(field, keywords) {
  return [
    `${field} had a limitation that made progress slower, costlier, or less reliable.`,
    `People needed a better way to control ${keywords[0] || "the core process"}.`,
    `The old system created friction across knowledge, energy, material, health, or coordination flow.`
  ];
}

function deriveMechanisms(field, keywords) {
  const primary = keywords[0] || "new mechanism";
  const secondary = keywords[1] || "system behavior";
  return [
    `Change the behavior of ${primary}.`,
    `Improve how ${secondary} is measured, moved, transformed, or controlled.`,
    `Turn a hidden scientific rule into a practical tool.`
  ];
}

export async function generateRealityEngine(payload = {}) {
  const title = sentence(payload.title, "Untitled innovation");
  const summary = sentence(payload.summary || payload.fullText, "No summary was provided.");
  const text = `${title} ${payload.summary || ""} ${payload.fullText || ""}`;
  const keywords = keywordsFromText(text);
  const field = payload.field || inferField(text);
  const futureBranches = buildFutureBranches({ field, keywords });

  const analysis = {
    innovation_name: title,
    field,
    problem_space: deriveProblemSpace(field, keywords),
    human_intention: [
      "reduce limitation",
      "increase useful control over reality",
      "make life safer, faster, healthier, cheaper, or more understandable"
    ],
    system_bottlenecks: [
      `${keywords[0] || "core system"} was hard to control at scale`,
      `${keywords[1] || "knowledge"} moved slowly or unreliably`,
      "cost, risk, complexity, or access blocked wider use"
    ],
    mechanism_of_change: deriveMechanisms(field, keywords),
    before_world: {
      summary: `Before ${title}, people face the old bottleneck: ${summary}`,
      atmosphere: "slower, darker, limited, constrained",
      npc_behavior: "waiting, manual work, uncertainty, repeated friction",
      infrastructure: "older tools and fragmented systems"
    },
    discovery_event: {
      summary: `A discovery or innovation reveals a better mechanism for ${keywords[0] || field}.`,
      visual: "cyan-gold causal flash; bottleneck cracks; mechanism graph appears",
      transition: "constraint wall becomes a controllable pathway"
    },
    after_world: {
      summary: `After the innovation, the same world has more useful control, faster flow, and lower friction.`,
      atmosphere: "clearer, brighter, accelerated, connected",
      npc_behavior: "cooperation, tool use, better decisions, less waiting",
      infrastructure: "new pipelines for energy, information, material, or health benefit"
    },
    future_branches: futureBranches,
    civilization_impact: {
      level: "early-to-long-range",
      changes: [
        "knowledge moves faster",
        "resources may be used more efficiently",
        "new industries or skills can appear",
        "ethical and access choices shape the outcome"
      ],
      caution: "This is a possibility simulation, not a guaranteed prediction."
    },
    entropy_changes: {
      before: "high waste, uncertainty, delay, scattered effort",
      discovery: "new rule compresses confusion into usable understanding",
      after: "lower operational entropy: cleaner flows, better prediction, less repeated failure",
      visualization: "chaotic particles organize into directed streams"
    },
    scale_propagation: {
      atom: `microscopic mechanism: ${keywords[0] || "matter/energy/information"} changes behavior`,
      cell: "biological or material effects become measurable if relevant",
      human: "individual capability improves",
      city: "infrastructure or service patterns can change",
      planet: "large-scale resource, health, climate, or knowledge systems may shift",
      space_civilization: "long-range possibility: stronger civilization capacity beyond Earth"
    }
  };

  const timeline = buildTimeline(analysis);
  analysis.timeline = timeline;

  return {
    ok: true,
    analysis,
    unity: convertAnalysisToUnityPrompts(analysis),
    timeline,
    causalGraph: buildCausalGraph(analysis),
    entropyVisualization: {
      mode: "order-from-chaos",
      beforeParticles: "scattered gray-blue particles",
      afterParticles: "directed cyan-gold streams",
      metric: "friction down, useful control up"
    },
    scalePropagation: analysis.scale_propagation,
    generatedAt: new Date().toISOString(),
    engineVersion: "0.1.0-local-causal"
  };
}
