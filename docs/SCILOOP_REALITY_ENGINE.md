# SciLoop Reality Engine

The Reality Engine upgrades every News Portal card with:

`⚡ Imagine Quantum Possibilities`

The button generates a causal before/after/future simulation plan directly inside the card.

## Browser flow

1. User reads a news card.
2. User clicks `⚡ Imagine Quantum Possibilities`.
3. The card posts title, summary, and field to:
   `POST /api/reality-engine/generate`
4. Backend extracts:
   - human intention
   - bottleneck
   - problem space
   - mechanism
   - before world
   - discovery event
   - after world
   - future branches
   - entropy changes
   - scale propagation
5. The card renders a cinematic embedded simulation panel.

## Unity bridge

The backend returns a `unity` object with prompts and scene metadata. A future Unity WebGL build can consume it through:

```js
unityInstance.SendMessage(
  "SciLoopRealitySceneController",
  "LoadSceneJson",
  JSON.stringify(scenePayload)
);
```

## Endpoint

```http
POST http://localhost:5050/api/reality-engine/generate
Content-Type: application/json

{
  "title": "New battery material improves storage",
  "summary": "Researchers developed a material that may help batteries store more energy.",
  "field": "Energy",
  "fullText": ""
}
```

## Docker

From repo root:

```powershell
docker compose -f backend/reality-engine/docker-compose.reality-engine.yml up --build
```

## Current limitation

This v0.1 does not package a Unity WebGL build. It creates the protocol, C# scripts, backend route, and in-card browser simulation so the platform works immediately.
