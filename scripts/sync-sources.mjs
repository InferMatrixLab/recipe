import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import {
  ROOT,
  digest,
  readManifest,
  localRecords,
  lockedRecords,
  makeCatalog,
} from "./catalog-core.mjs";

function githubToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execFileSync("gh", ["auth", "token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      windowsHide: true,
    }).trim();
  } catch {
    return "";
  }
}
export function githubReader(token = githubToken()) {
  async function request(route) {
    const response = await fetch(`https://api.github.com${route}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`GitHub ${response.status} at ${route}`);
    if (Number(response.headers.get("content-length")) > 2_000_000)
      throw new Error(`Oversize GitHub response at ${route}`);
    // Bound reads even when the upstream does not send a Content-Length header.
    const reader = response.body.getReader();
    const chunks = [];
    let length = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.length;
        if (length > 2_000_000)
          throw new Error(`Oversize GitHub response at ${route}`);
        chunks.push(Buffer.from(value));
      }
    } finally {
      await reader.cancel();
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  }
  return async (source) => {
    const repo = source.repository.slice("https://github.com/".length);
    const resolved = await request(
      `/repos/${repo}/commits/${encodeURIComponent(source.ref)}`,
    );
    if (!/^[a-f0-9]{40}$/.test(resolved.sha))
      throw new Error("GitHub returned invalid commit");
    const files = [];
    for (const p of source.paths) {
      const encodedPath = p.split("/").map(encodeURIComponent).join("/");
      const item = await request(
        `/repos/${repo}/contents/${encodedPath}?ref=${resolved.sha}`,
      );
      if (
        item.type !== "file" ||
        item.path !== p ||
        item.encoding !== "base64" ||
        item.size > 1_000_000
      )
        throw new Error(`${p}: expected a YAML file under 1 MB`);
      const content = Buffer.from(item.content, "base64").toString("utf8");
      files.push({ path: p, sha256: digest(content), content });
    }
    return { ...source, commit: resolved.sha, files };
  };
}
export async function atomicSnapshot(
  file,
  snapshot,
  beforeRename = async () => {},
) {
  const temp = `${file}.${process.pid}.${crypto.randomUUID()}.tmp`;
  try {
    await fs.writeFile(temp, JSON.stringify(snapshot, null, 2) + "\n", {
      flag: "wx",
    });
    await beforeRename();
    await fs.rename(temp, file);
  } finally {
    await fs.rm(temp, { force: true });
  }
}
export async function syncSources({
  root = ROOT,
  readSource = githubReader(),
  writeSnapshot = atomicSnapshot,
} = {}) {
  const manifest = await readManifest(root);
  const snapshot = { schema_version: 1, sources: [] };
  for (const source of manifest.sources) {
    try {
      snapshot.sources.push(await readSource(source));
    } catch (e) {
      throw new Error(`${source.id}: ${e.message}`, { cause: e });
    }
  }
  // Validate the complete candidate, including collisions with locally owned recipes,
  // before replacing the single file that owns both lock metadata and YAML cache.
  makeCatalog([
    ...(await localRecords(root)),
    ...lockedRecords(manifest, snapshot),
  ]);
  await writeSnapshot(path.join(root, "sources.lock.json"), snapshot);
  return snapshot;
}
if (
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url
) {
  try {
    const result = await syncSources();
    console.log(
      `Synced ${result.sources.length} sources; lock and content cache replaced atomically`,
    );
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
