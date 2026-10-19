import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { parseDocument } from "yaml";

export const ROOT = fileURLToPath(new URL("../", import.meta.url));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const recipeSchema = JSON.parse(
  await fs.readFile(new URL("../schemas/recipe.schema.json", import.meta.url)),
);
const sourcesSchema = JSON.parse(
  await fs.readFile(new URL("../schemas/sources.schema.json", import.meta.url)),
);
const recipeValidator = ajv.compile(recipeSchema);
const sourceValidator = ajv.compile(sourcesSchema);
export const digest = (text) => createHash("sha256").update(text).digest("hex");
function checked(validate, value, file) {
  if (!validate(value))
    throw new Error(
      `${file}: ${validate.errors.map((e) => `${e.instancePath || "/"}/${e.params.missingProperty || e.params.additionalProperty || ""} ${e.message}`).join("; ")}`,
    );
}
function rejectPlaceholders(value, file, field = "") {
  if (typeof value === "string" && /<[^>\n]+>|\bTODO\b|\bTBD\b/i.test(value))
    throw new Error(`${file}: ${field} contains a placeholder`);
  if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value))
      rejectPlaceholders(v, file, `${field}/${k}`);
}
export function parseYaml(text, file) {
  const doc = parseDocument(text, { uniqueKeys: true, maxAliasCount: 0 });
  if (doc.errors.length)
    throw new Error(`${file}: invalid YAML: ${doc.errors[0].message}`);
  try {
    return doc.toJS({ maxAliasCount: 0 });
  } catch (e) {
    throw new Error(`${file}: ${e.message}`);
  }
}
export function validateRecipe(value, file) {
  checked(recipeValidator, value, file);
  rejectPlaceholders(value, file);
  for (const [field, link] of [
    ["deployment/evidence_url", value.deployment.evidence_url],
    ["acceptance/issue_url", value.acceptance.issue_url],
    ["acceptance/evidence_url", value.acceptance.evidence_url],
  ])
    if (link !== null) {
      try {
        const url = new URL(link);
        if (
          url.protocol !== "https:" ||
          !url.hostname ||
          url.username ||
          url.password
        )
          throw new Error("invalid HTTPS URL");
      } catch {
        throw new Error(
          `${file}: /${field} must be a valid HTTPS URL with a hostname`,
        );
      }
    }
  return value;
}
export function validateSources(value, file = "sources.yaml") {
  checked(sourceValidator, value, file);
  rejectPlaceholders(value, file);
  const ids = new Set(),
    paths = new Set();
  for (const source of value.sources) {
    if (ids.has(source.id))
      throw new Error(`${file}: duplicate source id ${source.id}`);
    ids.add(source.id);
    for (const p of source.paths) {
      const key = `${source.repository.toLowerCase()}/${p}`;
      if (paths.has(key))
        throw new Error(`${file}: duplicate source path ${key}`);
      paths.add(key);
    }
  }
  return value;
}
export function makeCatalog(records) {
  const recipes = [],
    ids = new Set();
  for (const { recipe, source, file } of records) {
    validateRecipe(recipe, file);
    if (ids.has(recipe.id))
      throw new Error(`${file}: duplicate recipe id ${recipe.id}`);
    ids.add(recipe.id);
    const modelSlug = `${recipe.model.id.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${digest(recipe.model.id).slice(0, 8)}`;
    const encodedPath = source.path
      .split("/")
      .map(encodeURIComponent)
      .join("/");
    recipes.push({
      ...recipe,
      modelSlug,
      source: {
        ...source,
        url: `${source.repository}/blob/${source.commit}/${encodedPath}`,
        editUrl: `${source.repository}/edit/${source.ref}/${encodedPath}`,
      },
    });
  }
  recipes.sort((a, b) => a.id.localeCompare(b.id, "en"));
  const models = [...new Set(recipes.map((r) => r.model.id))]
    .sort()
    .map((id) => {
      const related = recipes.filter((r) => r.model.id === id);
      return {
        ...related[0].model,
        slug: related[0].modelSlug,
        recipeIds: related.map((r) => r.id),
        engineIds: [...new Set(related.map((r) => r.engine.id))].sort(),
      };
    });
  const engines = [...new Set(recipes.map((r) => r.engine.id))]
    .sort()
    .map((id) => ({
      id,
      name: recipes.find((r) => r.engine.id === id).engine.name,
      recipeIds: recipes.filter((r) => r.engine.id === id).map((r) => r.id),
    }));
  return { schema_version: 1, recipes, models, engines };
}
export async function localRecords(root, commit = "main") {
  const folder = path.join(root, "recipes");
  const entries = await fs
    .readdir(folder, { withFileTypes: true })
    .catch((e) => {
      if (e.code === "ENOENT") return [];
      throw e;
    });
  const records = [];
  for (const entry of entries)
    if (/\.ya?ml$/.test(entry.name)) {
      if (!entry.isFile())
        throw new Error(`recipes/${entry.name}: expected a regular YAML file`);
      const file = `recipes/${entry.name}`;
      records.push({
        recipe: parseYaml(
          await fs.readFile(path.join(root, file), "utf8"),
          file,
        ),
        file,
        source: {
          repository: "https://github.com/InferMatrixLab/recipe",
          path: file,
          commit,
          ref: "main",
        },
      });
    }
  return records;
}
export function lockedRecords(manifest, lock) {
  if (lock?.schema_version !== 1 || !Array.isArray(lock.sources))
    throw new Error("sources.lock.json: invalid lock version/shape");
  if (lock.sources.length !== manifest.sources.length)
    throw new Error(
      "sources.lock.json: source list changed; run pnpm sync:sources",
    );
  const records = [],
    ids = new Set();
  for (const source of manifest.sources) {
    const item = lock.sources.find((x) => x.id === source.id);
    if (
      !item ||
      ids.has(item.id) ||
      item.repository !== source.repository ||
      item.ref !== source.ref ||
      !/^[a-f0-9]{40}$/.test(item.commit) ||
      !Array.isArray(item.files) ||
      item.files.length !== source.paths.length
    )
      throw new Error(
        `sources.lock.json: ${source.id} stale or invalid; run pnpm sync:sources`,
      );
    ids.add(item.id);
    for (const p of source.paths) {
      const cached = item.files.find((x) => x.path === p);
      const file = `${source.id}:${p}`;
      if (
        !cached ||
        typeof cached.content !== "string" ||
        cached.sha256 !== digest(cached.content)
      )
        throw new Error(`sources.lock.json: ${file} missing or corrupt cache`);
      const recipe = validateRecipe(parseYaml(cached.content, file), file);
      if (recipe.engine.repository !== source.repository)
        throw new Error(
          `${file}: engine/repository does not match content owner ${source.repository}`,
        );
      records.push({
        recipe,
        file,
        source: {
          repository: source.repository,
          path: p,
          commit: item.commit,
          ref: source.ref,
        },
      });
    }
  }
  return records;
}
export async function readManifest(root) {
  return validateSources(
    parseYaml(
      await fs.readFile(path.join(root, "sources.yaml"), "utf8"),
      "sources.yaml",
    ),
  );
}
export async function readCatalog(root = ROOT, commit = "main") {
  const manifest = await readManifest(root);
  const lock = JSON.parse(
    await fs.readFile(path.join(root, "sources.lock.json"), "utf8"),
  );
  return makeCatalog([
    ...(await localRecords(root, commit)),
    ...lockedRecords(manifest, lock),
  ]);
}
