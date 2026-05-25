import { normalizeNews } from "../utils/normalizeNews.js";

const DEFAULT_COOLDOWN_MS = 15 * 60 * 1000;

function env(name) {
  return (process.env[name] || "").trim();
}

function hasKey(name) {
  return Boolean(env(name));
}

function jsonPost(body, headers = {}) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    body: JSON.stringify(body)
  };
}

function extractJson(text = "") {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function xmlValue(block = "", tag = "") {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = block.match(new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  return decodeXml(match?.[1] || "");
}

function decodeXml(value = "") {
  return String(value)
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .trim();
}

function parseRss(text = "", provider, topic) {
  const items = [...text.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]);
  return items.map((item) => normalizeNews({
    title: xmlValue(item, "title"),
    summary: xmlValue(item, "description"),
    url: xmlValue(item, "link"),
    publishedAt: xmlValue(item, "pubDate"),
    source: provider.name
  }, provider, topic));
}

function parseAtom(text = "", provider, topic) {
  const entries = [...text.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((match) => match[0]);
  return entries.map((entry) => {
    const linkMatch = entry.match(/<link[^>]+href="([^"]+)"/i);
    return normalizeNews({
      title: xmlValue(entry, "title"),
      summary: xmlValue(entry, "summary"),
      url: decodeXml(linkMatch?.[1] || ""),
      publishedAt: xmlValue(entry, "published") || xmlValue(entry, "updated"),
      source: provider.name
    }, provider, topic);
  });
}

function makeBiologyVisualPlanPrompt(input = {}) {
  if (input.prompt) return input.prompt;

  const localPlan = input.localPlan || input.existingLocalPlan || {};
  const visualPlan = input.visualPlan || {};
  const title = input.title || input.article?.title || localPlan.title || "Unknown biology update";
  const summary = input.summary || input.article?.summary || input.newsText || input.fullText || "No summary was provided.";
  const task = input.task || "create-biology-visual-plan";

  return `You are SciLoop AI Visual Planner.
Create or verify a Biology visual-plan JSON object for the SciLoop frontend.
Use simple English, avoid hallucinated facts, and keep the visual direction useful for animation.
If exact people, dates, or mechanisms are not confirmed by the provided text, say "not confirmed from this article" in warnings.

Task: ${task}

Return only valid JSON matching this schema:
{
  "subject": "Biology",
  "title": "...",
  "confidence": 0,
  "matchedExamples": [{"id": "...", "title": "...", "score": 0}],
  "detected": {
    "entities": ["..."],
    "processes": ["..."],
    "systems": ["..."],
    "scale": "molecular | cellular | tissue | organ | organism | population | ecosystem | mixed",
    "outcomes": ["..."],
    "signals": ["..."],
    "energy": ["..."],
    "keywords": ["..."],
    "templateId": "sequence | flow | feedback_loop | network | hierarchy | comparison | evolution | defense | intervention | discovery_spotlight"
  },
  "chosenTemplate": "...",
  "visualScene": {
    "sceneType": "...",
    "nodes": [{"id": "...", "label": "...", "type": "..."}],
    "connections": [{"from": "...", "to": "...", "label": "..."}],
    "flows": [{"from": "...", "to": "...", "particle": "..."}],
    "stages": [{"label": "...", "description": "..."}],
    "annotations": ["..."]
  },
  "animationPlan": ["..."],
  "explanation": {
    "simple": "...",
    "scientific": "...",
    "innovationConnection": "...",
    "warnings": ["..."]
  },
  "providerMeta": {
    "mode": "ai-assisted",
    "provider": "server-side",
    "verifiedBy": "SciLoop AI Backend"
  }
}

Biology article:
Title: ${title}
Summary: ${summary}
Full text: ${input.fullText || input.newsText || ""}

Existing local plan to improve, if available:
${JSON.stringify(localPlan).slice(0, 6000)}

Existing AI plan to verify, if available:
${JSON.stringify(visualPlan).slice(0, 6000)}`;
}

function makeUniversalVisualPlanPrompt(input = {}) {
  if (input.prompt) return input.prompt;

  const localPlan = input.localPlan || input.existingLocalPlan || {};
  const title = input.title || input.article?.title || localPlan.title || "Unknown SciLoop visual request";
  const summary = input.summary || input.article?.summary || input.newsText || input.fullText || "No summary was provided.";
  const subject = input.subject || localPlan.subject || "auto";
  const compactExamples = input.compactExamples || input.examples || localPlan.matchedExamples || [];

  return `You are SciLoop Universal Visual Planner.
Convert the concept/news into a valid universal visual-plan JSON object for the SciLoop frontend.
Return ONLY JSON. Use simple English. Do not hallucinate exact facts, people, dates, or impossible physics.
If a detail is not confirmed from the input, add a warning.

Required schema:
{
  "id": "...",
  "sourceType": "manual-input | live-news | demo",
  "subject": "...",
  "title": "...",
  "rawText": "...",
  "cleanedText": "...",
  "confidence": 0.0,
  "matchedExamples": [{"id": "...", "title": "...", "score": 0.0}],
  "detected": {
    "entities": ["..."],
    "processes": ["..."],
    "systems": ["..."],
    "scale": "...",
    "laws": ["..."],
    "variables": ["..."],
    "flows": ["..."],
    "fields": ["..."],
    "signals": ["..."],
    "constraints": ["..."],
    "outcomes": ["..."],
    "keywords": ["..."]
  },
  "chosenTemplate": "...",
  "visualScene": {
    "sceneType": "...",
    "nodes": [{"id": "...", "label": "...", "type": "...", "color": "..."}],
    "connections": [{"from": "...", "to": "...", "label": "..."}],
    "flows": [{"from": "...", "to": "...", "label": "..."}],
    "stages": [{"label": "...", "description": "..."}],
    "annotations": ["..."],
    "labels": ["..."],
    "legend": [{"label": "...", "color": "...", "meaning": "..."}],
    "camera": {},
    "renderHints": {}
  },
  "animationPlan": ["..."],
  "explanation": {
    "simple": "...",
    "scientific": "...",
    "innovationConnection": "...",
    "warnings": ["..."]
  },
  "renderMode": "local-2d | local-pseudo-3d",
  "providerMeta": {
    "mode": "ai-assisted",
    "provider": "server-side",
    "verifiedBy": "SciLoop AI Backend"
  }
}

Template rules:
- force/motion -> Force-Motion
- energy/work/heat -> Energy-Transfer or Thermodynamic-Flow
- charge/magnet/gravity field -> Field-Line
- wave/frequency/gravitational wave -> Wave
- collision/momentum -> Collision
- spacetime/black hole/light bending -> Relativity-Spacetime
- electron/photon/atom/superposition -> Quantum-Probability
- algorithms/data -> Algorithm Flow or System Architecture
- reaction/catalyst/molecule -> Reaction Mechanism
- markets/incentives -> Supply Demand or Incentive Flow
- unknown reality subject -> object -> interaction -> outcome

Requested subject: ${subject}
Title: ${title}
Summary/Text: ${summary}
Full text: ${input.fullText || input.newsText || ""}

Local visual plan to refine safely:
${JSON.stringify(localPlan).slice(0, 8000)}

Compact examples:
${JSON.stringify(compactExamples).slice(0, 3000)}`;
}

function makeAiPrompt(article = {}, mode = "simple", explanation = "", input = {}) {
  if (mode === "biology-visual-plan") {
    return makeBiologyVisualPlanPrompt(input);
  }

  if (mode === "universal-visual-plan") {
    return makeUniversalVisualPlanPrompt(input);
  }

  if (mode === "simulation") {
    return `You are SciLoop AI.
Create a simple SciLoop possibility simulation from this science/innovation news.
Explain why humans may have innovated this technology, what problem it solves, how the idea may have evolved, and one best realistic future possibility.
Do not hallucinate exact names or years. If people or dates are not confirmed, say "not confirmed from this article".
Do not exaggerate impossible physics. Clearly say "possible future" when speculating.
Keep output understandable for a smart 12-year-old.
Use simple English, emojis, symbols, and structured sections.
Return only valid JSON with these fields:
{
  "simulationTitle": "...",
  "whyHumansNeededThis": "...",
  "evolutionStoryline": [
    "Problem: ...",
    "Observation: ...",
    "Experiment: ...",
    "Breakthrough: ...",
    "Application: ..."
  ],
  "humanPossibility": "...",
  "realWorldImpact": "...",
  "futurePossibility": "...",
  "visualSimulationBlueprint": {
    "scene": "...",
    "objects": ["..."],
    "motion": "...",
    "labels": ["Problem", "Idea", "Experiment", "Breakthrough", "Future"],
    "interaction": "...",
    "colorEffectIdea": "..."
  }
}

Article:
Title: ${article.title || "Unknown"}
Summary: ${article.summary || "Unknown"}
Source: ${article.source || "Unknown"}
URL: ${article.url || article.link || ""}
Published: ${article.publishedAt || article.published || ""}

Existing SciLoop AI explanation, if available:
${explanation || "No prior explanation was provided."}`;
  }

  return `You are SciLoop AI.
Explain this science or innovation article like a smart 12-year-old.
Use simple English and helpful emojis/symbols.
Never invent exact people, labs, or years. If not present, say "not confirmed from this article".
Return only valid JSON with these fields:
{
  "explanation": "...",
  "timeline": ["..."],
  "peopleInvolved": "Confirmed teams, labs, companies, civilizations, scientists, engineers, or individuals behind this innovation. If not confirmed, say not confirmed from this article.",
  "simpleMeaning": "...",
  "whyItMatters": "...",
  "visualBlueprint": {
    "objects": ["..."],
    "motion": "...",
    "labels": ["..."],
    "colors": ["..."],
    "interactionIdea": "..."
  }
}

Mode: ${mode}
Article:
Title: ${article.title || "Unknown"}
Summary: ${article.summary || "Unknown"}
Source: ${article.source || "Unknown"}
URL: ${article.url || article.link || ""}
Published: ${article.publishedAt || article.published || ""}`;
}

function parseOpenAiLike(data) {
  const text = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || "";
  return extractJson(text) || { explanation: text };
}

function parseCohereChat(data) {
  const content = data?.message?.content;
  const text = Array.isArray(content)
    ? content.map((item) => item?.text || "").join("\n")
    : data?.text || "";
  return extractJson(text) || { explanation: text };
}

export function getAiProviders() {
  return [
    {
      id: "gemini",
      name: "Gemini",
      enabled: hasKey("GEMINI_API_KEY"),
      priority: 1,
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      model: env("GEMINI_MODEL") || "gemini-flash-latest",
      rpmLimit: 12,
      dailyLimit: 1400,
      monthlyLimit: 30000,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(input) {
        const model = this.model.replace(/^models\//, "");
        return {
          url: `${this.baseUrl}/models/${model}:generateContent?key=${encodeURIComponent(env("GEMINI_API_KEY"))}`,
          options: jsonPost({
            contents: [{ parts: [{ text: makeAiPrompt(input.article, input.mode, input.explanation, input) }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        };
      },
      parseResponse(response) {
        const text = response?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n") || "";
        return extractJson(text) || { explanation: text };
      }
    },
    {
      id: "openrouter",
      name: "OpenRouter",
      enabled: hasKey("OPENROUTER_API_KEY"),
      priority: 90,
      baseUrl: "https://openrouter.ai/api/v1/chat/completions",
      model: env("OPENROUTER_MODEL") || "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
      rpmLimit: 10,
      dailyLimit: 200,
      monthlyLimit: 3000,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(input) {
        return {
          url: this.baseUrl,
          options: jsonPost({
            model: this.model,
            messages: [{ role: "user", content: makeAiPrompt(input.article, input.mode, input.explanation, input) }],
            response_format: { type: "json_object" }
          }, {
            Authorization: `Bearer ${env("OPENROUTER_API_KEY")}`,
            "HTTP-Referer": "http://localhost",
            "X-Title": "SciLoop AI Backend"
          })
        };
      },
      parseResponse: parseOpenAiLike
    },
    {
      id: "groq",
      name: "Groq",
      enabled: hasKey("GROQ_API_KEY"),
      priority: 2,
      baseUrl: "https://api.groq.com/openai/v1/chat/completions",
      model: env("GROQ_MODEL") || "llama-3.1-8b-instant",
      rpmLimit: 20,
      dailyLimit: 1000,
      monthlyLimit: 10000,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(input) {
        return {
          url: this.baseUrl,
          options: jsonPost({
            model: this.model,
            messages: [{ role: "user", content: makeAiPrompt(input.article, input.mode, input.explanation, input) }],
            response_format: { type: "json_object" }
          }, { Authorization: `Bearer ${env("GROQ_API_KEY")}` })
        };
      },
      parseResponse: parseOpenAiLike
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      enabled: hasKey("DEEPSEEK_API_KEY"),
      priority: 3,
      baseUrl: "https://api.deepseek.com/chat/completions",
      model: env("DEEPSEEK_MODEL") || "deepseek-chat",
      rpmLimit: 8,
      dailyLimit: 300,
      monthlyLimit: 3000,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(input) {
        return {
          url: this.baseUrl,
          options: jsonPost({
            model: this.model,
            messages: [{ role: "user", content: makeAiPrompt(input.article, input.mode, input.explanation, input) }],
            response_format: { type: "json_object" }
          }, { Authorization: `Bearer ${env("DEEPSEEK_API_KEY")}` })
        };
      },
      parseResponse: parseOpenAiLike
    },
    {
      id: "cohere",
      name: "Cohere",
      enabled: hasKey("COHERE_API_KEY"),
      priority: 4,
      baseUrl: "https://api.cohere.com/v2/chat",
      model: env("COHERE_CHAT_MODEL") || "command-a-03-2025",
      rpmLimit: 8,
      dailyLimit: 250,
      monthlyLimit: 3000,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(input) {
        return {
          url: this.baseUrl,
          options: jsonPost({
            model: this.model,
            messages: [{ role: "user", content: makeAiPrompt(input.article, input.mode, input.explanation, input) }]
          }, { Authorization: `Bearer ${env("COHERE_API_KEY")}` })
        };
      },
      parseResponse: parseCohereChat
    },
    {
      id: "huggingface",
      name: "HuggingFace Inference",
      enabled: hasKey("HUGGINGFACE_API_KEY"),
      priority: 5,
      baseUrl: "https://api-inference.huggingface.co/models",
      model: env("HUGGINGFACE_MODEL") || "mistralai/Mistral-7B-Instruct-v0.3",
      rpmLimit: 8,
      dailyLimit: 200,
      monthlyLimit: 2500,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(input) {
        return {
          url: `${this.baseUrl}/${this.model}`,
          options: jsonPost({
            inputs: makeAiPrompt(input.article, input.mode, input.explanation, input),
            parameters: { max_new_tokens: 700, return_full_text: false }
          }, { Authorization: `Bearer ${env("HUGGINGFACE_API_KEY")}` })
        };
      },
      parseResponse(response) {
        const text = Array.isArray(response)
          ? response[0]?.generated_text
          : response?.generated_text || response?.[0]?.generated_text || "";
        return extractJson(text) || { explanation: text };
      }
    },
    {
      id: "together",
      name: "Together AI",
      enabled: hasKey("TOGETHER_API_KEY"),
      priority: 91,
      baseUrl: "https://api.together.xyz/v1/chat/completions",
      model: env("TOGETHER_MODEL") || "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      rpmLimit: 8,
      dailyLimit: 200,
      monthlyLimit: 2500,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(input) {
        return {
          url: this.baseUrl,
          options: jsonPost({
            model: this.model,
            messages: [{ role: "user", content: makeAiPrompt(input.article, input.mode, input.explanation, input) }],
            response_format: { type: "json_object" }
          }, { Authorization: `Bearer ${env("TOGETHER_API_KEY")}` })
        };
      },
      parseResponse: parseOpenAiLike
    },
    {
      id: "github-models",
      name: "GitHub Models",
      enabled: hasKey("GITHUB_TOKEN"),
      priority: 92,
      baseUrl: `${env("GITHUB_MODELS_BASE_URL") || "https://models.github.ai/inference"}/chat/completions`,
      model: env("GITHUB_MODEL") || "openai/gpt-4o-mini",
      rpmLimit: 8,
      dailyLimit: 200,
      monthlyLimit: 2500,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(input) {
        return {
          url: this.baseUrl,
          options: jsonPost({
            model: this.model,
            messages: [{ role: "user", content: makeAiPrompt(input.article, input.mode, input.explanation, input) }],
            response_format: { type: "json_object" }
          }, { Authorization: `Bearer ${env("GITHUB_TOKEN")}` })
        };
      },
      parseResponse: parseOpenAiLike
    }
  ].sort((a, b) => a.priority - b.priority);
}

export function getNewsProviders() {
  return [
    {
      id: "newsapi",
      name: "NewsAPI",
      enabled: hasKey("NEWSAPI_KEY"),
      priority: 1,
      baseUrl: "https://newsapi.org/v2/everything",
      rpmLimit: 8,
      dailyLimit: 90,
      monthlyLimit: 900,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(topic, limit) {
        return {
          url: `${this.baseUrl}?q=${encodeURIComponent(topic)}&language=en&pageSize=${limit}&sortBy=publishedAt&apiKey=${encodeURIComponent(env("NEWSAPI_KEY"))}`,
          options: {}
        };
      },
      parseResponse(response, topic) {
        return (response?.articles || []).map((item) => normalizeNews(item, this, topic));
      }
    },
    {
      id: "gnews",
      name: "GNews",
      enabled: hasKey("GNEWS_API_KEY"),
      priority: 2,
      baseUrl: "https://gnews.io/api/v4/search",
      rpmLimit: 8,
      dailyLimit: 90,
      monthlyLimit: 900,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(topic, limit) {
        return {
          url: `${this.baseUrl}?q=${encodeURIComponent(topic)}&lang=en&max=${limit}&token=${encodeURIComponent(env("GNEWS_API_KEY"))}`,
          options: {}
        };
      },
      parseResponse(response, topic) {
        return (response?.articles || []).map((item) => normalizeNews(item, this, topic));
      }
    },
    {
      id: "guardian",
      name: "Guardian Open Platform",
      enabled: hasKey("GUARDIAN_API_KEY"),
      priority: 3,
      baseUrl: "https://content.guardianapis.com/search",
      rpmLimit: 10,
      dailyLimit: 500,
      monthlyLimit: 5000,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(topic, limit) {
        return {
          url: `${this.baseUrl}?q=${encodeURIComponent(topic)}&show-fields=trailText,thumbnail&page-size=${limit}&api-key=${encodeURIComponent(env("GUARDIAN_API_KEY"))}`,
          options: {}
        };
      },
      parseResponse(response, topic) {
        return (response?.response?.results || []).map((item) => normalizeNews(item, this, topic));
      }
    },
    {
      id: "nyt",
      name: "New York Times API",
      enabled: hasKey("NYT_API_KEY"),
      priority: 4,
      baseUrl: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
      rpmLimit: 8,
      dailyLimit: 250,
      monthlyLimit: 3000,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(topic, limit) {
        return {
          url: `${this.baseUrl}?q=${encodeURIComponent(topic)}&sort=newest&api-key=${encodeURIComponent(env("NYT_API_KEY"))}`,
          options: {}
        };
      },
      parseResponse(response, topic) {
        return (response?.response?.docs || []).slice(0, 20).map((item) => normalizeNews(item, this, topic));
      }
    },
    {
      id: "mediastack",
      name: "Mediastack",
      enabled: hasKey("MEDIASTACK_API_KEY"),
      priority: 5,
      baseUrl: "https://api.mediastack.com/v1/news",
      rpmLimit: 8,
      dailyLimit: 90,
      monthlyLimit: 900,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(topic, limit) {
        return {
          url: `${this.baseUrl}?access_key=${encodeURIComponent(env("MEDIASTACK_API_KEY"))}&keywords=${encodeURIComponent(topic)}&languages=en&limit=${limit}&sort=published_desc`,
          options: {}
        };
      },
      parseResponse(response, topic) {
        return (response?.data || []).map((item) => normalizeNews(item, this, topic));
      }
    },
    {
      id: "nasa-rss",
      name: "NASA RSS",
      enabled: true,
      priority: 6,
      baseUrl: "https://www.nasa.gov/news-release/feed/",
      rpmLimit: 6,
      dailyLimit: 200,
      monthlyLimit: 5000,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest() {
        return { url: this.baseUrl, options: {} };
      },
      parseResponse(_response, topic, text) {
        return parseRss(text, this, topic);
      }
    },
    {
      id: "arxiv",
      name: "arXiv",
      enabled: true,
      priority: 7,
      baseUrl: "https://export.arxiv.org/api/query",
      rpmLimit: 4,
      dailyLimit: 200,
      monthlyLimit: 5000,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(topic, limit) {
        return {
          url: `${this.baseUrl}?search_query=all:${encodeURIComponent(topic)}&start=0&max_results=${limit}&sortBy=submittedDate&sortOrder=descending`,
          options: {}
        };
      },
      parseResponse(_response, topic, text) {
        return parseAtom(text, this, topic);
      }
    },
    {
      id: "crossref",
      name: "Crossref",
      enabled: true,
      priority: 8,
      baseUrl: "https://api.crossref.org/works",
      rpmLimit: 10,
      dailyLimit: 500,
      monthlyLimit: 10000,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(topic, limit) {
        return {
          url: `${this.baseUrl}?query=${encodeURIComponent(topic)}&rows=${limit}&sort=published&order=desc`,
          options: {}
        };
      },
      parseResponse(response, topic) {
        return (response?.message?.items || []).map((item) => normalizeNews({
          title: item.title?.[0],
          summary: item.abstract || item.subtitle?.[0],
          url: item.URL,
          source: item.publisher || item["container-title"]?.[0],
          publishedAt: item.published?.["date-parts"]?.[0]?.join("-")
        }, this, topic));
      }
    },
    {
      id: "semantic-scholar",
      name: "Semantic Scholar",
      enabled: true,
      priority: 9,
      baseUrl: "https://api.semanticscholar.org/graph/v1/paper/search",
      rpmLimit: 5,
      dailyLimit: 200,
      monthlyLimit: 5000,
      cooldownMs: DEFAULT_COOLDOWN_MS,
      buildRequest(topic, limit) {
        return {
          url: `${this.baseUrl}?query=${encodeURIComponent(topic)}&limit=${limit}&fields=title,abstract,url,year,publicationDate,venue,authors`,
          options: {}
        };
      },
      parseResponse(response, topic) {
        return (response?.data || []).map((item) => normalizeNews({
          title: item.title,
          summary: item.abstract,
          url: item.url,
          source: item.venue || "Semantic Scholar",
          publishedAt: item.publicationDate || item.year
        }, this, topic));
      }
    }
  ].sort((a, b) => a.priority - b.priority);
}

export function publicProviderSummary(providers) {
  return providers.map((provider) => ({
    id: provider.id,
    name: provider.name,
    enabled: Boolean(provider.enabled),
    priority: provider.priority,
    model: provider.model,
    rpmLimit: provider.rpmLimit,
    dailyLimit: provider.dailyLimit,
    monthlyLimit: provider.monthlyLimit,
    cooldownMs: provider.cooldownMs
  }));
}
