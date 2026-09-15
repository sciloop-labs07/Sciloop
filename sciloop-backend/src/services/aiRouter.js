import crypto from "node:crypto";
import { getAiProviders } from "../config/providers.js";
import { safeFetch } from "../utils/safeFetch.js";
import { getCache, makeCacheKey, setCache } from "./cacheManager.js";
import { isProviderAllowed, recordFailure, recordSuccess } from "./quotaManager.js";

const AI_CACHE_TTL_SECONDS = Number(process.env.AI_CACHE_TTL_SECONDS || 604800);
const AI_PROVIDER_TIMEOUT_MS = Number(process.env.AI_PROVIDER_TIMEOUT_MS || 5000);
const MAX_PROVIDERS_PER_AI_REQUEST = Number(process.env.MAX_PROVIDERS_PER_AI_REQUEST || 5);
const VERIFIED_PROVIDER_ORDER = ["groq", "openrouter", "cohere", "huggingface", "gemini"];
const TEXT_PROVIDER_FAILOVER_ORDER = VERIFIED_PROVIDER_ORDER;
const BIOLOGY_VISUAL_PROVIDER_ORDER = VERIFIED_PROVIDER_ORDER;
const UNIVERSAL_VISUAL_PROVIDER_ORDER = VERIFIED_PROVIDER_ORDER;
const STRUCTURED_JSON_PROVIDER_ORDER = VERIFIED_PROVIDER_ORDER;

function textHash(article = {}, mode = "simple") {
  return crypto
    .createHash("sha1")
    .update(`${mode}:${article.url || ""}:${article.title || ""}:${article.summary || ""}`)
    .digest("hex");
}

function asArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (!value) return [];
  return [String(value)];
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function boundedNumber(value, fallback = 55) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(100, number));
}

function extractFirstJsonObject(text = "") {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === "\"") {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;

    if (depth === 0) {
      try {
        return JSON.parse(text.slice(start, index + 1));
      } catch {
        return null;
      }
    }
  }

  return null;
}

function expandNestedProviderPayload(payload = {}) {
  if (!payload || typeof payload !== "object") return {};

  if (typeof payload.explanation === "string") {
    const nestedPayload = extractFirstJsonObject(payload.explanation);

    if (nestedPayload && typeof nestedPayload === "object") {
      return {
        ...payload,
        ...nestedPayload
      };
    }
  }

  return payload;
}

function normalizeAiPayload(payload = {}, article = {}, providerUsed = "unknown", extras = {}) {
  payload = expandNestedProviderPayload(payload);

  const explanation = payload.explanation || payload.simpleMeaning || payload.summary || "";
  const simpleMeaning = payload.simpleMeaning || explanation || `This article is about: ${article.title || "a science update"}.`;
  const whyItMatters = payload.whyItMatters || payload.impact || "The importance is not fully confirmed from this article.";
  const timeline = asArray(payload.timeline).length
    ? asArray(payload.timeline)
    : [`Published context: ${article.publishedAt || article.published || "not confirmed from this article"}`];

  const visualBlueprint = typeof payload.visualBlueprint === "object" && payload.visualBlueprint
    ? payload.visualBlueprint
    : {
      objects: ["article idea", "cause", "effect", "future use"],
      motion: "Show the idea moving from problem to discovery to impact.",
      labels: ["problem", "discovery", "impact"],
      colors: ["cyan", "gold", "white"],
      interactionIdea: "Let the user tap each stage to reveal one simple sentence."
    };

  return {
    explanation: explanation || localExplanation(article).explanation,
    timeline,
    peopleInvolved: payload.peopleInvolved || payload.people || "not confirmed from this article",
    simpleMeaning,
    whyItMatters,
    visualBlueprint,
    providerUsed,
    cached: Boolean(extras.cached),
    fallback: Boolean(extras.fallback)
  };
}

function normalizeBlueprint(blueprint = {}, article = {}) {
  if (blueprint && typeof blueprint === "object" && !Array.isArray(blueprint)) {
    return {
      scene: blueprint.scene || "A dark SciLoop lab table showing the innovation journey.",
      objects: asArray(blueprint.objects).length
        ? asArray(blueprint.objects)
        : ["problem marker", "idea spark", "experiment path", "future unlock"],
      motion: blueprint.motion || "Move from problem to observation to experiment to breakthrough to future.",
      labels: asArray(blueprint.labels).length
        ? asArray(blueprint.labels)
        : ["Problem", "Idea", "Experiment", "Breakthrough", "Future"],
      interaction: blueprint.interaction || blueprint.interactionIdea || "User clicks each stage to see the innovation journey.",
      colorEffectIdea: blueprint.colorEffectIdea || blueprint.colors?.join?.(", ") || "Cyan science glow with gold future highlights."
    };
  }

  return {
    scene: `A SciLoop possibility map for ${article.title || "this innovation"}.`,
    objects: ["problem marker", "idea spark", "experiment path", "future unlock"],
    motion: "Animate the path from need to invention to impact.",
    labels: ["Problem", "Idea", "Experiment", "Breakthrough", "Future"],
    interaction: "User clicks each stage to see the innovation journey.",
    colorEffectIdea: "Cyan science glow with gold future highlights."
  };
}

