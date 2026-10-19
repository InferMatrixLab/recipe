# Add an engine to the catalog

1. Copy and adapt the
   [InferRSI engine delivery template](https://github.com/InferMatrixLab/InferRSI/tree/main/docs/template).
   Keep the implementation in its real owner repository, retain upstream notices
   and use the common organization attribution/asset provenance. Existing engines
   adapt only relevant files; they do not need the InferRSI Python runtime.
2. Document architecture, environment, installation, startup, minimal request,
   reproduction, tests and limitations. Verify each claimed hardware independently.
   Keep campaign gates and comparison pins in acceptance issues and evidence
   (`plan/`, `results/`, `patch/`, `validator/`). Missing hardware leaves the entry
   unverified and the acceptance INCONCLUSIVE.
3. Copy InferRSI's recipe YAML into `recipes/<id>.yaml` in the engine repository.
   Follow [schema v1](schema.md). Use exact deployment tags/commits and maintainers,
   one complete configuration per ID, with reviewed commands. Commit that source
   before catalog registration; source URLs must be reachable by the sync identity.
4. Add an explicit declaration to the catalog's `sources.yaml`:

   ```yaml
   schema_version: 1
   sources:
     - id: your-engine
       repository: https://github.com/your-org/your-engine
       ref: main
       paths:
         - recipes/your-model-your-device.yaml
   ```

   The names above illustrate syntax and are not publishable content. Do not
   copy a second owned YAML into this catalog. If no engine-owned source can be
   maintained, use one local YAML here with upstream repository attribution.
5. Run `pnpm sync:sources`, review the exact lock/cache diff, then `pnpm test`,
   `pnpm validate` and `pnpm build`. Do not execute commands during content sync.
   Review cards, model associations, mobile layout, copy and original edit links.
6. Submit the collection change with source ownership, actual checks, hardware
   validation gaps and evidence scope. Engine maintenance, catalog collection,
   experiment acceptance and website publication are distinct responsibilities.

For changes to an existing engine recipe, update the owner file, synchronize
and review the new locked snapshot. A failed sync preserves the previous
snapshot but exits nonzero; resolve the reported source/path before publishing.
