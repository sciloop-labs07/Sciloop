const DEFAULT_FORLOOP_API_BASE = "http://localhost:3001";
const DEFAULT_FORLOOP_ACCESS_CODE = "123456";
const FEEDBACK_STORAGE_KEY = "forloop_feedback_notes";
const API_BASE_STORAGE_KEY = "forloopApiBase";
const UNLOCK_STORAGE_KEY = "forloop_session_unlocked";
const DEMO_STORAGE_KEY = "forloop_demo_mode";
const SCILOOP_RUNTIME_STATE_KEY = "sciloop_runtime_state_v1";

const SECTION_NAMES = [
  "Overview",
  "Services",
  "Runtime Console",
  "Portal Registry",
  "AI Pipeline",
  "SciLoop AI Panel",
  "Unity AI Bridge",
  "AI Test Lab",
  "Story Builder Lab",
  "News Pipeline Lab",
  "Simulation Planner",
  "Feedback Inspector",
  "Dev Report Exporter",
  "Action History / Logs",
  "Production Readiness",
  "Settings",
];

const PORTALS = [
  ["SciLoop Nexus", "Main entry surface for the broader SciLoop ecosystem.", "Active", "Low"],
  ["Platform Guide", "Explains portals and user pathways.", "Beta", "Low"],
  ["Timeless Problems Lab", "Frames big problems as exploration prompts.", "Experimental", "Medium"],
  ["Potential Explorer", "Maps invention opportunities for users.", "Beta", "Medium"],
  ["Reality Sandbox", "Lets users probe world variables.", "Active", "Medium"],
  ["News Portal", "Transforms science developments into understandable stories.", "Needs API", "High"],
  ["Hall of Builders", "Highlights inventors and scientific builders.", "Beta", "Low"],
  ["Mini Experiment Lab", "Guided experiments and short exercises.", "Experimental", "Medium"],
  ["Impact Hub", "Shows societal effects of discoveries.", "Beta", "Medium"],
  ["Local Problem Solver", "Connects community issues to innovation pathways.", "Needs API", "High"],
  ["Visual Language Engine", "Browser-native semantic simulations for causal visual reasoning.", "Active", "Medium"],
  ["Feedback Portal", "Collects user notes and reports.", "Active", "Low"],
];

const PIPELINE_STEPS = [
  ["Raw News Input", "Incoming science and innovation feeds enter the loop.", "Standby"],
  ["Source Filtering", "Weak, duplicate, or noisy signals get screened out.", "Standby"],
  ["AI Simplification", "Dense reports are rewritten into readable explanations.", "Standby"],
  ["Story/Emoji Compression", "Narrative payload is condensed into memorable story form.", "Standby"],
  ["Simulation Prompt", "Ideas are translated into visual or interactive scene prompts.", "Local"],
  ["Semantic Graph", "Concepts become entities, variables, flows, and causal relations.", "Local"],
  ["User Output", "Nothing reaches SciLoop users until reviewed.", "Unknown"],
  ["Feedback Signal", "Developers inspect feedback before downstream changes.", "Local"],
  ["Developer Iteration", "ForLoop operators decide the next safe action.", "Ready"],
];

const CHECKLIST_ITEMS = [
  ["Add real admin authentication", "Not Started", "Protects developer tools from unauthorized access.", "Replace the local access code with authenticated admin sessions."],
  ["Restrict admin routes behind auth", "Planned", "API routes should be protected, not just the frontend shell.", "Apply auth middleware to /api/admin routes."],
  ["Configure secure CORS", "Local Only", "Production should only trust known admin origins.", "Replace local dev origin list with environment-specific allowlists."],
  ["Move secrets only to backend env", "Ready", "Frontend must never expose provider secrets.", "Keep keys in backend-only env files."],
  ["Add persistent logging", "Not Started", "In-memory logs disappear on restart.", "Store audit logs in a safe backend system."],
  ["Add database-backed feedback store", "Not Started", "Local notes are not enough for shared review.", "Create a safe feedback persistence layer."],
  ["Add rate limits to admin test endpoints", "Planned", "Protects cost and abuse surfaces.", "Add per-endpoint local and production rate limits."],
  ["Add audit logs for developer actions", "Planned", "Production review needs traceability.", "Differentiate user actions from automated system events."],
  ["Add deployment environment separation", "Local Only", "Dev and production behaviors must be isolated.", "Split local, staging, and production admin configs."],
  ["Add real monitoring and alerting", "Not Started", "ForLoop should eventually observe live operational signals.", "Integrate uptime and alert tooling."],
  ["Add API provider cost limits", "Not Started", "Protects budgets before enabling real models.", "Add per-provider quotas and spend caps."],
  ["Add safe publish approval workflow", "Not Started", "Nothing should auto-publish into SciLoop.", "Require explicit review and approval for publish flows."],
];

const SETTINGS = [
  ["Environment", "environment", ["Local", "Staging", "Production"], "Local"],
  ["AI Provider", "aiProvider", ["Gemini", "Groq", "HuggingFace", "Custom", "Mock"], "Mock"],
  ["News Mode", "newsMode", ["Manual", "Scheduled", "Live"], "Manual"],
  ["Simulation Mode", "simulationMode", ["Template", "AI Assisted", "Full Engine"], "Template"],
  ["Logging Level", "loggingLevel", ["Basic", "Detailed", "Debug"], "Basic"],
];

const SCILOOP_AI_PROVIDER_FALLBACK = [
  ["gemini", "Google AI Studio Gemini", "Master planner, structure, explanation, final synthesis", "GEMINI_API_KEY"],
  ["groq", "GroqCloud", "Ultra-fast responses, formatting, quick summaries", "GROQ_API_KEY"],
  ["deepseek", "DeepSeek", "Deep reasoning and step-by-step logic", "DEEPSEEK_API_KEY"],
  ["cohere", "Cohere", "Embeddings, semantic search, similarity memory", "COHERE_API_KEY"],
  ["witai", "Wit.ai", "Intent extraction from user text into structured commands", "WIT_AI_TOKEN"],
  ["huggingface", "Hugging Face Inference", "Entity extraction, classification, parser layer", "HUGGINGFACE_API_KEY"],
  ["stability", "Stability AI", "Image generation for scenes and concepts", "STABILITY_API_KEY"],
  ["clarifai", "Clarifai", "Image understanding and visual verification", "CLARIFAI_PAT"],
  ["puter", "Puter.js", "Client-side AI offload to the user's device/session", null],
  ["assemblyai", "AssemblyAI", "Speech-to-text expansion for voice input", "ASSEMBLYAI_API_KEY"],
  ["githubModels", "GitHub Models", "Development experiments and model comparison", "GITHUB_TOKEN"],
].map(([id, name, role, keyName]) => ({
  id,
  name,
  role,
  keyName,
  configured: false,
  maskedKey: keyName ? "" : "no key needed",
  check: {
    id,
    status: keyName ? "missing_key" : "pending",
    message: keyName ? `${name} key has not been saved yet.` : "Puter.js runtime has not been checked yet.",
    checkedAt: null,
  },
}));

const SCILOOP_AI_MIN_READY_TO_START = 3;

const state = {
  activeSection: "Overview",
  apiBase: localStorage.getItem(API_BASE_STORAGE_KEY) || DEFAULT_FORLOOP_API_BASE,
  unlocked: sessionStorage.getItem(UNLOCK_STORAGE_KEY) === "true",
  demoMode: sessionStorage.getItem(DEMO_STORAGE_KEY) === "true",
  connection: {
    backendUrl: localStorage.getItem(API_BASE_STORAGE_KEY) || DEFAULT_FORLOOP_API_BASE,
    mode: "Local fallback",
    lastSuccessfulCheck: "Never",
    lastError: "Not checked yet",
  },
  access: {
    gateEnabled: true,
    mode: "local",
  },
  accessCode: "",
  backend: {
    health: null,
    services: [],
    ai: null,
    news: null,
    simulation: null,
    feedback: null,
    logs: [],
  },
  runtime: {
    status: null,
    logs: [],
    lastAction: "No runtime action yet.",
  },
  sciloopAi: {
    status: null,
    busy: false,
    lastMessage: "SciLoop AI Panel is waiting for a refresh.",
  },
  unityAi: {
    status: null,
    latestScene: null,
    testResult: null,
    busy: false,
    lastMessage: "Unity AI Bridge is waiting for a refresh.",
  },
  labs: {
    ai: null,
    story: null,
    news: null,
    simulation: null,
  },
  feedbackNotes: readJsonStorage(FEEDBACK_STORAGE_KEY, []),
  logFilterLevel: "all",
  logFilterSource: "all",
  localLogs: [],
  toasts: [],
};

seedInitialLogs();

function readJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveFeedbackNotes() {
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(state.feedbackNotes));
}

function readSharedRuntimeState() {
  return readJsonStorage(SCILOOP_RUNTIME_STATE_KEY, {});
}

