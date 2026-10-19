# InferMatrixLab Recipes

<img src="public/assets/infermatrix-logo.png" alt="InferMatrix" width="300">

Find a documented inference configuration for a model, engine and exact hardware.
An [InferMatrixLab](https://github.com/InferMatrixLab) project. The catalog shows
deployment status and performance acceptance separately, with commands and
source provenance. Unlisted combinations have no support claim.

## Run locally

Requires Node.js 22+ and pnpm 11.25.0. The lockfile pins the resolved dependencies.

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm validate
pnpm dev
```

Open `http://localhost:3000`. `validate` and `build` consume the committed source
lock/cache offline; dependency installation in a new environment requires network.
After a content edit, rerun validation to regenerate the catalog used by the site.

```bash
pnpm sync:sources   # explicit network operation; review sources.lock.json changes
pnpm build          # validate content, then export every route into out/
pnpm preview        # serve out/ at http://localhost:4173
```

Source sync reads only declared GitHub YAML files and metadata. It uses
`GITHUB_TOKEN` when set, otherwise an available `gh auth token`, otherwise public
GitHub access. Credentials never belong in source declarations or the lockfile.
Sync/build never run recipe commands, model downloads or hardware workloads.

## Contribute and deploy

- [Engine delivery template](https://github.com/InferMatrixLab/InferRSI/tree/main/docs/template): maintained only in InferRSI.
- [Adding an engine](docs/adding-an-engine.md): template → source recipe → catalog registration.
- [Schema v1](docs/schema.md): exact fields, ownership and verification rules.
- [Engine inventory](docs/inventory.md): audited scope, releases, evidence and follow-ups.
- [Contribution guide](CONTRIBUTING.md): checks and reviewer responsibilities.
- [Deployment](docs/deployment.md): static hosting, path prefixes and current publication status.
- [Verification record](docs/verification.md): actual checks and outstanding hardware runs.

This site follows the browse/model/recipe organization of
[vLLM Recipes](https://recipes.vllm.ai/), with an original implementation for
InferMatrixLab's content contract. Source and asset attribution are in [NOTICE](NOTICE).
The site's code is MIT; engine, model, font and branding terms remain distinct.