function normalizeSimulationPayload(payload = {}, article = {}, providerUsed = "unknown", extras = {}) {
  payload = expandNestedProviderPayload(payload);

  const title = article.title || "this science update";
  const summary = article.summary || "The article summary is not available.";
  const storyline = asArray(payload.evolutionStoryline).length
    ? asArray(payload.evolutionStoryline)
    : [
      `Problem: People noticed a limitation connected to ${title}.`,
      `Observation: The article suggests a signal or pattern worth studying. ${summary}`,
      "Experiment: Researchers test materials, tools, data, or methods to reduce the limitation.",
      "Breakthrough: A useful improvement appears, but exact details must be checked in the source.",
      "Application: The idea can move toward real-world testing, learning, or industry use."
    ];

  return {
    simulationTitle: payload.simulationTitle || "SciLoop Possibility Simulation",
    whyHumansNeededThis:
      payload.whyHumansNeededThis ||
      `Humans usually innovate when they face a problem, limitation, or opportunity. This article appears connected to ${title}.`,
    evolutionStoryline: storyline,
    humanPossibility:
      payload.humanPossibility ||
      payload.peopleInvolved ||
      payload.people ||
      "Exact people are not confirmed from this article.",
    realWorldImpact:
      payload.realWorldImpact ||
      payload.impact ||
      "This could affect students, scientists, industry, medicine, energy, space, or society if the idea becomes reliable.",
    futurePossibility:
      payload.futurePossibility ||
      payload.future ||
      "A possible future is that this idea becomes a safer, cheaper, or more powerful tool for solving real human problems.",
    visualSimulationBlueprint: normalizeBlueprint(payload.visualSimulationBlueprint || payload.visualBlueprint, article),
    providerUsed,
    cached: Boolean(extras.cached),
    fallback: Boolean(extras.fallback)
  };
}

export function localExplanation(article = {}) {
  const title = article.title || "this science update";
  const summary = article.summary || "The article summary is not available.";
  return normalizeAiPayload({
    explanation: `AI providers are unavailable right now. Here is a simple local summary based on the article title and summary: ${title}. ${summary}`,
    simpleMeaning: `${title}: ${summary}`,
    whyItMatters: "This may matter because it describes a new scientific or innovation signal worth checking against the original source.",
    peopleInvolved: "not confirmed from this article",
    timeline: [`Published context: ${article.publishedAt || article.published || "not confirmed from this article"}`],
    visualBlueprint: {
      objects: ["news card", "main idea", "impact path"],
      motion: "Animate the title splitting into problem, idea, and impact.",
      labels: ["what happened", "why it matters", "what to verify"],
      colors: ["cyan", "amber", "white"],
      interactionIdea: "Tap each label to see the matching sentence from the summary."
    }
  }, article, "local-fallback", { fallback: true });
}

export function localSimulation(article = {}) {
  const title = article.title || "this science update";
  const summary = article.summary || "The article summary is not available.";

  return normalizeSimulationPayload({
    simulationTitle: "Local SciLoop Simulation",
    whyHumansNeededThis: `Humans usually innovate when they face a problem, limitation, or opportunity. This article appears connected to ${title}.`,
    evolutionStoryline: [
      `Problem: A real need or limitation appears around ${title}.`,
      `Observation: People notice clues in the article summary: ${summary}`,
      "Experiment: Teams test ideas, compare results, and remove weak designs.",
      "Breakthrough: One method becomes strong enough to be useful or worth deeper testing.",
      "Application: The idea can be used in learning, research, industry, health, energy, space, or society."
    ],
    humanPossibility: "Exact people are not confirmed from this article.",
    realWorldImpact: "It can help people understand a problem faster and may become a tool for better science, technology, or decision-making.",
    futurePossibility: `A possible future is that ${title} unlocks a safer, cleaner, smarter, or more accessible technology for everyday life.`,
    visualSimulationBlueprint: {
      scene: "A dark SciLoop lab map where a human problem becomes an innovation path.",
      objects: ["problem node", "observation lens", "experiment chamber", "breakthrough spark", "future city"],
      motion: "Nodes light up one by one from left to right.",
      labels: ["Problem", "Idea", "Experiment", "Breakthrough", "Future"],
      interaction: "User clicks each stage to see the innovation journey.",
      colorEffectIdea: "Cold cyan for science steps, warm gold for future possibility."
    }
  }, article, "local-fallback", { fallback: true });
}

function getTextFailoverProviders() {
  const enabled = new Map(getAiProviders().filter((provider) => provider.enabled).map((provider) => [provider.id, provider]));
  return TEXT_PROVIDER_FAILOVER_ORDER
    .map((providerId) => enabled.get(providerId))
    .filter(Boolean);
}

function visualPlanHash(payload = {}) {
  return crypto
    .createHash("sha1")
    .update(JSON.stringify({
      task: payload.task || "create-biology-visual-plan",
      provider: payload.provider || payload.preferredProvider || "auto",
      title: payload.title || payload.article?.title || "",
      summary: payload.summary || payload.article?.summary || payload.newsText || "",
      fullText: payload.fullText || "",
      visualPlan: payload.visualPlan || null,
      localPlanId: payload.localPlan?.id || payload.existingLocalPlan?.id || ""
    }))
    .digest("hex");
}

