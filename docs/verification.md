# Delivery verification — 2026-10-19

Scope: InferRSI engine-delivery template, five organization-engine source recipes,
one supplemental upstream Qwen-Image recipe, catalog/sync and static website.
Runtime kernels, scheduler/evaluator behavior, old evidence and InferRSI's four
CI lanes were not changed.

## Checks executed

| Check | Actual result / scope |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed on Windows, Node 24.13.1 / pnpm 11.25.0 |
| `pnpm test` | 39 contract, filter and source-sync tests passed |
| `pnpm validate` | Six production recipes, six models and six engines; offline lock/cache validation passed |
| Root static build | Passed; homepage, six model routes, six recipe routes and not-found export generated |
| Export inspection | Root and `/recipe` prefix builds each passed 283 internal navigation/resource/anchor checks; 404 and .nojekyll present |
| Prefix HTTP checks | `/recipe/`, direct recipe and logo returned 200; unknown recipe returned 404 on the temporary prefixed preview |
| Browser | Search, intersecting filters, no-results and clear; model/detail navigation and copy equality checked in Codex browser |
| Mobile | 390 px viewport; fixed long-command ancestor overflow with `min-width: 0`; page width now fits and commands scroll within their own blocks |
| InferRSI | `python -X utf8 -m pytest tests/test_template_layout.py -q`: 3 passed; copied scaffold's 43 local links resolve |
| Source commands | Bash syntax, embedded Python AST/JSON, exact deployment-file references and schema checks passed; independent source/API review completed |
| Additional existing docs checks | System1 strict MkDocs build and MLX Ruff check passed |
| Diff review | Signed commits and focused file scope reviewed; independent reviewer did not edit reviewed source |

Ordinary Python pytest on this Windows machine hits the existing GBK default
when reading UTF-8 README text; UTF-8 mode passes. The attempted full MLX unittest
suite has 23 import errors from unavailable Apple-only `mlx`; it is not reported
as passing. These docs/recipe changes did not alter MLX runtime code.

## Independent review and fixes

Data/schema/sync review found an evidence URL syntax gap. Hostname/port semantic
validation and six regression cases were added; independent recheck passed all
39 tests and rejected invalid values in all three evidence/Issue URL fields.

Engine/source review found that RLT's copied device override conflicted with its
scheduler-allocation guidance. Source recipes now default only an unset device
variable and preserve allocated indexes, UUIDs and explicit empty masks. The
reviewer rechecked final source commits listed in [inventory](inventory.md),
including CLI/API request semantics and original hardware/evidence scope.

Template review covered `5b3c167..f55b4bc`, copied layout/links, template/schema
alignment and unchanged runtime/CI. Website/deployment review checked generated
routes/assets and found a Pages `.nojekyll` omission, now fixed. Browser testing
additionally found and fixed mobile command overflow. Reviews recommend the
specific examined revisions; they are not hardware acceptance or merge authority.

## Local delivery and pending publication

The user's latest instruction is to finish local commits and run the service,
then push after permissions are available. No further push is performed.
The InferRSI template push had already completed before that instruction arrived:
`f55b4bc054f7fe3a500451b91071ac542f299c20` is on remote `main`.
The [scoped task Issue](https://github.com/InferMatrixLab/InferRSI/issues/29)
remains open; no campaign Issue was closed.

The five engine sources and central website are local signed commits. A real
`pnpm sync:sources` attempt returned GitHub 404 for the unpublished source YAML
and exited 1; the existing lockfile's SHA-256 remained unchanged. The source
lock/cache was built from each exact local Git commit using the same complete
snapshot validation/atomic-write path. No successful remote source sync is claimed
for YAML files that have not been pushed yet. Until their remote publication,
new source/edit links and central GitHub documentation links can return 404;
the local website, cached recipes, original evidence and deployment revision
links remain reviewable. Production domain/Pages hosting has not been configured.

After write permission is available: publish the five source changes to their
declared refs first, run `pnpm sync:sources`, review the resolved source commits,
then validate/test/build and publish the central repository/static export. Avoid
squashing away provenance without refreshing the lock. The website's local
recipe source permalink is updated by rebuilding after its containing commit.

## Remote hardware follow-up

All six entries deliberately remain `unverified / INCONCLUSIVE`. On each exact
listed hardware/software/model revision, run install, readiness, minimum request,
output integrity and the source's required L3/L4 quality/E2E protocol. Capture
unknown OS/toolchain versions and actual execution logs. Do not upgrade from CPU
tests, historical reports or a successful webpage build. System1 root licensing,
additional engine/model/SKU combinations and complete Qwen-Image prepared-host
provisioning remain documented follow-ups in the inventory.
