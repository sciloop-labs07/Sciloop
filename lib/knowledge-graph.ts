export type KnowledgeDomain = "Physics" | "Mathematics" | "Biology" | "Chemistry" | "AI" | "Engineering" | "History" | "Economics" | "Civilization";
export type KnowledgeNodeKind = "concept" | "theory" | "equation" | "scientist" | "technology" | "experiment" | "organization" | "application" | "open-question";
export type KnowledgeEdgeRelation = "causes" | "depends on" | "extends" | "contradicts" | "enables" | "improves" | "inspired by" | "validated by";

export type KnowledgeNode = { id: string; label: string; kind: KnowledgeNodeKind; domain: KnowledgeDomain; description: string; x: number; y: number; year: number; novelty: "new" | "connected" | "known" };
export type KnowledgeEdge = { source: string; target: string; relation: KnowledgeEdgeRelation; weight: number };
export type LearningPath = { id: string; title: string; duration: string; steps: string[]; outcome: string };
export type KnowledgeGraph = {
  title: string;
  query: string;
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  timeline: Array<{ year: number; label: string; nodeIds: string[] }>;
  learningPaths: LearningPath[];
  visualizationPrompts: Array<{ nodeId: string; type: string; prompt: string }>;
  relatedDiscoveries: string[];
  openQuestions: string[];
  civilizationImpact: Array<{ domain: string; impact: number; explanation: string }>;
  novelty: { newNodes: string[]; newRelationships: string[]; contradictions: string[]; interdisciplinaryConnections: string[]; knowledgeGaps: string[]; branchScore: number };
  outputs: { graphJson: string; learningPaths: string; visualizationPrompts: string; relatedDiscoveries: string; openQuestions: string; civilizationImpact: string };
};

const domainColors: Record<KnowledgeDomain, string> = { Physics: "#67e8f9", Mathematics: "#c4b5fd", Biology: "#6ee7b7", Chemistry: "#fbbf24", AI: "#f9a8d4", Engineering: "#93c5fd", History: "#fdba74", Economics: "#86efac", Civilization: "#f0abfc" };
export { domainColors };

function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function node(id: string, label: string, kind: KnowledgeNodeKind, domain: KnowledgeDomain, description: string, x: number, y: number, year: number, novelty: KnowledgeNode["novelty"] = "connected"): KnowledgeNode { return { id, label, kind, domain, description, x, y, year, novelty }; }

