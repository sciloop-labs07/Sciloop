# Visual Language Phase 1

Phase 1 establishes the contract, not a new public UI.

## Delivered foundation

- `PredictiveVisualPackage v0.1`: a versioned, engine-neutral package with evidence, sources, semantic nodes, causal edges, scenarios, assumptions, risks, unknowns, and provenance.
- Validator: blocks unsupported known claims, dangling evidence references, dangling graph edges, missing engine audit data, and invalid certainty for unknowns.
- Deterministic compiler: converts a validated package into the existing SciLoop `VisualRecipe` renderer contract without generating arbitrary graphics code.
- Provenance fields on visual recipe objects and relations: evidence and scenario IDs remain attached through rendering.

## Next phase gate

Connect one selected Live Innovation to a `PredictiveVisualPackage`, render it with the existing `VisualRecipeRenderer`, and retain the existing visualization as a feature-flagged fallback.

## Non-goals

- No AGI OS UI copy.
- No deployment.
- No claim of empirical prediction accuracy.
- No external image or video generation dependency.
