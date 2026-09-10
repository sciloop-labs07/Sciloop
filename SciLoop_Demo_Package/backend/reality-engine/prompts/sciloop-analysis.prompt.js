export function buildRealityEnginePrompt(input = {}) {
  return `You are SciLoop Reality Engine.
Analyze this science or innovation news as a causal civilization simulation.
Return JSON only. Do not invent exact people, dates, or claims not present in the article.

Input:
Title: ${input.title || "Unknown"}
Field: ${input.field || "auto"}
Summary: ${input.summary || ""}
Full text: ${input.fullText || ""}

Extract:
- human intention
- bottleneck
- problem space
- mechanism
- before world
- discovery event
- after world
- future branches
- civilization impact
- entropy reduction
- scale propagation from atom/cell to space civilization`;
}
