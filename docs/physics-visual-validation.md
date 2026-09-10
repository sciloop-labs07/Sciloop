# Physics Visual Validation

## Recipe validation

Run:

```bash
npm run validate:physics
```

Validation checks required entities, directed causal relations, quantities,
timeline references, fallback reading order, sources, reduced-motion behavior,
and the WebGPU public-default prohibition.

## Scientific review

Before promotion, reviewers must confirm:

- the animation represents the stated mechanism;
- the controlled variable is genuinely connected to the output;
- arrows and motion have a declared meaning;
- units are correct or explicitly marked as model units;
- analogy limits are visible;
- evidence is separated from inference;
- uncertainty is not hidden;
- one prediction question has a deterministic expected outcome.

## Browser review

Use the repository browser verifier to check server-rendered fallback, desktop
and mobile layout, keyboard activation, reduced motion, console errors, WebGL
fallback, WebGPU unavailable behavior, and deep links after reload.

