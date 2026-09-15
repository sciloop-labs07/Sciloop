# SciLoop Unity AI Sandbox — One-Shot Testing Command

Test the Unity AI Sandbox integration safely without breaking existing SciLoop portals.

## Goal

Verify these 5 things:

1. The project compiles.
2. The Unity AI Sandbox portal/component loads.
3. Canvas fallback mode works when Unity is not present.
4. Controls update simulation JSON correctly.
5. No existing SciLoop portal is broken.

## Testing Steps

### 1. Install dependencies

Run:

```bash
npm install
```

### 2. Start development server

Run:

```bash
npm run dev
```

Open the local URL shown in terminal, usually:

```text
http://localhost:3000
```

or

```text
http://localhost:5173
```

### 3. Check project errors

Confirm there are no errors like:

- module not found
- failed import
- undefined component
- JSX syntax error
- Tailwind class crash
- portal router crash

If errors appear, fix imports first.

### 4. Confirm new files exist

Check these files exist:

- UnityAISandbox.jsx
- sciloopUnityBridge.js
- fallbackAISimulation.js
- sampleSimulation.json

Unity files should exist separately for Unity project:

- SciLoopUnityBridge.cs
- AgentAI.cs
- EnergyParticle.cs

### 5. Confirm portal entry exists

Search for the portal list and confirm this entry exists:

```js
{
  id: "unity-ai-sandbox",
  title: "Unity AI Sandbox",
  icon: "🎮",
  description: "Connect SciLoop visual intelligence with Unity 3D AI simulations."
}
```

### 6. Confirm portal renderer exists

Search for activePortal rendering logic and confirm one of these exists:

```jsx
{activePortal === "unity-ai-sandbox" && <UnityAISandbox />}
```

or:

```jsx
if (activePortal === "unity-ai-sandbox") {
  return <UnityAISandbox />;
}
```

### 7. Test fallback mode

Do NOT add Unity build yet.

Open:

```text
Unity AI Sandbox
```

Expected result:

- Status says: Fallback Canvas Mode
- Canvas appears
- Click Start Simulation
- Cyan agents start moving
- Yellow resources appear
- Metrics update:
  - Alive Agents
  - Avg Energy
  - Collisions
  - Stability
- Explanation panel shows simple SciLoop explanation

### 8. Test sliders

Change these sliders:

- Population
- Temperature
- Gravity
- Energy
- Speed

Click Start Simulation again.

Expected behavior:

- Higher population creates more agents
- Higher temperature creates more chaotic movement
- Low energy makes agents die faster
- High gravity pulls movement downward
- Metrics change live

### 9. Test reset

Click Reset.

Expected result:

- Canvas simulation stops
- Metrics reset to:
  - Alive Agents: 0
  - Avg Energy: 0.0
  - Collisions: 0
  - Stability: 100.0

### 10. Test existing portals

Click every old SciLoop portal:

- SciLoop Nexus
- Platform Guide
- Timeless Problems Lab
- Potential Explorer
- Reality Sandbox
- News Portal
- Hall of Builders
- Mini Experiment Lab
- Impact Hub
- Local Problem Solver
- Feedback Portal

Expected result:

- Every old portal still opens
- No blank page
- No console crash
- Portal switching still works

### 11. Browser console test

Open browser DevTools Console.

Run:

```js
window.unityInstance
```

Expected result before Unity build:

```js
undefined
```

That is okay.

Fallback mode should still work.

### 12. Manual JSON test

Open browser DevTools Console and run:

```js
JSON.stringify({
  source: "SciLoop",
  target: "Unity",
  version: "1.0",
  simulationType: "ecosystem",
  controls: {
    gravity: 9.8,
    population: 30,
    speed: 4,
    energy: 80,
    temperature: 25
  }
})
```

Expected result:

A valid JSON string appears with no error.

### 13. Build test

Stop dev server and run:

```bash
npm run build
```

Expected result:

- Build completes successfully
- No fatal compile errors
- No missing imports

### 14. Final pass condition

Mark the Unity AI Sandbox integration as working if:

- npm run dev works
- npm run build works
- Unity AI Sandbox opens
- Canvas fallback runs
- Start button works
- Reset button works
- Metrics update
- Old portals still work

## If something fails

Fix in this order:

1. Import path errors
2. Portal ID mismatch
3. Component export/import mismatch
4. Missing Tailwind setup
5. Canvas ref not attached
6. Runtime undefined window access
7. Build warnings

## Required final report

After testing, produce this report:

```text
SciLoop Unity AI Sandbox Test Report

Status:
PASS / FAIL

Working:
- Development server:
- Build:
- Portal loads:
- Canvas fallback:
- Sliders:
- Metrics:
- Reset:
- Old portals:

Errors found:
-

Fixes applied:
-

Next upgrade:
Connect real Unity WebGL build inside public/unity-build/
```
