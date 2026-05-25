# SciLoop Visual Language Engine

SciLoop Visual Language Engine v0.1 is a browser-native semantic simulation system.

It is not an image generator, not a photorealistic renderer, and not a dashboard. It turns a concept into a causal graph, maps that graph into consistent visual primitives, and lets the user change variables to see how the system responds.

## Pipeline

```text
Text / demo concept
-> Semantic parser
-> Semantic graph
-> Visual grammar compiler
-> Primitive instances
-> Causal animation engine
-> Canvas/SVG simulation
-> Sliders, dragging, hover inspection
```

## Current demos

- Gravity Well: mass changes curvature, trajectory, and escape threshold.
- Photosynthesis: light, water, and CO2 become oxygen output and glucose storage.
- Neural Network Learning: forward signal, backward error, visible weight update.
- Economic Inflation: money token flow, price pressure, purchasing power decay.

## Add a new demo

1. Create a file in `src/examples`.
2. Export a `DemoDefinition`.
3. Build a `SemanticGraph` with entities, variables, relations, flows, and causal chain.
4. Add the demo to `src/examples/index.ts`.
5. The lab selector will pick it up through the registered engine demo list.

## Add a new primitive

1. Add the primitive kind to `src/grammar/PrimitiveTypes.ts`.
2. Register behavior in `src/grammar/VisualGrammar.ts`.
3. Add a semantic mapping in `src/grammar/SemanticMappings.ts`.
4. Extend `CanvasRenderer` only if the primitive needs a special visual behavior.

## Design rules

- Every animation must encode a meaning.
- Motion should answer: what changed, what caused it, where the effect moved, and what variable controls it.
- Unknown input must produce a safe fallback graph, not a crash.
- Local rendering remains the default runtime.
