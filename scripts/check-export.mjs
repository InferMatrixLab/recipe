import fs from "node:fs/promises";
import path from "node:path";
import { ROOT } from "./catalog-core.mjs";

const out = path.join(ROOT, "out");
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
async function filesIn(folder) {
  const found = [];
  for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) found.push(...await filesIn(file));
    else if (entry.name.endsWith(".html")) found.push(file);
  }
  return found;
}
let references = 0;
for (const file of await filesIn(out)) {
  const html = await fs.readFile(file, "utf8");
  const relative = path.relative(out, file).split(path.sep).join("/");
  const route = `${base}/${relative.replace(/index\.html$/, "")}`;
  for (const [, raw] of html.matchAll(/(?:href|src)="([^\"]+)"/g)) {
    if (/^(?:https?:|data:|mailto:)/.test(raw)) continue;
    const url = new URL(raw.replaceAll("&amp;", "&"), `http://localhost${route}`);
    if (base && url.pathname !== base && !url.pathname.startsWith(`${base}/`)) throw new Error(`${relative}: missing base path in ${raw}`);
    const target = path.resolve(out, decodeURIComponent(url.pathname.slice(base.length)).replace(/^\/+/, ""));
    if (target !== out && !target.startsWith(`${out}${path.sep}`)) throw new Error(`${relative}: escaped export in ${raw}`);
    const stat = await fs.stat(target).catch(() => null);
    const resolved = stat?.isDirectory() ? path.join(target, "index.html") : target;
    if (!stat || !(await fs.stat(resolved).catch(() => null))?.isFile()) throw new Error(`${relative}: missing target ${raw}`);
    if (url.hash && resolved.endsWith(".html")) {
      const id = decodeURIComponent(url.hash.slice(1));
      const content = resolved === file ? html : await fs.readFile(resolved, "utf8");
      if (!content.includes(`id="${id}"`)) throw new Error(`${relative}: missing anchor ${raw}`);
    }
    references++;
  }
}
await fs.access(path.join(out, ".nojekyll"));
await fs.access(path.join(out, "404.html"));
console.log(`Static export checked: ${references} internal page/resource/anchor references; 404 + .nojekyll present (${base || "/"})`);
