# SciLoop Unity Bridge Setup

This folder now contains the first safe Unity receiver for the SciLoop visual bridge:

- `SciLoopRealitySceneController.cs`

## Purpose

SciLoop does not send runtime C# to Unity.

It sends a structured JSON envelope with:

- protocol
- subject
- title
- scene objects
- scene effects
- camera config
- animation timeline

Unity interprets that JSON with a fixed trusted script.

## Current protocol

`sciloop-unity-visual-bridge-v0.1`

## Expected Unity receiver

The browser and backend expect this GameObject + method:

- GameObject name: `SciLoopRealitySceneController`
- Method: `LoadSceneJson(string json)`

## Unity setup

1. Create a new empty GameObject in your scene.
2. Rename it to `SciLoopRealitySceneController`.
3. Add the `SciLoopRealitySceneController` script to it.
4. Make sure your scene has a `Main Camera`.
5. If you build WebGL and expose the Unity instance globally, SciLoop can call:

```javascript
unityInstance.SendMessage("SciLoopRealitySceneController", "LoadSceneJson", jsonPayload);
```

## Current behavior

The receiver currently:

- validates the protocol
- blocks runtime code execution
- clears the previous generated scene
- creates simple primitives for scene objects
- draws effect links with `LineRenderer`
- creates world-space labels with `TextMesh`
- colors them from the JSON
- positions the main camera

This is still intentionally v0 and safe, but now much easier to inspect visually.

## Local endpoint

SciLoop backend route:

`POST http://localhost:5050/api/reality-engine/unity-scene`

This returns the Unity-safe scene envelope.

## OpenAI-assisted endpoint

SciLoop backend route:

`POST http://localhost:5050/api/reality-engine/openai-visual`

This can refine the scene plan on the backend. If no `OPENAI_API_KEY` is configured, it falls back locally without crashing.

## Next recommended step

The next build step is a richer Unity renderer layer that maps:

- `node` -> sphere or labeled unit
- `field` -> panel, grid, or volume
- `energy_core` -> emissive orb
- `particle_stream` -> moving particle line
- `boundary` -> membrane or wall
- `world_panel` -> stage card or system block

After that, we can add:

- timeline playback
- WebSocket live updates
- subject-specific prefabs
- animated particle motion
- better materials for URP/HDRP
