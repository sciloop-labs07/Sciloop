# Physics Visual Language Foundation

## Purpose

SciLoop's Physics Visual Language represents scientific meaning before it
chooses a rendering technology. The canonical contract is
`src/physics-visual-language/types.ts` and the reference recipes live in
`src/physics-visual-language/recipes.ts`.

The renderer must preserve meaning across SVG, Canvas 2D, Three.js/WebGL, and
future WebGPU implementations. A richer renderer may add resolution, but it
must not change the causal interpretation.

## Minimum semantic contract

Every physics recipe defines:

- entities: source, field, object, state, measurement, evidence, and outcome;
- directed causal relations with an explicit direction meaning;
- one controlled variable;
- one measured output;
- quantities and units where meaningful;
- evidence and uncertainty;
- a timeline that explains whether progression means time or a conceptual chain;
- a prediction the user can test;
- a misconception guard;
- an accessible static fallback;
- renderer-specific configuration subordinate to the meaning.

## Representation rules

### Information

Objects are named entities. Relations are directed and labeled. Quantities are
separate from objects so a visual can distinguish a thing from a measurement of
that thing.

### Causality

Every causal arrow must state what its direction means. Motion, glow, color,
and size may reinforce a causal relation, but must not be the only way to
communicate it.

### Uncertainty

Uncertainty is part of the recipe, not an afterthought. Use intervals, haze,
distributions, branches, or confidence indicators according to the meaning.

### Time

Recipes explicitly state whether a sequence is continuous, ordered, or cyclic.
A conceptual chain must not be animated as if it were literal time evolution.

### Compression

The visual may simplify geometry, scale, or units, but it must disclose the
analogy or model limit through `misconceptionGuard`.

### Prediction

Every interactive recipe must expose one controlled variable and one expected
outcome. If the user cannot predict a change, the visual is not yet a useful
simulation.

## Physics v1 scope

The first canonical recipes are electromagnetic induction, general relativity,
and the Higgs field. These are foundation contracts, not a claim that the
public product already renders all three as complete interactive experiments.

