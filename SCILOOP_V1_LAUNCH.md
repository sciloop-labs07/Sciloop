# SciLoop V1 Launch Runbook

## Product

SciLoop is **The World's Live Innovation Platform**.

Public flow:

```text
Home → Live Innovation Feed → Innovation Explorer → Save / Share / Ask AI
```

The primary V1 routes are:

- `/`
- `/live-innovations`
- `/innovations/google-quantum-chip`
- `/innovations/crispr-gene-editing`
- `/innovations/solid-state-battery`

## Local setup

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

Validation:

```powershell
npm run typecheck
npm run lint
npm run build
```

## Production deployment

The Next.js app is deployable to Vercel, Render, or an equivalent Node host.

Required production values:

- `SCILOOP_AI_BACKEND_URL` for live news and AI proxying
- `NEXT_PUBLIC_SITE_URL` for canonical sharing URLs
- AI provider keys in the backend service, never in browser code

Deploy from the repository root with `npm run build` and `npm run start`.

Production is live on Vercel at https://sciloop-live.vercel.app. The canonical public interface is the uploaded HTML shell at /sciloop-live.

## Admin instructions

1. Keep AI and news provider keys in the backend environment only.
2. Check `/system-status` after deployment.
3. Confirm `/api/sciloop-ai-proxy/news?topic=science&limit=18&aiLimit=0` returns either live or cached signals.
4. Review cached stories before promoting them as editorial highlights.
5. Use the existing ForLoop access code only for private operations; never expose it in public UI.

## Revenue-ready checklist

- Vercel Web Analytics is enabled and wired into the Next.js surfaces plus the canonical HTML shell. Add custom event tracking after observing real user behavior.
- Sentry is connected for Next.js errors and the canonical HTML shell; the production DSN is stored as a sensitive Vercel environment variable.
- Add email capture for daily innovation briefings.
- Add an authenticated saved-innovation library.
- Add paid research briefings or team workspaces after measuring demand.
- Add source attribution and an editorial correction path.

## Launch checklist

- [ ] Home communicates the positioning in five seconds.
- [ ] Search from Home opens the filtered feed.
- [ ] Feed filters and live API fallback work on mobile.
- [ ] Each seed innovation opens one complete explorer page.
- [ ] Save and share work.
- [ ] AI question flow has a loading and offline state.
- [ ] No portal links appear in primary navigation.
- [ ] No secrets are present in frontend bundles.
- [ ] Production build and smoke tests pass.
- [x] Canonical production URL is tested from a fresh browser.
- [x] Vercel Web Analytics is enabled and deployed.
- [x] Sentry project created and production error reporting deployed.
- [x] Custom domain intentionally deferred; Vercel URL is the canonical launch URL for V1.
- [ ] Add Sentry DSN or another external error-monitoring provider.

## Known V1 issues

- Remote feed stories use a generated explorer slug and currently have a generic fallback detail page only if no curated record matches.
- Saved innovations are local-browser only until authentication is added.
- AI chat is currently a lightweight planning bridge, not a full conversational memory system.
- Free-tier hosting may cold-start or sleep.
- Production URL and domain are not configured in this workspace.
