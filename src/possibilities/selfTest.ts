import { possibilityEvidenceFixtures } from "./fixtures";
import { runPossibilityPipeline } from "./pipeline";
import { validateEvidenceBrief } from "./validator";
import { POSSIBILITY_SCHEMA_VERSION, type EvidenceBrief } from "./types";

export function runPossibilityContractSelfTest() {
  const results = possibilityEvidenceFixtures.map((fixture) => ({
    id: fixture.id,
    result: validateEvidenceBrief(fixture),
  }));
  return {
    ok: results.every(({ result }) => result.ok),
    results,
  };
}

function domainFixture(id: string, field: string, title: string, mechanism: string): EvidenceBrief {
  const sourceId = `${id}-source`;
  return {
    schemaVersion: POSSIBILITY_SCHEMA_VERSION,
    id,
    subject: field,
    title,
    field,
    currentState: `Researchers can study ${field}, but important limits remain explicit in the supplied test brief.`,
    mechanism,
    history: [`Before ${title}, researchers relied on earlier methods with narrower reach.`, `The field is now testing whether the mechanism scales responsibly.`],
    evidence: [
      { id: `${id}-fact`, statement: `The mechanism changes what can be measured or built in ${field}.`, kind: "fact", strength: "moderate", sourceIds: [sourceId] },
      { id: `${id}-inference`, statement: `Scaling the mechanism depends on solving the listed constraints.`, kind: "inference", strength: "moderate", sourceIds: [sourceId] },
      { id: `${id}-unknown`, statement: "The long-term system effects remain unknown.", kind: "unknown", strength: "unverified", sourceIds: [] },
    ],
    constraints: ["reliability", "cost and scale", "independent validation"],
    dependencies: ["better measurements", "repeatable engineering", "careful testing"],
    unknowns: ["Which application will prove most useful first?"],
    sources: [{ id: sourceId, title: `${title} test source`, publisher: "SciLoop self-test", sourceType: "user-input" }],
    generatedBy: "fixture",
  };
}

export function runQuantumDomainSelfTest() {
  const fixtures = [
    domainFixture("domain-physics", "Physics", "Gravitational-wave detection", "Interferometers compare tiny changes in path length caused by passing spacetime waves."),
    domainFixture("domain-biology", "Biology", "Programmable gene editing", "A guide sequence directs a molecular complex toward a matching DNA target."),
    domainFixture("domain-computer-science", "Computer science", "Transformer language models", "Attention mixes information across a sequence so the model can predict context-dependent tokens."),
    domainFixture("domain-chemistry", "Chemistry", "Catalytic reaction design", "A catalyst changes the reaction pathway and lowers the effective activation barrier without being consumed."),
    domainFixture("domain-space", "Space science", "Reusable orbital launch", "A launch vehicle returns enough hardware for controlled recovery and a later flight."),
  ];
  const results = fixtures.map((fixture) => {
    const result = runPossibilityPipeline(fixture, { includeVisual: true });
    const analysis = result.ok ? result.analysis : undefined;
    return {
      id: fixture.id,
      ok: Boolean(result.ok && analysis?.before && analysis.discoveryMechanism && analysis.after && analysis.counterfactual && analysis.futurePossibilities.length && analysis.visualScene.beforeScene),
      stages: result.stages,
    };
  });
  return { ok: results.every((result) => result.ok), results };
}
