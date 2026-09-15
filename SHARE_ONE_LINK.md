# SciLoop One-Link Team Sharing

This setup lets you share one WhatsApp link while SciLoop AI, Visualize, and ForLoop calls still work.

## Local ports

Run these three services:

```powershell
cd "C:\Users\moham\Downloads\Sciloop 3"
npm run dev
```

```powershell
cd "C:\Users\moham\Downloads\Sciloop 3\sciloop-backend"
npm run dev
```

```powershell
cd "C:\Users\moham\Downloads\Sciloop 3"
node server/index.js
```

Open this local one-link page:

```text
http://localhost:3000/sciloop-live
```

Share this route through a tunnel or deployment:

```text
https://your-public-url/sciloop-live
```

## How it works

The browser loads the full SciLoop HTML from `/sciloop-live`.

Frontend calls go to same-origin proxy routes:

```text
/api/sciloop-ai-proxy/*  ->  SCILOOP_AI_BACKEND_URL/api/sciloop-ai/*
/api/forloop-proxy/*     ->  FORLOOP_BACKEND_URL/api/admin/*
```

So team members only need one public URL. They do not need ports `5050` or `3001` exposed directly.

## Environment

Copy `.env.example` to `.env.local` in the root:

```powershell
copy .env.example .env.local
```

For local use:

```env
SCILOOP_AI_BACKEND_URL=http://localhost:5050
FORLOOP_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_SCILOOP_AI_API_BASE=/api/sciloop-ai-proxy
```

For hosted use, set these on the hosting platform:

```env
SCILOOP_AI_BACKEND_URL=https://your-ai-backend.example.com
FORLOOP_BACKEND_URL=https://your-forloop-backend.example.com
NEXT_PUBLIC_SCILOOP_AI_API_BASE=/api/sciloop-ai-proxy
```

## WhatsApp demo with Cloudflare Tunnel

You already have `cloudflared.exe` in this folder. After all three local services are running:

```powershell
.\cloudflared.exe tunnel --url http://localhost:3000
```

Cloudflare prints a public URL. Share:

```text
https://the-url-cloudflare-gives-you/sciloop-live
```

Keep your laptop and all three terminals running during the demo.

## Easiest mobile-phone sharing

Double-click:

```text
Start SciLoop Mobile Share.bat
```

It starts the frontend, SciLoop AI backend, ForLoop backend, and Cloudflare Tunnel.

When Cloudflare prints a URL like:

```text
https://example-name.trycloudflare.com
```

send this on WhatsApp:

```text
https://example-name.trycloudflare.com/sciloop-live
```

Your team can open that link on Android or iPhone. The phone only talks to the one public link. SciLoop AI and ForLoop stay on your laptop behind the Next proxy.

## Same Wi-Fi phone test without tunnel

This is useful only when the phone and laptop are on the same Wi-Fi.

Start the frontend with:

```powershell
npm run dev:share
```

Find your laptop IP:

```powershell
ipconfig
```

Open this on the phone:

```text
http://YOUR-LAPTOP-IP:3000/sciloop-live
```

If Windows Firewall blocks it, allow Node.js on Private networks.

## Test URLs

```text
http://localhost:3000/sciloop-live
http://localhost:3000/visual-language-lab
http://localhost:3000/api/sciloop-ai-proxy/news
http://localhost:3000/api/forloop-proxy/visual-language/status
```

## Important

Do not put API keys in frontend code. Put Gemini, Groq, OpenRouter, and news API keys only in backend `.env` files.