function extractProviderVisualPlan(payload = {}) {
  const expanded = expandNestedProviderPayload(payload);
  return asObject(expanded.visualPlan || expanded.plan || expanded.data || expanded);
}

function getBiologyVisualProviders(preferredProvider = "auto") {
  const enabled = new Map(getAiProviders().filter((provider) => provider.enabled).map((provider) => [provider.id, provider]));
  const requested = String(preferredProvider || "auto").toLowerCase();
  const order = requested !== "auto" && BIOLOGY_VISUAL_PROVIDER_ORDER.includes(requested)
    ? [requested, ...BIOLOGY_VISUAL_PROVIDER_ORDER.filter((providerId) => providerId !== requested)]
    : BIOLOGY_VISUAL_PROVIDER_ORDER;

  return order
    .map((providerId) => enabled.get(providerId))
    .filter(Boolean);
}

function getUniversalVisualProviders(preferredProvider = "auto") {
  const enabled = new Map(getAiProviders().filter((provider) => provider.enabled).map((provider) => [provider.id, provider]));
  const requested = String(preferredProvider || "auto").toLowerCase();
  const order = requested !== "auto" && UNIVERSAL_VISUAL_PROVIDER_ORDER.includes(requested)
    ? [requested, ...UNIVERSAL_VISUAL_PROVIDER_ORDER.filter((providerId) => providerId !== requested)]
    : UNIVERSAL_VISUAL_PROVIDER_ORDER;

  return order
    .map((providerId) => enabled.get(providerId))
    .filter(Boolean);
}

function getStructuredJsonProviders(preferredProvider = "auto") {
  const enabled = new Map(getAiProviders().filter((provider) => provider.enabled).map((provider) => [provider.id, provider]));
  const requested = String(preferredProvider || "auto").toLowerCase();
  const order = requested !== "auto" && STRUCTURED_JSON_PROVIDER_ORDER.includes(requested)
    ? [requested, ...STRUCTURED_JSON_PROVIDER_ORDER.filter((providerId) => providerId !== requested)]
    : STRUCTURED_JSON_PROVIDER_ORDER;

  return order.map((providerId) => enabled.get(providerId)).filter(Boolean);
}

function normalizeVisualScene(scene = {}, localScene = {}) {
  scene = asObject(scene);
  localScene = asObject(localScene);

  return {
    sceneType: scene.sceneType || localScene.sceneType || "biology-process-map",
    nodes: Array.isArray(scene.nodes) ? scene.nodes : (Array.isArray(localScene.nodes) ? localScene.nodes : []),
    connections: Array.isArray(scene.connections) ? scene.connections : (Array.isArray(localScene.connections) ? localScene.connections : []),
    flows: Array.isArray(scene.flows) ? scene.flows : (Array.isArray(localScene.flows) ? localScene.flows : []),
    stages: Array.isArray(scene.stages) ? scene.stages : (Array.isArray(localScene.stages) ? localScene.stages : []),
    annotations: asArray(scene.annotations).length ? asArray(scene.annotations) : asArray(localScene.annotations)
  };
}