function writeSharedRuntimeState(patch = {}) {
  try {
    const current = readSharedRuntimeState();
    const next = {
      ...current,
      ...patch,
      source: "forloop-control-panel",
      forloopApiBase: state.apiBase,
      backendUrl: "http://localhost:5050",
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(SCILOOP_RUNTIME_STATE_KEY, JSON.stringify(next));
  } catch (_error) {
    // Standalone file mode should keep working even if local storage is unavailable.
  }
}

function statusTone(value) {
  const safe = String(value || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (["online", "ready", "ok", "clean", "local", "mock", "template", "demo-online", "running", "external-online"].includes(safe)) return safe;
  if (["warn", "pending", "standby", "unknown", "local-only", "planned", "local-only-ready"].includes(safe)) return safe;
  if (["error", "offline", "missing-key", "not-started", "stopped", "missing", "quota-limit"].includes(safe)) return safe;
  return "unknown";
}

function metricPercent(status) {
  const tone = statusTone(status);
  if (["online", "ready", "ok", "clean", "local", "mock", "template", "demo-online", "running", "external-online"].includes(tone)) return 92;
  if (["warn", "pending", "standby", "unknown", "local-only", "planned"].includes(tone)) return 56;
  return 18;
}

function formatTime(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function sanitizeText(value, max = 3000) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

function pushToast(level, message) {
  const id = `${Date.now()}-${Math.random()}`;
  state.toasts.push({ id, level, message });
  renderToasts();
  setTimeout(() => {
    state.toasts = state.toasts.filter((toast) => toast.id !== id);
    renderToasts();
  }, 3200);
}

function addLocalLog(level, source, message) {
  state.localLogs.unshift({
    level,
    source,
    message,
    timestamp: new Date().toISOString(),
  });
  if (state.localLogs.length > 200) state.localLogs.length = 200;
  renderLogs();
}

function runtimeRequestHeaders() {
  return {
    "Content-Type": "application/json",
    "X-ForLoop-Access-Code": state.accessCode,
  };
}

function seedInitialLogs() {
  [
    ["info", "system", "ForLoop control panel loaded."],
    ["info", "system", "Running in developer-only local mode."],
    ["info", "system", "SciLoop frontend not modified."],
    ["warn", "system", "Backend health check not connected yet."],
    ["warn", "ai", "AI provider test not connected yet."],
    ["info", "system", "Developer mission control ready for command 4."],
  ].forEach(([level, source, message]) => {
    state.localLogs.push({ level, source, message, timestamp: new Date().toISOString() });
  });
}

function createNode(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function withElement(id, callback) {
  const element = document.getElementById(id);
  if (!element) return null;
  callback(element);
  return element;
}

function renderToasts() {
  const region = document.getElementById("toast-region");
  region.innerHTML = "";
  state.toasts.forEach((toast) => {
    const item = createNode("div", `toast status-${statusTone(toast.level)}`);
    item.textContent = toast.message;
    region.appendChild(item);
  });
}

async function requestJson(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${state.apiBase.replace(/\/$/, "")}${path}`, {
      ...options,
      signal: controller.signal,
    });
    const text = await response.text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      throw new Error("Invalid JSON response.");
    }
    if (!response.ok || payload?.ok === false) {
      throw new Error(payload?.error || "Backend request failed.");
    }
    return payload.data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out.");
    }
    if (/Failed to fetch/i.test(error.message)) {
      throw new Error("Backend offline or blocked by CORS.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

const api = {
  getAccessConfig: () => requestJson("/api/admin/access-config"),
  verifyAccess: (code) =>
    requestJson("/api/admin/verify-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }),
  getHealth: () => requestJson("/api/health"),
  getServices: () => requestJson("/api/admin/services"),
  getAIStatus: () => requestJson("/api/admin/ai-status"),
  getNewsStatus: () => requestJson("/api/admin/news-status"),
  getSimulationStatus: () => requestJson("/api/admin/simulation-status"),
  getFeedbackStatus: () => requestJson("/api/admin/feedback-status"),
  getFeedbackList: () => requestJson("/api/admin/feedback-list"),
  getLogs: () => requestJson("/api/admin/logs"),
  getRuntimeStatus: () => requestJson("/api/admin/runtime/status"),
  getRuntimeLogs: () => requestJson("/api/admin/runtime/logs"),
  startRuntimeTarget: (targetId) =>
    requestJson("/api/admin/runtime/start", {
      method: "POST",
      headers: runtimeRequestHeaders(),
      body: JSON.stringify({ targetId }),
    }),
  stopRuntimeTarget: (targetId) =>
    requestJson("/api/admin/runtime/stop", {
      method: "POST",
      headers: runtimeRequestHeaders(),
      body: JSON.stringify({ targetId }),
    }),
  restartRuntimeTarget: (targetId) =>
    requestJson("/api/admin/runtime/restart", {
      method: "POST",
      headers: runtimeRequestHeaders(),
      body: JSON.stringify({ targetId }),
    }),
  getSciloopAiStatus: () => requestJson("/api/admin/sciloop-ai/status"),
  saveSciloopAiKeys: (keys) =>
    requestJson("/api/admin/sciloop-ai/keys", {
      method: "POST",
      headers: runtimeRequestHeaders(),
      body: JSON.stringify({ keys }),
    }),
  checkSciloopAiProvider: (providerId) =>
    requestJson("/api/admin/sciloop-ai/check-provider", {
      method: "POST",
      headers: runtimeRequestHeaders(),
      body: JSON.stringify({ providerId }),
    }),
  checkAllSciloopAiProviders: () =>
    requestJson("/api/admin/sciloop-ai/check-all", {
      method: "POST",
      headers: runtimeRequestHeaders(),
      body: JSON.stringify({}),
    }),
  startSciloopAiServer: () =>
    requestJson("/api/admin/sciloop-ai/start-server", {
      method: "POST",
      headers: runtimeRequestHeaders(),
      body: JSON.stringify({}),
    }),
  startFullSciLoop: () =>
    requestJson("/api/admin/sciloop-ai/start-all", {
      method: "POST",
      headers: runtimeRequestHeaders(),
      body: JSON.stringify({}),
    }),
  getUnityAiStatus: () => requestJson("/api/admin/unity-ai/status"),
  generateUnityAiTest: (payload) =>
    requestJson("/api/admin/unity-ai/generate-test", {
      method: "POST",
      headers: runtimeRequestHeaders(),
      body: JSON.stringify(payload),
    }),
  runAIExplainTest: (input, style, provider) =>
    requestJson("/api/admin/ai-explain-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, style, provider }),
    }),
  runStoryPreview: (input, format) =>
    requestJson("/api/admin/story-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, format }),
    }),
  runNewsDryRun: (payload) =>
    requestJson("/api/admin/news-dry-run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  parseNewsText: (payload) =>
    requestJson("/api/admin/news-parse-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  generateSimulationPlan: (payload) =>
    requestJson("/api/admin/simulation-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};

function mockAIResult(input, style) {
  return {
    mode: state.demoMode ? "demo" : "mock",
    provider: state.demoMode ? "demo-sample" : "mock",
    style,
    inputChars: input.length,
    output: {
      title: state.demoMode ? "Demo Explanation Preview" : "Mock Explanation Preview",
      summary: "This is a deterministic developer preview. No paid AI call was made.",
      keyPoints: [
        input ? `Input topic detected: ${input.slice(0, 120)}.` : "No input detected.",
        "Explanation output is safe for review only.",
        "Nothing was published to SciLoop users.",
      ],
      whyItMatters: "Developers can inspect output shape without depending on live providers.",
      limitations: "Local fallback or demo mode only.",
    },
    timestamp: new Date().toISOString(),
  };
}

function mockStoryResult(input, format) {
  return {
    mode: state.demoMode ? "demo" : "mock",
    story: {
      title: "Discovery Story Preview",
      hook: "A difficult concept becomes easier to hold when turned into a guided story frame.",
      timeline: [
        { step: "Problem", text: "The topic begins as a dense or abstract challenge." },
        { step: "Experiment", text: input.slice(0, 180) || "No developer text supplied." },
        { step: "Breakthrough", text: "ForLoop translates the idea into a safe preview structure." },
        { step: "Impact", text: "Developers can review tone and sequence before SciLoop users ever see it." },
      ],
      peopleOrTeams: "Not extracted in fallback/demo mode.",
      breakthroughMechanism: "Deterministic story scaffolding.",
      impact: "Useful for reviewing narrative framing.",
      visualSimulationIdea: "Show puzzle, experiment, and visible result states.",
      emojiLine: "🧩 -> 🧪 -> ⚡ -> 🌍",
      formatLabel: format,
    },
  };
}

function mockNewsResult(payload) {
  return {
    mode: state.demoMode ? "demo" : "mock",
    items: [
      {
        title: payload.input.split(" ").slice(0, 8).join(" ") || `${payload.category} Mock Discovery`,
        category: payload.category,
        source: payload.sourceMode === "manual" ? "Manual Text" : state.demoMode ? "Demo Source" : "Mock Source",
        relevanceScore: state.demoMode ? 88 : 84,
        duplicateRisk: "low",
        summaryReady: true,
        publishReady: false,
        warnings: ["Dry run only. Not published."],
      },
    ],
  };
}

function mockSimulationResult(payload) {
  return {
    mode: state.demoMode ? "demo" : "template",
    plan: {
      sceneTitle: state.demoMode ? "Demo Simulation Plan" : "Simulation Plan Preview",
      learningGoal: `Show how ${payload.topic || "the selected topic"} could be explained visually.`,
      objects: ["main actor", "reference object", "control overlay"],
      lawsShown: ["cause and effect", "state change", "observable relationship"],
      visualSteps: [
        "Start from a neutral scene.",
        "Introduce the main entities.",
        "Animate the central scientific change.",
        "Expose one control developers can vary.",
      ],
      userControls: ["mode toggle", "speed slider", "focus selector"],
      limitations: "Template or demo plan only. No renderer was invoked.",
      futureUpgrade: "Connect to a real renderer in a later phase.",
      level: payload.level,
      domain: payload.domain,
    },
  };
}

function demoBackendState() {
  return {
    health: {
      status: "ok",
      mode: "demo",
      timestamp: new Date().toISOString(),
      checks: {},
    },
    services: [
      { id: "frontend", name: "SciLoop Frontend", status: "demo_online", purpose: "User-facing portal interface", lastCheck: new Date().toISOString(), risk: "low" },
      { id: "backend", name: "Backend API", status: "demo_online", purpose: "Developer monitoring API", lastCheck: new Date().toISOString(), risk: "medium" },
      { id: "ai", name: "AI Story Engine", status: "mock", purpose: "Developer preview mode", lastCheck: new Date().toISOString(), risk: "medium" },
      { id: "news", name: "News Engine", status: "mock", purpose: "Developer preview mode", lastCheck: new Date().toISOString(), risk: "medium" },
      { id: "simulation", name: "Simulation Engine", status: "template", purpose: "Simulation planning mode", lastCheck: new Date().toISOString(), risk: "high" },
      { id: "feedback", name: "Feedback Collector", status: "local_only", purpose: "Local review notes", lastCheck: new Date().toISOString(), risk: "medium" },
    ],
    ai: {
      provider: "demo",
      configured: true,
      status: "mock",
      model: "demo-sample",
      testMode: "manual_only_disabled",
      message: "Demo mode enabled. No real systems were called.",
      lastChecked: new Date().toISOString(),
    },
    news: {
      status: "mock",
      mode: "manual",
      sourcesConfigured: 0,
      lastFetch: null,
      queueSize: 0,
      message: "Demo mode enabled. No live fetch performed.",
      lastChecked: new Date().toISOString(),
    },
    simulation: {
      status: "template",
      mode: "demo",
      templates: ["physics", "biology", "chemistry", "cosmic", "mini-experiment"],
      queueSize: 0,
      message: "Demo mode enabled. No renderer was invoked.",
      lastChecked: new Date().toISOString(),
    },
    feedback: {
      status: "local_only",
      message: "Demo mode uses local feedback notes only.",
      knownCount: state.feedbackNotes.length,
      lastChecked: new Date().toISOString(),
    },
  };
}

function mockSciloopAiStatus() {
  const providers = SCILOOP_AI_PROVIDER_FALLBACK.map((provider) => ({
    ...provider,
    configured: true,
    maskedKey: provider.keyName ? "demo...key" : "no key needed",
    check: {
      id: provider.id,
      status: "ready",
      message: "Demo mode sample check is green.",
      checkedAt: new Date().toISOString(),
    },
  }));

  return {
    providers,
    readiness: {
      ready: true,
      backend: { reachable: true },
      checks: [
        ["node", "Node.js", "ready", "Demo Node.js check is green."],
        ["npm", "npm", "ready", "Demo npm check is green."],
        ["backend-folder", "Backend folder", "ready", "Demo backend folder check is green."],
        ["dependencies", "Dependencies", "ready", "Demo dependency check is green."],
        ["env", "Local .env", "ready", "Demo .env check is green."],
        ["port-5050", "Port 5050", "running", "Demo backend is shown as reachable."],
      ].map(([id, label, status, message]) => ({ id, label, status, message })),
    },
    allProvidersReady: true,
    enoughProvidersReady: true,
    minReadyProvidersToStart: SCILOOP_AI_MIN_READY_TO_START,
    canStart: false,
    requiredCount: providers.length,
    readyCount: providers.length,
    backendUrl: "http://localhost:5050",
    updatedAt: new Date().toISOString(),
  };
}

function setUnlocked(nextValue) {
  state.unlocked = nextValue;
  if (nextValue) {
    sessionStorage.setItem(UNLOCK_STORAGE_KEY, "true");
  } else {
    sessionStorage.removeItem(UNLOCK_STORAGE_KEY);
  }
  renderGate();
}

function setDemoMode(nextValue) {
  state.demoMode = nextValue;
  if (nextValue) {
    sessionStorage.setItem(DEMO_STORAGE_KEY, "true");
    writeSharedRuntimeState({
      demoMode: true,
      liveMode: false,
      providerBadge: "Demo mode active",
      runtimeBadge: "Demo mode",
      runtimeState: "Demo mode active",
      runtimeDetail: "ForLoop is using sample data. Start SciLoop AI to switch back to live local mode.",
      viewportStatus: "Demo simulation active",
      viewportDetail: "Live backend checks are paused while demo mode is enabled.",
    });
    addLocalLog("info", "system", "Demo mode enabled. No real systems were called.");
    pushToast("info", "Demo mode enabled.");
  } else {
    sessionStorage.removeItem(DEMO_STORAGE_KEY);
    writeSharedRuntimeState({
      demoMode: false,
      liveMode: true,
      providerBadge: "SciLoop AI backend standby",
      runtimeBadge: "ForLoop linked",
      runtimeState: "Live local runtime standby",
      runtimeDetail: "SciLoop is waiting for a live backend health check.",
      viewportStatus: "Live handoff armed",
      viewportDetail: "Open SciLoop and press Start to connect the page to the local backend.",
    });
    addLocalLog("info", "system", "Demo mode disabled.");
    pushToast("info", "Demo mode disabled.");
  }
  renderMiniStatus();
  renderHeaderStatus();
  renderOverview();
  renderServices();
  renderConnectionPanel();
  renderTimeline();
  renderAIMeta();
  renderFeedback();
  renderReportPreview();
  renderLogs();
}

function renderGate() {
  document.getElementById("access-gate").hidden = state.unlocked;
  document.getElementById("forloop-app").hidden = !state.unlocked;
}

function renderMiniStatus() {
  const host = document.getElementById("mini-status");
  host.innerHTML = "";
  const title = createNode("h2", "", state.demoMode ? "Demo mode active" : "ForLoop local mission status");
  const detail = createNode(
    "p",
    "section-copy",
    state.demoMode
      ? "All labs are using sample data. No real systems are being called."
      : `${state.connection.mode}. Backend URL: ${state.connection.backendUrl}`,
  );
  host.append(title, detail);
}

function renderHeaderStatus() {
  const source = state.demoMode ? demoBackendState() : state.backend;
  const services = source.services || [];
  const frontend = services.find((item) => item.id === "frontend");
  const statuses = [
    ["SCI LOOP FRONTEND", frontend?.status || "unknown"],
    ["BACKEND", source.health?.status === "ok" ? (state.demoMode ? "demo_online" : "online") : "offline"],
    ["AI ENGINE", source.ai?.status || "standby"],
    ["NEWS ENGINE", source.news?.status || "standby"],
    ["SIMULATION ENGINE", source.simulation?.status || "standby"],
  ];
  const host = document.getElementById("status-chip-grid");
  host.innerHTML = "";
  statuses.forEach(([label, value]) => {
    const chip = createNode("span", `status-chip status-${statusTone(value)}`);
    chip.textContent = `${label}: ${String(value).toUpperCase()}`;
    host.appendChild(chip);
  });
}

function renderSidebar() {
  const host = document.getElementById("section-nav");
  host.innerHTML = "";
  document.querySelectorAll("[data-section]").forEach((panel) => {
    panel.hidden = panel.getAttribute("data-section") !== state.activeSection;
  });
  SECTION_NAMES.forEach((section) => {
    const button = createNode("button", `nav-button${state.activeSection === section ? " is-active" : ""}`, section);
    button.type = "button";
    button.dataset.section = section;
    button.setAttribute("aria-current", state.activeSection === section ? "page" : "false");
    button.addEventListener("click", () => {
      state.activeSection = section;
      document.querySelectorAll("[data-section]").forEach((panel) => {
        panel.hidden = panel.getAttribute("data-section") !== section;
      });
      renderSidebar();
      addLocalLog("info", "system", `${section} panel opened.`);
    });
    host.appendChild(button);
  });
}

function renderOverview() {
  const source = state.demoMode ? demoBackendState() : state.backend;
  const overview = [
    ["SciLoop Frontend", "Ready", "User-facing platform detected or prepared for monitoring."],
    ["Backend API", source.health?.status === "ok" ? "Online" : "Offline", state.demoMode ? "Demo backend state active." : `Backend mode: ${source.health?.mode || "local fallback"}.`],
    ["AI Engine", source.ai?.status || "Standby", source.ai?.message || "Provider readiness will appear here."],
    ["News Engine", source.news?.status || "Standby", source.news?.message || "News engine readiness will appear here."],
    ["Simulation Engine", source.simulation?.status || "Local", source.simulation?.message || "Simulation readiness will appear here."],
    ["Feedback Flow", source.feedback?.status || "Local", source.feedback?.message || "Feedback readiness will appear here."],
    ["Error Monitor", state.connection.lastError === "None" ? "Clean" : "Warn", state.connection.lastError],
    ["Next Action", state.demoMode ? "Inspect Demo" : "Run Diagnostics", state.demoMode ? "Demo mode is safe for walkthroughs." : "Use labs to inspect outputs before user exposure."],
  ];
  const host = document.getElementById("overview-grid");
  host.innerHTML = "";
  overview.forEach(([title, value, text]) => {
    const card = createNode("article", "metric-card");
    card.appendChild(createNode("h3", "", title));
    card.appendChild(createNode("div", `metric-value status-${statusTone(value)}`, value));
    card.appendChild(createNode("p", "", text));
    host.appendChild(card);
  });
  renderMeters(source);
}

function renderMeters(source) {
  const host = document.getElementById("meter-grid");
  host.innerHTML = "";
  [
    ["Backend Reachability", source.health?.status === "ok" ? (state.demoMode ? "demo_online" : "online") : "offline", state.connection.mode],
    ["AI Readiness", source.ai?.status || "standby", source.ai?.provider || "Mock only"],
    ["News Readiness", source.news?.status || "standby", source.news?.mode || "manual"],
    ["Simulation Readiness", source.simulation?.status || "template", source.simulation?.mode || "template"],
    ["Feedback Readiness", source.feedback?.status || "local_only", `${state.feedbackNotes.length} local notes`],
    ["Error Level", state.connection.lastError === "None" ? "clean" : "warn", state.connection.lastError],
  ].forEach(([label, status, detail]) => {
    const card = createNode("article", "meter-card");
    card.appendChild(createNode("h3", "", label));
    card.appendChild(createNode("div", `service-chip status-${statusTone(status)}`, String(status).toUpperCase()));
    const bar = createNode("div", "meter-bar");
    const fill = createNode("span", "meter-fill");
    fill.style.width = `${metricPercent(status)}%`;
    bar.appendChild(fill);
    card.appendChild(bar);
    const meta = createNode("div", "meter-meta");
    meta.append(createNode("span", "", `${metricPercent(status)}%`), createNode("span", "", detail));
    card.appendChild(meta);
    host.appendChild(card);
  });
}

function renderConnectionPanel() {
  const host = document.getElementById("connection-grid");
  host.innerHTML = "";
  [
    ["Backend URL", state.connection.backendUrl],
    ["Mode", state.demoMode ? "Demo Mode" : state.connection.mode],
    ["Last Successful Check", state.connection.lastSuccessfulCheck],
    ["Last Error", state.connection.lastError],
  ].forEach(([title, text]) => {
    const card = createNode("article", "connection-card");
    card.appendChild(createNode("h3", "", title));
    card.appendChild(createNode("p", "", text));
    host.appendChild(card);
  });
}

function renderTimeline() {
  const source = state.demoMode ? demoBackendState() : state.backend;
  const host = document.getElementById("timeline-list");
  host.innerHTML = "";
  const items = [
    ["Backend health", source.health?.status, source.health?.timestamp],
    ["AI readiness", source.ai?.status, source.ai?.lastChecked],
    ["News engine", source.news?.status, source.news?.lastChecked],
    ["Simulation engine", source.simulation?.status, source.simulation?.lastChecked],
    ["Feedback readiness", source.feedback?.status, source.feedback?.lastChecked],
  ].filter((item) => item[1]);
  if (!items.length) {
    host.appendChild(createNode("div", "empty-state", "No live checks yet."));
    return;
  }
  items.forEach(([title, status, time]) => {
    const card = createNode("article", "timeline-card");
    card.appendChild(createNode("h3", "", title));
    card.appendChild(createNode("p", "", `${status} at ${formatTime(time)}`));
    host.appendChild(card);
  });
}

function renderServices() {
  const source = state.demoMode ? demoBackendState().services : state.backend.services;
  const host = document.getElementById("services-grid");
  host.innerHTML = "";
  (source?.length ? source : []).forEach((service) => {
    const card = createNode("article", "service-card");
    const top = createNode("div", "service-top");
    const textWrap = createNode("div");
    textWrap.append(createNode("h3", "", service.name), createNode("p", "", service.purpose));
    top.append(textWrap, createNode("span", `service-chip status-${statusTone(service.status)}`, service.status));
    card.appendChild(top);
    const meta = createNode("div", "meta-stack");
    meta.appendChild(createNode("p", "meta-row", `Last check: ${formatTime(service.lastCheck || service.lastChecked)}`));
    card.appendChild(meta);
    host.appendChild(card);
  });
}

function renderRuntimeConsole() {
  const grid = document.getElementById("runtime-target-grid");
  const stream = document.getElementById("runtime-terminal-stream");
  if (!grid || !stream) return;

  grid.innerHTML = "";
  stream.innerHTML = "";

  const targets = state.demoMode
    ? [
        {
          id: "demo-runtime",
          name: "Demo Runtime",
          type: "demo",
          status: "demo_online",
          purpose: "Sample runtime target for walkthroughs.",
          commandLabel: "demo mode",
          url: "not connected",
          message: "Demo mode is enabled. No real systems are called.",
          canStart: false,
          canStop: false,
          canRestart: false,
        },
      ]
    : state.runtime.status?.targets || [];

  if (!targets.length) {
    grid.appendChild(createNode("div", "empty-state", "No runtime status loaded yet. Use Refresh Runtime Status."));
  }

  targets.forEach((target) => {
    const card = createNode("article", "runtime-target-card");
    const top = createNode("div", "service-top");
    const copy = createNode("div");
    copy.append(createNode("h3", "", target.name), createNode("p", "", target.purpose));
    top.append(copy, createNode("span", `service-chip status-${statusTone(target.status)}`, target.status));
    card.appendChild(top);

    const meta = createNode("div", "meta-stack");
    meta.append(
      createNode("p", "meta-row", `Target: ${target.id}`),
      createNode("p", "meta-row", `Command: ${target.commandLabel || "not applicable"}`),
      createNode("p", "meta-row", `URL: ${target.url || "not available"}`),
      createNode("p", "meta-row", target.message || "No runtime message."),
    );
    card.appendChild(meta);

    const actions = createNode("div", "tool-actions runtime-actions");
    [
      ["Start", "start", target.canStart],
      ["Stop", "stop", target.canStop],
      ["Restart", "restart", target.canRestart],
    ].forEach(([label, action, enabled]) => {
      const button = createNode("button", action === "stop" ? "danger-button" : "secondary-button", label);
      button.type = "button";
      button.dataset.runtimeAction = action;
      button.dataset.targetId = target.id;
      button.disabled = !enabled || state.demoMode;
      actions.appendChild(button);
    });
    card.appendChild(actions);
    grid.appendChild(card);
  });

  const logs = state.demoMode
    ? [{ level: "info", source: "runtime", message: "Demo mode enabled. Runtime controls are sample-only.", timestamp: new Date().toISOString() }]
    : state.runtime.logs;

  if (!logs.length) {
    stream.appendChild(createNode("div", "empty-state", "No runtime output yet."));
    return;
  }

  logs.slice(0, 120).forEach((entry) => {
    const line = createNode("div", "terminal-line");
    line.append(
      createNode("span", "terminal-time", formatTime(entry.timestamp)),
      createNode("span", `terminal-level status-${statusTone(entry.level)}`, entry.level || "info"),
      createNode("span", "terminal-source", entry.source || "runtime"),
      createNode("span", "terminal-message", entry.message || ""),
    );
    stream.appendChild(line);
  });
}

function renderPortalRegistry() {
  const host = document.getElementById("portal-grid");
  host.innerHTML = "";
  PORTALS.forEach(([name, purpose, status, risk]) => {
    const card = createNode("article", "registry-card");
    const top = createNode("div", "registry-top");
    const textWrap = createNode("div");
    textWrap.append(createNode("h3", "", name), createNode("p", "", purpose));
    top.append(textWrap, createNode("span", "service-chip status-ready", "USER PORTAL"));
    card.appendChild(top);
    const meta = createNode("div", "meta-stack");
    meta.append(
      createNode("div", `developer-status status-${statusTone(status)}`, status),
      createNode("div", `risk-badge status-${statusTone(risk)}`, risk),
    );
    card.appendChild(meta);
    host.appendChild(card);
  });
}

function renderPipeline() {
  const host = document.getElementById("pipeline-grid");
  host.innerHTML = "";
  PIPELINE_STEPS.forEach(([title, purpose, status]) => {
    const card = createNode("article", "pipeline-card");
    card.append(createNode("span", `service-chip status-${statusTone(status)}`, status), createNode("h3", "", title), createNode("p", "", purpose));
    host.appendChild(card);
  });
}

function renderSciloopAiPanel() {
  let status = state.demoMode ? mockSciloopAiStatus() : state.sciloopAi.status;
  const launch = document.getElementById("sciloop-ai-launch-status");
  const trGrid = document.getElementById("sciloop-ai-tr-grid");
  const keyForm = document.getElementById("sciloop-ai-key-form");
  const log = document.getElementById("sciloop-ai-log");
  const startButton = document.getElementById("sciloop-ai-start-button");
  const checkAllButton = document.getElementById("sciloop-ai-check-all-button");
  const refreshButton = document.getElementById("sciloop-ai-refresh-button");
  if (!launch || !trGrid || !keyForm || !log || !startButton) return;

  launch.innerHTML = "";
  trGrid.innerHTML = "";
  keyForm.innerHTML = "";
  log.innerHTML = "";

  if (!status) {
    status = {
      providers: SCILOOP_AI_PROVIDER_FALLBACK,
      readiness: {
        ready: false,
        backend: { reachable: false },
        checks: [
          { id: "control-api", label: "ForLoop Control API", status: "offline", message: "Start or refresh the ForLoop Control API at http://localhost:3001." },
          { id: "tr-live", label: "TR live check", status: "pending", message: "Live Node/npm/backend checks appear after the control API responds." },
        ],
      },
      allProvidersReady: false,
      enoughProvidersReady: false,
      minReadyProvidersToStart: SCILOOP_AI_MIN_READY_TO_START,
      canStart: false,
      requiredCount: SCILOOP_AI_PROVIDER_FALLBACK.length,
      readyCount: 0,
      backendUrl: "http://localhost:5050",
    };
  }

  const launchTone = status.canStart ? "ready" : "missing";
  const minReady = status.minReadyProvidersToStart || SCILOOP_AI_MIN_READY_TO_START;
  launch.append(
    createNode("span", `service-chip status-${launchTone}`, status.canStart ? "START READY" : `${status.readyCount}/${minReady} NEEDED`),
    createNode("h3", "", status.canStart ? "Ready to start the News AI backend" : `Blocked until TR is green and any ${minReady} specialists are ready`),
    createNode("p", "", `Target backend: ${status.backendUrl}. ${status.readyCount}/${status.requiredCount} specialists green. ${state.sciloopAi.lastMessage}`),
  );

  (status.readiness?.checks || []).forEach((check) => {
    const card = createNode("article", "tr-check-card");
    card.append(
      createNode("span", `service-chip status-${statusTone(check.status)}`, check.status),
      createNode("h3", "", check.label),
      createNode("p", "", check.message),
    );
    trGrid.appendChild(card);
  });

  (status.providers || []).forEach((provider) => {
    const card = createNode("article", "provider-key-card");
    const top = createNode("div", "service-top");
    const copy = createNode("div");
    copy.append(createNode("h3", "", provider.name), createNode("p", "", provider.role));
    const chip = createNode("span", `service-chip status-${statusTone(provider.check?.status)}`, provider.check?.status || "pending");
    top.append(copy, chip);
    card.appendChild(top);

    const inputId = `sciloop-ai-key-${provider.id}`;
    if (provider.keyName) {
      const input = createNode("input");
      input.id = inputId;
      input.name = provider.id;
      input.type = "password";
      input.autocomplete = "off";
      input.placeholder = provider.maskedKey || `${provider.keyName}`;
      card.append(createNode("label", "", `${provider.keyName} (${provider.maskedKey || "not saved"})`), input);
    } else {
      card.appendChild(createNode("div", "empty-state", "No API key is needed. ForLoop checks the Puter.js client runtime/library path."));
    }

    const meta = createNode("div", "meta-stack");
    meta.append(
      createNode("p", "meta-row", provider.check?.message || "Not checked yet."),
      createNode("p", "meta-row", provider.check?.checkedAt ? `Last checked: ${formatTime(provider.check.checkedAt)}` : "Last checked: never"),
    );
    card.appendChild(meta);

    const actions = createNode("div", "tool-actions");
    const testButton = createNode("button", "secondary-button", "Check");
    testButton.type = "button";
    testButton.dataset.sciloopAiCheck = provider.id;
    testButton.disabled = state.demoMode || state.sciloopAi.busy;
    actions.appendChild(testButton);
    card.appendChild(actions);
    keyForm.appendChild(card);
  });

  const saveRow = createNode("div", "sciloop-ai-save-row");
  const saveButton = createNode("button", "action-button", "Save Keys To Local Backend");
  saveButton.type = "submit";
  saveButton.disabled = state.demoMode || state.sciloopAi.busy;
  saveRow.appendChild(saveButton);
  keyForm.appendChild(saveRow);

  startButton.disabled = state.demoMode || state.sciloopAi.busy || !status.canStart;
  checkAllButton.disabled = state.demoMode || state.sciloopAi.busy;
  refreshButton.disabled = state.sciloopAi.busy;

  [
    `Specialist contract: any ${minReady} working AI APIs can launch the server; remaining specialists stay visible as warnings until refreshed.`,
    `TR box: ${status.readiness?.ready ? "ready" : "not ready"}. Backend reachable: ${status.readiness?.backend?.reachable ? "yes" : "not yet"}.`,
    `Start rule: ${status.canStart ? "enabled" : `disabled until ${minReady} specialists and TR are ready`}.`,
  ].forEach((line) => log.appendChild(createNode("div", "log-entry", line)));
}

function renderUnityAiBridge() {
  const statusHost = document.getElementById("unity-ai-status");
  const latestHost = document.getElementById("unity-ai-latest-scene");
  const rawHost = document.getElementById("unity-ai-output-raw");
  const refreshButton = document.getElementById("unity-ai-refresh-button");
  const testButton = document.getElementById("unity-ai-test-button");
  if (!statusHost || !latestHost || !rawHost) return;

  const status = state.demoMode
    ? {
        status: "demo_online",
        message: "Demo Unity AI bridge is ready. No real backend call was made.",
        endpoint: "demo://reality-engine",
        unityProject: { exists: true, scriptsExist: true, webglBuildExpected: "Demo WebGL Build" },
        probe: { ok: true, engineVersion: "demo", timelineCount: 5, branchCount: 3 },
        latestScene: {
          article: { title: "Demo possibility scene", field: "Energy" },
          timelineCount: 5,
          branchCount: 3,
          unityPromptPreview: "Demo before/after Unity prompt bundle.",
          createdAt: new Date().toISOString(),
        },
      }
    : state.unityAi.status;

  statusHost.innerHTML = "";
  latestHost.innerHTML = "";

  if (!status) {
    statusHost.append(
      createNode("span", "service-chip status-standby", "WAITING"),
      createNode("h3", "", "Unity AI Bridge not checked yet"),
      createNode("p", "", "Use Check Unity AI Bridge to verify the Reality Engine endpoint and Unity script handoff.")
    );
    latestHost.appendChild(createNode("div", "empty-state", "No News Portal possibility scene has been sent to ForLoop yet."));
    rawHost.textContent = "No Unity AI bridge output yet.";
  } else {
    statusHost.append(
      createNode("span", `service-chip status-${statusTone(status.status)}`, String(status.status || "unknown").toUpperCase()),
      createNode("h3", "", status.status === "ready" || status.status === "demo_online" ? "Unity AI bridge is connected" : "Unity AI bridge needs attention"),
      createNode("p", "", status.message || "Status loaded."),
      createNode("p", "meta-row", `Reality endpoint: ${status.endpoint || "not configured"}`),
      createNode("p", "meta-row", `Unity scripts: ${status.unityProject?.scriptsExist ? "detected" : "not detected"} | WebGL build: ${status.unityProject?.webglBuildExpected || "not configured"}`),
      createNode("p", "meta-row", `Probe: ${status.probe?.engineVersion || "unknown"} | timeline ${status.probe?.timelineCount || 0} | branches ${status.probe?.branchCount || 0}`)
    );

    const latest = state.unityAi.latestScene || status.latestScene;
    if (latest) {
      const card = createNode("article", "unity-scene-card");
      card.append(
        createNode("h4", "", latest.article?.title || "Untitled Unity AI scene"),
        createNode("p", "", `Field: ${latest.article?.field || "Applied Reality"} | Timeline: ${latest.timelineCount || 0} | Branches: ${latest.branchCount || 0}`),
        createNode("p", "", latest.unityPromptPreview || "Unity prompt bundle is ready."),
        createNode("p", "meta-row", `Created: ${formatTime(latest.createdAt)}`)
      );
      latestHost.appendChild(card);
    } else {
      latestHost.appendChild(createNode("div", "empty-state", "No News Portal possibility scene has been sent to ForLoop yet."));
    }

    rawHost.textContent = JSON.stringify(state.unityAi.testResult || status, null, 2);
  }

  if (refreshButton) refreshButton.disabled = state.unityAi.busy;
  if (testButton) testButton.disabled = state.unityAi.busy;
}

function renderChecklist() {
  const host = document.getElementById("production-checklist");
  host.innerHTML = "";
  CHECKLIST_ITEMS.forEach(([title, status, why, nextAction]) => {
    const card = createNode("article", "checklist-card");
    card.append(
      createNode("h3", "", title),
      createNode("div", `service-chip status-${statusTone(status)}`, status),
      createNode("p", "", why),
      createNode("p", "", `Next: ${nextAction}`),
    );
    host.appendChild(card);
  });
}

function renderSettings() {
  const host = document.getElementById("settings-grid");
  host.innerHTML = "";
  SETTINGS.forEach(([label, key, options, selected]) => {
    const card = createNode("div", "tool-card");
    const select = createNode("select");
    select.id = key;
    options.forEach((option) => {
      const item = createNode("option", "", option);
      item.value = option;
      if (option === selected) item.selected = true;
      select.appendChild(item);
    });
    card.append(createNode("label", "", label), select);
    host.appendChild(card);
  });
  document.getElementById("backend-url-input").value = state.apiBase;
}

function combineLogs() {
  const all = [
    ...state.localLogs,
    ...(Array.isArray(state.backend.logs) ? state.backend.logs : []),
    ...(Array.isArray(state.runtime.logs) ? state.runtime.logs : []),
  ];
  return all
    .filter((entry) => state.logFilterLevel === "all" || entry.level === state.logFilterLevel)
    .filter((entry) => state.logFilterSource === "all" || entry.source === state.logFilterSource)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function renderLogs() {
  const combined = combineLogs();
  const stream = document.getElementById("log-stream");
  const panel = document.getElementById("log-only-panel");
  stream.innerHTML = "";
  panel.innerHTML = "";
  if (!combined.length) {
    const empty = createNode("div", "empty-state", "No logs yet.");
    stream.appendChild(empty.cloneNode(true));
    panel.appendChild(empty);
    return;
  }
  combined.forEach((entry) => {
    const node = createNode("div", "log-entry");
    node.textContent = `${formatTime(entry.timestamp)} | ${String(entry.level).toUpperCase()} | ${entry.source} | ${entry.message}`;
    stream.appendChild(node.cloneNode(true));
    panel.appendChild(node);
  });
}

function renderOutput(targetViewId, targetRawId, targetEmptyId, blocks, rawPayload) {
  const view = document.getElementById(targetViewId);
  const raw = document.getElementById(targetRawId);
  const empty = document.getElementById(targetEmptyId);
  view.innerHTML = "";
  raw.textContent = rawPayload ? JSON.stringify(rawPayload, null, 2) : "";
  empty.hidden = Boolean(rawPayload);
  if (!rawPayload) return;
  blocks.forEach((block) => {
    const card = createNode("article", "output-block");
    card.appendChild(createNode("h4", "", block.title));
    if (block.text) card.appendChild(createNode("p", "", block.text));
    if (Array.isArray(block.list) && block.list.length) {
      const list = createNode("ul", "output-list");
      block.list.forEach((item) => {
        const li = createNode("li", "", item);
        list.appendChild(li);
      });
      card.appendChild(list);
    }
    view.appendChild(card);
  });
}

function renderLabOutputs() {
  const ai = state.labs.ai;
  renderOutput(
    "ai-output-view",
    "ai-output-raw",
    "ai-empty",
    ai ? [
      { title: ai.output.title, text: ai.output.summary },
      { title: "Key Points", list: ai.output.keyPoints },
      { title: "Why It Matters", text: ai.output.whyItMatters },
      { title: "Limitations", text: ai.output.limitations },
    ] : [],
    ai,
  );

  const story = state.labs.story;
  renderOutput(
    "story-output-view",
    "story-output-raw",
    "story-empty",
    story ? [
      { title: story.story.title, text: story.story.hook },
      { title: "Timeline", list: story.story.timeline.map((item) => `${item.step}: ${item.text}`) },
      { title: "Visual Idea", text: story.story.visualSimulationIdea },
      { title: "Emoji Line", text: story.story.emojiLine },
    ] : [],
    story,
  );

  const news = state.labs.news;
  renderOutput(
    "news-output-view",
    "news-output-raw",
    "news-empty",
    news ? news.items.map((item) => ({
      title: item.title,
      list: [
        `Category: ${item.category}`,
        `Source: ${item.source || item.sourceMode}`,
        `Relevance Score: ${item.relevanceScore}`,
        `Duplicate Risk: ${item.duplicateRisk}`,
        `Summary Ready: ${item.summaryReady}`,
        `Publish Ready: ${item.publishReady}`,
        `Warnings: ${(item.warnings || []).join(" | ")}`,
      ],
    })) : [],
    news,
  );

  const simulation = state.labs.simulation;
  renderOutput(
    "simulation-output-view",
    "simulation-output-raw",
    "simulation-empty",
    simulation ? [
      { title: simulation.plan.sceneTitle, text: simulation.plan.learningGoal },
      { title: "Objects", list: simulation.plan.objects },
      { title: "Laws Shown", list: simulation.plan.lawsShown },
      { title: "Visual Steps", list: simulation.plan.visualSteps },
      { title: "User Controls", list: simulation.plan.userControls },
      { title: "Limitations", text: simulation.plan.limitations },
    ] : [],
    simulation,
  );
}

function renderFeedback() {
  const host = document.getElementById("feedback-list");
  host.innerHTML = "";
  const meta = document.getElementById("feedback-meta");
  meta.innerHTML = "";
  meta.append(
    createNode("span", `service-chip status-${statusTone(state.backend.feedback?.status || "local_only")}`, state.demoMode ? "DEMO SOURCE" : "FORLOOP LOCAL"),
    createNode("span", "service-chip status-standby", `${state.feedbackNotes.length} notes`),
  );
  if (!state.feedbackNotes.length) {
    host.appendChild(createNode("div", "empty-state", "No local feedback notes yet."));
    return;
  }
  state.feedbackNotes.forEach((note) => {
    const item = createNode("article", "feedback-note");
    item.textContent = `${note.type} | ${formatTime(note.timestamp)} | ${note.note}`;
    host.appendChild(item);
  });
}

function buildReport() {
  return {
    timestamp: new Date().toISOString(),
    demoMode: state.demoMode,
    backendUrl: state.apiBase,
    connectionStatus: state.connection,
    serviceStatuses: state.backend.services,
    runtimeStatus: state.runtime.status,
    sciloopAiStatus: state.sciloopAi.status
      ? {
          readyCount: state.sciloopAi.status.readyCount,
          requiredCount: state.sciloopAi.status.requiredCount,
          canStart: state.sciloopAi.status.canStart,
          backendUrl: state.sciloopAi.status.backendUrl,
          providers: state.sciloopAi.status.providers?.map((provider) => ({
            id: provider.id,
            name: provider.name,
            status: provider.check?.status,
          })),
        }
      : null,
    aiReadiness: state.backend.ai,
    newsReadiness: state.backend.news,
    simulationReadiness: state.backend.simulation,
    latestLogs: combineLogs().slice(0, 25),
    localFeedbackNotesCount: state.feedbackNotes.length,
    latestOutputs: {
      ai: state.labs.ai ? { mode: state.labs.ai.mode, provider: state.labs.ai.provider, timestamp: state.labs.ai.timestamp } : null,
      story: state.labs.story ? { mode: state.labs.story.mode || "mock" } : null,
      news: state.labs.news ? { mode: state.labs.news.mode, items: state.labs.news.items?.length || 0 } : null,
      simulation: state.labs.simulation ? { mode: state.labs.simulation.mode, sceneTitle: state.labs.simulation.plan?.sceneTitle } : null,
    },
    knownPlaceholders: [
      "No production admin authentication yet.",
      "No public SciLoop publishing.",
      "No backend feedback storage.",
      "No destructive admin controls.",
      "Runtime console is allowlisted and local-only.",
    ],
    recommendedNextActions: [
      "Add authenticated admin sessions.",
      "Add persistent feedback storage.",
      "Add publish review gates and audit logging.",
    ],
  };
}

function renderReportPreview() {
  const preview = document.getElementById("report-preview");
  const empty = document.getElementById("report-empty");
  const report = buildReport();
  preview.textContent = JSON.stringify(report, null, 2);
  empty.hidden = false;
}

function renderAIMeta() {
  const host = document.getElementById("ai-meta");
  host.innerHTML = "";
  const provider = state.demoMode ? "demo" : state.backend.ai?.provider || "mock";
  const model = state.demoMode ? "demo-sample" : state.backend.ai?.model || "not connected";
  const mode = state.demoMode ? "demo_only" : state.backend.ai?.testMode || "manual_only_disabled";
  host.append(
    createNode("span", `service-chip status-${statusTone(state.backend.ai?.status || "standby")}`, provider),
    createNode("span", "service-chip status-standby", model),
    createNode("span", "service-chip status-standby", mode.replace(/_/g, " ")),
  );
}

async function refreshSystemStatus() {
  addLocalLog("action", "system", "Refresh system status requested.");
  if (state.demoMode) {
    const demo = demoBackendState();
    state.backend.health = demo.health;
    state.backend.services = demo.services;
    state.backend.ai = demo.ai;
    state.backend.news = demo.news;
    state.backend.simulation = demo.simulation;
    state.backend.feedback = demo.feedback;
    state.unityAi.status = {
      status: "demo_online",
      message: "Demo Unity AI bridge ready.",
      endpoint: "demo://reality-engine",
      unityProject: { exists: true, scriptsExist: true, webglBuildExpected: "Demo WebGL Build" },
      probe: { ok: true, engineVersion: "demo", timelineCount: 5, branchCount: 3 },
      latestScene: null,
    };
    state.connection.mode = "Demo Mode";
    state.connection.lastSuccessfulCheck = formatTime(new Date().toISOString());
    state.connection.lastError = "None";
    renderAll();
    return;
  }

  try {
    const [access, health, services, ai, news, simulation, feedback, unityAi] = await Promise.all([
      api.getAccessConfig().catch(() => ({ gateEnabled: true, mode: "local", message: "Developer access gate enabled." })),
      api.getHealth(),
      api.getServices(),
      api.getAIStatus(),
      api.getNewsStatus(),
      api.getSimulationStatus(),
      api.getFeedbackStatus(),
      api.getUnityAiStatus().catch((error) => ({ status: "offline", message: error.message })),
    ]);
    state.access = access;
    state.backend.health = health;
    state.backend.services = Array.isArray(services) ? services : [];
    state.backend.ai = ai;
    state.backend.news = news;
    state.backend.simulation = simulation;
    state.backend.feedback = feedback;
    state.unityAi.status = unityAi;
    state.unityAi.latestScene = unityAi?.latestScene || state.unityAi.latestScene;
    state.connection.mode = "Live";
    state.connection.lastSuccessfulCheck = formatTime(health.timestamp);
    state.connection.lastError = "None";
    writeSharedRuntimeState({
      demoMode: false,
      liveMode: true,
      backendHealth: health.status || "unknown",
      aiStatus: ai.status || "standby",
      providerBadge: ai.status === "ready" ? "SciLoop AI backend ready" : "SciLoop AI backend standby",
      runtimeBadge: "ForLoop linked",
      runtimeState: "Live local runtime ready",
      runtimeDetail: "ForLoop is connected to the local SciLoop backend and can refresh live status.",
      viewportStatus: "Live local backend ready",
      viewportDetail: "The standalone SciLoop page can now use the localhost backend instead of demo fallback text.",
    });
    pushToast("info", "System status refreshed.");
  } catch (error) {
    state.connection.mode = "Local fallback";
    state.connection.lastError = error.message;
    addLocalLog("warn", "system", `Backend unavailable. ${error.message}`);
    pushToast("warn", "Backend unavailable. Running local fallback mode.");
  }
  renderAll();
}

async function loadBackendLogs() {
  addLocalLog("action", "system", "Load backend logs requested.");
  if (state.demoMode) {
    state.backend.logs = [
      { level: "info", source: "system", message: "Demo mode enabled. No real systems were called.", timestamp: new Date().toISOString() },
    ];
    renderLogs();
    return;
  }
  try {
    const logs = await api.getLogs();
    state.backend.logs = Array.isArray(logs) ? logs : [];
    pushToast("info", "Backend logs loaded.");
  } catch (error) {
    addLocalLog("warn", "system", `Backend logs unavailable. ${error.message}`);
    pushToast("warn", "Backend logs unavailable.");
  }
  renderLogs();
}

async function refreshRuntimeStatus() {
  addLocalLog("action", "runtime", "Runtime status requested.");
  if (state.demoMode) {
    state.runtime.status = null;
    state.runtime.logs = [
      { level: "info", source: "runtime", message: "Demo mode enabled. Runtime controls are sample-only.", timestamp: new Date().toISOString() },
    ];
    state.runtime.lastAction = "Demo runtime status loaded.";
    renderRuntimeConsole();
    renderLogs();
    return;
  }

  try {
    state.runtime.status = await api.getRuntimeStatus();
    state.runtime.lastAction = "Runtime status refreshed.";
    pushToast("info", "Runtime status refreshed.");
  } catch (error) {
    addLocalLog("warn", "runtime", `Runtime status unavailable. ${error.message}`);
    pushToast("warn", "Runtime status unavailable.");
  }
  renderRuntimeConsole();
}

async function loadRuntimeLogs() {
  addLocalLog("action", "runtime", "Runtime logs requested.");
  if (state.demoMode) {
    state.runtime.logs = [
      { level: "info", source: "runtime", message: "Demo mode enabled. No runtime process output exists.", timestamp: new Date().toISOString() },
    ];
    renderRuntimeConsole();
    renderLogs();
    return;
  }

  try {
    const logs = await api.getRuntimeLogs();
    state.runtime.logs = Array.isArray(logs) ? logs : [];
    pushToast("info", "Runtime logs loaded.");
  } catch (error) {
    addLocalLog("warn", "runtime", `Runtime logs unavailable. ${error.message}`);
    pushToast("warn", "Runtime logs unavailable.");
  }
  renderRuntimeConsole();
  renderLogs();
}

async function refreshUnityAiStatus() {
  addLocalLog("action", "unity-ai", "Unity AI bridge status requested.");
  state.unityAi.busy = true;
  renderUnityAiBridge();

  if (state.demoMode) {
    state.unityAi.status = {
      status: "demo_online",
      message: "Demo Unity AI bridge ready.",
      endpoint: "demo://reality-engine",
      unityProject: { exists: true, scriptsExist: true, webglBuildExpected: "Demo WebGL Build" },
      probe: { ok: true, engineVersion: "demo", timelineCount: 5, branchCount: 3 },
      latestScene: state.unityAi.latestScene,
    };
    state.unityAi.busy = false;
    renderUnityAiBridge();
    return;
  }

  try {
    const status = await api.getUnityAiStatus();
    state.unityAi.status = status;
    state.unityAi.latestScene = status.latestScene || state.unityAi.latestScene;
    state.unityAi.lastMessage = status.message || "Unity AI bridge refreshed.";
    addLocalLog("info", "unity-ai", state.unityAi.lastMessage);
    pushToast("info", "Unity AI bridge refreshed.");
  } catch (error) {
    state.unityAi.lastMessage = `Unity AI bridge unavailable. ${error.message}`;
    addLocalLog("warn", "unity-ai", state.unityAi.lastMessage);
    pushToast("warn", "Unity AI bridge unavailable.");
  } finally {
    state.unityAi.busy = false;
    renderUnityAiBridge();
    renderLogs();
  }
}

async function runUnityAiTest() {
  const title = sanitizeText(document.getElementById("unity-ai-title-input")?.value || "", 300) || "Scientists develop new battery material";
  const summary = sanitizeText(document.getElementById("unity-ai-summary-input")?.value || "", 1200);
  const field = sanitizeText(document.getElementById("unity-ai-field-input")?.value || "", 120) || "Applied Reality";

  addLocalLog("action", "unity-ai", `Unity AI test requested: ${title}`);
  state.unityAi.busy = true;
  renderUnityAiBridge();

  if (state.demoMode) {
    state.unityAi.testResult = {
      scene: { article: { title, field }, timelineCount: 5, branchCount: 3, unityPromptPreview: "Demo Unity prompt bundle.", createdAt: new Date().toISOString() },
      result: { ok: true, engineVersion: "demo", analysis: { innovation_name: title, field } },
    };
    state.unityAi.latestScene = state.unityAi.testResult.scene;
    state.unityAi.busy = false;
    renderUnityAiBridge();
    return;
  }

  try {
    const result = await api.generateUnityAiTest({ title, summary, field });
    state.unityAi.testResult = result;
    state.unityAi.status = result.status || state.unityAi.status;
    state.unityAi.latestScene = result.scene || state.unityAi.latestScene;
    addLocalLog("info", "unity-ai", `Unity AI test generated ${result.scene?.timelineCount || 0} timeline stages and ${result.scene?.branchCount || 0} future branches.`);
    pushToast("info", "Unity AI possibility generated.");
  } catch (error) {
    addLocalLog("error", "unity-ai", `Unity AI test failed. ${error.message}`);
    pushToast("warn", "Unity AI test failed.");
  } finally {
    state.unityAi.busy = false;
    renderUnityAiBridge();
    renderLogs();
  }
}

async function refreshSciloopAiStatus(message = "SciLoop AI status refreshed.") {
  addLocalLog("action", "sciloop-ai", "SciLoop AI Panel refresh requested.");
  if (state.demoMode) {
    state.sciloopAi.status = mockSciloopAiStatus();
    state.sciloopAi.lastMessage = "Demo mode is active. No real keys or servers were touched.";
    renderSciloopAiPanel();
    return;
  }

  try {
    state.sciloopAi.status = await api.getSciloopAiStatus();
    state.sciloopAi.lastMessage = message;
    pushToast("info", "SciLoop AI Panel refreshed.");
  } catch (error) {
    state.sciloopAi.lastMessage = error.message;
    addLocalLog("warn", "sciloop-ai", `SciLoop AI status unavailable. ${error.message}`);
    pushToast("warn", "SciLoop AI status unavailable.");
  }
  renderSciloopAiPanel();
  renderLogs();
}

async function saveSciloopAiKeys(event) {
  event.preventDefault();
  if (state.demoMode || state.sciloopAi.busy) return;
  const form = event.currentTarget;
  const keys = {};
  Array.from(form.elements).forEach((element) => {
    if (element instanceof HTMLInputElement && element.name && element.value.trim()) {
      keys[element.name] = element.value.trim();
    }
  });

  if (!Object.keys(keys).length) {
    pushToast("warn", "Paste at least one fresh key before saving.");
    return;
  }

  state.sciloopAi.busy = true;
  state.sciloopAi.lastMessage = "Saving keys into the local SciLoop backend .env...";
  renderSciloopAiPanel();
  try {
    state.sciloopAi.status = await api.saveSciloopAiKeys(keys);
    state.sciloopAi.lastMessage = "Keys saved locally. Run specialist checks next.";
    addLocalLog("action", "sciloop-ai", "SciLoop AI keys saved locally.");
    pushToast("info", "SciLoop AI keys saved locally.");
  } catch (error) {
    state.sciloopAi.lastMessage = error.message;
    addLocalLog("error", "sciloop-ai", `Saving SciLoop AI keys failed. ${error.message}`);
    pushToast("error", "Could not save SciLoop AI keys.");
  } finally {
    state.sciloopAi.busy = false;
    renderSciloopAiPanel();
    renderLogs();
  }
}

async function checkSciloopAiProvider(providerId) {
  if (state.demoMode || state.sciloopAi.busy || !providerId) return;
  state.sciloopAi.busy = true;
  state.sciloopAi.lastMessage = `Checking ${providerId}...`;
  renderSciloopAiPanel();
  try {
    const result = await api.checkSciloopAiProvider(providerId);
    await refreshSciloopAiStatus(`${providerId} check finished: ${result.status}.`);
    addLocalLog("action", "sciloop-ai", `${providerId} check finished: ${result.status}.`);
  } catch (error) {
    state.sciloopAi.lastMessage = error.message;
    addLocalLog("error", "sciloop-ai", `${providerId} check failed. ${error.message}`);
    pushToast("error", `${providerId} check failed.`);
  } finally {
    state.sciloopAi.busy = false;
    renderSciloopAiPanel();
    renderLogs();
  }
}

async function checkAllSciloopAiProviders() {
  if (state.demoMode || state.sciloopAi.busy) return;
  state.sciloopAi.busy = true;
  state.sciloopAi.lastMessage = "Checking every specialist API. This can take a moment.";
  renderSciloopAiPanel();
  try {
    const result = await api.checkAllSciloopAiProviders();
    state.sciloopAi.status = result.status;
    state.sciloopAi.lastMessage = `Provider check completed: ${result.status.readyCount}/${result.status.requiredCount} ready.`;
    addLocalLog("action", "sciloop-ai", state.sciloopAi.lastMessage);
    pushToast("info", "SciLoop AI provider checks completed.");
  } catch (error) {
    state.sciloopAi.lastMessage = error.message;
    addLocalLog("error", "sciloop-ai", `Full SciLoop AI check failed. ${error.message}`);
    pushToast("error", "Full SciLoop AI check failed.");
  } finally {
    state.sciloopAi.busy = false;
    renderSciloopAiPanel();
    renderLogs();
  }
}

async function startSciloopAiServer() {
  if (state.sciloopAi.busy) return;
  if (state.demoMode) {
    setDemoMode(false);
  }
  state.sciloopAi.busy = true;
  state.sciloopAi.lastMessage = "One-click live start requested from ForLoop.";
  renderSciloopAiPanel();
  try {
    const result = await api.startFullSciLoop();
    state.sciloopAi.status = result.status;
    state.sciloopAi.lastMessage = "SciLoop AI live start requested. Refreshing the page handoff next.";
    writeSharedRuntimeState({
      demoMode: false,
      liveMode: true,
      aiStatus: result.status?.status || "ready",
      providerBadge: "SciLoop AI backend live",
      runtimeBadge: "ForLoop linked",
      runtimeState: "SciLoop AI backend live",
      runtimeDetail: "Start came from the ForLoop control panel and the local backend is now the active path.",
      viewportStatus: "Live backend connected",
      viewportDetail: "Reload SciLoop only if the open page still shows an old fallback label.",
    });
    addLocalLog("action", "sciloop-ai", "SciLoop one-click live start requested.");
    pushToast("info", "SciLoop one-click live start requested.");
    await refreshRuntimeStatus();
    await loadRuntimeLogs();
    await refreshSystemStatus();
    await refreshSciloopAiStatus("Start command finished. Check the News Portal again.");
  } catch (error) {
    state.sciloopAi.lastMessage = error.message;
    addLocalLog("error", "sciloop-ai", `SciLoop AI backend start failed. ${error.message}`);
    pushToast("error", "SciLoop AI backend start failed.");
  } finally {
    state.sciloopAi.busy = false;
    renderSciloopAiPanel();
    renderLogs();
  }
}

async function runRuntimeAction(action, targetId) {
  if (state.demoMode) {
    addLocalLog("info", "runtime", "Demo mode active. Runtime action was not sent.");
    pushToast("info", "Demo mode: no runtime action sent.");
    return;
  }

  const labels = {
    start: "start",
    stop: "stop",
    restart: "restart",
  };
  if (!labels[action] || !targetId) return;
  if ((action === "stop" || action === "restart") && !window.confirm(`Run ${action} for ${targetId}? ForLoop can only control processes it started.`)) {
    return;
  }

  addLocalLog("action", "runtime", `${labels[action]} requested for ${targetId}.`);
  pushToast("info", `Runtime ${labels[action]} requested...`);
  try {
    if (action === "start") await api.startRuntimeTarget(targetId);
    if (action === "stop") await api.stopRuntimeTarget(targetId);
    if (action === "restart") await api.restartRuntimeTarget(targetId);
    await refreshRuntimeStatus();
    await loadRuntimeLogs();
    pushToast("info", `Runtime ${labels[action]} completed.`);
  } catch (error) {
    addLocalLog("error", "runtime", `Runtime ${labels[action]} failed. ${error.message}`);
    pushToast("error", `Runtime ${labels[action]} failed.`);
  }
}

async function runApprovedRuntimeCommand(commandText) {
  const command = sanitizeText(commandText, 180).toLowerCase();
  if (!command) return;

  if (command === "status") {
    await refreshRuntimeStatus();
    return;
  }
  if (command === "logs") {
    await loadRuntimeLogs();
    return;
  }

  const match = /^(start|stop|restart)\s+([a-z0-9-]+)$/.exec(command);
  if (match) {
    await runRuntimeAction(match[1], match[2]);
    return;
  }

  addLocalLog("warn", "runtime", `Command rejected: ${command}. Only status, logs, start/stop/restart <target> are allowed.`);
  pushToast("warn", "Command rejected. Use an approved runtime command.");
}

async function runFullDiagnostic() {
  addLocalLog("action", "system", "Full local diagnostic requested.");
  await refreshSystemStatus();
  await loadBackendLogs();
  await refreshRuntimeStatus();
  await loadRuntimeLogs();
  pushToast("info", "Full diagnostic completed.");
}

async function runAI(mode) {
  const input = sanitizeText(document.getElementById("ai-test-input").value);
  const style = document.getElementById("ai-style-select").value;
  if (!input) {
    pushToast("error", "AI explanation input is required.");
    return;
  }
  addLocalLog("action", "ai", "AI explanation test requested.");
  try {
    state.labs.ai = mode === "mock" || state.demoMode
      ? mockAIResult(input, style)
      : await api.runAIExplainTest(input, style, "env");
    addLocalLog("info", "ai", `AI explanation completed in ${state.labs.ai.mode} mode.`);
  } catch (error) {
    addLocalLog("warn", "ai", `Backend unavailable. Running local mock tool. ${error.message}`);
    state.labs.ai = mockAIResult(input, style);
  }
  renderLabOutputs();
  renderReportPreview();
}

async function runStory(mode) {
  const input = sanitizeText(document.getElementById("story-input").value);
  const format = document.getElementById("story-format-select").value;
  if (!input) {
    pushToast("error", "Story input is required.");
    return;
  }
  addLocalLog("action", "ai", "Story preview requested.");
  try {
    state.labs.story = mode === "mock" || state.demoMode
      ? mockStoryResult(input, format)
      : await api.runStoryPreview(input, format);
  } catch (error) {
    addLocalLog("warn", "ai", `Backend unavailable. Running local mock tool. ${error.message}`);
    state.labs.story = mockStoryResult(input, format);
  }
  renderLabOutputs();
  renderReportPreview();
}

async function runNews(mode) {
  const payload = {
    sourceMode: document.getElementById("news-source-mode").value,
    category: document.getElementById("news-category").value,
    input: sanitizeText(document.getElementById("news-input").value),
  };
  addLocalLog("action", "news", mode === "parse" ? "Manual news parse requested." : "News dry-run requested.");
  try {
    if (mode === "mock" || state.demoMode) {
      state.labs.news = mockNewsResult(payload);
    } else if (mode === "parse") {
      state.labs.news = await api.parseNewsText(payload);
    } else {
      state.labs.news = await api.runNewsDryRun(payload);
    }
  } catch (error) {
    addLocalLog("warn", "news", `Backend unavailable. Running local mock tool. ${error.message}`);
    state.labs.news = mockNewsResult(payload);
  }
  renderLabOutputs();
  renderReportPreview();
}

async function runSimulation(mode) {
  const payload = {
    topic: sanitizeText(document.getElementById("simulation-topic").value, 200) || "gravity",
    domain: document.getElementById("simulation-domain").value,
    level: document.getElementById("simulation-level").value,
  };
  addLocalLog("action", "simulation", "Simulation plan requested.");
  try {
    state.labs.simulation = mode === "mock" || state.demoMode
      ? mockSimulationResult(payload)
      : await api.generateSimulationPlan(payload);
  } catch (error) {
    addLocalLog("warn", "simulation", `Backend unavailable. Running local mock tool. ${error.message}`);
    state.labs.simulation = mockSimulationResult(payload);
  }
  renderLabOutputs();
  renderReportPreview();
}

function addFeedbackNote() {
  const type = document.getElementById("feedback-type").value;
  const note = sanitizeText(document.getElementById("feedback-note").value);
  if (!note) {
    pushToast("error", "Feedback note is required.");
    return;
  }
  state.feedbackNotes.unshift({
    type,
    note,
    timestamp: new Date().toISOString(),
  });
  saveFeedbackNotes();
  document.getElementById("feedback-note").value = "";
  addLocalLog("action", "feedback", "Developer feedback note added.");
  renderFeedback();
  renderReportPreview();
}

function clearFeedbackNotes() {
  state.feedbackNotes = [];
  saveFeedbackNotes();
  addLocalLog("action", "feedback", "Local feedback notes cleared.");
  renderFeedback();
  renderReportPreview();
}

function exportJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportReport() {
  exportJson("forloop-dev-report.json", buildReport());
  addLocalLog("action", "system", "Developer report exported.");
  pushToast("info", "Developer report exported.");
}

async function copyReport() {
  try {
    await navigator.clipboard.writeText(JSON.stringify(buildReport(), null, 2));
    pushToast("info", "Developer report JSON copied.");
  } catch {
    pushToast("warn", "Clipboard copy unavailable here.");
  }
}

function exportLogs() {
  exportJson("forloop-logs.json", combineLogs());
  addLocalLog("action", "system", "Logs JSON exported.");
}

function resetLocalState() {
  if (!window.confirm("Reset ForLoop local state only? This will not touch SciLoop user data.")) {
    return;
  }
  localStorage.removeItem(API_BASE_STORAGE_KEY);
  localStorage.removeItem(FEEDBACK_STORAGE_KEY);
  localStorage.removeItem(SCILOOP_RUNTIME_STATE_KEY);
  sessionStorage.removeItem(DEMO_STORAGE_KEY);
  sessionStorage.removeItem(UNLOCK_STORAGE_KEY);
  pushToast("info", "ForLoop local state reset.");
  window.location.reload();
}

function attachHandlers() {
  withElement("access-form", (form) => form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = sanitizeText(document.getElementById("access-code-input").value, 120);
    const message = document.getElementById("gate-message");
    message.textContent = "Checking...";
    try {
      const result = await api.verifyAccess(code).catch(() => ({ authorized: code === DEFAULT_FORLOOP_ACCESS_CODE }));
      if (result.authorized || code === DEFAULT_FORLOOP_ACCESS_CODE) {
        state.accessCode = code;
        setUnlocked(true);
        message.textContent = "";
        pushToast("info", "ForLoop unlocked.");
      } else {
        message.textContent = "Wrong access code.";
      }
    } catch {
      if (code === DEFAULT_FORLOOP_ACCESS_CODE) {
        state.accessCode = code;
        setUnlocked(true);
        message.textContent = "";
      } else {
        message.textContent = "Wrong access code.";
      }
    }
  }));

  withElement("lock-forloop-button", (button) => button.addEventListener("click", () => {
    state.accessCode = "";
    setUnlocked(false);
    pushToast("info", "ForLoop locked.");
  }));

  withElement("demo-toggle-button", (button) => button.addEventListener("click", () => {
    setDemoMode(!state.demoMode);
  }));

  withElement("clear-console-button", (button) => button.addEventListener("click", () => {
    state.localLogs = [];
    addLocalLog("info", "system", "Local console cleared.");
  }));

  withElement("backend-url-form", (form) => form.addEventListener("submit", (event) => {
    event.preventDefault();
    const next = sanitizeText(document.getElementById("backend-url-input").value, 500) || DEFAULT_FORLOOP_API_BASE;
    state.apiBase = next;
    state.connection.backendUrl = next;
    localStorage.setItem(API_BASE_STORAGE_KEY, next);
    addLocalLog("info", "system", `Backend URL changed to ${next}.`);
    renderConnectionPanel();
  }));

  withElement("sciloop-ai-refresh-button", (button) => button.addEventListener("click", async () => {
    await refreshSciloopAiStatus();
  }));

  withElement("sciloop-ai-check-all-button", (button) => button.addEventListener("click", async () => {
    await checkAllSciloopAiProviders();
  }));

  withElement("sciloop-ai-start-button", (button) => button.addEventListener("click", async () => {
    await startSciloopAiServer();
  }));

  withElement("sciloop-ai-key-form", (form) => form.addEventListener("submit", saveSciloopAiKeys));

  withElement("sciloop-ai-key-form", (form) => form.addEventListener("click", async (event) => {
    const button = event.target;
    if (!(button instanceof HTMLButtonElement)) return;
    const providerId = button.dataset.sciloopAiCheck;
    if (providerId) await checkSciloopAiProvider(providerId);
  }));

  withElement("unity-ai-refresh-button", (button) => button.addEventListener("click", async () => {
    await refreshUnityAiStatus();
  }));

  withElement("unity-ai-test-button", (button) => button.addEventListener("click", async () => {
    await runUnityAiTest();
  }));

  withElement("unity-ai-test-form", (form) => form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await runUnityAiTest();
  }));

  withElement("ai-test-form", (form) => form.addEventListener("submit", async (event) => {
    event.preventDefault();
    pushToast("info", "Running AI explanation test...");
    await runAI("live");
  }));
  withElement("ai-mock-button", (button) => button.addEventListener("click", async () => {
    pushToast("info", "Generating mock explanation...");
    await runAI("mock");
  }));

  withElement("story-form", (form) => form.addEventListener("submit", async (event) => {
    event.preventDefault();
    pushToast("info", "Generating story preview...");
    await runStory("live");
  }));
  withElement("story-mock-button", (button) => button.addEventListener("click", async () => {
    pushToast("info", "Generating mock story...");
    await runStory("mock");
  }));

  withElement("news-form", (form) => form.addEventListener("submit", async (event) => {
    event.preventDefault();
    pushToast("info", "Running news dry-run...");
    await runNews("dry-run");
  }));
  withElement("news-parse-button", (button) => button.addEventListener("click", async () => {
    pushToast("info", "Parsing manual text...");
    await runNews("parse");
  }));
  withElement("news-mock-button", (button) => button.addEventListener("click", async () => {
    pushToast("info", "Generating mock news batch...");
    await runNews("mock");
  }));

  withElement("simulation-form", (form) => form.addEventListener("submit", async (event) => {
    event.preventDefault();
    pushToast("info", "Generating simulation plan...");
    await runSimulation("live");
  }));
  withElement("simulation-mock-button", (button) => button.addEventListener("click", async () => {
    pushToast("info", "Generating mock simulation...");
    await runSimulation("mock");
  }));

  withElement("feedback-form", (form) => form.addEventListener("submit", (event) => {
    event.preventDefault();
    addFeedbackNote();
  }));
  withElement("feedback-clear-button", (button) => button.addEventListener("click", clearFeedbackNotes));
  withElement("export-report-button", (button) => button.addEventListener("click", exportReport));
  withElement("copy-report-button", (button) => button.addEventListener("click", copyReport));
  withElement("load-backend-logs-button", (button) => button.addEventListener("click", loadBackendLogs));
  withElement("export-logs-button", (button) => button.addEventListener("click", exportLogs));
  withElement("reset-state-button", (button) => button.addEventListener("click", resetLocalState));
  withElement("runtime-refresh-button", (button) => button.addEventListener("click", refreshRuntimeStatus));
  withElement("runtime-load-logs-button", (button) => button.addEventListener("click", loadRuntimeLogs));
  withElement("runtime-target-grid", (grid) => grid.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    await runRuntimeAction(target.dataset.runtimeAction, target.dataset.targetId);
  }));
  withElement("runtime-command-form", (form) => form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("runtime-command-input");
    await runApprovedRuntimeCommand(input.value);
    input.value = "";
  }));

  withElement("log-level-filter", (select) => select.addEventListener("change", (event) => {
    state.logFilterLevel = event.target.value;
    renderLogs();
  }));
  withElement("log-source-filter", (select) => select.addEventListener("change", (event) => {
    state.logFilterSource = event.target.value;
    renderLogs();
  }));

  withElement("quick-actions", (host) => host.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const label = target.textContent || "";
    if (label === "Start Full SciLoop") await startSciloopAiServer();
    if (label === "Refresh System Status") await refreshSystemStatus();
    if (label === "Run Full Local Diagnostic") await runFullDiagnostic();
    if (label === "Open Runtime Console") {
      state.activeSection = "Runtime Console";
      renderAll();
      await refreshRuntimeStatus();
      await loadRuntimeLogs();
    }
    if (label === "Open SciLoop AI Panel") {
      state.activeSection = "SciLoop AI Panel";
      renderAll();
      await refreshSciloopAiStatus();
    }
    if (label === "Open Unity AI Bridge") {
      state.activeSection = "Unity AI Bridge";
      renderAll();
      await refreshUnityAiStatus();
    }
    if (label === "Generate Unity Possibility") await runUnityAiTest();
    if (label === "Run AI Mock Test") await runAI("mock");
    if (label === "Run News Mock Batch") await runNews("mock");
    if (label === "Generate Simulation Mock Plan") await runSimulation("mock");
    if (label === "Export Dev Report") exportReport();
    if (label === "Clear Console") {
      state.localLogs = [];
      addLocalLog("info", "system", "Local console cleared.");
    }
  }));
}

function renderQuickActions() {
  const host = document.getElementById("quick-actions");
  host.innerHTML = "";
  [
    "Start Full SciLoop",
    "Refresh System Status",
    "Run Full Local Diagnostic",
    "Open Runtime Console",
    "Open SciLoop AI Panel",
    "Open Unity AI Bridge",
    "Generate Unity Possibility",
    "Run AI Mock Test",
    "Run News Mock Batch",
    "Generate Simulation Mock Plan",
    "Export Dev Report",
    "Clear Console",
  ].forEach((label) => {
    host.appendChild(createNode("button", "action-button", label));
  });
}

function renderAll() {
  renderGate();
  renderMiniStatus();
  renderHeaderStatus();
  renderSidebar();
  renderOverview();
  renderConnectionPanel();
  renderTimeline();
  renderServices();
  renderRuntimeConsole();
  renderPortalRegistry();
  renderPipeline();
  renderSciloopAiPanel();
  renderUnityAiBridge();
  renderChecklist();
  renderSettings();
  renderFeedback();
  renderLabOutputs();
  renderReportPreview();
  renderAIMeta();
  renderLogs();
  document.getElementById("demo-toggle-button").textContent = state.demoMode ? "Disable Demo Mode" : "Enable Demo Mode";
}

async function initializeAccess() {
  try {
    state.access = await api.getAccessConfig();
  } catch {
    state.access = { gateEnabled: true, mode: "local", message: "Developer access gate enabled." };
  }
}

async function init() {
  await initializeAccess();
  attachHandlers();
  renderQuickActions();
  renderAll();
  if (state.unlocked) {
    await refreshSystemStatus();
    await refreshRuntimeStatus();
    await refreshSciloopAiStatus();
    await refreshUnityAiStatus();
  }
}

document.addEventListener("DOMContentLoaded", init);
