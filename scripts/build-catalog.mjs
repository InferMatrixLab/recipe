import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { readCatalog, ROOT } from "./catalog-core.mjs";
try {
  const commit = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
  const catalog = await readCatalog(ROOT, commit);
  await fs.mkdir(path.join(ROOT, "generated"), { recursive: true });
  await fs.writeFile(
    path.join(ROOT, "generated/catalog.json"),
    JSON.stringify(catalog, null, 2) + "\n",
  );
  console.log(
    `Validated ${catalog.recipes.length} recipes / ${catalog.models.length} models / ${catalog.engines.length} engines (offline)`,
  );
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
