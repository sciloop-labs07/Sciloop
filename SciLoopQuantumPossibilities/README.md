# SciLoopQuantumPossibilities

Unity-side prototype folder for the SciLoop Reality Engine.

Recommended setup:

1. Create a Unity 6 project named `SciLoopQuantumPossibilities`.
2. Copy `Assets/Scripts/RealityEngine` into the Unity project.
3. Create an empty GameObject named `SciLoopRealitySceneController`.
4. Attach `RealitySceneController`.
5. Build WebGL.
6. In SciLoop browser code, call:

```js
unityInstance.SendMessage(
  "SciLoopRealitySceneController",
  "LoadSceneJson",
  JSON.stringify(scenePayload)
);
```

The browser version works without Unity. Unity becomes the cinematic runtime when a WebGL build is available.

## OpenAI / Codex Visual Planning Bridge

The PDF workflow is implemented in a safer SciLoop shape:

```text
Unity or SciLoop UI
-> SciLoop backend
-> OpenAI Responses API
-> compact visual scene JSON
-> Unity procedural primitives
```

This keeps `OPENAI_API_KEY` on the backend instead of inside Unity WebGL or frontend code.

### Unity setup

1. Copy `Assets/Scripts/RealityEngine` into a Unity 6 project.
2. Create an empty GameObject named `SciLoopGeneratedVisualRoot`.
3. Add `GeneratedVisualApplier` to it.
4. Create another GameObject named `SciLoopOpenAIVisualClient`.
5. Add `SciLoopOpenAIVisualClient` to it.
6. Drag `SciLoopGeneratedVisualRoot` into the client `Generated Visual Applier` field.
7. Keep backend endpoint as:

```text
http://localhost:5050/api/reality-engine/openai-visual
```

8. Click `GenerateDemoVisual()` from a UI button or call:

```csharp
FindObjectOfType<SciLoopOpenAIVisualClient>()
  .GenerateVisual(
    "Mass bends spacetime and curves light",
    "Show before/after physics understanding with field curvature and future branches.",
    "Physics"
  );
```

### Backend environment

In `sciloop-backend/.env`, add only keys you legally own:

```env
OPENAI_API_KEY=your_key_here
OPENAI_VISUAL_MODEL=gpt-5-mini
OPENAI_VISUAL_TIMEOUT_MS=15000
OPENAI_VISUAL_MAX_TOKENS=1400
```

If `OPENAI_API_KEY` is missing, SciLoop returns a local fallback scene instead of crashing.

### PowerShell test command

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:5050/api/reality-engine/openai-visual" `
  -ContentType "application/json" `
  -Body '{
    "title": "Mass bends spacetime and curves light",
    "summary": "Create a cinematic Unity scene with a massive object, curved field, bending light, and future discovery branch.",
    "field": "Physics"
  }'
```

### Curl command from the PDF, updated for SciLoop backend

```bash
curl http://localhost:5050/api/reality-engine/openai-visual \
  -H "Content-Type: application/json" \
  -d '{
    "title": "A catalyst lowers activation energy",
    "summary": "Create a Unity visual scene with reactants, catalyst, lower barrier, and product flow.",
    "field": "Chemistry"
  }'
```

### Unity build command template

Update the Unity path/version to match your install:

```powershell
& "C:\Program Files\Unity\Hub\Editor\6000.0.0f1\Editor\Unity.exe" `
  -projectPath "C:\Projects\SciLoopQuantumPossibilities" `
  -buildWindows64Player "C:\Builds\SciLoopQuantumPossibilities.exe" `
  -quit -batchmode -nographics `
  -logFile "C:\Builds\SciLoopUnityBuild.log"
```

For WebGL, use Unity Build Settings or a custom build script later. The current integration is code-ready and does not require generated C# execution, which is intentionally avoided for safety.
