const REQUIRED_STORYLINE_KEYS = [
  "problem",
  "oldLimit",
  "breakthrough",
  "howItWorks",
  "impact"
];

const SYSTEM_PROMPT =
  "You are Sciloop’s scientific news explainer. Convert raw science or innovation news into simple English, emojis, timeline, invention storyline, impact, and visual-ready explanation. Avoid fake claims. Separate facts, inferences, and speculation. If people, labs, or exact years are unknown, write ‘not clearly stated in source’ instead of inventing. Return ONLY valid JSON matching the required schema.";

function asText(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asArray(value) {
  return Array.isArray(value) ? value.filter((item) => item !== null && item !== undefined).map(String) : [];
}

function clampScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 55;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function detectField(news = {}) {
  const text = `${news.title || ""} ${news.summary || ""}`.toLowerCase();
  if (/(battery|chip|semiconductor|robot|software|ai|computer|device|solar|quantum)/.test(text)) return "Technology";
  if (/(cell|gene|dna|protein|brain|cancer|medicine|vaccine|health|disease)/.test(text)) return "Biology / Medicine";
  if (/(climate|earthquake|ocean|weather|carbon|volcano|environment)/.test(text)) return "Earth / Environment";
  if (/(space|planet|star|galaxy|telescope|rocket|moon|mars)/.test(text)) return "Space Science";
  if (/(material|chemical|molecule|reaction|catalyst)/.test(text)) return "Chemistry / Materials";
  return "Science / Innovation";
}

function visualSymbolsForField(field = "") {
  const lower = field.toLowerCase();
  if (lower.includes("medicine") || lower.includes("biology")) return ["🧬", "🔬", "🩺", "🌍"];
  if (lower.includes("space")) return ["🚀", "🛰️", "🌌", "🔭"];
  if (lower.includes("earth") || lower.includes("environment")) return ["🌍", "🌦️", "🌊", "⚠️"];
  if (lower.includes("chemistry") || lower.includes("materials")) return ["⚗️", "🔬", "🧱", "⚡"];
  if (lower.includes("technology")) return ["⚡", "🤖", "💡", "🌍"];
  return ["🔬", "⚡", "🌍"];
}

export function createRuleBasedFallback(news = {}) {
  const title = asText(news.title, "This science update");
  const summary = asText(news.summary, "The source summary was not provided.");
  const field = detectField(news);
  const year = news.publishedAt ? String(new Date(news.publishedAt).getFullYear()) : "not clearly stated in source";
  const usableYear = year === "NaN" ? "not clearly stated in source" : year;

  return {
    simpleExplanation: `🧠 ${title} means researchers are reporting a new science or innovation update. In simple words: ${summary}`,
    storyline: {
      problem: "The source points to a scientific or technology problem that researchers are trying to understand or improve.",
      oldLimit: "The earlier limitation is not fully clear from the news card, so SciLoop marks it as not clearly stated in source.",
      breakthrough: "The reported breakthrough is the main discovery or improvement described in the title and summary.",
      howItWorks: "SciLoop can explain the idea at a high level, but exact technical steps need the original source or research paper.",
      impact: "The update may help students understand how research moves from problem to idea to real-world impact."
    },
    timeline: [
      { year: "earlier", event: "Scientists worked on the broad problem area." },
      { year: usableYear, event: "This news item reported the current update." },
      { year: "future", event: "More testing, peer review, or real-world use may come next." }
    ],
    peopleOrLabs: "not clearly stated in source",
    field,
    impactScore: 55,
    visualSymbols: visualSymbolsForField(field),
    factInferenceSpeculation: {
      facts: [
        `Title from source: ${title}`,
        news.source ? `Source label: ${news.source}` : "Source label not clearly stated"
      ],
      inferences: [
        `Likely field: ${field}`,
        "The problem and impact are summarized from the title and summary."
      ],
      speculation: [
        "Future uses need verification from the original research or official source."
      ]
    },
    oneLineForStudent: `✨ ${title} is a news example of how science turns a problem into a possible solution.`,
    teacherDemoSpeech: "This module takes a live news card, separates facts from guesses, and turns it into a simple student-friendly explanation."
  };
}

function normalizeTimeline(value, fallbackTimeline) {
  const timeline = Array.isArray(value) ? value : fallbackTimeline;
  return timeline.slice(0, 6).map((entry) => ({
    year: asText(entry?.year, "not clearly stated in source"),
    event: asText(entry?.event, "not clearly stated in source")
  }));
}

function ensureExplanationShape(parsed, news = {}) {
  const candidate = parsed?.data && typeof parsed.data === "object" ? parsed.data : parsed;
  const fallback = createRuleBasedFallback(news);
  const data = candidate && typeof candidate === "object" ? candidate : {};
  const storyline = data.storyline && typeof data.storyline === "object" ? data.storyline : {};
  const factGroups = data.factInferenceSpeculation && typeof data.factInferenceSpeculation === "object"
    ? data.factInferenceSpeculation
    : {};

  return {
    simpleExplanation: asText(data.simpleExplanation, fallback.simpleExplanation),
    storyline: REQUIRED_STORYLINE_KEYS.reduce((result, key) => {
      result[key] = asText(storyline[key], fallback.storyline[key]);
      return result;
    }, {}),
    timeline: normalizeTimeline(data.timeline, fallback.timeline),
    peopleOrLabs: asText(data.peopleOrLabs, fallback.peopleOrLabs),
    field: asText(data.field, fallback.field),
    impactScore: clampScore(data.impactScore ?? fallback.impactScore),
    visualSymbols: asArray(data.visualSymbols).length ? asArray(data.visualSymbols).slice(0, 8) : fallback.visualSymbols,
    factInferenceSpeculation: {
      facts: asArray(factGroups.facts).length ? asArray(factGroups.facts) : fallback.factInferenceSpeculation.facts,
      inferences: asArray(factGroups.inferences).length ? asArray(factGroups.inferences) : fallback.factInferenceSpeculation.inferences,
      speculation: asArray(factGroups.speculation).length ? asArray(factGroups.speculation) : fallback.factInferenceSpeculation.speculation
    },
    oneLineForStudent: asText(data.oneLineForStudent, fallback.oneLineForStudent),
    teacherDemoSpeech: asText(data.teacherDemoSpeech, fallback.teacherDemoSpeech)
  };
}

export function safeParseAIJson(text, news = {}) {
  if (!text || typeof text !== "string") return createRuleBasedFallback(news);

  try {
    return ensureExplanationShape(JSON.parse(text), news);
  } catch {}

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      return ensureExplanationShape(JSON.parse(text.slice(firstBrace, lastBrace + 1)), news);
    } catch {}
  }

  return createRuleBasedFallback(news);
}

