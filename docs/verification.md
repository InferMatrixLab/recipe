# Delivery verification — 2026-10-19

## Website visual follow-up

The user's supplied vLLM Recipes screenshots replace the initial landing-page
visual direction. The website now uses a compact white header, manufacturer/model
navigation, grouped configuration buttons, real provider/hardware logos and
tabbed command panels. Quantized Qwen checkpoints appear under the Qwen model
manufacturer while retaining their real `mlx-community` publisher/checkpoint ID.

This follow-up was self-reviewed; the independent reviews below describe the
earlier delivery slices. Source YAML, schema, evidence statuses and all engine
repositories remain unchanged by this visual update.

- 42 Node tests pass, including manufacturer/publisher grouping, complete-record
  configuration selection and precision/filter intersections.
- Root and `/recipe` prefix builds each pass 692 internal page/resource/anchor
  references. Prefix browser navigation, selected model, header search and local
  WebP/SVG/ICO assets work without console errors.
- Actual browser checks cover model search, filter intersections, reset/no-results,
  provider collapse/expand, model navigation, install expansion, command tabs,
  disabled benchmark, environment display and exact clipboard content.
- Arrow-key command-tab navigation works. Desktop, 768 px tablet and 390 px mobile
  layouts have no page-level horizontal overflow; long commands scroll locally.
- Provider/hardware images load with no missing images; console has no warnings
  or errors during the tested flows.
- [Design QA](../design-qa.md) records side-by-side source/render comparisons,
  initial findings, corrections and final visual result.

No source recipe or hardware acceptance status has been promoted.

## All recipes hardware follow-up

The hardware groups now follow NVIDIA, Huawei Ascend, Apple Silicon order.
NVIDIA filter buttons use the model family (B300, H20, L40S in the current
catalog), with duplicate B300 SKUs grouped under one button. Filtering retains
both recorded B300 recipes; cards, detail pages and commands retain their exact
hardware metadata. All 43 Node tests pass, including family filtering and
unchanged Ascend/Apple labels.
The root export passes 692 internal reference checks. Browser checks confirm
group order, two B300 results, one H20 result and reset to all six recipes;
no console warnings/errors were observed.

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

## Publication scope and pending engine sources

The user's latest instruction authorizes integrating the central website into
`InferMatrixLab/recipe` directly. The refreshed permission check reports ADMIN
on that repository, and its remote `main` is still the initial commit before
integration. This supersedes the earlier local-only instruction for recipe.
The five engine source repositories remain local pending publication.
The InferRSI template push had already completed before that instruction arrived:
`f55b4bc054f7fe3a500451b91071ac542f299c20` is on remote `main`.
The [scoped task Issue](https://github.com/InferMatrixLab/InferRSI/issues/29)
remains open; no campaign Issue was closed.

The five engine sources are local signed commits. A real
`pnpm sync:sources` attempt returned GitHub 404 for the unpublished source YAML
and exited 1; the existing lockfile's SHA-256 remained unchanged. The source
lock/cache was built from each exact local Git commit using the same complete
snapshot validation/atomic-write path. No successful remote source sync is claimed
for YAML files that have not been pushed yet. Until their remote publication,
new engine source/edit links can return 404;
the local website, cached recipes, original evidence and deployment revision
links remain reviewable. Production domain/Pages hosting has not been configured.

For the engine publication follow-up: publish the five source changes to their
declared refs, run `pnpm sync:sources`, review the resolved source commits,
then validate/test/build and refresh the central snapshot/static export. Avoid
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
