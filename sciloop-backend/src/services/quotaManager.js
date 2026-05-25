import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.resolve(".data");
const USAGE_FILE = path.join(DATA_DIR, "provider-usage.json");

function nowParts() {
  const now = new Date();
  return {
    nowMs: now.getTime(),
    minute: now.toISOString().slice(0, 16),
    day: now.toISOString().slice(0, 10),
    month: now.toISOString().slice(0, 7)
  };
}

async function readUsage() {
  try {
    const raw = await fs.readFile(USAGE_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return { providers: {} };
  }
}

async function writeUsage(state) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(USAGE_FILE, JSON.stringify(state, null, 2));
  } catch (error) {
    console.warn(`[quota] could not write usage file: ${error.message}`);
  }
}

function providerBucket(state, providerId) {
  state.providers ||= {};
  state.providers[providerId] ||= {
    minute: { key: "", count: 0 },
    day: { key: "", count: 0 },
    month: { key: "", count: 0 },
    cooldownUntil: 0,
    exhaustedUntil: 0,
    lastError: ""
  };
  return state.providers[providerId];
}

function resetIfNeeded(bucket, parts) {
  if (bucket.minute.key !== parts.minute) bucket.minute = { key: parts.minute, count: 0 };
  if (bucket.day.key !== parts.day) bucket.day = { key: parts.day, count: 0 };
  if (bucket.month.key !== parts.month) bucket.month = { key: parts.month, count: 0 };
}

export async function isProviderAllowed(provider) {
  const state = await readUsage();
  const parts = nowParts();
  const bucket = providerBucket(state, provider.id);
  resetIfNeeded(bucket, parts);
  await writeUsage(state);

  if (bucket.exhaustedUntil && bucket.exhaustedUntil > parts.nowMs) {
    return { allowed: false, reason: "provider quota exhausted", bucket };
  }

  if (bucket.cooldownUntil && bucket.cooldownUntil > parts.nowMs) {
    return { allowed: false, reason: "provider cooling down", bucket };
  }

  if (provider.rpmLimit && bucket.minute.count >= provider.rpmLimit) {
    return { allowed: false, reason: "per-minute limit reached", bucket };
  }

  if (provider.dailyLimit && bucket.day.count >= provider.dailyLimit) {
    return { allowed: false, reason: "daily limit reached", bucket };
  }

  if (provider.monthlyLimit && bucket.month.count >= provider.monthlyLimit) {
    return { allowed: false, reason: "monthly limit reached", bucket };
  }

  return { allowed: true, reason: "allowed", bucket };
}

export async function recordSuccess(provider) {
  const state = await readUsage();
  const parts = nowParts();
  const bucket = providerBucket(state, provider.id);
  resetIfNeeded(bucket, parts);
  bucket.minute.count += 1;
  bucket.day.count += 1;
  bucket.month.count += 1;
  bucket.lastError = "";
  await writeUsage(state);
}

export async function recordFailure(provider, result = {}) {
  const state = await readUsage();
  const parts = nowParts();
  const bucket = providerBucket(state, provider.id);
  resetIfNeeded(bucket, parts);
  bucket.lastError = result.reason || result.error || "Provider failed";

  if (result.quotaError || [402, 403, 429].includes(result.status)) {
    const cooldownMs = Number(provider.cooldownMs || 15 * 60 * 1000);
    bucket.cooldownUntil = parts.nowMs + cooldownMs;
    if ([402, 403].includes(result.status) || /quota|billing|payment|exceeded/i.test(bucket.lastError)) {
      bucket.exhaustedUntil = parts.nowMs + cooldownMs;
    }
  }

  await writeUsage(state);
}

export async function getQuotaState() {
  const state = await readUsage();
  return state.providers || {};
}
