# SciLoop × AGI OS workflow

This workflow connects SciLoop's scientific-intelligence pipeline to AGI OS's
prediction-first learning and research loop.

## End-to-end flow

```text
SciLoop signal
  → evidence brief
  → causal model
  → conditional scenarios
  → decision-ready question
  → AGI OS prediction challenge
  → safe simulation / experiment
  → observation and error trace
  → feedback and confidence update
  → rule / explanation
  → transfer challenge
  → AGI OS graph, workspace, roadmap, and frontier memory
```

## Stage responsibilities

| Stage | Owner | Output | Gate |
| --- | --- | --- | --- |
| Discover | SciLoop | Reviewed signal with source links | Signal is evidence-linked |
| Understand | SciLoop | Evidence brief and mechanism summary | Claims separated from inference |
| Explore | SciLoop | Causal variables and conditional scenarios | Uncertainty is explicit |
| Ask better | SciLoop | Decision-ready research question | Human accepts the question |
| Predict | AGI OS / SciLoop Flow | Learner or agent prediction | Prediction is recorded before explanation |
| Simulate | AGI OS / Maths AI | Reproducible test run | Run is bounded and deterministic where possible |
| Observe | AGI OS / Visual Engine | Result, mismatch, and trace | Evidence is attached to the run |
| Adapt | AGI OS / Evolving Engine | Updated confidence and next challenge | Error produces contrast; success raises difficulty |
| Compress | AGI OS | Rule and explanation | Rule cites observations and assumptions |
| Transfer | AGI OS | New-context challenge | Transfer result is recorded |
| Remember | AGI OS | Graph/workspace/roadmap records | Human approves consequential decisions |

## Canonical handoff payload

The payload in [`workflow.json`](./workflow.json) is the contract between the
two systems. SciLoop should populate `signal`, `evidence`, `causalModel`, and
`decisionQuestion`; AGI OS should append `prediction`, `test`, `observation`,
`adaptation`, and `transfer`.

## Safety and quality rules

1. Never present a conditional scenario as a prediction guarantee.
2. Preserve source URLs and claim-level provenance through every handoff.
3. Require a human decision for external actions, high-impact recommendations,
   or publishing.
4. Keep simulations bounded, reproducible, and clearly labeled as simulated.
5. Store failures and rejected hypotheses, not only successful conclusions.

## Suggested implementation order

1. Implement the JSON handoff and validate it at the SciLoop → AGI OS boundary.
2. Connect the handoff to the AGI OS SciLoop Flow designer.
3. Persist completed runs in the AGI OS Workspace and Knowledge Graph.
4. Add roadmap/frontier updates only after human review.