function normalizeBiologyVisualPlan(aiPlan = {}, requestPayload = {}, providerUsed = "unknown", extras = {}) {
  const localPlan = asObject(requestPayload.localPlan || requestPayload.existingLocalPlan);
  const plan = extractProviderVisualPlan(aiPlan);
  const localDetected = asObject(localPlan.detected);
  const detected = asObject(plan.detected);
  const localExplanation = asObject(localPlan.explanation);
  const explanation = asObject(plan.explanation);
  const title = plan.title || requestPayload.title || requestPayload.article?.title || localPlan.title || "Biology visual plan";
  const summary = requestPayload.summary || requestPayload.article?.summary || requestPayload.newsText || requestPayload.fullText || "";
  const fallbackWarnings = extras.fallback ? ["AI providers unavailable. Local visual plan generated by SciLoop backend."] : [];

  return {
    id: plan.id || localPlan.id || `bio-plan-${crypto.createHash("sha1").update(title).digest("hex").slice(0, 10)}`,
    sourceType: plan.sourceType || localPlan.sourceType || "news",
    subject: "Biology",
    title,
    rawText: plan.rawText || localPlan.rawText || summary,
    cleanedText: plan.cleanedText || localPlan.cleanedText || summary,
    confidence: boundedNumber(plan.confidence ?? localPlan.confidence, extras.fallback ? 45 : 70),
    matchedExamples: Array.isArray(plan.matchedExamples)
      ? plan.matchedExamples
      : (Array.isArray(localPlan.matchedExamples) ? localPlan.matchedExamples : []),
    detected: {
      entities: asArray(detected.entities).length ? asArray(detected.entities) : (asArray(localDetected.entities).length ? asArray(localDetected.entities) : ["biology system"]),
      processes: asArray(detected.processes).length ? asArray(detected.processes) : (asArray(localDetected.processes).length ? asArray(localDetected.processes) : ["change over time"]),
      systems: asArray(detected.systems).length ? asArray(detected.systems) : asArray(localDetected.systems),
      scale: detected.scale || localDetected.scale || "mixed",
      outcomes: asArray(detected.outcomes).length ? asArray(detected.outcomes) : asArray(localDetected.outcomes),
      signals: asArray(detected.signals).length ? asArray(detected.signals) : asArray(localDetected.signals),
      energy: asArray(detected.energy).length ? asArray(detected.energy) : asArray(localDetected.energy),
      keywords: asArray(detected.keywords).length
        ? asArray(detected.keywords)
        : (asArray(localDetected.keywords).length ? asArray(localDetected.keywords) : ["biology", "visual", "process"]),
      templateId: detected.templateId || localDetected.templateId || "discovery_spotlight"
    },
    chosenTemplate: plan.chosenTemplate || localPlan.chosenTemplate || detected.templateId || localDetected.templateId || "discovery_spotlight",
    visualScene: normalizeVisualScene(plan.visualScene, localPlan.visualScene),
    animationPlan: asArray(plan.animationPlan).length
      ? asArray(plan.animationPlan)
      : (asArray(localPlan.animationPlan).length
        ? asArray(localPlan.animationPlan)
        : [
          "Fade in the main biology object.",
          "Animate arrows to show cause and effect.",
          "Highlight the final outcome and real-world meaning."
        ]),
    explanation: {
      simple: explanation.simple || localExplanation.simple || `This biology story shows how ${title} changes or explains a living system.`,
      scientific: explanation.scientific || localExplanation.scientific || "Scientific details are limited by the article text, so this plan avoids unconfirmed claims.",
      innovationConnection:
        explanation.innovationConnection ||
        localExplanation.innovationConnection ||
        "This could help students see the hidden mechanism behind the discovery or innovation.",
      warnings: [
        ...asArray(explanation.warnings),
        ...asArray(localExplanation.warnings),
        ...fallbackWarnings
      ].filter(Boolean)
    },
    providerMeta: {
      mode: plan.providerMeta?.mode || requestPayload.mode || (requestPayload.task ? "hybrid-verification" : "ai-assisted"),
      provider: providerUsed,
      verifiedBy: plan.providerMeta?.verifiedBy || (requestPayload.task ? "SciLoop AI Backend verification" : "SciLoop AI Backend"),
      cached: Boolean(extras.cached),
      fallback: Boolean(extras.fallback)
    }
  };
}

function localBiologyVisualPlan(payload = {}, warnings = []) {
  const localPlan = asObject(payload.localPlan || payload.existingLocalPlan);
  if (Object.keys(localPlan).length) {
    return normalizeBiologyVisualPlan(localPlan, payload, "local-rule-engine", { fallback: true });
  }

  return normalizeBiologyVisualPlan({
    subject: "Biology",
    title: payload.title || payload.article?.title || "Biology visual plan",
    confidence: 45,
    detected: {
      entities: ["living system", "cell or organism", "biological signal"],
      processes: ["observe", "test", "change", "outcome"],
      systems: ["biology"],
      scale: "mixed",
      outcomes: ["new understanding"],
      signals: ["evidence from article"],
      energy: [],
      keywords: ["biology", "discovery", "visual plan"],
      templateId: "discovery_spotlight"
    },
    chosenTemplate: "discovery_spotlight",
    visualScene: {
      sceneType: "biology-discovery-map",
      nodes: [
        { id: "problem", label: "Problem", type: "question" },
        { id: "evidence", label: "Evidence", type: "signal" },
        { id: "mechanism", label: "Mechanism", type: "process" },
        { id: "impact", label: "Impact", type: "outcome" }
      ],
      connections: [
        { from: "problem", to: "evidence", label: "observe" },
        { from: "evidence", to: "mechanism", label: "explain" },
        { from: "mechanism", to: "impact", label: "apply" }
      ],
      flows: [{ from: "problem", to: "impact", particle: "cyan evidence pulse" }],
      stages: [
        { label: "Problem", description: "What humans are trying to understand." },
        { label: "Evidence", description: "What the article says was observed." },
        { label: "Mechanism", description: "The likely biology process behind it." },
        { label: "Impact", description: "Why it can matter in real life." }
      ],
      annotations: ["Exact people and dates are not confirmed from this article."]
    },
    animationPlan: [
      "Start with a dark biology lab card.",
      "Pulse the evidence node when the observation appears.",
      "Move cyan particles through the mechanism path.",
      "Glow the impact node when the meaning becomes clear."
    ],
    explanation: {
      simple: "This plan turns the biology article into a visual cause-and-effect story.",
      scientific: "The backend used a safe local plan because AI providers were unavailable or skipped.",
      innovationConnection: "Students can still see the problem, evidence, mechanism, and impact without exposing any API key.",
      warnings
    }
  }, payload, "local-rule-engine", { fallback: true });
}