export function buildKnowledgeGraph(discovery: string): KnowledgeGraph {
  const query = discovery.trim() || "a new scientific discovery";
  const root = slug(query).slice(0, 48) || "discovery";
  const nodes: KnowledgeNode[] = [
    node(root, query, "concept", "Physics", "The discovery signal that starts the graph.", 50, 48, 2026, "new"),
    node(`${root}-method`, "Evidence + method", "experiment", "Engineering", "How researchers made the invisible measurable.", 28, 28, 2025),
    node(`${root}-theory`, "Underlying theory", "theory", "Physics", "The rule or model that explains the observed result.", 50, 20, 1905),
    node(`${root}-math`, "Mathematical language", "equation", "Mathematics", "The structure used to describe the mechanism.", 72, 28, 1870),
    node(`${root}-biology`, "Living systems", "concept", "Biology", "The biological question this pattern touches.", 20, 55, 1953),
    node(`${root}-chemistry`, "Materials + chemistry", "technology", "Chemistry", "The substances and reactions that make the effect possible.", 79, 58, 1869),
    node(`${root}-ai`, "AI + computation", "technology", "AI", "A computational lens for finding patterns and scaling the insight.", 28, 78, 2024),
    node(`${root}-engineering`, "Engineering pathway", "technology", "Engineering", "A route from principle to prototype.", 72, 80, 2026),
    node(`${root}-application`, "Human application", "application", "Economics", "Where the discovery can change decisions, products, or systems.", 50, 72, 2032),
    node(`${root}-civilization`, "Civilization-scale question", "application", "Civilization", "What changes when the idea becomes widely usable?", 50, 94, 2050),
    node(`${root}-open`, "What remains unknown?", "open-question", "History", "The next question the graph cannot answer yet.", 88, 37, 2026, "new"),
  ];
  const edges: KnowledgeEdge[] = [
    { source: root, target: `${root}-method`, relation: "validated by", weight: 0.9 }, { source: root, target: `${root}-theory`, relation: "extends", weight: 0.9 }, { source: root, target: `${root}-open`, relation: "causes", weight: 0.8 },
    { source: `${root}-theory`, target: `${root}-math`, relation: "depends on", weight: 0.8 }, { source: `${root}-method`, target: `${root}-biology`, relation: "enables", weight: 0.7 }, { source: `${root}-method`, target: `${root}-chemistry`, relation: "improves", weight: 0.7 },
    { source: `${root}-math`, target: `${root}-ai`, relation: "enables", weight: 0.8 }, { source: `${root}-biology`, target: `${root}-application`, relation: "enables", weight: 0.7 }, { source: `${root}-chemistry`, target: `${root}-engineering`, relation: "enables", weight: 0.8 },
    { source: `${root}-ai`, target: `${root}-engineering`, relation: "improves", weight: 0.7 }, { source: `${root}-engineering`, target: `${root}-application`, relation: "causes", weight: 0.8 }, { source: `${root}-application`, target: `${root}-civilization`, relation: "enables", weight: 0.9 },
  ];
  const timeline = [{ year: 1869, label: "Foundations", nodeIds: [`${root}-chemistry`] }, { year: 1870, label: "Formal language", nodeIds: [`${root}-math`] }, { year: 1905, label: "Theory", nodeIds: [`${root}-theory`] }, { year: 1953, label: "Living systems", nodeIds: [`${root}-biology`] }, { year: 2024, label: "Computation", nodeIds: [`${root}-ai`] }, { year: 2026, label: "Discovery signal", nodeIds: [root, `${root}-method`, `${root}-open`] }, { year: 2050, label: "Civilization", nodeIds: [`${root}-civilization`] }];
  const learningPaths: LearningPath[] = [
    { id: "five-minute", title: "5-minute explanation", duration: "5 min", steps: [query, "Underlying theory", "One visual mechanism", "Why it matters"], outcome: "Explain the discovery in one clear mental model." },
    { id: "fifteen-minute", title: "15-minute deep dive", duration: "15 min", steps: ["Evidence + method", "Mathematical language", "Living systems", "Engineering pathway", "Open question"], outcome: "Connect the evidence to its interdisciplinary consequences." },
    { id: "one-hour", title: "1-hour mastery path", duration: "60 min", steps: ["Foundations", "Theory", "Methods", "Simulation", "Application", "Civilization-scale question"], outcome: "Build a transferable framework for asking the next research question." },
  ];
  const visualizationPrompts = nodes.map((item) => ({ nodeId: item.id, type: item.kind === "experiment" ? "interactive experiment" : item.kind === "application" ? "3D scene" : "animated diagram", prompt: `Visualize ${item.label} as a cinematic, scientifically grounded ${item.kind === "experiment" ? "interactive experiment" : "layered simulation"}; show ${item.description.toLowerCase()}, animate the edges, preserve mobile-readable labels, and use ${domainColors[item.domain]} as the signal accent.` }));
  const relatedDiscoveries = ["The foundational theory behind this result", "A neighboring discovery in a different scientific domain", "The experiment that made this mechanism visible", "A future application that could scale the insight"];
  const openQuestions = ["Which assumption is still least tested?", "What would falsify the current explanation?", "Which neighboring field has the missing tool?", "What is the smallest simulation that could answer the next question?"];
  const civilizationImpact = [{ domain: "Learning", impact: 91, explanation: "Makes complex ideas easier to understand and transfer." }, { domain: "Health", impact: 76, explanation: "Creates a path toward better measurement or intervention." }, { domain: "Industry", impact: 83, explanation: "Turns a principle into a design constraint or opportunity." }, { domain: "Economics", impact: 69, explanation: "Changes which capabilities become scalable." }, { domain: "Civilization", impact: 88, explanation: "Expands what society can ask, build, and imagine." }];
  const novelty = { newNodes: [query, "What remains unknown?"], newRelationships: ["Discovery → application", "Mathematical language → AI + computation", "Evidence + method → living systems"], contradictions: ["No contradiction detected without source-level evidence."], interdisciplinaryConnections: ["Physics ↔ Mathematics", "Biology ↔ Engineering", "AI ↔ Economics", "Discovery ↔ Civilization"], knowledgeGaps: ["Source article evidence not yet attached", "Quantitative limits need verification"], branchScore: 87 };
  const graphJson = JSON.stringify({ nodes, edges }, null, 2);
  const learningPathsText = learningPaths.map((path) => `# ${path.title} (${path.duration})\n\n${path.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}\n\nOutcome: ${path.outcome}`).join("\n\n");
  const visualizationText = visualizationPrompts.map((item) => `## ${item.type}\n\n${item.prompt}`).join("\n\n");
  const relatedText = relatedDiscoveries.map((item) => `- ${item}`).join("\n");
  const questionsText = openQuestions.map((item) => `- ${item}`).join("\n");
  const impactText = civilizationImpact.map((item) => `- ${item.domain}: ${item.impact}/100 — ${item.explanation}`).join("\n");
  return { title: query, query, nodes, edges, timeline, learningPaths, visualizationPrompts, relatedDiscoveries, openQuestions, civilizationImpact, novelty, outputs: { graphJson, learningPaths: learningPathsText, visualizationPrompts: visualizationText, relatedDiscoveries: relatedText, openQuestions: questionsText, civilizationImpact: impactText } };
}
