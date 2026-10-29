import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { parseYaml, validateRecipe } from "../scripts/catalog-core.mjs";
import { filterRecipes } from "../src/lib/filter.js";
import { taskLabel } from "../src/lib/brands.js";

const file = "recipes/fasth3-h3-metal-m5-max.yaml";
const recipe = parseYaml(await readFile(new URL(`../${file}`, import.meta.url), "utf8"), file);
test("FastH3 is a pinned, unverified external Metal recipe with explicit evidence limits", () => {
  validateRecipe(recipe, file);
  assert.match(recipe.engine.ref, /^[0-9a-f]{40}$/);
  assert.equal(recipe.engine.repository, "https://github.com/zuiho-kai/h3-metal");
  assert.equal(recipe.deployment.status, "unverified");
  assert.equal(recipe.acceptance.verdict, "INCONCLUSIVE");
  assert.equal(recipe.commands.benchmark, null);
  assert.match(recipe.commands.install, new RegExp(recipe.engine.ref));
  assert.match(recipe.commands.serve, /--fasth3 --use-int8-row-fc2/);
  assert.match(recipe.commands.request, /fresh process/);
  assert.match(recipe.limitations.join(" "), /distilled 4-step checkpoint with 20-step/);
  assert.match(recipe.limitations.join(" "), /not independently rerun/);
});
test("FastH3 supports catalog filtering and a readable video/audio task label", () => {
  assert.equal(filterRecipes([recipe], { q: "h3-metal", vendor: "Apple", backend: "metal" }).length, 1);
  assert.equal(filterRecipes([recipe], { vendor: "NVIDIA" }).length, 0);
  assert.equal(taskLabel(recipe.model.task), "Text to video + audio");
});
test("FastH3 display commands are valid Bash syntax without running them", () => {
  for (const name of ["install", "serve", "request"]) {
    const result = spawnSync("bash", ["-n"], { input: recipe.commands[name], encoding: "utf8" });
    assert.equal(result.status, 0, `${name}: ${result.stderr}`);
  }
});
