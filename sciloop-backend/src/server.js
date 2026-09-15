import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { getAiProviders, getNewsProviders, publicProviderSummary } from "./config/providers.js";
import { getNews } from "./services/newsRouter.js";
import { biologyVisualPlan, explainArticle, generateStructuredJson, simulateArticle, universalVisualPlan } from "./services/aiRouter.js";
import { getQuotaState } from "./services/quotaManager.js";
import { getCacheState } from "./services/cacheManager.js";
import { handleRealityGenerate } from "../../backend/reality-engine/controllers/realityEngine.controller.js";
import { generateOpenAIUnityVisual } from "../../backend/reality-engine/services/openai-visual.service.js";
import { buildUnitySceneEnvelope, validateUnitySceneEnvelope } from "../../backend/reality-engine/services/unity-scene.service.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5050);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const MAX_ARTICLES_PER_REQUEST = Number(process.env.MAX_ARTICLES_PER_REQUEST || 12);
const MAX_AI_CALLS_PER_REQUEST = Number(process.env.MAX_AI_CALLS_PER_REQUEST || 4);
const VISUAL_LANGUAGE_LAB_URL = process.env.VISUAL_LANGUAGE_LAB_URL || "http://localhost:3000/visual-language-lab";
const NEWS_VISUALIZE_HANDOFF_TTL_MS = Number(process.env.NEWS_VISUALIZE_HANDOFF_TTL_MS || 15 * 60 * 1000);
const newsVisualizeHandoffs = new Map();

function corsOrigin(origin, callback) {
  if (!origin || process.env.NODE_ENV !== "production" || origin === FRONTEND_ORIGIN) {
    return callback(null, true);
  }
  return callback(null, false);
}

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "1mb" }));

app.use((error, _req, res, next) => {
  if (!error) return next();
  console.error("[server] request parse error:", error.message);
  return res.status(400).json({
    ok: false,
    error: "Invalid JSON request body"
  });
});

function activeCount(providers) {
  return providers.filter((provider) => provider.enabled).length;
}

function pruneNewsVisualizeHandoffs() {
  const now = Date.now();
  for (const [handoffId, handoff] of newsVisualizeHandoffs.entries()) {
    if (!handoff?.expiresAt || handoff.expiresAt <= now) {
      newsVisualizeHandoffs.delete(handoffId);
    }
  }
}

function normalizeNewsVisualizeArticle(body = {}) {
  const article = body.article || body.news || body;
  return {
    title: String(article.title || "").trim(),
    summary: String(article.summary || article.description || "").trim(),
    source: String(article.source || "SciLoop News Portal").trim(),
    url: String(article.url || article.link || "").trim(),
    publishedAt: String(article.publishedAt || article.date || "").trim(),
    subject: String(article.subject || article.subjectId || body.subject || "auto").trim()
  };
}

app.get("/", (_req, res) => {
  res.send("SciLoop AI Backend running");
});

app.get("/health", (_req, res) => {
  const newsProviders = getNewsProviders();
  const aiProviders = getAiProviders();
  res.json({
    ok: true,
    service: "SciLoop AI Backend",
    uptime: process.uptime(),
    activeNewsProviders: activeCount(newsProviders),
    activeAIProviders: activeCount(aiProviders)
  });
});

app.get("/api/providers", async (_req, res) => {
  res.json({
    newsProviders: publicProviderSummary(getNewsProviders()),
    aiProviders: publicProviderSummary(getAiProviders()),
    quotaState: await getQuotaState(),
    cacheState: await getCacheState()
  });
});

app.post("/api/reality-engine/generate", handleRealityGenerate);

app.post("/api/reality-engine/openai-visual", async (req, res) => {
  try {
    const result = await generateOpenAIUnityVisual(req.body || {});
    res.json(result);
  } catch (error) {
    console.error("[server] OpenAI Unity visual endpoint failed:", error);
    res.status(500).json({
      ok: false,
      error: "SciLoop could not generate the Unity visual scene.",
      details: error.message
    });
  }
});

app.post("/api/reality-engine/unity-scene", async (req, res) => {
  try {
    const envelope = buildUnitySceneEnvelope(req.body || {});
    const validation = validateUnitySceneEnvelope(envelope);

    if (!validation.ok) {
      return res.status(400).json({
        ok: false,
        error: "Invalid Unity scene envelope.",
        details: validation.errors
      });
    }

    return res.json({
      ok: true,
      providerUsed: "local-unity-scene-envelope",
      fallback: false,
      unityScene: envelope,
      bridge: {
        transport: envelope.transport.mode,
        webglObjectName: envelope.transport.webglObjectName,
        webglMethodName: envelope.transport.webglMethodName
      },
      warnings: envelope.safety.notes
    });
  } catch (error) {
    console.error("[server] Unity scene envelope failed:", error);
    return res.status(500).json({
      ok: false,
      error: "SciLoop could not build the Unity scene envelope.",
      details: error.message
    });
  }
});

app.get("/api/news", async (req, res) => {
  const topic = String(req.query.topic || "science");
  const limit = Math.min(Number(req.query.limit || MAX_ARTICLES_PER_REQUEST), MAX_ARTICLES_PER_REQUEST);
  const result = await getNews({ topic, limit });
  res.json({
    ok: true,
    topic,
    limit,
    count: result.articles.length,
    ...result
  });
});

app.post("/api/sciloop-ai/explain", async (req, res) => {
  const article = req.body?.article || req.body?.news || req.body || {};
  const mode = ["simple", "story", "visual"].includes(req.body?.mode) ? req.body.mode : "simple";

  const result = await explainArticle({ article, mode });
  res.json({
    ok: true,
    ...result
  });
});

