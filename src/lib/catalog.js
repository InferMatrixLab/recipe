import fs from "node:fs";
import path from "node:path";
export function getCatalog() {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "generated/catalog.json"), "utf8"),
  );
}
