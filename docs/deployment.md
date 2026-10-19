# Static deployment

`pnpm build` exports the Next.js App Router site to `out/` with one HTML directory
per model/recipe route. It uses only the validated source snapshot and local
recipes. Fonts and organization artwork are local; builds do not fetch them.
There is no server API, account system or command execution service.

For a local production preview:

```bash
pnpm build
pnpm preview
```

Open `http://localhost:4173/`. The bundled preview binds to loopback and serves
nested `index.html` routes, static assets and an HTTP 404 for unknown routes.
`PORT` overrides 4173. Use HTTPS on a remote host so Clipboard API copy works;
failure shows selectable command text with explicit feedback.

For root-domain hosting, upload **the contents** of `out/` to a static host.
Use directory index routing and a real 404 page (`404.html`); do not rewrite
all missing URLs to the homepage. `.next/` is not the deployable artifact and
`next start` is not used for this static export.

The export includes `public/.nojekyll`, which is copied into `out/.nojekyll`.
Preserve that dotfile when uploading to a Pages publishing branch so Jekyll
does not discard `_next/` assets. Actions-based Pages uploads also accept this
static export; the supplied CPU workflow only creates a review artifact.

For GitHub Pages project hosting at `/recipe/`, set
`NEXT_PUBLIC_BASE_PATH=/recipe` in the build environment. The same variable is
used by the preview server. Next handles page links; local public assets use
the matching prefix. Rebuild when changing the prefix. For example in Bash:

```bash
NEXT_PUBLIC_BASE_PATH=/recipe pnpm build
NEXT_PUBLIC_BASE_PATH=/recipe pnpm preview
```

PowerShell equivalent: assign `$env:NEXT_PUBLIC_BASE_PATH='/recipe'`, build and
preview, then remove that environment variable before a root-path rebuild.
The CPU workflow uploads `out/` for review. Production hosting is deliberately
an explicit configuration step; no domain or Pages site is presumed to exist.

## Publication status

No production domain or live hosted URL was supplied. This delivery provides a
local preview and static export. At the initial permission audit on 2026-10-19,
the active GitHub account had READ on `InferMatrixLab/recipe` and four source
engines, ADMIN on InferRSI and WRITE on the Drama engine. The latest permission
check reports ADMIN on recipe, and the user has authorized direct integration
into its `main`. The five engine source commits still await publication;
merging recipe does not configure production Pages hosting.
See [verification](verification.md) for the final delivery status.
