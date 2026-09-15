# ForLoop Control Panel

## What ForLoop Is

ForLoop is a developer-only mission-control platform for SciLoop. It is used to monitor backend health, inspect AI and story outputs, run dry-runs, review local feedback notes, and export safe developer reports.

## What ForLoop Is Not

ForLoop is not part of the SciLoop user-facing experience. It is not a portal tab, not a public product page, and not a publishing surface for end users.

## How It Differs From SciLoop

- `SciLoop` is the user-facing scientific discovery and simulation platform.
- `ForLoop` is the developer/admin cockpit that tests and monitors SciLoop from outside.

## How To Run It

Run the SciLoop frontend:

```powershell
cd "C:\Users\moham\Downloads\Sciloop 3"
npm run dev
```

Run the backend:

```powershell
cd "C:\Users\moham\Downloads\Sciloop 3\server"
npm run dev
```

Open:

- Recommended ForLoop launcher: `C:\Users\moham\Downloads\Sciloop 3\Start ForLoop Control Panel.bat`
- Double-clickable ForLoop file: `C:\Users\moham\Downloads\Sciloop 3\ForLoop - Control Panel.html`
- SciLoop user app: `http://localhost:3000/`
- ForLoop control panel: `http://localhost:3000/forloop-control-panel/`
- ForLoop control panel from backend: `http://localhost:3001/forloop-control-panel/`
- ForLoop launcher from backend: `http://localhost:3001/forloop-control-panel.html`

## SciLoop AI Panel

The new `SciLoop AI Panel` is the launch control surface for the standalone News Portal AI backend at:

```text
http://localhost:5050
```

The panel has two gates:

- Specialist AI checks: any 3 provider checks must be green. The remaining specialists still show warnings until refreshed, but they no longer block launch.
- TR box: Node.js, npm, backend folder, dependencies, `.env`, and port/backend status must be ready.

Keys are entered manually in ForLoop and saved only into the local `sciloop-backend/.env` file. ForLoop returns masked key labels only; it does not echo raw keys back into the browser.

The red `Start SciLoop AI Server` button starts the allowlisted runtime target:

```text
sciloop-ai-backend -> cd sciloop-backend && npm run start
```

## Local Access Gate

ForLoop uses a local developer gate. By default, the access code is:

```text
123456
```

You can override it in `server/.env` with:

```text
FORLOOP_DEV_ACCESS_CODE=your-local-code
```

The unlock state is stored only in `sessionStorage`.

## Environment Variables

Safe defaults live in [server/.env.example](</C:/Users/moham/Downloads/Sciloop 3/server/.env.example>).

Important ones:

- `FORLOOP_ADMIN_MODE=local`
- `FORLOOP_DEV_ACCESS_CODE=123456`
- `ALLOW_ADMIN_AI_TEST=false`
- `ALLOW_ADMIN_NEWS_FETCH=false`
- `ALLOW_ADMIN_SIMULATION_AI=false`

## Backend Fallback Mode

If the backend is offline, ForLoop still works in local fallback mode:

- mock AI explanation
- mock story preview
- mock news batch
- template simulation plan
- local feedback notes
- local developer report export

## Demo Mode

Demo mode is a frontend-only sample mode for teacher, investor, or developer walkthroughs. It never calls real APIs and never publishes anything to SciLoop users.

## Runtime Console

ForLoop includes a local Runtime Console for controlling approved SciLoop processes from the browser.

It is intentionally not a full unrestricted terminal. The approved commands are:

```text
status
logs
start sciloop-frontend
stop sciloop-frontend
restart sciloop-frontend
```

The backend exposes these runtime endpoints:

```text
GET /api/admin/runtime/status
GET /api/admin/runtime/logs
POST /api/admin/runtime/start
POST /api/admin/runtime/stop
POST /api/admin/runtime/restart
```

Runtime mutations require the local access code via the browser session. ForLoop only stops processes it started itself. It will not kill unrelated terminals or arbitrary processes already running on a port.

The ForLoop Control API is the control anchor. It reports its own status, but it cannot safely stop itself from inside its own process.

## Existing Admin Endpoints

- `GET /api/health`
- `GET /api/admin/status`
- `GET /api/admin/access-config`
- `POST /api/admin/verify-access`
- `GET /api/admin/services`
- `GET /api/admin/ai-status`
- `POST /api/admin/ai-explain-test`
- `POST /api/admin/story-preview`
- `GET /api/admin/news-status`
- `POST /api/admin/news-dry-run`
- `POST /api/admin/news-parse-text`
- `GET /api/admin/simulation-status`
- `POST /api/admin/simulation-plan`
- `GET /api/admin/feedback-status`
- `GET /api/admin/feedback-list`
- `GET /api/admin/logs`
- `GET /api/admin/action-history`

## Mock Vs Real Tools

- Real by default:
  - status checks
  - service registry
  - logs
  - action history
  - news parse
  - safe dry-runs
- Mock by default:
  - AI explanation test
  - story preview when AI admin test is disabled
  - demo mode outputs
- Real provider calls only happen after explicit local opt-in.

## Security Rules

- Never expose API keys to the frontend.
- Never return raw `process.env` values.
- Never auto-call paid providers by default.
- Never auto-publish anything to the SciLoop frontend.
- Never add destructive admin endpoints in this phase.

## Future Roadmap

Command 5 can add:

- authenticated admin access
- persistent feedback storage
- review queue and publish approvals
- audit logs
- rate limits
- richer pipeline artifacts