function buildUserPrompt(news = {}) {
  return `Return ONLY a JSON object for the "data" field with this exact shape:
{
  "simpleExplanation": "",
  "storyline": {
    "problem": "",
    "oldLimit": "",
    "breakthrough": "",
    "howItWorks": "",
    "impact": ""
  },
  "timeline": [
    { "year": "", "event": "" }
  ],
  "peopleOrLabs": "",
  "field": "",
  "impactScore": 0,
  "visualSymbols": ["🔬", "⚡", "🌍"],
  "factInferenceSpeculation": {
    "facts": [],
    "inferences": [],
    "speculation": []
  },
  "oneLineForStudent": "",
  "teacherDemoSpeech": ""
}

News:
- title: ${news.title || "not provided"}
- summary: ${news.summary || "not provided"}
- source: ${news.source || "not provided"}
- publishedAt: ${news.publishedAt || "not provided"}
- url: ${news.url || "not provided"}`;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function callOpenRouter(news) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) throw new Error("OPENROUTER_API_KEY missing");

  const response = await fetchWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3001",
      "X-Title": "SciLoop News Explanation API"
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(news) }
      ],
      temperature: 0.35,
      response_format: { type: "json_object" },
      max_tokens: 1400
    })
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error?.message || `OpenRouter HTTP ${response.status}`);
  return payload?.choices?.[0]?.message?.content || "";
}

async function callGroq(news) {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) throw new Error("GROQ_API_KEY missing");

  const response = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(news) }
      ],
      temperature: 0.35,
      response_format: { type: "json_object" },
      max_tokens: 1400
    })
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error?.message || `Groq HTTP ${response.status}`);
  return payload?.choices?.[0]?.message?.content || "";
}

async function callOllama(news) {
  const baseUrl = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/$/, "");
  const model = process.env.OLLAMA_MODEL || "llama3.1";

  const chatResponse = await fetchWithTimeout(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(news) }
      ]
    })
  }).catch((error) => ({ ok: false, _networkError: error }));

  if (chatResponse.ok) {
    const payload = await chatResponse.json().catch(() => null);
    const content = payload?.message?.content || "";
    if (content) return content;
  }

  const generateResponse = await fetchWithTimeout(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt: `${SYSTEM_PROMPT}\n\n${buildUserPrompt(news)}`,
      stream: false,
      format: "json"
    })
  });

  const payload = await generateResponse.json().catch(() => null);
  if (!generateResponse.ok) throw new Error(payload?.error || `Ollama HTTP ${generateResponse.status}`);
  return payload?.response || "";
}

function getProviderOrder() {
  const provider = (process.env.AI_PROVIDER || "auto").toLowerCase().trim();
  if (provider === "openrouter") return ["openrouter"];
  if (provider === "groq") return ["groq"];
  if (provider === "ollama") return ["ollama"];
  return ["openrouter", "groq", "ollama"];
}

export async function explainNewsWithAI(news = {}) {
  const providers = {
    openrouter: callOpenRouter,
    groq: callGroq,
    ollama: callOllama
  };

  for (const providerName of getProviderOrder()) {
    try {
      console.log(`[ai] trying ${providerName}`);
      const rawText = await providers[providerName](news);
      return {
        providerUsed: providerName,
        data: safeParseAIJson(rawText, news)
      };
    } catch (error) {
      console.log(`[ai] ${providerName} failed: ${error.message}`);
    }
  }

  return {
    providerUsed: "fallback",
    data: createRuleBasedFallback(news)
  };
}
