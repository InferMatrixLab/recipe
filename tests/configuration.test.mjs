import { test } from "node:test";
import assert from "node:assert/strict";
import { fixture } from "./fixtures.mjs";
import { providerGroups, modelBrand } from "../src/lib/brands.js";
import {
  selectConfiguration,
  configurationValue,
} from "../src/lib/configuration.js";
import { filterRecipes } from "../src/lib/filter.js";

test("manufacturer navigation retains the exact quantized checkpoint and publisher", () => {
  const models = [
    { id: "Qwen/model", provider: "Qwen", slug: "native" },
    {
      id: "mlx-community/Qwen3-TTS-4bit",
      provider: "mlx-community",
      slug: "quantized",
    },
    { id: "LiquidAI/model", provider: "LiquidAI", slug: "liquid" },
  ];
  const qwen = providerGroups(models).find((p) => p.name === "Qwen");
  assert.equal(qwen.models.length, 2);
  assert.equal(
    qwen.models.find((m) => m.slug === "quantized").provider,
    "mlx-community",
  );
  assert.equal(models[1].id, "mlx-community/Qwen3-TTS-4bit");
  assert.equal(
    modelBrand({ provider: "unregistered", id: "unregistered/model" }).logo,
    null,
  );
});
test("hardware selection picks a whole recorded recipe; absent combinations stay unavailable", () => {
  const current = fixture();
  const alternate = fixture();
  alternate.id = "alternate";
  alternate.hardware.model = "Another CPU";
  alternate.commands.serve = "alternate exact command";
  const unrelated = fixture();
  unrelated.id = "unrelated";
  unrelated.model.id = "another/model";
  unrelated.hardware.model = "GPU";
  const selected = selectConfiguration(
    [current, alternate, unrelated],
    current,
    "hardware",
    configurationValue(alternate, "hardware"),
  );
  assert.equal(selected, alternate);
  assert.equal(selected.commands.serve, "alternate exact command");
  assert.equal(
    selectConfiguration(
      [current, alternate, unrelated],
      current,
      "hardware",
      configurationValue(unrelated, "hardware"),
    ),
    null,
  );
  assert.equal(
    selectConfiguration([current, alternate], current, "precision", "fp8"),
    null,
  );
});
test("precision intersects hardware filters, and displayed provider names are searchable", () => {
  const x = fixture();
  x.model = {
    id: "fishaudio/drama-3",
    provider: "fishaudio",
    task: "text_to_speech",
  };
  x.runtime.precision = "bf16";
  assert.equal(
    filterRecipes([x], {
      q: "Fish Audio",
      precision: "bf16",
      hardware: x.hardware.model,
    }).length,
    1,
  );
  assert.equal(
    filterRecipes([x], { q: "Fish Audio", precision: "fp16" }).length,
    0,
  );
});