function normalizeUniversalVisualPlan(aiPlan = {}, requestPayload = {}, providerUsed = "unknown", extras = {}) {
  const localPlan = asObject(requestPayload.localPlan || requestPayload.existingLocalPlan);
  const plan = extractProviderVisualPlan(aiPlan);
  const localDetected = asObject(localPlan.detected);
  const detected = asObject(plan.detected);
  const localScene = asObject(localPlan.visualScene);
  const scene = asObject(plan.visualScene);
  const localExplanation = asObject(localPlan.explanation);
  const explanation = asObject(plan.explanation);
  const title = plan.title || requestPayload.title || requestPayload.article?.title || localPlan.title || "SciLoop universal visual plan";
  const subject = plan.subject || requestPayload.subject || localPlan.subject || "Applied Reality";
  const rawText = plan.rawText || requestPayload.summary || requestPayload.article?.summary || requestPayload.newsText || requestPayload.fullText || localPlan.rawText || title;
  const fallbackWarnings = extras.fallback ? ["AI providers unavailable. Local universal visual plan returned by SciLoop backend."] : [];

  return {
    id: plan.id || localPlan.id || `universal-plan-${crypto.createHash("sha1").update(`${subject}:${title}`).digest("hex").slice(0, 10)}`,
    sourceType: plan.sourceType || localPlan.sourceType || requestPayload.sourceType || "manual-input",
    subject,
    title,
    rawText,
    cleanedText: plan.cleanedText || localPlan.cleanedText || rawText,
    confidence: Math.max(0, Math.min(1, Number(plan.confidence ?? localPlan.confidence ?? (extras.fallback ? 0.45 : 0.72)) || 0.6)),
    matchedExamples: Array.isArray(plan.matchedExamples)
      ? plan.matchedExamples
      : (Array.isArray(localPlan.matchedExamples) ? localPlan.matchedExamples : []),
    detected: {
      entities: asArray(detected.entities).length ? asArray(detected.entities) : (asArray(localDetected.entities).length ? asArray(localDetected.entities) : ["object"]),
      processes: asArray(detected.processes).length ? asArray(detected.processes) : (asArray(localDetected.processes).length ? asArray(localDetected.processes) : ["interaction"]),
      systems: asArray(detected.systems).length ? asArray(detected.systems) : asArray(localDetected.systems),
      scale: detected.scale || localDetected.scale || "mixed",
      laws: asArray(detected.laws).length ? asArray(detected.laws) : asArray(localDetected.laws),
      variables: asArray(detected.variables).length ? asArray(detected.variables) : asArray(localDetected.variables),
      flows: asArray(detected.flows).length ? asArray(detected.flows) : asArray(localDetected.flows),
      fields: asArray(detected.fields).length ? asArray(detected.fields) : asArray(localDetected.fields),
      signals: asArray(detected.signals).length ? asArray(detected.signals) : asArray(localDetected.signals),
      constraints: asArray(detected.constraints).length ? asArray(detected.constraints) : asArray(localDetected.constraints),
      outcomes: asArray(detected.outcomes).length ? asArray(detected.outcomes) : asArray(localDetected.outcomes),
      keywords: asArray(detected.keywords).length ? asArray(detected.keywords) : (asArray(localDetected.keywords).length ? asArray(localDetected.keywords) : ["visual", "concept"])
    },
    chosenTemplate: plan.chosenTemplate || localPlan.chosenTemplate || "Object Interaction Outcome",
    visualScene: {
      sceneType: scene.sceneType || localScene.sceneType || "node-flow-scene",
      nodes: Array.isArray(scene.nodes) ? scene.nodes : (Array.isArray(localScene.nodes) ? localScene.nodes : [
        { id: "input", label: "Input", type: "source" },
        { id: "mechanism", label: "Mechanism", type: "process" },
        { id: "outcome", label: "Outcome", type: "result" }
      ]),
      connections: Array.isArray(scene.connections) ? scene.connections : (Array.isArray(localScene.connections) ? localScene.connections : [
        { from: "input", to: "mechanism", label: "changes" },
        { from: "mechanism", to: "outcome", label: "creates" }
      ]),
      flows: Array.isArray(scene.flows) ? scene.flows : (Array.isArray(localScene.flows) ? localScene.flows : []),
      stages: Array.isArray(scene.stages) ? scene.stages : (Array.isArray(localScene.stages) ? localScene.stages : [
        { label: "Input", description: "What enters the system." },
        { label: "Mechanism", description: "What causes the change." },
        { label: "Outcome", description: "What becomes visible." }
      ]),
      annotations: asArray(scene.annotations).length ? asArray(scene.annotations) : asArray(localScene.annotations),
      labels: asArray(scene.labels).length ? asArray(scene.labels) : asArray(localScene.labels),
      legend: Array.isArray(scene.legend) ? scene.legend : (Array.isArray(localScene.legend) ? localScene.legend : []),
      camera: asObject(scene.camera || localScene.camera),
      renderHints: asObject(scene.renderHints || localScene.renderHints)
    },
    animationPlan: asArray(plan.animationPlan).length
      ? asArray(plan.animationPlan)
      : (asArray(localPlan.animationPlan).length ? asArray(localPlan.animationPlan) : [
        "Fade in the main entities.",
        "Animate the mechanism arrows.",
        "Highlight the outcome and uncertainty label."
      ]),
    explanation: {
      simple: explanation.simple || localExplanation.simple || `This visual shows the main mechanism behind ${title}.`,
      scientific: explanation.scientific || localExplanation.scientific || "The plan is based only on the provided text and avoids unconfirmed details.",
      innovationConnection: explanation.innovationConnection || localExplanation.innovationConnection || "This can help students see how a concept becomes a usable tool, model, or invention.",
      warnings: [
        ...asArray(explanation.warnings),
        ...asArray(localExplanation.warnings),
        ...fallbackWarnings
      ].filter(Boolean)
    },
    renderMode: plan.renderMode || localPlan.renderMode || requestPayload.renderMode || "local-pseudo-3d",
    providerMeta: {
      mode: plan.providerMeta?.mode || requestPayload.mode || "ai-assisted",
      provider: providerUsed,
      verifiedBy: plan.providerMeta?.verifiedBy || "SciLoop AI Backend",
      cached: Boolean(extras.cached),
      fallback: Boolean(extras.fallback)
    }
  };
}

