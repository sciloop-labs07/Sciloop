# Visual Engine Architecture

## One meaning, multiple renderers

```text
PhysicsVisualRecipe
        |
        +-- server-rendered SVG/HTML fallback
        +-- Canvas 2D dynamic renderer
        +-- Three.js + React Three Fiber workbench renderer
        +-- WebGPU experimental adapter
```

The semantic recipe is the source of truth. Renderers are replaceable views.
They must not contain independent scientific meanings or duplicate physics
rules.

## Renderer boundaries

### SVG

Default public renderer for first paint, labels, arrows, fields, diagrams, and
JavaScript-disabled operation. It must include accessible title, description,
and visible supporting text.

### Canvas 2D

Use for dynamic 2D particles, fields, waves, and graphs after interaction.
Provide HTML/SVG labels and a static fallback because Canvas pixels are not
semantic content by themselves.

### Three.js/WebGL

Use for expensive interactive 3D workbench experiences. Load lazily, render on
demand when possible, reuse geometries/materials, and adapt quality to device
performance.

### WebGPU

Feature-flagged experimental acceleration only. It is never the public default
and never the only renderer.

## Public/workbench boundary

The public route may use reviewed SVG and small Canvas experiences. Full Three.js
and future WebGPU experiments remain workbench capabilities until they pass the
promotion checklist.

