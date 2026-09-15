import type { InnovationRecord } from "@/data/innovations";
import { POSSIBILITY_SCHEMA_VERSION, type EvidenceBrief } from "./types";

export function evidenceBriefFromInnovation(innovation: InnovationRecord): EvidenceBrief {
  const sourceId = `${innovation.slug}-editorial-source`;
  return {
    schemaVersion: POSSIBILITY_SCHEMA_VERSION,
    id: `${innovation.slug}-possibility-brief`,
    subject: innovation.field,
    title: innovation.title,
    field: innovation.field,
    currentState: innovation.summary,
    mechanism: innovation.mechanism,
    history: innovation.timeline.map((item) => `${item.year}: ${item.label}. ${item.detail}`),
    evidence: [
      ...innovation.facts.map((statement, index) => ({
        id: `${innovation.slug}-fact-${index + 1}`,
        statement,
        kind: "fact" as const,
        strength: "moderate" as const,
        sourceIds: [sourceId],
      })),
      ...innovation.futures.filter((future) => future.tone === "open").map((future, index) => ({
        id: `${innovation.slug}-unknown-${index + 1}`,
        statement: future.detail,
        kind: "unknown" as const,
        strength: "unverified" as const,
        sourceIds: [],
      })),
    ],
    constraints: innovation.futures.filter((future) => future.tone === "caution").map((future) => future.detail),
    dependencies: innovation.technology.map((item) => item.label),
    unknowns: innovation.futures.filter((future) => future.tone === "open").map((future) => future.detail),
    sources: [{
      id: sourceId,
      title: innovation.source,
      publisher: "SciLoop editorial layer",
      sourceType: "user-input",
    }],
    generatedBy: "fallback",
  };
}
