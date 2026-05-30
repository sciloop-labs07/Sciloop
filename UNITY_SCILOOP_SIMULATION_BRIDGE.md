# Unity-SciLoop Simulation Bridge

This module connects the SciLoop web platform to a Unity WebGL simulation build.

## What SciLoop Does

SciLoop owns the explanation layer, sliders, JSON command generation, fallback canvas renderer, and results panel.

The new portal is injected by:

```text
sciloopUnityBridge.js
```

It adds a portal named:

```text
Unity Simulation Bridge
```

The bridge generates JSON with:

```json
{
  "simulationType": "ecosystem-dynamics",
  "entities": [],
  "variables": {},
  "causalRelations": [],
  "visualModel": {},
  "controls": {}
}
```

When Unity WebGL is available, SciLoop calls:

```js
unityInstance.SendMessage("SciLoopUnityBridge", "LoadSimulation", jsonPayload);
```

When Unity is not available, SciLoop keeps running a lightweight canvas simulation using the same JSON structure.

## Files

```text
sciloopUnityBridge.js
backend/reality-engine/unity-bridge/SciLoopUnityBridge.cs
sampleSimulation.json
UNITY_SCILOOP_SIMULATION_BRIDGE.md
```

## Unity Setup

1. Create or open a Unity project.
2. Add `SciLoopUnityBridge.cs` to your Unity `Assets/Scripts` folder.
3. Create an empty GameObject named exactly:

```text
SciLoopUnityBridge
```

4. Attach the `SciLoopUnityBridge` component to that GameObject.
5. Optionally assign:

```text
agentPrefab
fieldPrefab
simulationRoot
```

If no prefabs are assigned, the script uses Unity primitive spheres and cylinders.

## WebGL Build Setup

1. In Unity, switch platform to WebGL.
2. Build the Unity WebGL project.
3. Host the build output under a public path such as:

```text
public/unity/sciloop-simulation/
```

4. Expose the Unity instance globally after the Unity loader finishes:

```js
createUnityInstance(canvas, config, progressHandler).then((instance) => {
  window.unityInstance = instance;
  window.sciloopUnityBridge?.setUnityInstance(instance);
});
```

SciLoop checks these names:

```text
window.sciloopUnityInstance
window.unityInstance
window.UnityInstance
```

You can point the SciLoop portal at a hosted WebGL page without changing the bridge code:

```js
window.SCILOOP_UNITY_WEBGL_URL = "/unity/sciloop-simulation/index.html";
```

You can also pass it in the URL:

```text
/sciloop-live?unityUrl=/unity/sciloop-simulation/index.html#unity-simulation-bridge
```

or call:

```js
window.sciloopUnityBridge.setUnityFrameUrl("/unity/sciloop-simulation/index.html");
```

## Runtime Results

Unity reports simulation results back to the browser with:

```csharp
Application.ExternalCall("receiveSciLoopUnityResults", json);
```

The browser expects:

```json
{
  "objectCount": 34,
  "averageSpeed": 1.2,
  "collisionCount": 4,
  "stabilityScore": 0.78
}
```

SciLoop displays those values in the Unity Simulation Bridge results panel.

## Current Limits

- WebSocket transport is intentionally deferred.
- The current Unity script uses simple primitives unless prefabs are provided.
- The browser iframe is a placeholder until a real Unity WebGL build folder is added.
- Canvas fallback is intentionally lightweight and browser-safe.

## Next Step

Build a Unity WebGL scene, expose `window.unityInstance`, and open SciLoop's `Unity Simulation Bridge` tab. Slider changes will immediately generate JSON and call Unity when the WebGL instance is ready.
