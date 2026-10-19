# Recipe schema v1

Canonical contract: [recipe.schema.json](../schemas/recipe.schema.json).
The matching copy template is maintained in
[InferRSI/docs/template/recipe.yaml](https://github.com/InferMatrixLab/InferRSI/blob/main/docs/template/recipe.yaml).
Update the schema, documentation, tests and that template together.

One entry describes model × engine × task × backend × exact device/count ×
precision. IDs are stable lowercase hyphenated slugs and globally unique.
Unknown fields, duplicate YAML keys, aliases, placeholders and duplicate IDs fail.
Errors identify the source file and field. Commands are reviewed display text;
they are never synthesized, interpreted or executed by the catalog.

| Field | Contract |
| --- | --- |
| `schema_version` | Integer `1` |
| `id`, `title` | Stable slug and nonempty human title |
| `kind` | `standalone_engine` or `upstream_recipe` |
| `model` | Real provider/checkpoint `id`, `provider`, snake_case `task` |
| `engine` | Slug `id`, `name`, GitHub `repository`, real deployment tag/commit `ref` |
| `runtime` | Backend slug and exact precision description (mixed precision is explicit) |
| `hardware` | Vendor, exact device model and positive integer `device_count` |
| `environment` | OS and a string list of dependencies/prerequisites, including unknown version limits |
| `commands` | Required install, serve, request and benchmark keys; benchmark may be null |
| `deployment` | Status, nullable ISO calendar verification date and nullable HTTPS evidence URL |
| `acceptance` | Verdict, nullable HTTPS issue URL and nullable HTTPS evidence URL |
| `maintainers` | Nonempty unique list of verified real GitHub logins |
| `updated_at` | ISO calendar date `YYYY-MM-DD` |
| `limitations` | String list of blockers, scope and unverified details |

All listed fields are required; optional values use null rather than omitted keys.
Install/start/request must be nonempty for `unverified` or `validated`. A known
`unsupported` combination may use null commands, must explain a blocker in
limitations, and has no website deployment/copy controls. Unknown support is not
automatically unsupported. Incomplete inventory items do not enter the catalog.

`validated` requires a verification date and evidence for that exact deployment.
`PASS` requires both an acceptance issue and full evidence. `FAIL` is a completed
comparison missing frozen gates; `INCONCLUSIVE` records incomplete or mismatched
evidence. CPU tests and imported historical reports do not upgrade either status.
No common performance threshold is defined here. Historical reports retain their
authors, workload and revision scope; first-version cards contain no rankings.

URL syntax checks require HTTPS and a usable hostname/port. They cannot prove
that a report contains sufficient evidence: reviewers still check content and
scope. Deployment ref and content source commit identify different artifacts.

## Sources and the offline snapshot

[sources.schema.json](../schemas/sources.schema.json) defines a source list with
schema_version, and `id`, GitHub `repository`, `ref`, `paths` per source. Refs may
be branches, tags or commits. Paths are explicit relative YAML files: no globs,
absolute paths, `..`, backslashes, URL paths or credential fields. Duplicate
source IDs and repository/path owners fail. An imported recipe's engine repository
must match its declared source owner; upstream recipes maintained here are local.

`sources.lock.json` is the single atomic snapshot: each source has its resolved
40-character commit and files containing path, SHA-256 and original YAML content.
Embedding the content cache avoids two-file partial updates. Sync resolves each
ref once, reads only declared files at that commit, validates the entire candidate
with local recipes, then renames one temporary lockfile. Failure preserves the
last successful snapshot. GitHub reads have timeouts and size limits; no source
scripts or credentials are read. Interrupted temporary files are ignored.

Offline builds validate the manifest against the lock, check cached hashes, YAML,
owner and cross-catalog uniqueness, and reread local recipes. New invalid content
cannot silently fall back to an old generated catalog. Derived `generated/` and
`out/` are ignored. The catalog deterministically derives model/engine relations
and collision-resistant model slugs. Source permalinks use the resolved commit;
edit links use the content owner's declared ref.
