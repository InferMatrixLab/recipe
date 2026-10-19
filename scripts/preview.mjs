// Serve only the completed static export, including nested routes and a real 404.
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { ROOT } from "./catalog-core.mjs";
const out = path.join(ROOT, "out"),
  base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};
const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (base && urlPath !== base && !urlPath.startsWith(`${base}/`))
      throw new Error("not found");
    const relative = urlPath.slice(base.length).replace(/^\/+/, "");
    let file = path.resolve(out, relative);
    if (file !== out && !file.startsWith(`${out}${path.sep}`))
      throw new Error("not found");
    if ((await fs.stat(file)).isDirectory())
      file = path.join(file, "index.html");
    const data = await fs.readFile(file);
    res.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      await fs.readFile(path.join(out, "404.html")).catch(() => "Not found"),
    );
  }
});
server.listen(Number(process.env.PORT || 4173), "127.0.0.1", () =>
  console.log(
    `Static preview: http://localhost:${server.address().port}${base}/`,
  ),
);