app.post("/api/sciloop-ai/simulate", async (req, res) => {
  const article = req.body?.article || req.body?.news || {};
  const explanation = req.body?.explanation || "";

  const result = await simulateArticle({ article, explanation });
  res.json({
    ok: true,
    ...result
  });
});

app.post("/api/sciloop-ai/biology-visual-plan", async (req, res) => {
  const result = await biologyVisualPlan(req.body || {});
  res.json({
    ok: true,
    ...result
  });
});

app.post("/api/sciloop-ai/universal-visual-plan", async (req, res) => {
  const result = await universalVisualPlan(req.body || {});
  res.json({
    ok: true,
    ...result
  });
});

app.post("/api/sciloop-ai/structured-json", async (req, res) => {
  try {
    const result = await generateStructuredJson({
      systemPrompt: req.body?.systemPrompt,
      userPrompt: req.body?.userPrompt,
      preferredProvider: req.body?.preferredProvider || "auto",
    });
    return res.json({ ok: true, ...result });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: error instanceof Error ? error.message : "Structured JSON provider workflow failed.",
    });
  }
});

app.post("/api/sciloop-ai/news-visualize", async (req, res) => {
  try {
    pruneNewsVisualizeHandoffs();
    const article = normalizeNewsVisualizeArticle(req.body || {});

    if (!article.title && !article.summary) {
      return res.status(400).json({
        ok: false,
        error: "Article title or summary is required to create a visual handoff."
      });
    }

    const result = await universalVisualPlan({
      article,
      title: article.title,
      summary: article.summary,
      source: article.source,
      url: article.url,
      publishedAt: article.publishedAt,
      subject: article.subject || "auto",
      sourceType: "live-news",
      mode: req.body?.mode || "hybrid",
      preferredProvider: req.body?.preferredProvider || req.body?.provider || "auto",
      renderMode: req.body?.renderMode || "local-pseudo-3d"
    });

    const handoffId = crypto.randomUUID();
    const handoff = {
      article,
      visualPlan: result.visualPlan,
      providerUsed: result.providerUsed,
      cached: Boolean(result.cached),
      fallback: Boolean(result.fallback),
      warnings: Array.isArray(result.warnings) ? result.warnings : [],
      createdAt: Date.now(),
      expiresAt: Date.now() + NEWS_VISUALIZE_HANDOFF_TTL_MS
    };

    newsVisualizeHandoffs.set(handoffId, handoff);
    const redirectUrl = `${VISUAL_LANGUAGE_LAB_URL}?handoffId=${encodeURIComponent(handoffId)}`;
    console.log(`[server] news visual handoff ${handoffId} created via ${handoff.providerUsed || "unknown"}`);

    return res.json({
      ok: true,
      handoffId,
      visualPlan: handoff.visualPlan,
      providerUsed: handoff.providerUsed,
      cached: handoff.cached,
      fallback: handoff.fallback,
      warnings: handoff.warnings,
      redirectUrl
    });
  } catch (error) {
    console.error("[server] news visual handoff failed:", error);
    return res.status(500).json({
      ok: false,
      error: "SciLoop could not create a visual language handoff.",
      details: error.message
    });
  }
});

app.get("/api/sciloop-ai/news-visualize/:handoffId", (req, res) => {
  pruneNewsVisualizeHandoffs();
  const handoff = newsVisualizeHandoffs.get(req.params.handoffId);

  if (!handoff) {
    return res.status(404).json({
      ok: false,
      error: "Visual handoff not found or expired."
    });
  }

  return res.json({
    ok: true,
    handoffId: req.params.handoffId,
    ...handoff
  });
});

app.get("/api/sciloop-ai/news", async (req, res) => {
  const topic = String(req.query.topic || "science");
  const limit = Math.min(Number(req.query.limit || 8), MAX_ARTICLES_PER_REQUEST);
  const maxAi = Math.min(Number(req.query.aiLimit || MAX_AI_CALLS_PER_REQUEST), MAX_AI_CALLS_PER_REQUEST, limit);
  const newsResult = await getNews({ topic, limit });

  const articles = [];
  for (let index = 0; index < newsResult.articles.length; index += 1) {
    const article = { ...newsResult.articles[index] };
    if (index < maxAi && !article.fallback) {
      const ai = await explainArticle({ article, mode: "simple" });
      article.aiExplanation = ai;
      article.aiExplanationStatus = ai.fallback ? "local-fallback" : (ai.cached ? "cached" : "generated");
    } else {
      article.aiExplanationStatus = "not-requested-limit-protection";
    }
    articles.push(article);
  }

  res.json({
    ok: true,
    topic,
    limit,
    aiLimit: maxAi,
    count: articles.length,
    articles,
    cached: newsResult.cached,
    stale: newsResult.stale,
    fallback: newsResult.fallback,
    providersUsed: newsResult.providersUsed,
    warnings: newsResult.warnings
  });
});

// Compatibility route for older SciLoop HTML builds.
app.post("/explain-news", async (req, res) => {
  const article = req.body?.news || req.body?.article || req.body || {};
  const result = await explainArticle({ article, mode: "simple" });
  res.json({
    explanation: result.explanation,
    providerUsed: result.providerUsed,
    cached: result.cached,
    fallback: result.fallback
  });
});

app.use((_req, res) => {
  res.status(404).json({
    ok: false,
    error: "Endpoint not found"
  });
});

process.on("unhandledRejection", (error) => {
  console.error("[server] unhandled rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("[server] uncaught exception:", error);
});

app.listen(PORT, () => {
  console.log(`SciLoop AI Backend running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Providers: http://localhost:${PORT}/api/providers`);
});
