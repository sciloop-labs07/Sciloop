# SciLoop Demo Fast Start

This package contains the main SciLoop portal, the ForLoop control panel, and the small local API backend needed for a demo PC.

Real API keys are not bundled. Paste keys into `server\.env` on the demo PC.

## Start On Demo PC

1. Extract the zip.
2. Open `server\.env` and paste demo API keys.
3. Double-click `START_DEMO_BACKEND.bat`.
4. Open `ForLoop Control Panel Mobile.html` in Chrome.
5. Use access code:

```text
123456
```

6. Open `SciLoop - Live Scientific Discoveries 80.html` in Chrome.

## Backend URL

Local ForLoop API:

```text
http://localhost:3001
```

The control panel can test provider readiness and show backend status. If keys are missing, local fallback/demo mode still works but real provider calls will not.

## API Key Fields

Paste keys into `server\.env`:

```text
GEMINI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
HUGGINGFACE_API_KEY=
```

Optional news/provider keys can also be pasted into the blank fields.

## Important

Do not send real API keys in WhatsApp, GitHub, or a public zip. Use demo-limited keys, rotate keys after the demo, or paste them directly on the demo PC.
