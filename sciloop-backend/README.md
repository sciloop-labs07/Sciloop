# SciLoop AI Backend

Production-safe backend for the SciLoop News Portal. It fetches science and innovation news, routes AI explanations through legal keys added by the developer, protects provider limits with cache/quota/cooldown logic, and returns one clean "SciLoop AI" response to the frontend.

## Setup

```powershell
cd sciloop-backend
npm install
Copy-Item .env.example .env
notepad .env
npm run dev
```

Add only API keys you legally own. The backend runs even when keys are missing.

## Minimal Commands

```powershell
mkdir sciloop-backend
cd sciloop-backend
npm install
npm run dev
```

## Environment

Required only for AI news explanations:

```env
GEMINI_API_KEY=
GROQ_API_KEY=
DEEPSEEK_API_KEY=
```

Optional providers:

```env
OPENROUTER_API_KEY=
HUGGINGFACE_API_KEY=
TOGETHER_API_KEY=
NEWSAPI_KEY=
GNEWS_API_KEY=
GUARDIAN_API_KEY=
NYT_API_KEY=
MEDIASTACK_API_KEY=
NASA_API_KEY=
```

If a provider key is missing, SciLoop skips that provider and keeps running.

## Test URLs

Open these after `npm run dev`:

```text
http://localhost:5050/health
http://localhost:5050/api/providers
http://localhost:5050/api/news?topic=physics
http://localhost:5050/api/sciloop-ai/news?topic=space
```

## Main Endpoints

`GET /health`

Returns service health, uptime, active news providers, and active AI providers.

`GET /api/providers`

Returns provider readiness, public configuration, quota state, and cache state. It never returns API keys.

`GET /api/news?topic=physics&limit=12`

Fetches live science news from available providers, deduplicates, caches, and falls back to demo data if every provider fails.

`POST /api/sciloop-ai/explain`

Body:

```json
{
  "article": {
    "title": "Example science news",
    "summary": "Short summary",
    "url": "https://example.com",
    "source": "Example"
  },
  "mode": "simple"
}
```

Returns a stable SciLoop explanation:

```json
{
  "explanation": "...",
  "timeline": ["..."],
  "peopleInvolved": "...",
  "simpleMeaning": "...",
  "whyItMatters": "...",
  "visualBlueprint": {
    "objects": ["..."],
    "motion": "...",
    "labels": ["..."],
    "colors": ["..."],
    "interactionIdea": "..."
  },
  "providerUsed": "gemini",
  "cached": false,
  "fallback": false
}
```

`GET /api/sciloop-ai/news?topic=space&limit=8`

Fetches news and explains only the top few articles. This protects quota by respecting `MAX_AI_CALLS_PER_REQUEST`.

`POST /api/sciloop-ai/universal-visual-plan`

Refines a local SciLoop visual plan with Gemini, Groq, DeepSeek, OpenRouter, or Together when keys are available. If every provider fails or keys are missing, it returns the local plan with a safe fallback warning.

```json
{
  "title": "Mass bends spacetime and changes the path of light",
  "summary": "Demo visual request",
  "subject": "Relativity",
  "mode": "hybrid",
  "localPlan": {
    "subject": "Relativity",
    "title": "Mass bends spacetime",
    "chosenTemplate": "Spacetime Curvature"
  }
}
```

## Provider Switching

SciLoop tries providers in priority order. Before every call it checks:

- cooldown status
- per-minute usage
- daily usage
- monthly usage
- cache availability

If a provider times out, returns bad data, hits quota, or returns `402`, `403`, or `429`, the backend records the failure, cools that provider down, and moves to the next available provider.

If every live news provider fails, SciLoop returns safe demo science news.

If every AI provider fails, SciLoop returns a local rule-based explanation.

## Limit Protection

- News cache TTL: `NEWS_CACHE_TTL_SECONDS`, default 15 minutes
- AI cache TTL: `AI_CACHE_TTL_SECONDS`, default 7 days
- Usage file: `.data/provider-usage.json`
- Cache file: `.data/cache.json`
- Max articles per request: `MAX_ARTICLES_PER_REQUEST`
- Max AI calls per combined request: `MAX_AI_CALLS_PER_REQUEST`

The backend prefers cache before external API calls and never sends every article to AI automatically.
