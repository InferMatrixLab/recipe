import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { stringify } from "yaml";
import { fixture, source, commit } from "./fixtures.mjs";
import {
  digest,
  validateSources,
  readCatalog,
} from "../scripts/catalog-core.mjs";
import { syncSources, atomicSnapshot } from "../scripts/sync-sources.mjs";

async function setup(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "recipe-test-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const declared = source();
  await fs.writeFile(
    path.join(root, "sources.yaml"),
    stringify({ schema_version: 1, sources: [declared] }),
  );
  const content = stringify(fixture());
  const readSource = async (s) => ({
    ...s,
    commit,
    files: [{ path: s.paths[0], content, sha256: digest(content) }],
  });
  await syncSources({ root, readSource });
  return { root, readSource };
}
test("source sync and subsequent rebuild work offline", async (t) => {
  const { root } = await setup(t);
  const a = await readCatalog(root),
    b = await readCatalog(root);
  assert.deepEqual(a, b);
  assert.equal(a.recipes[0].source.commit, commit);
  assert.match(a.recipes[0].source.url, /blob\/a{40}\/recipes\/fixture.yaml/);
});
for (const invalid of [
  "../secret.yaml",
  "/secret.yaml",
  "recipes/../../x.yaml",
  "recipes\\x.yaml",
  "https://evil.test/x.yaml",
  "recipes/%2e%2e/x.yaml",
  "recipes/./x.yaml",
])
  test(`reject path ${invalid}`, () => {
    const s = source();
    s.paths = [invalid];
    assert.throws(
      () => validateSources({ schema_version: 1, sources: [s] }),
      /sources.yaml/,
    );
  });
test("duplicate source IDs, duplicate owner paths and embedded credentials fail", () => {
  const a = source(),
    b = { ...source(), id: "other" };
  assert.throws(
    () => validateSources({ schema_version: 1, sources: [a, a] }),
    /duplicate source id/,
  );
  assert.throws(
    () => validateSources({ schema_version: 1, sources: [a, b] }),
    /duplicate source path/,
  );
  assert.throws(
    () =>
      validateSources({
        schema_version: 1,
        sources: [{ ...a, token: "secret" }],
      }),
    /token/,
  );
});
for (const failure of [
  "remote missing",
  "invalid YAML",
  "wrong owner",
  "duplicate recipe",
  "interrupted write",
])
  test(`${failure} preserves last successful snapshot`, async (t) => {
    const { root, readSource } = await setup(t);
    const file = path.join(root, "sources.lock.json"),
      before = await fs.readFile(file, "utf8");
    let reader = readSource,
      writer = atomicSnapshot;
    if (failure === "remote missing")
      reader = async () => {
        throw new Error("404 missing source");
      };
    if (failure === "invalid YAML" || failure === "wrong owner")
      reader = async (s) => {
        const x = await readSource(s);
        const content =
          failure === "invalid YAML"
            ? "model: [broken"
            : stringify({
                ...fixture(),
                engine: {
                  ...fixture().engine,
                  repository: "https://github.com/other/owner",
                },
              });
        x.files[0] = { ...x.files[0], content, sha256: digest(content) };
        return x;
      };
    if (failure === "duplicate recipe") {
      await fs.mkdir(path.join(root, "recipes"));
      await fs.writeFile(
        path.join(root, "recipes/local.yaml"),
        stringify(fixture()),
      );
    }
    if (failure === "interrupted write")
      writer = (p, s) =>
        atomicSnapshot(p, s, async () => {
          throw new Error("interrupted before rename");
        });
    await assert.rejects(
      syncSources({ root, readSource: reader, writeSnapshot: writer }),
    );
    assert.equal(await fs.readFile(file, "utf8"), before);
    assert.equal(
      (await fs.readdir(root)).filter((x) => x.endsWith(".tmp")).length,
      0,
    );
  });
test("manifest edits and cache tampering prevent stale offline builds", async (t) => {
  const { root } = await setup(t);
  const file = path.join(root, "sources.lock.json"),
    lock = JSON.parse(await fs.readFile(file, "utf8"));
  lock.sources[0].files[0].content += "# tampered";
  await fs.writeFile(file, JSON.stringify(lock));
  await assert.rejects(readCatalog(root), /corrupt cache/);
  await fs.writeFile(
    path.join(root, "sources.yaml"),
    stringify({ schema_version: 1, sources: [] }),
  );
  await assert.rejects(readCatalog(root), /source list changed/);
});
