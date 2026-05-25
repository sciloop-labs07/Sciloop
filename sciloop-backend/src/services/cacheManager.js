import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const DATA_DIR = path.resolve(".data");
const CACHE_FILE = path.join(DATA_DIR, "cache.json");

function hashKey(input = "") {
  return crypto.createHash("sha1").update(String(input)).digest("hex");
}

async function readCache() {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return { entries: {} };
  }
}

async function writeCache(cache) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.warn(`[cache] could not write cache file: ${error.message}`);
  }
}

export function makeCacheKey(namespace, input) {
  return `${namespace}:${hashKey(JSON.stringify(input))}`;
}

export async function getCache(key, { allowStale = false } = {}) {
  const cache = await readCache();
  const entry = cache.entries?.[key];
  if (!entry) return { hit: false, stale: false, value: null };

  const stale = Date.now() > Number(entry.expiresAt || 0);
  if (stale && !allowStale) {
    return { hit: false, stale: true, value: null };
  }

  return { hit: true, stale, value: entry.value };
}

export async function setCache(key, value, ttlSeconds) {
  const cache = await readCache();
  cache.entries ||= {};
  cache.entries[key] = {
    value,
    createdAt: Date.now(),
    expiresAt: Date.now() + Number(ttlSeconds || 0) * 1000
  };
  await writeCache(cache);
}

export async function getCacheState() {
  const cache = await readCache();
  const entries = Object.entries(cache.entries || {});
  return {
    entries: entries.length,
    keys: entries.slice(0, 25).map(([key, entry]) => ({
      key,
      stale: Date.now() > Number(entry.expiresAt || 0),
      createdAt: entry.createdAt,
      expiresAt: entry.expiresAt
    }))
  };
}
