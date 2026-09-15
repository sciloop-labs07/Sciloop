# Render Deploy Guide for SciLoop

This project is ready to deploy to Render as three services:

1. `sciloop-frontend`
2. `sciloop-forloop-api`
3. `sciloop-ai-backend`

Blueprint file:

- [render.yaml](</C:/Users/moham/Downloads/Sciloop%203/render.yaml>)

## What each service does

### 1. Frontend

Root directory: `C:\Users\moham\Downloads\Sciloop 3`

Purpose:
- Hosts the Next.js SciLoop site
- Exposes `/api/sciloop-ai-proxy`
- Serves the main public SciLoop experience

### 2. ForLoop API

Root directory: `C:\Users\moham\Downloads\Sciloop 3\server`

Purpose:
- Hosts the ForLoop control API
- Serves the control panel at `/forloop-control-panel/`
- Handles admin checks, key checks, and one-click SciLoop startup logic

### 3. SciLoop AI Backend

Root directory: `C:\Users\moham\Downloads\Sciloop 3\sciloop-backend`

Purpose:
- Hosts the AI/news/visual-plan backend
- Provides `/health`
- Provides visual plan and explanation APIs

## Render setup

1. Push this project to GitHub.
2. In Render, choose **New Blueprint**.
3. Select the repo.
4. Render will detect [render.yaml](</C:/Users/moham/Downloads/Sciloop%203/render.yaml>).
5. Create the three services.

## Environment values to set after first draft deploy

You must fill the `sync: false` values manually in Render.

### Frontend

- `SCILOOP_AI_BACKEND_URL=https://YOUR-AI-BACKEND.onrender.com`
- `FORLOOP_BACKEND_URL=https://YOUR-FORLOOP-API.onrender.com`
- `NEXT_PUBLIC_SITE_URL=https://YOUR-FRONTEND.onrender.com`
- `OPENAI_API_KEY=...` only if you want the Next-side stream endpoint

### ForLoop API

- `FRONTEND_ORIGIN=https://YOUR-FRONTEND.onrender.com`
- `FORLOOP_ALLOWED_ORIGIN=https://YOUR-FRONTEND.onrender.com`
- `SCILOOP_AI_BACKEND_URL=https://YOUR-AI-BACKEND.onrender.com`
- `FORLOOP_DEV_ACCESS_CODE=123456` or a stronger private code
- AI keys you actually use:
  - `GEMINI_API_KEY`
  - `GROQ_API_KEY`
  - `DEEPSEEK_API_KEY`
  - `COHERE_API_KEY`
  - `HUGGINGFACE_API_KEY`
  - `STABILITY_API_KEY`

### SciLoop AI Backend

- `FRONTEND_ORIGIN=https://YOUR-FRONTEND.onrender.com`
- `VISUAL_LANGUAGE_LAB_URL=https://YOUR-FRONTEND.onrender.com/visual-language-lab`
- AI keys you actually use:
  - `GEMINI_API_KEY`
  - `GROQ_API_KEY`
  - `DEEPSEEK_API_KEY`
  - `COHERE_API_KEY`
  - `HUGGINGFACE_API_KEY`
  - `STABILITY_API_KEY`
  - `OPENAI_API_KEY` if you want the OpenAI Unity visual endpoint

## Mobile files after deploy

Once Render gives you public URLs, open these with your public server values:

- [ForLoop Control Panel Mobile.html](</C:/Users/moham/Downloads/Sciloop%203/ForLoop%20Control%20Panel%20Mobile.html>)
- [SciLoop Mobile Remote.html](</C:/Users/moham/Downloads/Sciloop%203/SciLoop%20Mobile%20Remote.html>)

Example:

```text
ForLoop Control Panel Mobile.html?forloop=https://YOUR-FORLOOP-API.onrender.com&api=https://YOUR-AI-BACKEND.onrender.com&lab=https://YOUR-FRONTEND.onrender.com/visual-language-lab
```

```text
SciLoop Mobile Remote.html?forloop=https://YOUR-FORLOOP-API.onrender.com&api=https://YOUR-AI-BACKEND.onrender.com&lab=https://YOUR-FRONTEND.onrender.com/visual-language-lab
```

## Free-tier reality check

Render free services may:
- sleep after inactivity
- wake slowly on first request
- feel fine for demos, but not ideal for a polished production experience

That is okay for early SciLoop member sharing.

## Recommended rollout order

1. Deploy `sciloop-ai-backend`
2. Deploy `sciloop-forloop-api`
3. Deploy `sciloop-frontend`
4. Update env vars with the actual Render URLs
5. Redeploy once env values are correct
6. Share the mobile files with the final public URLs
