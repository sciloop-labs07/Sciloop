import crypto from "node:crypto";

function cleanText(value = "") {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hashId(input = "") {
  return crypto.createHash("sha1").update(String(input)).digest("hex").slice(0, 16);
}

function normalizeDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export function normalizeNews(raw = {}, provider = {}, topic = "science") {
  const title = cleanText(raw.title || raw.webTitle || raw.headline?.main || raw.name || raw.display_name);
  const url = raw.url || raw.webUrl || raw.link || raw.uri || raw.id || raw.web_url || raw.imageUrl || "";
  const summary = cleanText(
    raw.summary ||
    raw.description ||
    raw.abstract ||
    raw.snippet ||
    raw.fields?.trailText ||
    raw.excerpt ||
    raw.subtype ||
    raw.title ||
    ""
  );
  const source = cleanText(
    raw.source?.name ||
    raw.source ||
    raw.sectionName ||
    raw.news_desk ||
    raw.venue ||
    provider.name ||
    "Unknown source"
  );
  const publishedAt = normalizeDate(
    raw.publishedAt ||
    raw.published_at ||
    raw.webPublicationDate ||
    raw.pub_date ||
    raw.publicationDate ||
    raw.created_date ||
    raw.date ||
    raw.updated ||
    raw.deposited?.["date-time"]
  );
  const imageUrl =
    raw.image ||
    raw.imageUrl ||
    raw.urlToImage ||
    raw.fields?.thumbnail ||
    raw.multimedia?.[0]?.url ||
    raw.links?.[0]?.href ||
    "";

  return {
    id: hashId(url || title || JSON.stringify(raw).slice(0, 500)),
    title: title || "Untitled science update",
    summary: summary || "Summary not available from this source.",
    url,
    source,
    publishedAt,
    topic,
    imageUrl,
    rawProvider: provider.id || "unknown",
    confidenceScore: url ? 0.82 : 0.58
  };
}

export function dedupeArticles(articles = []) {
  const seen = new Set();
  const output = [];

  for (const article of articles) {
    const key = (article.url || article.title || "").toLowerCase().replace(/\W+/g, "");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(article);
  }

  return output;
}

export function demoScienceNews(topic = "science") {
  return [
    {
      id: "sciloop-demo-no-provider",
      title: "SciLoop demo: No live provider available",
      summary: "Add legal free-tier API keys to .env to enable live science news.",
      url: "",
      source: "SciLoop Local Fallback",
      publishedAt: new Date().toISOString(),
      topic,
      imageUrl: "",
      rawProvider: "local-fallback",
      confidenceScore: 0.35,
      fallback: true
    }
  ];
}
