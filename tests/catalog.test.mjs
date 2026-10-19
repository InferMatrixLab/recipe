import { test } from "node:test";
import assert from "node:assert/strict";
import { fixture, record } from "./fixtures.mjs";
import { validateRecipe, makeCatalog } from "../scripts/catalog-core.mjs";
import { filterRecipes } from "../src/lib/filter.js";

test("valid recipe and deterministic model/engine relationships", () => {
  assert.doesNotThrow(() => validateRecipe(fixture(), "valid.yaml"));
  const second = fixture();
  second.id = "second";
  second.hardware.device_count = 2;
  const a = makeCatalog([record(), record(second)]);
  assert.equal(a.models.length, 1);
  assert.equal(a.engines.length, 1);
  assert.equal(a.models[0].recipeIds.length, 2);
  assert.deepEqual(a, makeCatalog([record(second), record()]));
});
for (const [label, mutate, path] of [
  ["missing field", (x) => delete x.hardware, "hardware"],
  ["wrong status", (x) => (x.deployment.status = "green"), "status"],
  ["missing command", (x) => (x.commands.serve = null), "serve"],
  [
    "missing device count",
    (x) => delete x.hardware.device_count,
    "device_count",
  ],
  ["zero devices", (x) => (x.hardware.device_count = 0), "device_count"],
  ["invalid date", (x) => (x.updated_at = "2026-02-30"), "updated_at"],
  ["empty maintainers", (x) => (x.maintainers = []), "maintainers"],
  ["placeholder", (x) => (x.engine.ref = "<release-tag>"), "engine/ref"],
  ["TODO", (x) => (x.limitations = ["TODO"]), "limitations"],
  [
    "PASS without evidence",
    (x) => (x.acceptance.verdict = "PASS"),
    "acceptance",
  ],
  [
    "validated without date/evidence",
    (x) => (x.deployment.status = "validated"),
    "deployment",
  ],
  [
    "unsupported without reason",
    (x) => {
      x.deployment.status = "unsupported";
      x.limitations = [];
    },
    "limitations",
  ],
  [
    "non-HTTPS evidence",
    (x) => (x.acceptance.evidence_url = "javascript:alert(1)"),
    "evidence_url",
  ],
  ["unknown field", (x) => (x.hardware.cards = 4), "cards"],
])
  test(`reject ${label} with file and field`, () => {
    const x = fixture();
    mutate(x);
    assert.throws(
      () => validateRecipe(x, "bad.yaml"),
      (e) => e.message.includes("bad.yaml") && e.message.includes(path),
    );
  });
test("unsupported recipe allows absent commands but never becomes deployable", () => {
  const x = fixture();
  x.deployment.status = "unsupported";
  x.commands = { install: null, serve: null, request: null, benchmark: null };
  assert.doesNotThrow(() => validateRecipe(x, "unsupported.yaml"));
});
test("duplicate recipe IDs fail rather than overwrite", () =>
  assert.throws(
    () => makeCatalog([record(), record()]),
    /duplicate recipe id/,
  ));
for (const url of [
  "https://#",
  "https://?",
  "https://@",
  "https://:",
  "https:///",
  "https://example.org:99999",
])
  test(`reject invalid evidence URL ${url}`, () => {
    const x = fixture();
    x.deployment = {
      status: "validated",
      last_verified_at: "2026-10-19",
      evidence_url: url,
    };
    assert.throws(() => validateRecipe(x, "bad-url.yaml"), /evidence_url/);
  });
test("all filters intersect; engine and model search; unknown combination stays empty", () => {
  const a = fixture();
  const b = fixture();
  b.id = "second";
  b.hardware.vendor = "Other";
  b.runtime.backend = "cuda";
  assert.equal(
    filterRecipes([a, b], {
      q: "fixture engine",
      vendor: "Fixture",
      backend: "cpu",
    }).length,
    1,
  );
  assert.equal(filterRecipes([a, b], { q: "fixture/model" }).length, 2);
  assert.equal(
    filterRecipes([a, b], { vendor: "Other", backend: "cpu" }).length,
    0,
  );
  assert.equal(filterRecipes([a, b], {}).length, 2);
});
