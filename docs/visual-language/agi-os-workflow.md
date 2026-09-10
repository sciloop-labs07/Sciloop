# AGI OS → SciLoop workflow

AGI OS is SciLoop's research and evaluation surface. SciLoop is the controlled product surface.

| AGI OS surface | Research responsibility | Output promoted to SciLoop |
| --- | --- | --- |
| SciLoop Synthesis | Defines the shared learning grammar. | Stable experience → prediction → simulation → observation → rule → transfer sequence. |
| SciLoop Flow | Authors and exports candidate learning/reasoning flows. | Versioned flow definition; never the Flow UI. |
| Cognitive Lab | Runs competing candidates and preserves traceable experiment history. | Validated causal semantics, execution trace, evaluation metadata. |
| Visual Engine | Maps semantic meaning to controlled visual primitives. | Primitive-selection policy and visual recipe input. |
| Evolving Engine | Tests feedback-driven progression inside safe practice worlds. | Adaptation rules only after measured learner or outcome evidence. |

## Product boundary

```text
AGI OS experiment
  → CognitiveEnginePackage (versioned, auditable)
  → SciLoop adapter validation
  → PredictiveVisualPackage v0.1
  → deterministic VisualRecipe compiler
  → React / SVG / Canvas / Three.js renderer
  → human review, feedback and rollback
```

AGI OS does not render the public product. It proposes structured reasoning. SciLoop owns the renderer, user experience, evidence treatment, fallback, and audit trail.

## Promotion gates

1. A flow must run reproducibly in AGI OS.
2. Its output must identify evidence, assumptions, risks, unknowns, and engine version.
3. SciLoop must validate the package before compilation.
4. The deterministic renderer must have a readable fallback.
5. Any adaptive rule requires measured evidence; structural scores alone cannot promote it.
