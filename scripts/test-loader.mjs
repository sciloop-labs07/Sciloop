import { access, stat } from "node:fs/promises";
import { dirname, extname, resolve as pathResolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = pathResolve(dirname(fileURLToPath(import.meta.url)), "..");

async function firstExisting(paths) {
  for (const path of paths) {
    try { await access(path); if ((await stat(path)).isFile()) return path; } catch { /* continue */ }
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const path = await firstExisting([pathResolve(root, specifier.slice(2)), pathResolve(root, `${specifier.slice(2)}.ts`), pathResolve(root, `${specifier.slice(2)}.tsx`), pathResolve(root, specifier.slice(2), "index.ts")]);
    if (path) return { url: pathToFileURL(path).href, shortCircuit: true };
  }
  if (specifier.startsWith(".") && context.parentURL) {
    const base = pathResolve(dirname(fileURLToPath(context.parentURL)), specifier);
    if (!/\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(base)) {
      const path = await firstExisting([`${base}.ts`, `${base}.tsx`, `${base}.js`, pathResolve(base, "index.ts")]);
      if (path) return { url: pathToFileURL(path).href, shortCircuit: true };
    }
  }
  return nextResolve(specifier, context);
}
