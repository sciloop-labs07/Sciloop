# SciLoop Smart Navigation Plan

Status: implemented in the modern SciLoop shell and on the public `/sciloop-live` portal through an isolated navigation enhancement.

## Design intent

The navigation borrows interaction patterns from Instagram’s current web experience—recognizable icon-first navigation, a quiet persistent navigation surface, strong active-state feedback, and responsive adaptation—without copying Instagram branding, assets, typography, or visual styling.

## Observed inspiration

- The navigation relies on familiar icons with concise labels.
- The active destination is easy to identify without reading every label.
- The layout becomes more compact on narrower viewports, where a bottom navigation pattern is more appropriate than a left rail.
- Primary actions remain available without consuming the main content area.
- The navigation uses restrained surfaces and high-contrast focus states rather than large visual interruptions.

## SciLoop desktop behavior

- A fixed left rail is visible at medium and larger breakpoints.
- It starts collapsed at icon width.
- Pointer entry expands it automatically.
- Pointer exit collapses it unless the user pins it.
- Keyboard focus expands it so keyboard users receive the same labels and context.
- Expansion uses width and opacity transitions; content does not reflow or shift.
- The active route keeps a cyan edge marker and highlighted icon surface while collapsed.
- A pin control lets the user keep the expanded state open.
- Escape closes a hover-expanded or focused state and does not change routes.

## SciLoop mobile behavior

- Hover behavior is not used on touch devices.
- A fixed bottom navigation bar exposes the four most important destinations.
- A More action opens the complete navigation list in a compact dialog-like panel.
- The mobile panel can be closed with Close or Escape.
- Navigation targets remain keyboard and touch accessible.

## Route visibility

The shell exposes only product-safe routes and protected workbench entrypoints. It does not expose AGI OS, provider credentials, backend services, legacy admin panels, or arbitrary experimental routes.

| Group | Route | Audience |
| --- | --- | --- |
| Explore | `/` | Public/product |
| Explore | `/live-innovations` | Public/product |
| Explore | `/sciloop-live/physics` | Public/product |
| Explore | `/live-innovations#method` | Public/product |
| Workbench | `/workbench` | Protected preview |
| Workbench | `/mini-experiment-lab` | Protected preview |
| Workbench | `/visual-frontier/visual-engine-demo` | Protected preview |

The preserved public HTML portal remains the default entry point under the current proxy. Its existing portal buttons, IDs, active-state controller, content, and assets remain intact; `lib/public-portal.ts` adds only the smart rail/bottom-bar behavior around that existing controller.

## Public portal behavior

- On desktop, the existing portal switcher is fixed on the left in a compact collapsed rail.
- Pointer entry, keyboard focus, or the explicit navigation button expands the rail to show full labels.
- Pointer exit collapses the rail after a short grace period, preventing flicker while moving between controls.
- On narrow viewports, the same controls become a fixed bottom navigation bar; the explicit button expands the available portal choices.
- The enhancement uses the portal’s existing buttons and click listeners, so portal routing and active visual states continue to be controlled by the original portal application.

## Accessibility requirements implemented

- Navigation landmarks have accessible labels.
- Links expose text labels when expanded and `title` text when collapsed.
- Active routes use `aria-current="page"`.
- The pin control exposes `aria-label` and `aria-pressed`.
- The mobile More control exposes `aria-expanded` and `aria-controls`.
- Focus-visible outlines are retained.
- Escape closes transient navigation states.
- No destination is available only through hover.

## Performance rules

- No pointermove listener or per-frame React update is used.
- Hover/focus changes update a small component state only at interaction boundaries.
- The rail animates width, opacity, transform, and paint-friendly surfaces.
- The main content receives stable left padding on large screens, preventing layout shifts during expansion.
- The mobile bar is fixed and the main shell reserves bottom space.
- The component contains no new dependency or rendering framework.

## Verification checklist

- Desktop collapsed rail visible.
- Pointer entry expands labels.
- Pointer exit collapses labels.
- Pin keeps the rail expanded.
- Active route marker follows pathname changes.
- Keyboard focus exposes labels and focus outlines.
- Escape closes transient states.
- Mobile bottom bar appears without hover assumptions.
- Mobile More panel exposes all configured routes.
- Reduced-motion global styles reduce transition duration.
- Public `/sciloop-live` route, portal content, and preserved assets remain intact; only the navigation presentation layer is enhanced.
- Typecheck, lint, build, and diff checks pass.
