# Enterprise Architecture

## Target architecture

```text
AGI OS research surface
  candidate graphs · experiments · structural evaluation
                    │ versioned EnginePackage export
                    ▼
SciLoop adapter layer
  schema validation · capability mapping · promotion checks
                    ▼
Controlled AI service
  provider routing · evidence preparation · guarded generation
                    ▼
Visual Predictive Engine
  knowledge graph · causal scenarios · visual recipe · simulation
                    ▼
React / Three.js experience
  explanation · interaction · visual state · safe fallback
                    ▼
Evaluation and telemetry
  user feedback · prediction/outcome records · evolution suggestions
```

## Existing SciLoop components

- `lib/knowledge-graph.ts` — typed nodes, relations, paths, questions, and impact summaries.
- `src/possibilities/*` — evidence brief, scenario, visual specification, and validation types.
- `backend/reality-engine` — causal before/after/future planning behind the AI boundary.
- `src/visual-engine/foundation` — typed visual recipes, semantics, and validation.
- `src/visual-engine/patterns` — reusable explanation patterns.
- `src/visual-engine/engines` — capability routing and fallbacks.
- `src/visual-engine/memory` — reviewed visual memory concepts.
- `lib/evolution-engine.ts` — predicted versus actual outcome comparison for content experiments.
- `components/three` — browser-native visual worlds and simulations.

## Adapter rule

AGI OS does not become a runtime dependency of the public app. Its useful artifacts are exported as versioned, validated packages. SciLoop imports the package and runs it through its own evidence, safety, renderer, tenant, and telemetry boundaries.

## Proposed package contract

```ts
type EnginePackage = {
  id: string;
  version: string;
  domain: string;
  flow: FlowDefinition;
  visualLanguage: VisualLanguageMap;
  scenarioTemplates: ScenarioTemplate[];
  evaluationRules: EvaluationRule[];
  assumptions: string[];
  status: "draft" | "frozen" | "promoted";
};
```

## Promotion gates

1. Schema validation passes.
2. Every node and edge has a defined meaning.
3. Every scenario has assumptions, risks, unknowns, and falsifiers.
4. Visual output has a safe fallback.
5. No secret or provider-specific runtime code is included.
6. Human review accepts the domain wording.
7. Pilot tenant and retention rules are known.
