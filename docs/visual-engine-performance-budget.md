# Visual Engine Performance Budget

## Public

- Server-render useful content without JavaScript.
- Do not block first paint on AI, simulation, or GPU initialization.
- Animate only reviewed, curated visuals in the first viewport.
- Prefer SVG for compact mechanisms.
- Lazy-load Canvas and Three.js after interaction.
- Pause off-screen and hidden-tab animation.
- Respect `prefers-reduced-motion`.
- Cap device pixel ratio and keep particle counts bounded.

## Workbench

- Three.js may use richer scenes after an explicit user action.
- Reuse geometries and materials.
- Prefer demand-driven rendering for scenes that can rest.
- Adapt pixel ratio and effects when frame rate declines.
- Keep WebGPU experiments behind an explicit feature flag.

## Acceptance signals

Every promoted visual must be checked on desktop and mobile, with slow network,
JavaScript disabled, reduced motion, unsupported GPU, and backend unavailable.

