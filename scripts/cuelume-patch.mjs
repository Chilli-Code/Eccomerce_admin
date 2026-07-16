import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(__dirname, "..", "node_modules", "cuelume", "package.json");

try {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  if (pkg.exports["./dist/sounds/recipes.js"]) {
    process.exit(0);
  }
  pkg.exports["./dist/sounds/recipes.js"] = { import: "./dist/sounds/recipes.js" };
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("🔊 cuelume: exports parcheado para volumen boost");
} catch {
  // cuelume no instalado, ignorar
}
