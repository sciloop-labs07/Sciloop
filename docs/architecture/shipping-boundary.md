# SciLoop shipping boundary

## What ships now

SciLoop ships as two deployable services:

1. **`sciloop-frontend`** — the Next.js 16 / React 19 / TypeScript public product.
2. **`sciloop-ai-backend`** — the controlled server-side AI and news adapter.

The public entry point is `/sciloop-live`. It serves the preserved SciLoop HTML
portal through a Next.js route handler so the original visual language and
browser simulations remain the public experience while same-origin backend
proxy calls work over HTTP. The source HTML and companion assets remain
preserved; they are copied into a deployable public asset bundle rather than
opened from `file://`. Public product routes may call safe Next API routes and
the controlled AI backend, but they must not call local admin tooling or
forward operational secrets.

The repository is developed and released as two environments:

1. `main` deploys the public production surface.
2. `workbench` deploys the protected preview surface for experiments,
   visualization development, and migration work.

Production keeps workbench paths unavailable unless the deployment explicitly
sets `SCILOOP_WORKBENCH_ENABLED=true`. Platform-level preview access protection
should be enabled on the workbench deployment as well.

## Quarantined during migration

These areas remain available in the repository for local work and reference,
but are not part of the shipping product or Render deployment:

| Area | Purpose | Migration rule |
| --- | --- | --- |
| `server/` | ForLoop control panel, runtime commands, provider diagnostics | Local/admin-only. No public proxy and no production deployment. |
| `public/forloop-control-panel/` | ForLoop browser control panel | Local/admin-only. Move to an internal tools package after the public UI no longer links to it. |
| `backend/reality-engine/` | Early reality/Unity experiment services | Keep behind the AI backend until a validated buyer use case exists. Do not add new public routes. |
| `SciLoop - Live Scientific Discoveries 80.html` and companion scripts | Preserved legacy visual shell | Keep unchanged as a rollback and migration source; do not serve it from the public launch route. |
| Reel files, exported HTML, screenshots, demos | Creative evidence and prototypes | Keep outside the application boundary and do not import from product code. |

## Public API ownership

| Capability | Shipping owner | Legacy owner |
| --- | --- | --- |
| Public news and explanations | `app/api/sciloop-ai-proxy/*` → `sciloop-ai-backend` | `server/` |
| Quantum possibilities | `app/api/possibilities` | ForLoop orchestration |
| Visual recipe translation | `app/api/visual-engine/translate` with safe fallback | ForLoop admin router |
| Admin runtime controls | None in the public app | `server/` only |

`/api/forloop-proxy/*` intentionally returns `410 Gone`. It used to attach an
admin access code to arbitrary public browser requests, which is not a safe
public-product boundary.

## React migration order

The legacy HTML shell stays live until its replacements have feature parity.
Move one independent slice at a time:

1. Extract the public navigation and product introduction into `app/sciloop-live` React components.
2. Extract the live-innovation feed and its fallback state.
3. Extract the possibilities interaction.
4. Extract visual-language and experiment components only where they prove buyer value.
5. Retire the raw HTML route only when the React route passes a mobile and desktop smoke test.

Do not move or delete a legacy asset merely to improve folder appearance. Each
move needs a verified replacement route, a reference search, and a build check.

## Capability promotion workflow

Capabilities are tracked in `lib/capability-registry.ts` with one of four
statuses: `workbench`, `candidate`, `public`, or `retired-but-preserved`.

New work is developed on a feature branch, merged into `workbench`, and tested
in the protected preview deployment. A capability can move to `public` only
after desktop/mobile first-load checks, accessibility checks, error and offline
states, performance review, and a production build pass. The previous public
deployment remains available for rollback after promotion.

## First promoted visual-language slice

`/sciloop-live/physics` is the first public Visual Language capability. It is
server-rendered from the typed physics discovery data in `data/discoveries.ts`
and the transition configuration in `data/worlds/physics-world.ts`. Its first
paint uses lightweight SVG/CSS mechanism visuals for Electromagnetic Induction,
General Relativity, and the Higgs Field.

The full `PhysicsWorldExperience` remains a protected workbench capability at
`/mini-experiment-lab`. The public page links to it only as an explicit user
action; it is not loaded into the public bundle or exposed through public
navigation. Future visual-language subjects must follow the same path: extract
a typed recipe, ship a reviewed static visual first, then promote an approved
interactive slice after preview testing.

The current React/Vercel introduction is retained at `/legacy-home` for
migration reference. The public root redirects to `/sciloop-live`, and the
protected workbench remains the place for platform development. The Next.js
development indicator is not part of the public portal; production verification
must use `npm run build` followed by `npm run start`, not `npm run dev`.