function localUniversalVisualPlan(payload = {}, warnings = []) {
  const localPlan = asObject(payload.localPlan || payload.existingLocalPlan);
  if (Object.keys(localPlan).length) {
    return normalizeUniversalVisualPlan(localPlan, payload, "local-rule-engine", { fallback: true });
  }

  const title = payload.title || payload.article?.title || "SciLoop universal visual plan";
  const summary = payload.summary || payload.article?.summary || payload.newsText || payload.fullText || "";

  return normalizeUniversalVisualPlan({
    subject: payload.subject || "Applied Reality",
    title,
    rawText: summary || title,
    confidence: 0.45,
    matchedExamples: [],
    detected: {
      entities: ["input idea", "mechanism", "outcome"],
      processes: ["observe", "transform", "apply"],
      systems: ["reality system"],
      scale: "mixed",
      laws: [],
      variables: [],
      flows: ["cause to effect"],
      fields: [],
      signals: [],
      constraints: ["not enough source detail"],
      outcomes: ["visual explanation"],
      keywords: ["universal", "visual", "fallback"]
    },
    chosenTemplate: "Object Interaction Outcome",
    visualScene: {
      sceneType: "node-flow-scene",
      nodes: [
        { id: "idea", label: "Idea", type: "source" },
        { id: "mechanism", label: "Mechanism", type: "process" },
        { id: "impact", label: "Impact", type: "outcome" }
      ],
      connections: [
        { from: "idea", to: "mechanism", label: "explains" },
        { from: "mechanism", to: "impact", label: "unlocks" }
      ],
      flows: [{ from: "idea", to: "impact", label: "meaning path" }],
      stages: [
        { label: "Idea", description: "Start from the article or concept." },
        { label: "Mechanism", description: "Show the hidden rule or process." },
        { label: "Impact", description: "Show why it matters." }
      ],
      annotations: warnings,
      labels: ["Idea", "Mechanism", "Impact"],
      legend: [{ label: "Cyan", color: "#62f4ff", meaning: "known mechanism" }]
    },
    animationPlan: [
      "Glow the source idea.",
      "Move particles through the mechanism path.",
      "Pulse the impact node when the meaning appears."
    ],
    explanation: {
      simple: "This local plan converts the text into a simple visual cause-and-effect scene.",
      scientific: "AI refinement was not available, so the backend returned a safe local structure.",
      innovationConnection: "The scene can still become a local SVG/canvas visualization without exposing API keys.",
      warnings
    }
  }, payload, "local-rule-engine", { fallback: true });
}

export async function explainArticle({ article = {}, mode = "simple" } = {}) {
  const cacheKey = makeCacheKey("ai", { hash: textHash(article, mode) });
  const freshCache = await getCache(cacheKey);

  if (freshCache.hit) {
    return {
      ...freshCache.value,
      cached: true,
      fallback: false
    };
  }

  const staleCache = await getCache(cacheKey, { allowStale: true });
  const providers = getTextFailoverProviders();
  const warnings = [];

  for (const provider of providers.slice(0, MAX_PROVIDERS_PER_AI_REQUEST)) {
    const quota = await isProviderAllowed(provider);
    if (!quota.allowed) {
      warnings.push(`${provider.name} skipped: ${quota.reason}`);
      continue;
    }

    const request = provider.buildRequest({ article, mode });
    const result = await safeFetch(provider.id, request.url, request.options, {
      retries: 0,
      timeoutMs: AI_PROVIDER_TIMEOUT_MS,
    });

    if (!result.ok) {
      await recordFailure(provider, result);
      warnings.push(`${provider.name} failed: ${result.reason || result.status}`);
      console.warn(`[aiRouter] ${provider.id} failed, trying next provider`);
      continue;
    }

    try {
      const parsed = provider.parseResponse(result.data);
      const normalized = normalizeAiPayload(parsed, article, provider.id);
      await setCache(cacheKey, normalized, AI_CACHE_TTL_SECONDS);
      await recordSuccess(provider);
      console.log(`[aiRouter] explanation generated by ${provider.id}`);
      return normalized;
    } catch (error) {
      await recordFailure(provider, { reason: error.message });
      warnings.push(`${provider.name} returned bad AI data`);
    }
  }

  if (staleCache.hit) {
    return {
      ...staleCache.value,
      cached: true,
      fallback: false,
      warning: "All AI providers failed. Returning stale cached explanation.",
      warnings
    };
  }

  return {
    ...localExplanation(article),
    warnings: ["All AI providers failed or were unavailable.", ...warnings]
  };
}

