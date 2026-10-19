# Contributing

Start with [adding an engine](docs/adding-an-engine.md) and [schema v1](docs/schema.md).
Use `plan → code → test → review`, small task branches and `git commit -s`.
Preserve real author identity. Record material agent assistance in an
`Agent-assisted-by: Codex (implementation)` trailer when applicable.

Engine maintainers own implementation, deployment commands and source recipes.
Catalog maintainers own the schema, synchronization and website. The acceptance
owner decides the experiment verdict from its frozen protocol and evidence.
Collecting a recipe does not assign a new engine maintainer or establish PASS.

Prefer `recipes/<id>.yaml` in the engine's repository. Declare its exact path and
reviewed ref in `sources.yaml`; run `pnpm sync:sources` and review the resulting
repo/path/commit and cached YAML in `sources.lock.json`. A local recipe is allowed
when an upstream source has no maintainable engine-owned recipe. Never create
two owners for one ID. File paths are case-sensitive on the hosting platform.

Run these checks before submitting a focused collection PR:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm validate
pnpm build
git diff --check
```

Review mobile and desktop pages, search/filter intersections, model links,
command copy (including failure feedback), source edit/permalink and evidence
links. Refresh directly on a detail route; unknown routes must return 404.
Source sync is explicit, not a required network step for every build. It fails
without replacing the previous snapshot if any source is missing or invalid.
An invalid changed manifest/local recipe also fails offline validation.

Tests are synthetic fixtures and are never production recipes. CI is CPU-only:
it validates content, runs contract/sync tests and exports the site. It does not
execute the catalog's shell/Python text or qualify GPU/NPU/Apple hardware.

For deployment validation, record the exact engine/model/software/device/workload,
date and evidence URL. For PASS, link the acceptance issue and complete evidence
with frozen gates. Keep baseline/candidate pins and numeric thresholds in that
issue and evidence, not this repository's shared automation. Missing required
quality/E2E evidence means INCONCLUSIVE. Preserve historical failures and scope.
