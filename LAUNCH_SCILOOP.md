# SciLoop Launch Playbook

This is the best launch path for SciLoop right now: start with a polished public beta link, protect backend keys, and keep one shareable URL for users.

## Launch URL

Primary user route:

```text
https://your-domain.com/sciloop-live
```

Status route:

```text
https://your-domain.com/system-status
```

## Architecture

```text
User phone/browser
  -> SciLoop Next frontend
  -> /sciloop-live
  -> /api/sciloop-ai-proxy/*
  -> SciLoop AI Backend
  -> AI/news providers

User phone/browser
  -> SciLoop Next frontend
  -> /api/forloop-proxy/*
  -> ForLoop backend
```

Do not expose API keys in frontend code.

## Phase 1: Best Quick Launch

Use this for a WhatsApp / classroom / team demo.

1. Start SciLoop AI backend.

```powershell
cd "C:\Users\moham\Downloads\Sciloop 3\sciloop-backend"
npm install
npm run start
```

2. Start ForLoop backend.

```powershell
cd "C:\Users\moham\Downloads\Sciloop 3"
node server/index.js
```

3. Start SciLoop frontend.

```powershell
cd "C:\Users\moham\Downloads\Sciloop 3"
npm install
npm run dev:share
```

4. Start Cloudflare Tunnel.

```powershell
cd "C:\Users\moham\Downloads\Sciloop 3"
.\cloudflared.exe tunnel --url http://localhost:3000
```

5. Share:

```text
https://CLOUDFLARE-URL/sciloop-live
```

## Phase 2: Production Beta

Recommended hosting:

- Frontend: Vercel, Netlify, Render, or a VPS.
- SciLoop AI Backend: Render, Railway, Fly.io, or VPS.
- ForLoop backend: Render/Railway/VPS or same machine as AI backend.

Production environment variables for frontend:

```env
SCILOOP_AI_BACKEND_URL=https://your-sciloop-ai-backend.example.com
FORLOOP_BACKEND_URL=https://your-forloop-backend.example.com
NEXT_PUBLIC_SCILOOP_AI_API_BASE=/api/sciloop-ai-proxy
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Production environment variables for `sciloop-backend`:

```env
PORT=5050
NODE_ENV=production
FRONTEND_ORIGIN=https://your-domain.com
VISUAL_LANGUAGE_LAB_URL=https://your-domain.com/visual-language-lab
GEMINI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
NEWSAPI_KEY=
GNEWS_API_KEY=
```

Production environment variables for ForLoop:

```env
PORT=3001
FRONTEND_ORIGIN=https://your-domain.com
FORLOOP_ALLOWED_ORIGIN=https://your-domain.com
FORLOOP_ADMIN_MODE=production
FORLOOP_DEV_ACCESS_CODE=change-this
```

## Preflight Checklist

Before sharing:

- Open `/system-status`.
- Frontend is online.
- SciLoop AI is online.
- ForLoop is online.
- Open `/sciloop-live` on desktop.
- Open `/sciloop-live` on phone.
- Click News Portal `Explain with Sciloop AI`.
- Click News Portal `Visualize`.
- Confirm redirect to `/visual-language-lab?handoffId=...`.
- Confirm no phone request goes to `localhost`.

## Launch Message

Use this simple message:

```text
SciLoop Beta is live.
It turns science news and concepts into visual explanations.
Open on phone:
https://your-domain.com/sciloop-live

Try:
1. News Portal
2. Explain with SciLoop AI
3. Visualize
4. Visual Language Lab
```

## What To Avoid In Beta

- Do not promise full scientific precision.
- Do not call it final.
- Do not expose backend ports.
- Do not paste API keys into frontend.
- Do not launch every portal as equally finished.

Position it as:

```text
SciLoop Beta: a visual learning engine for science, news, and concepts.
```

## Next Product Step

Add user feedback capture:

- Was the visual useful?
- Was the explanation clear?
- Which concept should SciLoop support next?
- Did anything fail on phone?

