# SciLoop Unity AI Sandbox Bridge

SciLoop creates the intelligence model. Unity visualizes and simulates it. JSON connects both. WebGL embeds Unity inside SciLoop, and a WebSocket layer can be added later for real-time advanced simulation.

## Files

- `sciloopUnityBridge.js` injects the SciLoop portal named `Unity AI Sandbox` into the existing standalone SciLoop page.
- `fallbackAISimulation.js` contains a reusable browser fallback simulation class for AI agents and energy particles.
- `sampleSimulation.json` is the command payload SciLoop sends to Unity.
- `backend/reality-engine/unity-bridge/SciLoopUnityBridge.cs` receives JSON in Unity through `LoadSimulation(string json)`.
- `backend/reality-engine/unity-bridge/AgentAI.cs` makes agents wander, seek energy particles, avoid walls, lose energy, and die at zero energy.
- `backend/reality-engine/unity-bridge/EnergyParticle.cs` represents collectible energy resources.
- `UnityAISandbox.jsx` is a React reference component for a future modular frontend version.

## Browser Usage

Open the SciLoop frontend and go to the `Unity AI Sandbox` tab. The portal works in two modes:

1. Unity WebGL loaded: SciLoop calls `unityInstance.SendMessage("SciLoopUnityBridge", "LoadSimulation", jsonString)`.
2. Unity WebGL missing: SciLoop runs the canvas fallback with the same control values and result shape.

To point the iframe at a Unity WebGL build, use one of these:

```js
window.SCILOOP_UNITY_WEBGL_URL = "https://your-unity-build-url/index.html";
```

or open SciLoop with:

```text
?unityUrl=https://your-unity-build-url/index.html
```

## Unity Setup

1. Create an empty GameObject named `SciLoopUnityBridge`.
2. Attach `SciLoopUnityBridge.cs` to it.
3. Add `AgentAI.cs` and `EnergyParticle.cs` to the Unity project.
4. Optional: assign agent, energy particle, and field prefabs in the inspector.
5. If no prefabs are assigned, the scripts create primitive spheres/cylinders.
6. Build as WebGL.
7. Expose the Unity instance to the browser as `window.unityInstance` or call:

```js
window.sciloopUnityBridge.setUnityInstance(unityInstance);
```

## JSON Contract

SciLoop sends:

```json
{
  "source": "SciLoop",
  "target": "Unity",
  "version": "1.0",
  "simulationType": "ecosystem",
  "entities": [],
  "variables": {
    "gravity": 9.8,
    "speed": 1.2,
    "population": 34,
    "energy": 62,
    "temperature": 24
  },
  "resultsRequest": {
    "aliveAgents": true,
    "averageEnergy": true,
    "collisionCount": true,
    "stabilityScore": true
  }
}
```

Unity sends results back with:

```js
receiveUnityResults("{\"aliveAgents\":34,\"averageEnergy\":61,\"collisionCount\":2,\"stabilityScore\":0.78}")
```

`receiveSciLoopUnityResults` is also supported for backward compatibility.

## Current Limits

- This is the first AI sandbox foundation, not the final high-end 4K renderer.
- The bridge uses `SendMessage` for WebGL. WebSocket streaming can be added later.
- The canvas fallback is symbolic, while Unity is responsible for real 3D physics and visuals.
