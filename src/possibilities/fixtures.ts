import type { EvidenceBrief } from "./types";
import { POSSIBILITY_SCHEMA_VERSION } from "./types";

const fixtureSource = (id: string, title: string): EvidenceBrief["sources"][number] => ({
  id,
  title,
  publisher: "SciLoop test fixture",
  sourceType: "user-input",
});

export const possibilityEvidenceFixtures: EvidenceBrief[] = [
  {
    schemaVersion: POSSIBILITY_SCHEMA_VERSION,
    id: "fixture-quantum-error-correction",
    subject: "quantum computing",
    title: "Fault-tolerant quantum computing",
    field: "Quantum computing",
    currentState: "Researchers are working to preserve useful quantum information while hardware remains noisy.",
    mechanism: "Logical qubits distribute information across physical qubits and use syndrome checks to detect error patterns without directly measuring the computation.",
    evidence: [
      { id: "q-fact-1", statement: "Physical qubits are affected by noise and error processes.", kind: "fact", strength: "strong", sourceIds: ["q-source"] },
      { id: "q-fact-2", statement: "Error correction requires additional physical resources around a logical qubit.", kind: "fact", strength: "moderate", sourceIds: ["q-source"] },
      { id: "q-inference-1", statement: "Scaling reliable logical qubits is an engineering bottleneck.", kind: "inference", strength: "moderate", sourceIds: ["q-source"] },
      { id: "q-unknown-1", statement: "The useful application threshold for a broad range of tasks remains uncertain.", kind: "unknown", strength: "unverified", sourceIds: [] },
    ],
    constraints: ["Error rates", "Control complexity", "Cooling and infrastructure", "Algorithm-specific usefulness"],
    dependencies: ["Reliable physical qubits", "Scalable error-correction architecture", "Useful algorithms", "Classical control systems"],
    unknowns: ["Which applications will produce value first?", "How much hardware overhead will practical workloads require?"],
    sources: [fixtureSource("q-source", "Quantum error-correction fixture")],
    generatedBy: "fixture",
  },
  {
    schemaVersion: POSSIBILITY_SCHEMA_VERSION,
    id: "fixture-crispr-therapy",
    subject: "gene editing",
    title: "Programmable gene editing in medicine",
    field: "Synthetic biology and medicine",
    currentState: "Gene-editing systems can target specific genetic sequences, but delivery, safety, and long-term effects remain central challenges.",
    mechanism: "A guide sequence directs an editing complex toward a matching DNA target, after which the cell repairs or incorporates the intended change.",
    evidence: [
      { id: "c-fact-1", statement: "Guide sequences can direct editing systems toward matching genetic targets.", kind: "fact", strength: "strong", sourceIds: ["c-source"] },
      { id: "c-fact-2", statement: "Delivery and off-target effects are important safety constraints.", kind: "fact", strength: "moderate", sourceIds: ["c-source"] },
      { id: "c-inference-1", statement: "Clinical expansion depends on precise delivery and durable safety evidence.", kind: "inference", strength: "moderate", sourceIds: ["c-source"] },
      { id: "c-unknown-1", statement: "Long-term outcomes may differ across tissues and patient populations.", kind: "unknown", strength: "unverified", sourceIds: [] },
    ],
    constraints: ["Off-target edits", "Delivery to the right cells", "Immune response", "Clinical evidence", "Access and governance"],
    dependencies: ["Accurate targeting", "Safe delivery", "Durable effect", "Manufacturing and clinical systems"],
    unknowns: ["Which delivery methods will scale safely?", "How should heritable editing be governed?"],
    sources: [fixtureSource("c-source", "Gene-editing therapy fixture")],
    generatedBy: "fixture",
  },
  {
    schemaVersion: POSSIBILITY_SCHEMA_VERSION,
    id: "fixture-solid-state-battery",
    subject: "energy storage",
    title: "Solid-state batteries at manufacturing scale",
    field: "Energy systems",
    currentState: "Solid electrolytes may improve safety or energy density, but interfaces, cycle life, cost, and manufacturing yield remain unresolved.",
    mechanism: "Ions move through a solid electrolyte between electrodes while electrons travel through an external circuit; interfaces determine much of the cell's practical performance.",
    evidence: [
      { id: "b-fact-1", statement: "A solid electrolyte changes the transport and interface problem inside a battery.", kind: "fact", strength: "strong", sourceIds: ["b-source"] },
      { id: "b-fact-2", statement: "Laboratory performance does not by itself establish manufacturing readiness.", kind: "fact", strength: "moderate", sourceIds: ["b-source"] },
      { id: "b-inference-1", statement: "Manufacturing yield and cycle durability are likely to decide adoption.", kind: "inference", strength: "moderate", sourceIds: ["b-source"] },
      { id: "b-unknown-1", statement: "The winning chemistry and manufacturing route are not settled.", kind: "unknown", strength: "unverified", sourceIds: [] },
    ],
    constraints: ["Interface stability", "Cycle life", "Manufacturing yield", "Material supply", "Cost"],
    dependencies: ["Stable electrolyte interfaces", "Repeatable manufacturing", "Supply-chain scale", "Charging and safety standards"],
    unknowns: ["Which architecture will achieve durable low-cost production?", "How will performance vary in different climates and use cases?"],
    sources: [fixtureSource("b-source", "Solid-state battery fixture")],
    generatedBy: "fixture",
  },
];