export async function simulateArticle({ article = {}, explanation = "" } = {}) {
  const cacheKey = makeCacheKey("simulation", { hash: textHash(article, "simulation") });
  const freshCache = await getCache(cacheKey);

  if (freshCache.hit) {
    return {
      ...freshCache.value,
      cached: true,
      fallback: false
    };
  }

  const staleCache = await getCache(cacheKey, { allowStale: true });
  const providers = getTextFailoverProviders();
  const warnings = [];

  for (const provider of providers.slice(0, MAX_PROVIDERS_PER_AI_REQUEST)) {
    const quota = await isProviderAllowed(provider);
    if (!quota.allowed) {
      warnings.push(`${provider.name} skipped: ${quota.reason}`);
      continue;
    }

    const request = provider.buildRequest({ article, explanation, mode: "simulation" });
    const result = await safeFetch(provider.id, request.url, request.options, {
      retries: 0,
      timeoutMs: AI_PROVIDER_TIMEOUT_MS,
    });

    if (!result.ok) {
      await recordFailure(provider, result);
      warnings.push(`${provider.name} failed: ${result.reason || result.status}`);
      console.warn(`[aiRouter] ${provider.id} simulation failed, trying next provider`);
      continue;
    }

    try {
      const parsed = provider.parseResponse(result.data);
      const normalized = normalizeSimulationPayload(parsed, article, provider.id);
      await setCache(cacheKey, normalized, AI_CACHE_TTL_SECONDS);
      await recordSuccess(provider);
      console.log(`[aiRouter] simulation generated by ${provider.id}`);
      return normalized;
    } catch (error) {
      await recordFailure(provider, { reason: error.message });
      warnings.push(`${provider.name} returned bad simulation data`);
    }
  }

  if (staleCache.hit) {
    return {
      ...staleCache.value,
      cached: true,
      fallback: false,
      warning: "All AI providers failed. Returning stale cached simulation.",
      warnings
    };
  }

  return {
    ...localSimulation(article),
    warnings: ["All AI providers failed or were unavailable.", ...warnings]
  };
}

export async function biologyVisualPlan(payload = {}) {
  const preferredProvider = payload.provider || payload.preferredProvider || "auto";
  const cacheKey = makeCacheKey("biology-visual-plan", { hash: visualPlanHash(payload) });
  const freshCache = await getCache(cacheKey);

  if (freshCache.hit) {
    return {
      ...freshCache.value,
      cached: true,
      fallback: false
    };
  }

  const staleCache = await getCache(cacheKey, { allowStale: true });
  const providers = getBiologyVisualProviders(preferredProvider);
  const warnings = [];
  const article = {
    title: payload.title || payload.article?.title || payload.localPlan?.title || payload.existingLocalPlan?.title,
    summary: payload.summary || payload.article?.summary || payload.newsText || payload.fullText,
    source: payload.source || payload.article?.source,
    url: payload.url || payload.article?.url,
    publishedAt: payload.publishedAt || payload.article?.publishedAt
  };

  for (const provider of providers.slice(0, MAX_PROVIDERS_PER_AI_REQUEST)) {
    const quota = await isProviderAllowed(provider);
    if (!quota.allowed) {
      warnings.push(`${provider.name} skipped: ${quota.reason}`);
      continue;
    }

    const request = provider.buildRequest({
      ...payload,
      article,
      mode: "biology-visual-plan"
    });
    const result = await safeFetch(provider.id, request.url, request.options, {
      retries: 0,
      timeoutMs: AI_PROVIDER_TIMEOUT_MS
    });

    if (!result.ok) {
      await recordFailure(provider, result);
      warnings.push(`${provider.name} failed: ${result.reason || result.status}`);
      console.warn(`[aiRouter] ${provider.id} biology visual plan failed, trying next provider`);
      continue;
    }

    try {
      const parsed = provider.parseResponse(result.data);
      const visualPlan = normalizeBiologyVisualPlan(parsed, payload, provider.id);
      const response = {
        visualPlan,
        providerUsed: provider.id,
        cached: false,
        fallback: false,
        warnings
      };
      await setCache(cacheKey, response, AI_CACHE_TTL_SECONDS);
      await recordSuccess(provider);
      console.log(`[aiRouter] biology visual plan generated by ${provider.id}`);
      return response;
    } catch (error) {
      await recordFailure(provider, { reason: error.message });
      warnings.push(`${provider.name} returned bad biology visual plan data`);
    }
  }

  if (staleCache.hit) {
    return {
      ...staleCache.value,
      cached: true,
      fallback: false,
      warning: "All biology visual AI providers failed. Returning stale cached visual plan.",
      warnings
    };
  }

  return {
    visualPlan: localBiologyVisualPlan(payload, ["All biology visual AI providers failed or were unavailable.", ...warnings]),
    providerUsed: "local-rule-engine",
    cached: false,
    fallback: true,
    warnings: ["All biology visual AI providers failed or were unavailable.", ...warnings]
  };
}

