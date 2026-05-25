# SciLoop Reality Engine v0.1

This module turns one SciLoop News Portal card into a causal before/after/future simulation plan.

It does **not** create random cinematic scenes. Every scene is derived from:

- human intention
- system bottleneck
- causal mechanism
- entropy reduction
- energy/information/material flow
- civilization-scale propagation

## Runtime API

The SciLoop AI backend mounts:

`POST /api/reality-engine/generate`

Input:

```json
{
  "title": "Innovation headline",
  "summary": "Short article summary",
  "field": "Energy",
  "fullText": "optional full text"
}
```

Output includes:

- `analysis`
- `unity`
- `timeline`
- `causalGraph`
- `entropyVisualization`
- `scalePropagation`

## Unity bridge

`unity-bridge/unity-bridge.service.js` converts analysis into Unity scene prompts and WebGL handoff metadata.

The current browser demo renders a cinematic causal panel inside each news card. Unity WebGL can later consume the same JSON.

## OpenAI Unity visual endpoint

The PDF workflow is implemented through this backend-safe route:

`POST /api/reality-engine/openai-visual`

Flow:

```text
Unity / SciLoop frontend -> SciLoop backend -> OpenAI Responses API -> visual scene JSON
```

Environment:

```env
OPENAI_API_KEY=
OPENAI_VISUAL_MODEL=gpt-5-mini
OPENAI_VISUAL_TIMEOUT_MS=15000
OPENAI_VISUAL_MAX_TOKENS=1400
```

PowerShell test:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:5050/api/reality-engine/openai-visual" `
  -ContentType "application/json" `
  -Body '{
    "title": "Mass bends spacetime and curves light",
    "summary": "Create a Unity scene with a massive object, curved field, bending light, and future branches.",
    "field": "Physics"
  }'
```

If `OPENAI_API_KEY` is not set, the endpoint returns a local fallback scene and does not crash.

## Unity scene envelope endpoint

The universal visual language portal can now convert any SciLoop visual plan into a Unity-safe scene envelope:

`POST /api/reality-engine/unity-scene`

Flow:

```text
SciLoop visual plan -> Unity scene envelope -> Unity JSON receiver
```

Safety rules:

- Unity receives structured JSON only.
- Runtime C# compilation is disabled.
- OpenAI and other API keys stay on the backend.
- The recommended Unity receiver is `SciLoopRealitySceneController.LoadSceneJson`.

PowerShell test:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:5050/api/reality-engine/unity-scene" `
  -ContentType "application/json" `
  -Body '{
    "visualPlan": {
      "subject": "Physics",
      "title": "Mass bends spacetime",
      "detected": {
        "entities": ["mass", "spacetime", "light"],
        "processes": ["curvature"]
      }
    }
  }'
```
