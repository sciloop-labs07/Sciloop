# SciLoop Public UI Contract

## Canonical public product

The root route `/` redirects to the canonical public launch interface.

The uploaded file below remains the deep live-discovery interface:

`SciLoop - Live Scientific Discoveries 80.html`

It is served at:

`/sciloop-live`

The root redirect ensures users land in the intended uploaded interface while preserving the Next.js routes as the platform and integration layer.

## SciLoop Studio

The Next.js pages, Workbench, kernel, Future Lens, and typed visual-engine modules remain in the repository as the platform/studio implementation layer.

They must not become a competing public homepage. New intelligence should be exposed through APIs and integrated into the main SciLoop HTML shell.

## Safe integration rule

New features should follow this path:

```text
SciLoop kernel/API → main HTML bridge → existing public portal action
```

Do not delete the studio code or the main HTML. Keep both until the public shell has reached parity with the studio capabilities.