export async function universalVisualPlan(payload = {}) {
  const preferredProvider = payload.provider || payload.preferredProvider || "auto";
  const cacheKey = makeCacheKey("universal-visual-plan", {
    hash: visualPlanHash({
      ...payload,
      task: "create-universal-visual-plan"
    })
  });
  const freshCache = await getCache(cacheKey);

  if (freshCache.hit) {
    return {
      ...freshCache.value,
      cached: true,
      fallback: false
    };
  }

  const staleCache = await getCache(cacheKey, { allowStale: true });
  const providers = getUniversalVisualProviders(preferredProvider);
  const warnings = [];
  const article = {
    title: payload.title || payload.article?.title || payload.localPlan?.title || payload.existingLocalPlan?.title,
    summary: payload.summary || payload.article?.summary || payload.newsText || payload.fullText,
    source: payload.source || payload.article?.source,
    url: payload.url || payload.article?.url,
    publishedAt: payload.publishedAt || payload.article?.publishedAt
  };

  for (const provider of providers.slice(0, MAX_PROVIDERS_PER_AI_REQUEST)) {
    const quota = await isProviderAllowed(provider);
    if (!quota.allowed) {
      warnings.push(`${provider.name} skipped: ${quota.reason}`);
      continue;
    }

    const request = provider.buildRequest({
      ...payload,
      article,
      mode: "universal-visual-plan"
    });
    const result = await safeFetch(provider.id, request.url, request.options, {
      retries: 0,
      timeoutMs: AI_PROVIDER_TIMEOUT_MS
    });

    if (!result.ok) {
      await recordFailure(provider, result);
      warnings.push(`${provider.name} failed: ${result.reason || result.status}`);
      console.warn(`[aiRouter] ${provider.id} universal visual plan failed, trying next provider`);
      continue;
    }

    try {
      const parsed = provider.parseResponse(result.data);
      const visualPlan = normalizeUniversalVisualPlan(parsed, payload, provider.id);
      const response = {
        visualPlan,
        providerUsed: provider.id,
        cached: false,
        fallback: false,
        warnings
      };
      await setCache(cacheKey, response, AI_CACHE_TTL_SECONDS);
      await recordSuccess(provider);
      console.log(`[aiRouter] universal visual plan generated by ${provider.id}`);
      return response;
    } catch (error) {
      await recordFailure(provider, { reason: error.message });
      warnings.push(`${provider.name} returned bad universal visual plan data`);
    }
  }

  if (staleCache.hit) {
    return {
      ...staleCache.value,
      cached: true,
      fallback: false,
      warning: "All universal visual AI providers failed. Returning stale cached visual plan.",
      warnings
    };
  }

  return {
    visualPlan: localUniversalVisualPlan(payload, ["All universal visual AI providers failed or were unavailable.", ...warnings]),
    providerUsed: "local-rule-engine",
    cached: false,
    fallback: true,
    warnings: ["All universal visual AI providers failed or were unavailable.", ...warnings]
  };
}

export async function generateStructuredJson({ systemPrompt, userPrompt, preferredProvider = "auto" } = {}) {
  if (!systemPrompt || !userPrompt) throw new Error("Structured JSON generation requires systemPrompt and userPrompt.");

  const warnings = [];
  const providers = getStructuredJsonProviders(preferredProvider);
  for (const provider of providers.slice(0, MAX_PROVIDERS_PER_AI_REQUEST)) {
    const quota = await isProviderAllowed(provider);
    if (!quota.allowed) {
      warnings.push(`${provider.name} skipped: ${quota.reason}`);
      continue;
    }

    const request = provider.buildRequest({
      article: { title: "Quantum Possibilities structured request", summary: userPrompt },
      mode: "structured-json",
      prompt: userPrompt,
      systemPrompt,
      userPrompt,
      fullText: userPrompt,
    });
    const result = await safeFetch(provider.id, request.url, request.options, {
      retries: 0,
      timeoutMs: AI_PROVIDER_TIMEOUT_MS,
    });

    if (!result.ok) {
      await recordFailure(provider, result);
      warnings.push(`${provider.name} failed: ${result.reason || result.status}`);
      continue;
    }

    const parsed = provider.parseResponse(result.data);
    const content = parsed && typeof parsed === "object" && !parsed.explanation
      ? JSON.stringify(parsed)
      : "";
    if (!content) {
      await recordFailure(provider, { reason: "provider returned non-JSON structured output" });
      warnings.push(`${provider.name} returned non-JSON structured output`);
      continue;
    }

    await recordSuccess(provider);
    return {
      content,
      providerUsed: provider.id,
      attemptedProviders: [...warnings, provider.name],
      warnings,
    };
  }

  throw new Error(`All structured JSON providers failed. ${warnings.join(" | ") || "No enabled providers."}`);
}
