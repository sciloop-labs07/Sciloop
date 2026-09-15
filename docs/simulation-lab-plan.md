# SciLoop Simulation Lab Plan

Last updated: May 5, 2026

## Current state

Inspected working app entry points:

- `app/layout.tsx`
- `app/page.tsx`
- `app/worlds/physics/page.tsx`
- `components/ui/site-header.tsx`
- `components/three/physics-world-experience.tsx`
- `components/three/physics-world-canvas.tsx`
- `components/three/discovery-overlay.tsx`
- `components/three/physics-world/*`
- `data/discoveries.ts`
- `data/worlds/physics-world.ts`
- `lib/simulation.ts`
- `lib/use-simulation-transition.ts`

What exists today:

- Next.js App Router shell is functional and remains the primary product shell.
- `/worlds/physics` contains the browser-native Simulation Lab route with typed discovery data, transition logic, reusable scene modules, and an educational overlay.
- The simulation stack is now browser-local only.
- SciLoop keeps local SVG, canvas, CSS, and Three.js-style/pseudo-3D renderers as the active visual runtime.

## Target state

SciLoop stays focused on fast, portable browser simulations:

- Web shell handles navigation, education, and controls.
- Browser Mode is the single working simulation path.
- The first flagship lab remains an upgraded Simulation Lab / Reality Sandbox 3D inside `/worlds/physics`.
- Visual Language scenes continue to use local rendering so the platform runs on normal machines without external render infrastructure.

## Architecture diagram

```text
SciLoop Next.js Shell
|
+-- App Router pages
|   +-- /                Landing and entry points
|   +-- /worlds/physics  Simulation Lab / Reality Sandbox 3D
|   +-- /discoveries
|   +-- /about
|
+-- Simulation Lab UI
|   +-- quality selector
|   +-- discovery selector
|   +-- educational status panel
|   +-- consequence summaries and warnings
|
+-- Runtime layer
|   +-- Browser renderer
|   +-- local canvas/SVG/pseudo-3D visual blocks
|   +-- responsive performance safeguards
|
+-- Visual Language layer
    +-- Biology renderer
    +-- Physics renderer
    +-- Universal subject renderer
    +-- local fallback scene plans
```

## Phases

### Phase 1

- Keep `/worlds/physics` as a focused Simulation Lab shell.
- Preserve the browser-native scene as the active runtime.
- Keep the educational overlay clear and readable.

### Phase 2

- Strengthen the browser-native simulation so it reflects conceptual variables:
  - gravity strength
  - energy abundance
  - biological resilience
  - travel efficiency
  - intelligence acceleration
  - environment stability

### Phase 3

- Make the educational layer explain what changed, what becomes unstable, and what broader intuition the user should take away.
- Keep Biology, Physics, and Universal Visual Language renderers modular so new subjects can reuse the same local scene contract.

## Deliverables in this implementation

- Simulation Lab shell inside the working app.
- Browser-local graphics runtime.
- Local visual blocks with smooth motion, labels, and educational overlays.
- Backend AI/news services kept separate from rendering.

## Risks

- Browser rendering cannot reach the same fidelity as a dedicated cinematic 3D engine, so realism should be improved with careful lighting, motion, depth, and material language.
- Complex scenes can become heavy on mobile if particle counts or canvas effects grow too large.
- Local renderers can drift visually if each subject implements its own scene rules without sharing a stable visual plan schema.

## Local run steps

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/`
- `http://localhost:3000/worlds/physics`
