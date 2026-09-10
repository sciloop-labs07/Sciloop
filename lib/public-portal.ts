import { readFile } from "node:fs/promises";
import path from "node:path";

const PORTAL_FILE = path.join(process.cwd(), "public", "portal", "index.html");

function normalizeBase(pathname: string) {
  const base = pathname === "/" ? "/sciloop-live/" : `${pathname.replace(/\/+$/, "")}/`;
  return base.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

export async function getPublicPortalHtml(pathname = "/sciloop-live", requestUrl?: string) {
  const source = await readPortalSource(requestUrl);
  const base = normalizeBase(pathname);

  return source
    .replaceAll("__SCILOOP_PORTAL_BASE__", base)
    .replace(
      /<body\b([^>]*)>/i,
      '<body data-sciloop-surface="public-portal"$1><script>window.SCILOOP_PUBLIC_PORTAL = true;</script>',
    );
}

async function readPortalSource(requestUrl?: string) {
  // Read the preserved public asset through Vercel's static asset path so a
  // large legacy file is available even when the function tracer omits it.
  try {
    const response = await fetch(new URL("/portal/index.html", requestUrl ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost")), {
      cache: "no-store",
    });
    if (response.ok) return response.text();
  } catch {
    // Local development falls back to the repository filesystem below.
  }

  return readFile(PORTAL_FILE, "utf8");
}
