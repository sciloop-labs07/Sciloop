import { getNewsProviders } from "../config/providers.js";
import { safeFetch } from "../utils/safeFetch.js";
import { dedupeArticles, demoScienceNews } from "../utils/normalizeNews.js";
import { getCache, makeCacheKey, setCache } from "./cacheManager.js";
import { isProviderAllowed, recordFailure, recordSuccess } from "./quotaManager.js";

const NEWS_CACHE_TTL_SECONDS = Number(process.env.NEWS_CACHE_TTL_SECONDS || 900);
const MAX_ARTICLES_PER_REQUEST = Number(process.env.MAX_ARTICLES_PER_REQUEST || 12);

function sortByDateDesc(articles = []) {
  return [...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getNews({ topic = "science", limit = MAX_ARTICLES_PER_REQUEST } = {}) {
  const safeTopic = String(topic || "science").slice(0, 80);
  const safeLimit = Math.max(1, Math.min(Number(limit) || MAX_ARTICLES_PER_REQUEST, MAX_ARTICLES_PER_REQUEST));
  const cacheKey = makeCacheKey("news", { topic: safeTopic, limit: safeLimit });
  const freshCache = await getCache(cacheKey);

  if (freshCache.hit) {
    return {
      articles: freshCache.value.articles,
      cached: true,
      stale: false,
      fallback: false,
      providersUsed: freshCache.value.providersUsed || [],
      warnings: []
    };
  }

  const staleCache = await getCache(cacheKey, { allowStale: true });
  const providers = getNewsProviders().filter((provider) => provider.enabled);
  const articles = [];
  const warnings = [];
  const providersUsed = [];

  for (const provider of providers) {
    if (articles.length >= safeLimit) break;

    const quota = await isProviderAllowed(provider);
    if (!quota.allowed) {
      warnings.push(`${provider.name} skipped: ${quota.reason}`);
      continue;
    }

    const request = provider.buildRequest(safeTopic, safeLimit);
    const result = await safeFetch(provider.id, request.url, request.options, { retries: 1 });

    if (!result.ok) {
      await recordFailure(provider, result);
      warnings.push(`${provider.name} failed: ${result.reason || result.status}`);
      continue;
    }

    try {
      const parsed = provider.parseResponse(result.data, safeTopic, result.text) || [];
      articles.push(...parsed);
      providersUsed.push(provider.id);
      await recordSuccess(provider);
      console.log(`[newsRouter] ${provider.id} returned ${parsed.length} articles`);
    } catch (error) {
      await recordFailure(provider, { reason: error.message });
      warnings.push(`${provider.name} returned bad data`);
    }
  }

  const merged = sortByDateDesc(dedupeArticles(articles)).slice(0, safeLimit);

  if (merged.length) {
    const value = { articles: merged, providersUsed };
    await setCache(cacheKey, value, NEWS_CACHE_TTL_SECONDS);
    return {
      articles: merged,
      cached: false,
      stale: false,
      fallback: false,
      providersUsed,
      warnings
    };
  }

  if (staleCache.hit) {
    return {
      articles: staleCache.value.articles,
      cached: true,
      stale: true,
      fallback: false,
      providersUsed: staleCache.value.providersUsed || [],
      warnings: ["Live providers failed. Returning stale cached news.", ...warnings]
    };
  }

  return {
    articles: demoScienceNews(safeTopic),
    cached: false,
    stale: false,
    fallback: true,
    providersUsed: ["local-fallback"],
    warnings: ["All live news providers failed or were unavailable.", ...warnings]
  };
}
