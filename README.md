# SciLoop Local Development

## Launch Routes

The root route redirects to the canonical public interface:

```text
/
```

The canonical public interface is the uploaded main SciLoop HTML shell:

The newer Next.js Workbench and kernel remain the internal SciLoop Studio layer and are integrated into the main shell through APIs.

See `SCILOOP_PUBLIC_UI.md` for the ownership contract.

Use these routes for the modern one-link launch setup:

```text
/sciloop-live
/visual-language-lab
/system-status
```

For the full public launch checklist, see:

```text
LAUNCH_SCILOOP.md
```

For GitHub + Render member sharing, see:

```text
GITHUB_RENDER_CHECKLIST.md
RENDER_DEPLOY.md
RENDER_ENV_TEMPLATE.md
MOBILE_REMOTE_SETUP.md
```

## Sciloop News Explanation API

This project includes a standalone backend for explaining science and innovation news.

### One-click launch

After a shutdown/restart, double-click:

```text
Start SciLoop Platform.bat
```

It starts the local API on port `3001` and opens the main SciLoop HTML file.

To stop the local API manually, double-click:

```text
Stop SciLoop API.bat
```

### Manual launch

```cmd
cd server
npm install
npm run dev
```

Then open:

```text
ai-news-test.html
```

The test page calls:

```text
http://localhost:3001/api/explain-news
```

If no AI provider key is configured, the API still returns a useful rule-based fallback response.

Optional environment variables are listed in:

```text
server/.env.example
```
